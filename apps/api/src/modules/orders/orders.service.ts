import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { QueryOrdersDto } from "./dto/query-orders.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { CompleteOrderDetailsDto } from "./dto/complete-order-details.dto";
import { RecordPaymentDto } from "./dto/record-payment.dto";
import { CreateManualOrderDto } from "./dto/create-manual-order.dto";
import { OrderStatus, BikeStatus, PaymentStatus, AuditAction } from "@khan/prisma";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Paginated, filtered by status/branchId/date range. Include bike, offer, branch, processedBy
   * For CUSTOMER role: filters by customer phone/CNIC from user profile
   */
  async getOrders(query: QueryOrdersDto, user?: any) {
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.branchId) {
      where.branchId = query.branchId;
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
  async getOrderById(id: string) {
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

    return order;
  }

  /**
   * Complete missing details of an order before payment
   */
  async completeOrderDetails(id: string, dto: CompleteOrderDetailsDto, user: any) {
    const order = await this.getOrderById(id);

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
    const order = await this.getOrderById(id);

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
   * Atomic: set order → CANCELLED, revert bike → AVAILABLE, clear reservedUntil,
   * if any transaction is SUCCESS flag for refund
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

      // 4. Check for any SUCCESS transactions → if found, create AuditLog entry flagging refund needed
      const successTransactions = order.transactions.filter(
        (t) => t.status === PaymentStatus.SUCCESS
      );

      if (successTransactions.length > 0) {
        await tx.auditLog.create({
          data: {
            userId: user.id,
            userRole: user.role,
            action: AuditAction.REFUND,
            entityType: "Order",
            entityId: order.id,
            oldValue: { status: order.status },
            newValue: { status: OrderStatus.CANCELLED, refundRequired: true },
          },
        });
      }

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
        refundRequired: successTransactions.length > 0,
      };
    });
  }

  /**
   * Create PaymentTransaction, if method is CASH → immediately set transaction SUCCESS
   * + order → PAID + offer → PAID, set bike → SOLD — all in one transaction
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

      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw new BadRequestException(
          `Order is not in PENDING_PAYMENT status. Current status: ${order.status}`
        );
      }

      // 2. Update order with payment method
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentMethod: dto.method,
        },
      });

      // 3. Create PaymentTransaction
      const transaction = await tx.paymentTransaction.create({
        data: {
          orderId,
          amount: dto.amount,
          method: dto.method,
          gatewayReference: dto.referenceNumber || null,
          status: dto.method === "CASH" ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
        },
      });

      // 4. If CASH, immediately set order → CONFIRMED, offer → PAID, bike → SOLD
      if (dto.method === "CASH") {
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.CONFIRMED,
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
  async getOrdersByBranch(branchId: string) {
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

      if (bike.status !== BikeStatus.AVAILABLE) {
        throw new BadRequestException(`Bike is not available for sale`);
      }

      // 2. Generate order number
      const orderNumber = `ORD-MAN-${Date.now()}`;

      // 3. Create Order
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
          processedById: user.id,
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
}
