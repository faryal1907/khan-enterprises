import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { QueryOrdersDto } from "./dto/query-orders.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { CompleteOrderDetailsDto } from "./dto/complete-order-details.dto";
import { RecordPaymentDto } from "./dto/record-payment.dto";
import { CreateManualOrderDto } from "./dto/create-manual-order.dto";
import { UploadPaymentProofDto } from "./dto/upload-payment-proof.dto";
import { VerifyPaymentDto } from "./dto/verify-payment.dto";
import { OrderStatus, BikeStatus, PaymentStatus, AuditAction } from "@khan/prisma";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private isAssignedBranchUser(user?: any) {
    return user?.role !== "ADMIN" && user?.role !== "CUSTOMER" && Boolean(user?.branchId);
  }

  private applyBranchScope(where: any, user?: any) {
    if (this.isAssignedBranchUser(user)) {
      where.branchId = user.branchId;
    }
  }

  private assertOrderAccess(order: { branchId: string; customerPhone?: string }, user?: any) {
    if (user?.role === "CUSTOMER" && order.customerPhone !== user.phoneNumber) {
      throw new NotFoundException("Order not found");
    }

    if (this.isAssignedBranchUser(user) && order.branchId !== user.branchId) {
      throw new NotFoundException("Order not found");
    }
  }

  /**
   * Paginated, filtered by status/branchId/date range. Include bike, offer, branch, processedBy
   * For CUSTOMER role: filters by customer phone/CNIC from user profile
   * Supports isCompleted filter: true=DELIVERED/CANCELLED, false=active orders
   */
  async getOrders(query: QueryOrdersDto, user?: any) {
    console.log('getOrders called with query:', query);
    console.log('isCompleted value:', query.isCompleted, 'type:', typeof query.isCompleted, 'is undefined:', query.isCompleted === undefined);
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    } else if (query.isCompleted !== undefined) {
      console.log('Filtering by isCompleted:', query.isCompleted);
      // Filter by completion status
      if (query.isCompleted) {
        where.status = { in: [OrderStatus.DELIVERED, OrderStatus.CANCELLED] };
        console.log('Setting where.status for completed orders:', where.status);
      } else {
        where.status = { in: [OrderStatus.PENDING_PAYMENT, OrderStatus.PAID, OrderStatus.CONFIRMED, OrderStatus.READY_FOR_DELIVERY] };
        console.log('Setting where.status for current orders:', where.status);
      }
    }

    if (query.branchId) {
      where.branchId = query.branchId;
    }

    this.applyBranchScope(where, user);

    if (query.processedById) {
      where.processedById = query.processedById;
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

    // Filter by customer for CUSTOMER role
    if (user?.role === "CUSTOMER") {
      where.customerPhone = user.phoneNumber;
    }

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
          offer: true,
          branch: true,
          processedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          transactions: true,
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
        offer: true,
        branch: true,
        transactions: true,
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
        offer: true,
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

    // For CUSTOMER role, verify order belongs to them
    if (user?.role === "CUSTOMER" && order.customerPhone !== user.phoneNumber) {
      throw new NotFoundException(`Order with number ${orderNumber} not found`);
    }

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

    // For CUSTOMER role, verify order belongs to them
    if (user?.role === "CUSTOMER" && order.customerPhone !== user.phoneNumber) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

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
        offer: true,
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

    return this.prisma.client.order.update({
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
        offer: true,
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
          offer: true,
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
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentMethod: dto.method,
        },
      });

      // 4. Create PaymentTransaction
      const transaction = await tx.paymentTransaction.create({
        data: {
          orderId,
          amount: dto.amount,
          method: dto.method,
          gatewayReference: dto.referenceNumber || null,
          status: dto.method === "CASH" ? PaymentStatus.SUCCESS : PaymentStatus.VERIFICATION_PENDING,
        },
      });

      // 5. For CASH payments: set order → PAID, offer → PAID, bike → SOLD, set reservationExpiry to 2 days
      // For non-CASH payments: keep order in PENDING_PAYMENT status for verification
      if (dto.method === "CASH") {
        // Set reservation expiry to 2 days from now
        const reservationExpiry = new Date();
        reservationExpiry.setDate(reservationExpiry.getDate() + 2);

        await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.PAID,
            reservationExpiry,
            processedById: user.id,
          },
        });

        if (order.offerId) {
          await tx.offer.update({
            where: { id: order.offerId },
            data: {
              status: "PAID",
            },
          });
        }

        await tx.bikeUnit.update({
          where: { id: order.bikeId },
          data: {
            status: BikeStatus.SOLD,
            soldAt: new Date(),
            reservedUntil: null,
          },
        });
      }

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
        offer: true,
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
   * Customer-scoped order list by phone number (public endpoint)
   */
  async getOrdersByCustomerPhone(phone: string) {
    const orders = await this.prisma.client.order.findMany({
      where: { customerPhone: phone },
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
   */
  async createManualOrder(dto: CreateManualOrderDto, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Find bike
      const bike = await tx.bikeUnit.findUnique({
        where: { chassisNumber: dto.chassisNumber },
        include: { branch: true },
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

      // 2. Generate order number
      const orderNumber = `ORD-MAN-${Date.now()}`;

      // 3. Set expiresAt to 1 week from now (for manual orders that might be pending payment)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // 4. Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          bikeId: bike.id,
          branchId: bike.branchId,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerCNIC: dto.customerCNIC,
          customerAddress: dto.customerAddress,
          negotiatedAmount: dto.salePrice,
          paymentMethod: dto.paymentMethod,
          status: OrderStatus.CONFIRMED,
          expiresAt,
          processedById: user.id,
          isOnlineOrder: false,
          orderType: "ONSITE",
          pickupType: "ONSITE_PICKUP",
        },
      });

      // 4. Update Bike
      await tx.bikeUnit.update({
        where: { id: bike.id },
        data: {
          status: BikeStatus.SOLD,
          soldAt: new Date(),
          reservedUntil: null,
        },
      });

      // 5. Create PaymentTransaction
      await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          amount: dto.salePrice,
          method: dto.paymentMethod,
          status: dto.paymentMethod === "CASH" ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.CREATE,
          entityType: "ORDER",
          entityId: order.id,
          newValue: JSON.stringify(dto),
        },
      });

      return order;
    });
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
        offer: true,
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
        status: PaymentStatus.VERIFICATION_PENDING,
      },
    });

    if (!transaction) {
      throw new BadRequestException(
        "No pending verification transaction found for this order"
      );
    }

    // Update transaction with payment proof URL
    const updatedTransaction = await this.prisma.client.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        paymentProofUrl: dto.paymentProofUrl,
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
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Fetch order
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          bike: true,
          offer: true,
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

      // 3. Update transaction to SUCCESS
      const updatedTransaction = await tx.paymentTransaction.update({
        where: { id: dto.transactionId },
        data: {
          status: PaymentStatus.SUCCESS,
          verifiedAt: new Date(),
          verifiedById: user.id,
        },
      });

      // 4. Update order to PAID
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAID,
          paymentVerified: true,
          processedById: user.id,
        },
      });

      // 5. Update offer to PAID if exists
      if (order.offerId) {
        await tx.offer.update({
          where: { id: order.offerId },
          data: {
            status: "PAID",
          },
        });
      }

      // 6. Update bike to SOLD
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

      return {
        order: updatedOrder,
        transaction: updatedTransaction,
      };
    });
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
}
