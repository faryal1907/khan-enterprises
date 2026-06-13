import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePartOrderDto } from "./dto/create-part-order.dto";
import { CreateManualPartOrderDto } from "./dto/create-manual-part-order.dto";
import { OrderStatus, PaymentStatus, BikeStatus } from "@khan/prisma";

@Injectable()
export class PartOrdersService {
  constructor(private readonly prisma: PrismaService) {}

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

      // 5. Create part order
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

      // 8. If CASH payment, immediately confirm order and reduce stock
      if (dto.paymentMethod === "CASH") {
        await tx.partOrder.update({
          where: { id: partOrder.id },
          data: {
            status: OrderStatus.CONFIRMED,
          },
        });

        await tx.partInventory.update({
          where: { id: dto.partInventoryId },
          data: {
            quantity: {
              decrement: dto.quantity,
            },
            reservedQuantity: {
              decrement: dto.quantity,
            },
          },
        });
      }

      return {
        order: partOrder,
        transaction,
      };
    });
  }

  /**
   * Get part order by order number
   */
  async getPartOrderByNumber(orderNumber: string) {
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

    return order;
  }

  /**
   * Get part order by ID
   */
  async getPartOrderById(id: string) {
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

    return order;
  }

  /**
   * Paginated, filtered by status/branchId/date range. Include part, inventory, branch, processedBy
   * For CUSTOMER role: filters by customer phone/CNIC from user profile
   */
  async getPartOrders(query: any, user?: any) {
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
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  }

  /**
   * Update part order status
   */
  async updatePartOrderStatus(id: string, status: OrderStatus, adminId: string) {
    const order = await this.prisma.client.partOrder.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Part order with ID ${id} not found`);
    }

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

    return this.prisma.client.partOrder.update({
      where: { id },
      data: {
        status,
        processedById: adminId,
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
  }

  /**
   * Cancel part order and restore stock
   */
  async cancelPartOrder(id: string, adminId: string) {
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
          processedById: adminId,
        },
      });

      // Restore reserved stock
      await tx.partInventory.update({
        where: { id: order.partInventoryId },
        data: {
          reservedQuantity: {
            decrement: order.quantity,
          },
        },
      });

      // If order was confirmed or ready for delivery (stock was already deducted), restore it
      if (order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.READY_FOR_DELIVERY) {
        await tx.partInventory.update({
          where: { id: order.partInventoryId },
          data: {
            quantity: {
              increment: order.quantity,
            },
          },
        });
      }

      return {
        order: updatedOrder,
        message: "Part order cancelled successfully",
      };
    });
  }

  /**
   * Manual part sale registration (admin bypasses offer workflow)
   */
  async createManualPartOrder(dto: CreateManualPartOrderDto, adminId: string) {
    return this.prisma.client.$transaction(async (tx) => {
      // 1. Fetch branch inventory
      const inventory = await tx.partInventory.findFirst({
        where: { partId: dto.partId }, // In a real app we'd scope this to the admin's branch
        include: { branch: true },
      });

      if (!inventory) {
        throw new NotFoundException(`Part inventory not found`);
      }

      // 2. Ensure stock
      if (inventory.quantity < dto.quantity) {
        throw new BadRequestException(`Insufficient stock. Available: ${inventory.quantity}`);
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
          processedById: adminId,
        },
      });

      // 6. Record StockMovement
      await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          movementType: "STOCK_OUT",
          quantity: dto.quantity,
          reason: `Manual sale: ${orderNumber}`,
          performedById: adminId,
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
}
