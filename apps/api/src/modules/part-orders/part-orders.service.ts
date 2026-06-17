import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePartOrderDto } from "./dto/create-part-order.dto";
import { CreateManualPartOrderDto } from "./dto/create-manual-part-order.dto";
import { QueryPartOrdersDto } from "./dto/query-part-orders.dto";
import { OrderStatus, PaymentStatus, BikeStatus, AuditAction } from "@khan/prisma";

@Injectable()
export class PartOrdersService {
  constructor(private readonly prisma: PrismaService) { }

  private isAssignedBranchUser(user?: any) {
    return user?.role !== "ADMIN" && user?.role !== "CUSTOMER" && Boolean(user?.branchId);
  }

  private applyBranchScope(where: any, user?: any) {
    if (this.isAssignedBranchUser(user)) {
      where.branchId = user.branchId;
    }
  }

  private assertPartOrderAccess(order: { branchId: string; customerPhone?: string }, user?: any) {
    if (user?.role === "CUSTOMER" && order.customerPhone !== user.phoneNumber) {
      throw new NotFoundException("Part order not found");
    }

    if (this.isAssignedBranchUser(user) && order.branchId !== user.branchId) {
      throw new NotFoundException("Part order not found");
    }
  }

  /**
   * Create a new part order
   */
  async createPartOrder(dto: CreatePartOrderDto) {
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Verify part exists
      const part = await tx.part.findUnique({
        where: { id: dto.partId },
      });
      if (!part) {
        throw new NotFoundException(`Part with ID ${dto.partId} not found`);
      }

      // 2. Verify part inventory exists and has sufficient stock
      const inventory = await tx.partInventory.findUnique({
        where: { id: dto.partInventoryId },
        include: { branch: true },
      });
      if (!inventory) {
        throw new NotFoundException(`Part inventory with ID ${dto.partInventoryId} not found`);
      }
      if (inventory.partId !== dto.partId) {
        throw new BadRequestException(`Part inventory does not belong to the specified part`);
      }
      const availableQuantity = inventory.quantity - inventory.reservedQuantity;
      if (availableQuantity < dto.quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${availableQuantity}, Requested: ${dto.quantity}`
        );
      }

      // 3. Generate unique order number
      const orderNumber = this.generateOrderNumber();

      // 4. Calculate total amount
      const amount = part.sellingPrice.mul(dto.quantity);

      // 5. Set expiresAt to 1 week from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // 6. Create part order
      const partOrder = await tx.partOrder.create({
        data: {
          orderNumber,
          partId: dto.partId,
          partInventoryId: dto.partInventoryId,
          branchId: inventory.branchId,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerAddress: dto.customerAddress,
          quantity: dto.quantity,
          amount,
          paymentMethod: dto.paymentMethod,
          status: OrderStatus.PENDING_PAYMENT,
          expiresAt,
        },
        include: {
          part: true,
          partInventory: {
            include: {
              branch: true,
            },
          },
          branch: true,
        },
      });

      // 6. Reserve the stock
      await tx.partInventory.update({
        where: { id: dto.partInventoryId },
        data: {
          reservedQuantity: {
            increment: dto.quantity,
          },
        },
      });

      // 7. Create payment transaction
      const transaction = await tx.partPaymentTransaction.create({
        data: {
          partOrderId: partOrder.id,
          amount,
          method: dto.paymentMethod,
          status: dto.paymentMethod === "CASH" ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
        },
      });

      return {
        order: partOrder,
        transaction,
      };
    });
  }

  /**
   * Get part order by order number
   */
  async getPartOrderByNumber(orderNumber: string, user?: any) {
    const order = await this.prisma.client.partOrder.findUnique({
      where: { orderNumber },
      include: {
        part: true,
        partInventory: {
          include: {
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
      throw new NotFoundException(`Part order with number ${orderNumber} not found`);
    }

    this.assertPartOrderAccess(order, user);

    return order;
  }

  /**
   * Get part order by ID
   */
  async getPartOrderById(id: string, user?: any) {
    const order = await this.prisma.client.partOrder.findUnique({
      where: { id },
      include: {
        part: true,
        partInventory: {
          include: {
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
      throw new NotFoundException(`Part order with ID ${id} not found`);
    }

    this.assertPartOrderAccess(order, user);

    return order;
  }

  /**
   * Paginated, filtered by status/branchId/date range. Include part, inventory, branch, processedBy
   * For CUSTOMER role: filters by customer phone/CNIC from user profile
   * Supports isCompleted filter: true=DELIVERED/CANCELLED, false=active orders
   */
  async getPartOrders(query: QueryPartOrdersDto, user?: any) {
    console.log('getPartOrders called with query:', query);
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

    if (query.partId) {
      where.partId = query.partId;
    }

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
      ];
    }

    // Filter by customer for CUSTOMER role
    if (user?.role === "CUSTOMER") {
      where.customerPhone = user.phoneNumber;
    }

    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.client.partOrder.findMany({
        where,
        skip,
        take: limit,
        include: {
          part: true,
          partInventory: {
            include: {
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
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.client.partOrder.count({ where }),
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
   * Get part orders for a customer (by phone number)
   */
  async getPartOrdersByCustomerPhone(phone: string) {
    const orders = await this.prisma.client.partOrder.findMany({
      where: { customerPhone: phone },
      include: {
        part: true,
        partInventory: {
          include: {
            branch: true,
          },
        },
        branch: true,
        transactions: true,
        delivery: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  }

  /**
   * Update part order status
   */
  async updatePartOrderStatus(id: string, status: OrderStatus, user: any) {
    const order = await this.prisma.client.partOrder.findUnique({
      where: { id },
      include: {
        partInventory: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Part order with ID ${id} not found`);
    }

    this.assertPartOrderAccess(order, user);

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.READY_FOR_DELIVERY, OrderStatus.CANCELLED],
      [OrderStatus.READY_FOR_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const currentStatus = order.status as OrderStatus;
    if (!validTransitions[currentStatus].includes(status)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${status}`
      );
    }

    return this.prisma.client.$transaction(async (tx) => {
      if (status === OrderStatus.CONFIRMED && currentStatus === OrderStatus.PAID) {
        const reservedQuantity = order.partInventory.reservedQuantity;
        if (order.partInventory.quantity < order.quantity || reservedQuantity < order.quantity) {
          throw new BadRequestException("Insufficient reserved stock to confirm this order");
        }

        await tx.partInventory.update({
          where: { id: order.partInventoryId },
          data: {
            quantity: { decrement: order.quantity },
            reservedQuantity: { decrement: order.quantity },
          },
        });
      }

      if (status === OrderStatus.CANCELLED) {
        await this.restorePartOrderStock(tx, order);
      }

      const updatedOrder = await tx.partOrder.update({
        where: { id },
        data: {
          status,
          processedById: user.id,
        },
        include: {
          part: true,
          partInventory: {
            include: {
              branch: true,
            },
          },
          branch: true,
        },
      });

      // When order is confirmed, deduct the actual inventory quantity
      if (status === OrderStatus.CONFIRMED && currentStatus === OrderStatus.PAID) {
        await tx.partInventory.update({
          where: { id: order.partInventoryId },
          data: {
            quantity: {
              decrement: order.quantity,
            },
            reservedQuantity: {
              decrement: order.quantity,
            },
          },
        });

        // Create stock movement record
        await tx.stockMovement.create({
          data: {
            inventoryId: order.partInventoryId,
            movementType: "STOCK_OUT",
            quantity: -order.quantity,
            reason: `Part order confirmed: ${updatedOrder.orderNumber}`,
            performedById: user.id,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "PART_ORDER",
          entityId: id,
          oldValue: JSON.stringify({ status: currentStatus }),
          newValue: JSON.stringify({ status }),
        },
      });

      return updatedOrder;
    });
  }

  /**
   * Cancel part order and restore stock
   */
  async cancelPartOrder(id: string, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      const order = await tx.partOrder.findUnique({
        where: { id },
        include: {
          transactions: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Part order with ID ${id} not found`);
      }

      this.assertPartOrderAccess(order, user);

      if (order.status === OrderStatus.DELIVERED) {
        throw new BadRequestException(`Cannot cancel a delivered order`);
      }

      if (order.status === OrderStatus.CANCELLED) {
        throw new BadRequestException(`Order is already cancelled`);
      }

      // Update order status
      const updatedOrder = await tx.partOrder.update({
        where: { id },
        data: {
          status: OrderStatus.CANCELLED,
          processedById: user.id,
        },
      });

      await this.restorePartOrderStock(tx, order);

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "PART_ORDER",
          entityId: order.id,
          oldValue: JSON.stringify({ status: order.status }),
          newValue: JSON.stringify({ status: OrderStatus.CANCELLED }),
        },
      });

      return {
        order: updatedOrder,
        message: "Part order cancelled successfully",
      };
    });
  }

  /**
   * Manual part sale registration (admin bypasses offer workflow)
   */
  async createManualPartOrder(dto: CreateManualPartOrderDto, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      const inventoryWhere: any = dto.partInventoryId
        ? { id: dto.partInventoryId, partId: dto.partId }
        : { partId: dto.partId };

      if (this.isAssignedBranchUser(user)) {
        inventoryWhere.branchId = user.branchId;
      }

      // 1. Fetch the exact branch inventory row selected by the sale form.
      const inventory = await tx.partInventory.findFirst({
        where: inventoryWhere,
        include: { branch: true },
      });

      if (!inventory) {
        throw new NotFoundException(`Part inventory not found`);
      }

      // 2. Ensure stock
      const availableQuantity = inventory.quantity - inventory.reservedQuantity;
      if (availableQuantity < dto.quantity) {
        throw new BadRequestException(`Insufficient stock. Available: ${availableQuantity}`);
      }

      // 3. Deduct stock immediately
      await tx.partInventory.update({
        where: { id: inventory.id },
        data: {
          quantity: { decrement: dto.quantity },
        },
      });

      // 4. Generate order number
      const orderNumber = this.generateOrderNumber();

      // 5. Create PartOrder
      const partOrder = await tx.partOrder.create({
        data: {
          orderNumber,
          partId: dto.partId,
          partInventoryId: inventory.id,
          branchId: inventory.branchId,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerAddress: dto.customerAddress,
          quantity: dto.quantity,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          status: OrderStatus.DELIVERED, // Manual sale assumes immediate delivery
          processedById: user.id,
        },
      });

      // 6. Record StockMovement
      await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          movementType: "STOCK_OUT",
          quantity: dto.quantity,
          reason: `Manual sale: ${orderNumber}`,
          performedById: user.id,
        },
      });

      // 7. Create Payment Transaction
      await tx.partPaymentTransaction.create({
        data: {
          partOrderId: partOrder.id,
          amount: dto.amount,
          method: dto.paymentMethod,
          status: dto.paymentMethod === "CASH" ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.CREATE,
          entityType: "PART_ORDER",
          entityId: partOrder.id,
          newValue: JSON.stringify(dto),
        },
      });

      return partOrder;
    });
  }

  /**
   * Generate unique order number
   */
  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PART-${year}${month}${day}-${random}`;
  }

  /**
   * Mark part order as completed for onsite purchases
   * Used when customer buys in person at branch
   */
  async markPartOrderAsCompletedOnsite(orderId: string, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Fetch part order
      const order = await tx.partOrder.findUnique({
        where: { id: orderId },
        include: {
          partInventory: true,
          delivery: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Part order with ID ${orderId} not found`);
      }

      // 2. Verify part order is in PAID or CONFIRMED status
      if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.CONFIRMED) {
        throw new BadRequestException(
          `Part order must be in PAID or CONFIRMED status to be marked as completed onsite. Current status: ${order.status}`
        );
      }

      // 3. Update part order status to DELIVERED
      const updatedOrder = await tx.partOrder.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.DELIVERED,
          processedById: user.id,
        },
      });

      // 4. Update part inventory if order was not already confirmed (stock not yet deducted)
      if (order.status === OrderStatus.PAID) {
        await tx.partInventory.update({
          where: { id: order.partInventoryId },
          data: {
            quantity: {
              decrement: order.quantity,
            },
            reservedQuantity: {
              decrement: order.quantity,
            },
          },
        });

        // Create stock movement record
        await tx.stockMovement.create({
          data: {
            inventoryId: order.partInventoryId,
            movementType: "STOCK_OUT",
            quantity: -order.quantity,
            reason: `Part order completed onsite: ${updatedOrder.orderNumber}`,
            performedById: user.id,
          },
        });
      } else if (order.status === OrderStatus.CONFIRMED) {
        // If already confirmed, just clear reserved quantity
        await tx.partInventory.update({
          where: { id: order.partInventoryId },
          data: {
            reservedQuantity: {
              decrement: order.quantity,
            },
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
          entityType: "PART_ORDER",
          entityId: orderId,
          oldValue: JSON.stringify({ status: order.status }),
          newValue: JSON.stringify({ status: OrderStatus.DELIVERED, completedOnsite: true }),
        },
      });

      return updatedOrder;
    });
  }

  /**
   * Mark part order as picked up by customer (no delivery)
   * Used when customer picks up the parts at the branch themselves
   */
  async markAsPickedByCustomer(orderId: string, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Fetch part order
      const order = await tx.partOrder.findUnique({
        where: { id: orderId },
        include: {
          partInventory: true,
          delivery: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Part order with ID ${orderId} not found`);
      }

      // 2. Verify part order is in CONFIRMED status
      if (order.status !== OrderStatus.CONFIRMED) {
        throw new BadRequestException(
          `Part order must be in CONFIRMED status to be marked as picked by customer. Current status: ${order.status}`
        );
      }

      // 3. Verify no delivery request exists (customer is picking up themselves)
      if (order.delivery) {
        throw new BadRequestException(
          `Cannot mark part order as picked by customer when a delivery request exists`
        );
      }

      // 4. Update part order status to DELIVERED
      const updatedOrder = await tx.partOrder.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.DELIVERED,
          processedById: user.id,
        },
      });

      // 5. Update part inventory (clear reserved quantity and deduct stock)
      await tx.partInventory.update({
        where: { id: order.partInventoryId },
        data: {
          quantity: {
            decrement: order.quantity,
          },
          reservedQuantity: {
            decrement: order.quantity,
          },
        },
      });

      // Create stock movement record
      await tx.stockMovement.create({
        data: {
          inventoryId: order.partInventoryId,
          movementType: "STOCK_OUT",
          quantity: -order.quantity,
          reason: `Part order picked by customer: ${updatedOrder.orderNumber}`,
          performedById: user.id,
        },
      });

      // 6. Create audit log entry
      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "PART_ORDER",
          entityId: orderId,
          oldValue: JSON.stringify({ status: order.status }),
          newValue: JSON.stringify({ status: OrderStatus.DELIVERED, pickedByCustomer: true }),
        },
      });

      return updatedOrder;
    });
  }
}
