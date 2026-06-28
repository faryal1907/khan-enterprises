import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { QueryOrdersDto } from "./dto/query-orders.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { CompleteOrderDetailsDto } from "./dto/complete-order-details.dto";
import { RecordPaymentDto } from "./dto/record-payment.dto";
import { CreateManualOrderDto, OrderType } from "./dto/create-manual-order.dto";
import { CreateCustomerOrderDto } from "./dto/create-customer-order.dto";
import { UploadPaymentProofDto } from "./dto/upload-payment-proof.dto";
import { VerifyPaymentDto } from "./dto/verify-payment.dto";
import { RevenueQueryDto, RevenueDuration } from "./dto/revenue-query.dto";
import { OrderStatus, BikeStatus, PaymentStatus, AuditAction } from "@khan/prisma";
import { OrderAlertsService } from "../order-alerts/order-alerts.service";
import { AlertType } from "../order-alerts/dto/get-alerts.dto";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderAlertsService: OrderAlertsService,
  ) { }

  private isAssignedBranchUser(user?: any) {
    return user?.role !== "ADMIN" && user?.role !== "CUSTOMER" && Boolean(user?.branchId);
  }

  private applyBranchScope(where: any, user?: any) {
    if (this.isAssignedBranchUser(user)) {
      where.branchId = user.branchId;
    }
  }

  private assertOrderAccess(order: { branchId: string; customerId?: string | null; customerPhone?: string | null }, user?: any) {
    if (user?.role === "CUSTOMER") {
      // Primary check: customerId is set and matches — grant access immediately.
      if (order.customerId === user.id) {
        // ownership confirmed, skip phone check
      } else if (order.customerId === null && user.phoneNumber && order.customerPhone === user.phoneNumber) {
        // Legacy fallback: row pre-dates the customerId migration, match by phone instead.
      } else {
        throw new NotFoundException("Order not found");
      }
    }

    if (this.isAssignedBranchUser(user) && order.branchId !== user.branchId) {

      throw new NotFoundException("Order not found");
    }
  }

  private applyCustomerScope(where: any, user?: any, isCustomerView?: boolean) {
    // Only scope to a specific customer when the caller is actually a CUSTOMER.
    // isCustomerView is a hint from the frontend but must never override the role check —
    // a non-CUSTOMER user (admin, staff) passing isCustomerView:true must still see all orders.
    if (user?.role !== "CUSTOMER" || !user.id) {
      return;
    }

    // Match orders explicitly linked to this user OR legacy orders (customerId not yet set)
    // that were placed with the customer's phone number.
    // Written into AND so it composes safely with any existing OR (e.g. search).
    const ownershipClause = {
      OR: [
        { customerId: user.id },
        ...(user.phoneNumber
          ? [{ customerId: null, customerPhone: user.phoneNumber }]
          : []),
      ],
    };
    where.AND = [...(where.AND ?? []), ownershipClause];
  }


  /**
   * Paginated, filtered by status/branchId/date range. Include bike, offer, branch, processedBy
   * For CUSTOMER role or customer view: filters by the logged-in user id
   * Supports isCompleted filter: true=DELIVERED/CANCELLED, false=active orders
   */
  async getOrders(query: QueryOrdersDto, user?: any) {
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    } else if (query.isCompleted !== undefined) {
      if (query.isCompleted) {
        where.status = { in: [OrderStatus.DELIVERED, OrderStatus.CANCELLED] };
      } else {
        where.status = { in: [OrderStatus.PENDING_PAYMENT, OrderStatus.PAID, OrderStatus.CONFIRMED, OrderStatus.READY_FOR_DELIVERY] };
      }
    }

    if (query.branchId) {
      where.branchId = query.branchId;
    }

    this.applyBranchScope(where, user);



    if (query.orderType) {
      where.orderType = query.orderType;
    }

    if (query.pickupType) {
      where.pickupType = query.pickupType;
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) {
        where.createdAt.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.createdAt.lte = new Date(query.dateTo);
      }
    }

    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: "insensitive" } },
        { customerName: { contains: query.search, mode: "insensitive" } },
        { customerPhone: { contains: query.search, mode: "insensitive" } },
        { bike: { is: { chassisNumber: { contains: query.search, mode: "insensitive" } } } },
      ];
    }

    this.applyCustomerScope(where, user, query.isCustomerView);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.client.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          bike: {
            include: {
              model: true,
              branch: true,
            },
          },
          branch: true,
          processedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          transactions: true,
          delivery: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.client.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Full detail: bike + model, offer, branch, transactions, delivery, documents
   */
  async getOrderById(id: string, user?: any) {
    const order = await this.prisma.client.order.findUnique({
      where: { id },
      include: {
        bike: {
          include: {
            model: true,
            branch: true,
          },
        },
        branch: true,
        transactions: true,
        delivery: true,
        processedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    this.assertOrderAccess(order, user);

    return order;
  }

  /**
   * Create an online order directly by a customer (no negotiation)
   * Auto-applies 2% discount for online orders
   */
  async createCustomerOrder(dto: CreateCustomerOrderDto, user: any) {
    const isCash = dto.paymentMethod === "CASH";
    const result = await this.prisma.client.$transaction(async (tx) => {
      const bike = await tx.bikeUnit.findUnique({
        where: { id: dto.bikeId },
        include: { model: true, branch: true },
      });

      if (!bike) throw new NotFoundException(`Bike not found`);
      if (bike.status !== BikeStatus.AVAILABLE) throw new BadRequestException(`Bike is not available for sale`);

      const basePrice = Number(bike.model.basePrice);
      const salePrice = basePrice * 0.98;
      const discountAmount = basePrice - salePrice;
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      if (!isCash && !dto.paymentProofUrl) {
        throw new BadRequestException(`Payment proof URL is required for online orders`);
      }

      // Set expiry: 1 day for cash (onsite pickup), no expiry for online (awaiting verification)
      let expiresAt: Date | null = null;
      let reservationExpiry: Date | null = null;
      
      if (isCash) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
        reservationExpiry = expiresAt;
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          bikeId: bike.id,
          branchId: bike.branchId,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerCNIC: dto.customerCNIC || null,
          customerAddress: dto.customerAddress || null,
          paymentMethod: dto.paymentMethod,
          status: OrderStatus.PENDING_PAYMENT,
          expiresAt,
          reservationExpiry,
          isOnlineOrder: !isCash,
          appliedDiscount: discountAmount,
          orderType: isCash ? "ONSITE" : "ONLINE",
          pickupType: isCash ? "ONSITE_PICKUP" : "DELIVERY",
          customerId: user.id,
        },
      });

      await tx.bikeUnit.update({
        where: { id: bike.id },
        data: {
          status: BikeStatus.RESERVED,
          soldAt: null,
          reservedUntil: expiresAt,
          actualSalePrice: salePrice,
          ...(isCash ? {} : { onlineDiscountPercent: 2 }),
        },
      });

      // Cash stays PENDING until customer picks up at store.
      // Online with a proof URL → VERIFICATION_PENDING (awaiting admin review).
      const transaction = await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          amount: salePrice,
          method: dto.paymentMethod,
          status: !isCash
            ? PaymentStatus.VERIFICATION_PENDING
            : PaymentStatus.PENDING,
          paymentProofUrl: dto.paymentProofUrl || null,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id, userRole: user.role, action: AuditAction.CREATE,
          entityType: "ORDER", entityId: order.id,
          newValue: JSON.stringify({ ...dto, finalSalePrice: salePrice, discountApplied: discountAmount }),
        },
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: { bike: { include: { model: true, branch: true } }, branch: true, transactions: true },
      });
    });

    await this.orderAlertsService.createAlertsForOrder(result!.id, isCash ? AlertType.NEW_ORDER : AlertType.PAYMENT_PENDING);

    return result;
  }

  /**
   * Used for invoice/customer-facing lookup
   * For CUSTOMER role: verifies order belongs to customer
   */
  async getOrderByNumber(orderNumber: string, user?: any) {
    const order = await this.prisma.client.order.findUnique({
      where: { orderNumber },
      include: {
        bike: {
          include: {
            model: true,
            branch: true,
          },
        },
        branch: true,
        transactions: true,
        delivery: true,
        documents: true,
        processedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with number ${orderNumber} not found`);
    }

    // assertOrderAccess handles both the customerId match and the legacy phone
    // fallback (customerId IS NULL) in one place — no need to duplicate here.
    this.assertOrderAccess(order, user);

    return order;
  }

  /**
   * Complete missing details of an order before payment
   */
  async completeOrderDetails(id: string, dto: CompleteOrderDetailsDto, user: any) {
    const order = await this.getOrderById(id, user);


    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        `Cannot complete details for order in ${order.status} status`
      );
    }

    // Ownership was already verified by getOrderById → assertOrderAccess above.
    // No need to re-check here.



    return this.prisma.client.order.update({
      where: { id },
      data: {
        customerCNIC: dto.customerCNIC,
        customerAddress: dto.customerAddress,
        paymentMethod: dto.paymentMethod,
        // Only update processedById if the action is taken by a staff member
        ...(user?.role !== "CUSTOMER" && { processedById: user.id }),
      },
      include: {
        bike: {
          include: {
            model: true,
            branch: true,
          },
        },
        branch: true,
        processedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Advance order through valid state transitions only
   * Applies inventory side effects: DELIVERED → bike SOLD, CANCELLED → bike AVAILABLE
   */
  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto, user: any) {
    const order = await this.getOrderById(id, user);

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.READY_FOR_DELIVERY, OrderStatus.CANCELLED],
      [OrderStatus.READY_FOR_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const currentStatus = order.status as OrderStatus;
    const newStatus = dto.status;

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }

    const updatedOrder = await this.prisma.client.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: {
          status: newStatus,
          processedById: user.id,
        },
        include: {
          bike: {
            include: {
              model: true,
              branch: true,
            },
          },
          branch: true,
          processedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

      // Update payment transaction status when order is paid or beyond
      if (newStatus === OrderStatus.PAID || newStatus === OrderStatus.CONFIRMED || newStatus === OrderStatus.READY_FOR_DELIVERY || newStatus === OrderStatus.DELIVERED) {
        await tx.paymentTransaction.updateMany({
          where: {
            orderId: id,
            status: { in: [PaymentStatus.PENDING, PaymentStatus.VERIFICATION_PENDING] }
          },
          data: {
            status: PaymentStatus.SUCCESS,
            verifiedAt: new Date(),
            verifiedById: user.id,
          },
        });
      }

      // Side effects: keep bike status in sync with order lifecycle
      if (newStatus === OrderStatus.DELIVERED && order.bike.status !== BikeStatus.SOLD) {
        await tx.bikeUnit.update({
          where: { id: order.bikeId },
          data: {
            status: BikeStatus.SOLD,
            soldAt: new Date(),
            reservedUntil: null,
          },
        });
      }

      if (newStatus === OrderStatus.CANCELLED) {
        await tx.bikeUnit.update({
          where: { id: order.bikeId },
          data: {
            status: BikeStatus.AVAILABLE,
            reservedUntil: null,
            soldAt: null,
          },
        });
      }

      return updatedOrder;
    });

    // AFTER transaction commits, send customer notification
    if (order.customerId && currentStatus !== newStatus) {
      let alertType = AlertType.ORDER_STATUS_UPDATED;
      
      if (newStatus === OrderStatus.CANCELLED) {
        alertType = AlertType.ORDER_CANCELLED;
      } else if (newStatus === OrderStatus.DELIVERED) {
        alertType = AlertType.ORDER_DELIVERED;
      }

      await this.orderAlertsService.createCustomerAlertForOrder(
        id,
        order.customerId!,
        alertType
      );
    }

    return updatedOrder;
  }

  /**
   * Atomic: set order → CANCELLED, revert bike → AVAILABLE, clear reservedUntil
   */
  async cancelOrder(id: string, dto: CancelOrderDto, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Fetch order, verify not already DELIVERED or CANCELLED
      const order = await tx.order.findUnique({
        where: { id },
        include: {
          transactions: true,
          processedBy: {
            select: {
              role: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      this.assertOrderAccess(order, user);

      if (order.status === OrderStatus.DELIVERED) {
        throw new BadRequestException(`Cannot cancel a delivered order`);
      }

      if (order.status === OrderStatus.CANCELLED) {
        throw new BadRequestException(`Order is already cancelled`);
      }

      // 2. Update order: status → CANCELLED
      const updatedOrder = await tx.order.update({
        where: { id },
        data: {
          status: OrderStatus.CANCELLED,
          processedById: user.id,
        },
      });

      // 3. Update bike: status → AVAILABLE, reservedUntil → null, soldAt → null
      await tx.bikeUnit.update({
        where: { id: order.bikeId },
        data: {
          status: BikeStatus.AVAILABLE,
          reservedUntil: null,
          soldAt: null,
        },
      });

      // 4. Update any associated payment transactions to CANCELLED
      await tx.paymentTransaction.updateMany({
        where: {
          orderId: id,
          status: { not: PaymentStatus.FAILED }
        },
        data: {
          status: PaymentStatus.CANCELLED,
        },
      });


      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "ORDER",
          entityId: order.id,
          oldValue: JSON.stringify({ status: order.status }),
          newValue: JSON.stringify({ status: OrderStatus.CANCELLED }),
        },
      });

      return {
        order: updatedOrder,
        message: "Order cancelled successfully",
      };
    });
  }

  /**
   * Create PaymentTransaction, if method is CASH → immediately set transaction SUCCESS
   * + order → PAID + offer → PAID, set bike → SOLD — all in one transaction
   * For non-cash payments, set transaction to VERIFICATION_PENDING and order to PENDING_PAYMENT
   * For cash payments, set reservationExpiry to 2 days from now
   */
  async recordPayment(orderId: string, dto: RecordPaymentDto, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Fetch order
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          bike: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      this.assertOrderAccess(order, user);

      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw new BadRequestException(
          `Order is not in PENDING_PAYMENT status. Current status: ${order.status}`
        );
      }

      // 2. Check if reservation has expired (for cash payments)
      if (order.reservationExpiry && new Date() > order.reservationExpiry) {
        throw new BadRequestException(
          `Reservation has expired on ${order.reservationExpiry.toISOString()}`
        );
      }

      // 3. Update order with payment method
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentMethod: dto.method,
        },
      });

      // 4. Update or Create PaymentTransaction
      // If there's an existing transaction (e.g. from customer order), update it to avoid duplicates
      const existingTx = await tx.paymentTransaction.findFirst({
        where: { orderId, status: { in: [PaymentStatus.PENDING, PaymentStatus.VERIFICATION_PENDING] } }
      });

      let transaction: any = existingTx;

      if (existingTx) {
        transaction = await tx.paymentTransaction.update({
          where: { id: existingTx.id },
          data: {
            amount: dto.amount,
            method: dto.method,
            gatewayReference: dto.referenceNumber || null,
            status: PaymentStatus.SUCCESS,
            verifiedAt: new Date(),
            verifiedById: user.id,
          },
        });
      } else {
        transaction = await tx.paymentTransaction.create({
          data: {
            orderId,
            amount: dto.amount,
            method: dto.method,
            gatewayReference: dto.referenceNumber || null,
            status: PaymentStatus.SUCCESS,
            verifiedAt: new Date(),
            verifiedById: user.id,
          },
        });
      }

      // 5. Update order → PAID, bike → SOLD
      let reservationExpiry = order.reservationExpiry;
      if (dto.method === "CASH" && order.pickupType === "ONSITE_PICKUP") {
        // Set reservation expiry to 1 day from now for cash pickups
        reservationExpiry = new Date();
        reservationExpiry.setDate(reservationExpiry.getDate() + 1);
      } else if (dto.method !== "CASH") {
        // If it's fully paid non-cash, no expiry applies
        reservationExpiry = null;
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAID,
          paymentVerified: true,
          reservationExpiry,
          processedById: user.id,
        },
      });

      await tx.bikeUnit.update({
        where: { id: order.bikeId },
        data: {
          status: BikeStatus.SOLD,
          soldAt: new Date(),
          reservedUntil: null,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.PAYMENT,
          entityType: "ORDER",
          entityId: orderId,
          newValue: JSON.stringify(dto),
        },
      });

      // No need for payment verification alerts since admin directly recorded it

      return {
        order: updatedOrder,
        transaction,
      };
    });
  }

  /**
   * Branch-scoped order list (used by MANAGER)
   */
  async getOrdersByBranch(branchId: string, user?: any) {
    if (this.isAssignedBranchUser(user) && user.branchId !== branchId) {
      throw new NotFoundException("Orders not found");
    }

    const orders = await this.prisma.client.order.findMany({
      where: { branchId },
      include: {
        bike: {
          include: {
            model: true,
            branch: true,
          },
        },
        processedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  }

  /**
   * Customer-scoped order list by phone number.
   * Returns orders matched by customerPhone OR by the customerId of a registered
   * user account whose phoneNumber matches — so online orders (which carry
   * customerId but may have a different stored phone) are included too.
   */
  async getOrdersByCustomerPhone(phone: string, user?: any) {
    // Look up a registered user account with this phone so we can also match
    // orders that are linked via customerId rather than customerPhone.
    const matchedUser = await this.prisma.client.user.findFirst({
      where: { phoneNumber: phone },
      select: { id: true },
    });

    const where: any = {
      OR: [
        { customerPhone: phone },
        ...(matchedUser ? [{ customerId: matchedUser.id }] : []),
      ],
    };

    // Branch scope must be applied as an AND alongside the OR so it doesn't
    // clobber the OR clause. applyBranchScope writes a flat branchId key, so
    // we handle it manually here.
    if (this.isAssignedBranchUser(user)) {
      where.AND = [{ branchId: user.branchId }];
    }

    const orders = await this.prisma.client.order.findMany({
      where,
      include: {
        bike: {
          include: {
            model: true,
            branch: true,
          },
        },
        branch: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  }

  /**
   * Manual sale registration (admin bypasses offer workflow)
   * Handles both ONLINE and ONSITE order types
   */
  async createManualOrder(dto: CreateManualOrderDto, user: any) {
    const createdOrder = await this.prisma.client.$transaction(async (tx) => {
      // 1. Find bike with model to get base price
      const bike = await tx.bikeUnit.findUnique({
        where: { chassisNumber: dto.chassisNumber },
        include: {
          branch: true,
          model: true,
        },
      });

      if (!bike) {
        throw new NotFoundException(`Bike with chassis ${dto.chassisNumber} not found`);
      }

      if (this.isAssignedBranchUser(user) && bike.branchId !== user.branchId) {
        throw new NotFoundException(`Bike with chassis ${dto.chassisNumber} not found`);
      }

      if (bike.status !== BikeStatus.AVAILABLE) {
        throw new BadRequestException(`Bike is not available for sale`);
      }

      // 2. Determine order type and calculate price
      const orderType = dto.orderType || "ONSITE";
      let finalSalePrice: number;
      let isOnlineOrder: boolean;

      if (orderType === "ONLINE") {
        // ONLINE: auto-apply 2% discount from base price
        const basePrice = Number(bike.model.basePrice);
        finalSalePrice = basePrice * 0.98; // 2% discount
        isOnlineOrder = true;
      } else {
        // ONSITE: use actualSalePrice if provided, otherwise use salePrice
        finalSalePrice = dto.actualSalePrice || dto.salePrice;
        isOnlineOrder = false;
      }

      // 3. Generate order number
      const orderNumber = `ORD-MAN-${Date.now()}`;

      // 4. Set expiresAt to 1 week from now (for manual orders that might be pending payment)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // 5. Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          bikeId: bike.id,
          branchId: bike.branchId,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerCNIC: dto.customerCNIC,
          customerAddress: dto.customerAddress,
          paymentMethod: dto.paymentMethod,
          status: OrderStatus.DELIVERED,
          paymentVerified: true,
          expiresAt,
          processedById: user.id,
          isOnlineOrder,
          orderType,
          pickupType: orderType === "ONLINE" ? "DELIVERY" : "ONSITE_PICKUP",
          customerId: dto.customerId ?? null,
        },
      });

      // 6. Update Bike
      await tx.bikeUnit.update({
        where: { id: bike.id },
        data: {
          status: BikeStatus.SOLD,
          soldAt: new Date(),
          reservedUntil: null,
          actualSalePrice: finalSalePrice,
          ...(orderType === "ONLINE" && { onlineDiscountPercent: 2 }),
        },
      });

      // 7. Create PaymentTransaction
      await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          amount: finalSalePrice,
          method: dto.paymentMethod,
          status: PaymentStatus.SUCCESS,
          verifiedAt: new Date(),
          verifiedById: user.id,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.CREATE,
          entityType: "ORDER",
          entityId: order.id,
          newValue: JSON.stringify({ ...dto, finalSalePrice, orderType }),
        },
      });

      return order;
    });

    // Create alerts for users based on their role AFTER transaction commits
    await this.orderAlertsService.createAlertsForOrder(createdOrder.id, AlertType.NEW_ORDER);

    return createdOrder;
  }

  /**
   * Register an online sale with automatic 2% discount from base price
   */
  async registerOnlineSale(dto: CreateManualOrderDto, user: any) {
    return this.createManualOrder(
      { ...dto, orderType: OrderType.ONLINE },
      user
    );
  }

  /**
   * Register an onsite sale with custom pricing (no validation)
   */
  async registerOnsiteSale(dto: CreateManualOrderDto, user: any) {
    return this.createManualOrder(
      { ...dto, orderType: OrderType.ONSITE, actualSalePrice: dto.salePrice },
      user
    );
  }

  /**
   * Mark order as completed for onsite purchases
   * Used when customer buys in person at branch
   */
  async markOrderAsCompletedOnsite(orderId: string, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Fetch order
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          bike: true,
          delivery: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      // 2. Verify order is in PAID or CONFIRMED status
      if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.CONFIRMED) {
        throw new BadRequestException(
          `Order must be in PAID or CONFIRMED status to be marked as completed onsite. Current status: ${order.status}`
        );
      }

      // 3. Update order status to DELIVERED
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.DELIVERED,
          processedById: user.id,
        },
      });

      // 4. Update bike status to SOLD if not already
      if (order.bike.status !== BikeStatus.SOLD) {
        await tx.bikeUnit.update({
          where: { id: order.bikeId },
          data: {
            status: BikeStatus.SOLD,
            soldAt: new Date(),
            reservedUntil: null,
          },
        });
      }

      // 5. Handle delivery request if one exists
      if (order.delivery) {
        await tx.deliveryRequest.update({
          where: { id: order.delivery.id },
          data: {
            status: "DELIVERED",
            deliveredAt: new Date(),
          },
        });
      }

      // 6. Create audit log entry
      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "ORDER",
          entityId: orderId,
          oldValue: JSON.stringify({ status: order.status }),
          newValue: JSON.stringify({ status: OrderStatus.DELIVERED, completedOnsite: true }),
        },
      });

      return updatedOrder;
    });
  }

  /**
   * Mark order as picked up by customer (no delivery)
   * Used when customer picks up the bike at the branch themselves
   */
  async markAsPickedByCustomer(orderId: string, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Fetch order
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          bike: true,
          delivery: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      // 2. Verify order is in CONFIRMED status
      if (order.status !== OrderStatus.CONFIRMED) {
        throw new BadRequestException(
          `Order must be in CONFIRMED status to be marked as picked by customer. Current status: ${order.status}`
        );
      }

      // 3. Verify no delivery request exists (customer is picking up themselves)
      if (order.delivery) {
        throw new BadRequestException(
          `Cannot mark order as picked by customer when a delivery request exists`
        );
      }

      // 4. Update order status to DELIVERED
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.DELIVERED,
          processedById: user.id,
        },
      });

      // 5. Update bike status to SOLD
      if (order.bike.status !== BikeStatus.SOLD) {
        await tx.bikeUnit.update({
          where: { id: order.bikeId },
          data: {
            status: BikeStatus.SOLD,
            soldAt: new Date(),
            reservedUntil: null,
          },
        });
      }

      // 6. Create audit log entry
      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "ORDER",
          entityId: orderId,
          oldValue: JSON.stringify({ status: order.status }),
          newValue: JSON.stringify({ status: OrderStatus.DELIVERED, pickedByCustomer: true }),
        },
      });

      return updatedOrder;
    });
  }

  /**
   * Get orders awaiting payment verification
   * For ADMIN and MANAGER roles
   */
  async getPendingVerificationOrders(user: any) {
    const where: any = {
      transactions: {
        some: {
          status: PaymentStatus.VERIFICATION_PENDING,
        },
      },
    };

    this.applyBranchScope(where, user);

    const orders = await this.prisma.client.order.findMany({
      where,
      include: {
        bike: {
          include: {
            model: true,
            branch: true,
          },
        },
        branch: true,
        transactions: {
          where: {
            status: PaymentStatus.VERIFICATION_PENDING,
          },
        },
        processedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  }

  /**
   * Upload payment proof for an order
   * For ADMIN, MANAGER, SALES_STAFF, and CUSTOMER roles
   */
  async uploadPaymentProof(orderId: string, dto: UploadPaymentProofDto, user: any) {
    const order = await this.getOrderById(orderId, user);

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        `Cannot upload payment proof for order in ${order.status} status`
      );
    }

    // Find the pending transaction
    const transaction = await this.prisma.client.paymentTransaction.findFirst({
      where: {
        orderId,
        status: { in: [PaymentStatus.PENDING, PaymentStatus.VERIFICATION_PENDING] },
      },
    });

    if (!transaction) {
      throw new BadRequestException(
        "No pending transaction found for this order"
      );
    }

    // Update transaction with payment proof URL and status
    const updatedTransaction = await this.prisma.client.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        paymentProofUrl: dto.paymentProofUrl,
        status: PaymentStatus.VERIFICATION_PENDING,
      },
    });

    await this.prisma.client.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: AuditAction.UPDATE,
        entityType: "PAYMENT_TRANSACTION",
        entityId: transaction.id,
        newValue: JSON.stringify({ paymentProofUrl: dto.paymentProofUrl }),
      },
    });

    return updatedTransaction;
  }

  /**
   * Verify payment for an order
   * For ADMIN and MANAGER roles
   * Updates transaction to SUCCESS, order to PAID, and bike to SOLD
   */
  async verifyPayment(orderId: string, dto: VerifyPaymentDto, user: any) {
    // Fetch order first to get customerId for notification
    const order = await this.prisma.client.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const result = await this.prisma.client.$transaction(async (tx) => {
      // 1. Fetch order
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          bike: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      this.assertOrderAccess(order, user);

      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw new BadRequestException(
          `Order is not in PENDING_PAYMENT status. Current status: ${order.status}`
        );
      }

      // 2. Fetch transaction
      const transaction = await tx.paymentTransaction.findUnique({
        where: { id: dto.transactionId },
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${dto.transactionId} not found`);
      }

      if (transaction.orderId !== orderId) {
        throw new BadRequestException(`Transaction does not belong to this order`);
      }

      if (transaction.status !== PaymentStatus.VERIFICATION_PENDING) {
        throw new BadRequestException(
          `Transaction is not in VERIFICATION_PENDING status. Current status: ${transaction.status}`
        );
      }

      let updatedTransaction;
      let updatedOrder;

      if (dto.isApproved) {
        // 3. Update transaction to SUCCESS
        updatedTransaction = await tx.paymentTransaction.update({
          where: { id: dto.transactionId },
          data: {
            status: PaymentStatus.SUCCESS,
            verifiedAt: new Date(),
            verifiedById: user.id,
          },
        });

        // 4. Update order to PAID
        updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.PAID,
            paymentVerified: true,
            processedById: user.id,
          },
        });

        // 5. Update bike to SOLD
        await tx.bikeUnit.update({
          where: { id: order.bikeId },
          data: {
            status: BikeStatus.SOLD,
            soldAt: new Date(),
            reservedUntil: null,
          },
        });

        // 7. Create audit log entry
        await tx.auditLog.create({
          data: {
            userId: user.id,
            userRole: user.role,
            action: AuditAction.PAYMENT,
            entityType: "ORDER",
            entityId: orderId,
            newValue: JSON.stringify({ paymentVerified: true }),
          },
        });
      } else {
        // 3. Update transaction to FAILED
        updatedTransaction = await tx.paymentTransaction.update({
          where: { id: dto.transactionId },
          data: {
            status: PaymentStatus.FAILED,
            failureReason: dto.reason || "Payment proof rejected by admin",
            verifiedAt: new Date(),
            verifiedById: user.id,
          },
        });

        // 4. Update order to CANCELLED
        updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.CANCELLED,
            processedById: user.id,
          },
        });

        // 5. Update bike to AVAILABLE
        await tx.bikeUnit.update({
          where: { id: order.bikeId },
          data: {
            status: BikeStatus.AVAILABLE,
            soldAt: null,
            reservedUntil: null,
          },
        });

        // 7. Create audit log entry
        await tx.auditLog.create({
          data: {
            userId: user.id,
            userRole: user.role,
            action: AuditAction.PAYMENT,
            entityType: "ORDER",
            entityId: orderId,
            newValue: JSON.stringify({ paymentVerified: false, reason: dto.reason }),
          },
        });
      }

      return {
        order: updatedOrder,
        transaction: updatedTransaction,
      };
    });

    // AFTER transaction commits, send customer notification
    if (order.customerId) {
      const alertType = dto.isApproved 
        ? AlertType.PAYMENT_VERIFIED 
        : AlertType.PAYMENT_FAILED;
      
      await this.orderAlertsService.createCustomerAlertForOrder(
        orderId,
        order.customerId!,
        alertType
      );
    }

    return result;
  }

  /**
   * Expire reservations that have passed their reservationExpiry
   * Sets order to CANCELLED, bike back to AVAILABLE
   * Can be called by scheduled job or manually
   */
  async expireReservations() {
    const now = new Date();

    const expiredOrders = await this.prisma.client.order.findMany({
      where: {
        reservationExpiry: {
          lt: now,
        },
        status: {
          in: [OrderStatus.PAID, OrderStatus.PENDING_PAYMENT],
        },
      },
      include: {
        bike: true,
      },
    });

    const results: Array<{
      orderId: string;
      orderNumber: string;
      success: boolean;
      error?: string;
    }> = [];

    for (const order of expiredOrders) {
      try {
        await this.prisma.client.$transaction(async (tx) => {
          // Update order to CANCELLED
          await tx.order.update({
            where: { id: order.id },
            data: {
              status: OrderStatus.CANCELLED,
            },
          });

          // Update bike back to AVAILABLE
          await tx.bikeUnit.update({
            where: { id: order.bikeId },
            data: {
              status: BikeStatus.AVAILABLE,
              soldAt: null,
              reservedUntil: null,
            },
          });

          // Update any associated payment transactions to FAILED
          await tx.paymentTransaction.updateMany({
            where: {
              orderId: order.id,
              status: { not: PaymentStatus.FAILED }
            },
            data: {
              status: PaymentStatus.FAILED,
            },
          });

          // Create audit log
          await tx.auditLog.create({
            data: {
              action: AuditAction.UPDATE,
              entityType: "ORDER",
              entityId: order.id,
              newValue: JSON.stringify({
                status: OrderStatus.CANCELLED,
                reason: "Reservation expired"
              }),
            },
          });

          // Create alert for reservation expiry
          await this.orderAlertsService.createAlertsForOrder(order.id, AlertType.EXPIRY_WARNING);
        });

        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          success: true,
        });
      } catch (error: any) {
        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      total: expiredOrders.length,
      processed: results.length,
      results,
    };
  }

  /**
   * Get revenue summary with filters
   */
  async revenueSummary(query: RevenueQueryDto, user?: any) {
    const now = new Date();
    let dateFrom: Date;
    let dateTo: Date;

    // Calculate date range based on duration
    switch (query.duration) {
      case RevenueDuration.WEEKLY:
        dateFrom = new Date(now);
        dateFrom.setDate(dateFrom.getDate() - 7);
        dateTo = now;
        break;
      case RevenueDuration.MONTHLY:
        dateFrom = new Date(now);
        dateFrom.setMonth(dateFrom.getMonth() - 1);
        dateTo = now;
        break;
      case RevenueDuration.ANNUAL:
        dateFrom = new Date(now);
        dateFrom.setFullYear(dateFrom.getFullYear() - 1);
        dateTo = now;
        break;
      case RevenueDuration.CUSTOM:
        if (!query.dateFrom || !query.dateTo) {
          throw new BadRequestException("dateFrom and dateTo are required for CUSTOM duration");
        }
        dateFrom = new Date(query.dateFrom);
        dateTo = new Date(query.dateTo);
        break;
      default:
        throw new BadRequestException("Invalid duration");
    }

    const where: any = {
      createdAt: {
        gte: dateFrom,
        lte: dateTo,
      },
      status: {
        in: [OrderStatus.PAID, OrderStatus.CONFIRMED, OrderStatus.READY_FOR_DELIVERY, OrderStatus.DELIVERED],
      },
    };

    // Apply branch filter
    if (query.branchId) {
      where.branchId = query.branchId;
    }

    // Apply branch scope for non-admin users
    this.applyBranchScope(where, user);

    // Get orders with transactions
    const orders = await this.prisma.client.order.findMany({
      where,
      include: {
        transactions: {
          where: {
            status: PaymentStatus.SUCCESS,
          },
        },
        branch: true,
      },
    });

    // Calculate revenue metrics
    const totalRevenue = orders.reduce((sum, order) => {
      const orderRevenue = order.transactions.reduce((txSum, tx) => txSum + Number(tx.amount), 0);
      return sum + orderRevenue;
    }, 0);

    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group by branch
    const revenueByBranch = orders.reduce((acc, order) => {
      const branchId = order.branchId;
      const branchRevenue = order.transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);

      if (!acc[branchId]) {
        acc[branchId] = {
          branchId,
          branchName: order.branch.name,
          revenue: 0,
          orderCount: 0,
        };
      }

      acc[branchId].revenue += branchRevenue;
      acc[branchId].orderCount += 1;

      return acc;
    }, {} as Record<string, any>);

    return {
      duration: query.duration,
      dateFrom,
      dateTo,
      totalRevenue,
      totalOrders,
      averageOrderValue,
      revenueByBranch: Object.values(revenueByBranch),
    };
  }
}
