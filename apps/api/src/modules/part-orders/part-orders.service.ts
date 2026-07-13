import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePartOrderDto } from "./dto/create-part-order.dto";
import { CreateManualPartOrderDto } from "./dto/create-manual-part-order.dto";
import { QueryPartOrdersDto } from "./dto/query-part-orders.dto";
import { RevenueQueryDto, RevenueDuration } from "../orders/dto/revenue-query.dto";
import { OrderAlertsService } from "../order-alerts/order-alerts.service";
import { AlertType } from "../order-alerts/dto/get-alerts.dto";
import { OrderStatus, PaymentStatus, PaymentMethod, BikeStatus, AuditAction, AccountSubtype, JournalStatus, PaymentState } from "@khan/prisma";
@Injectable()
export class PartOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderAlertsService: OrderAlertsService
  ) { }

  private isAssignedBranchUser(user?: any) {
    return user?.role !== "ADMIN" && user?.role !== "CUSTOMER" && Boolean(user?.branchId);
  }

  private applyBranchScope(where: any, user?: any) {
    if (this.isAssignedBranchUser(user)) {
      where.branchId = user.branchId;
    }
  }

  private assertPartOrderAccess(
    order: { branchId: string; customerId?: string | null; customerPhone?: string },
    user?: any,
  ) {
    if (user?.role === "CUSTOMER") {
      // Primary check: customerId is set and matches — grant access immediately.
      if (order.customerId === user.id) {
        // ownership confirmed, skip phone check
      } else if (order.customerId === null && user.phoneNumber && order.customerPhone === user.phoneNumber) {
        // Legacy fallback: row pre-dates the customerId migration, match by phone instead.
      } else {
        throw new NotFoundException("Part order not found");
      }
    }

    if (this.isAssignedBranchUser(user) && order.branchId !== user.branchId) {
      throw new NotFoundException("Part order not found");
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
   * Create a new part order
   * - Online price = sellingPrice * (1 - discount%)
   * - Customer pays at least 50% advance; remainder becomes a receivable.
   */
  async createPartOrder(dto: CreatePartOrderDto, user: any) {
    const result = await this.prisma.client.$transaction(async (tx) => {

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

      // 4. Calculate discounted unit price
      const baseUnitPrice = Number(part.sellingPrice);
      const inventoryDiscount = Number(inventory.onlineDiscountPercent) || 0;
      const globalDiscountSetting = await tx.systemSetting.findFirst({ where: { key: "GLOBAL_PART_DISCOUNT" } });
      const globalDiscount = globalDiscountSetting?.value ? parseFloat(globalDiscountSetting.value) : 0;
      const effectiveDiscount = inventoryDiscount + globalDiscount;
      const unitPrice = baseUnitPrice * (1 - effectiveDiscount / 100);
      const amount = unitPrice * dto.quantity;

      // 5. Determine order type and set expiry
      const isCash = dto.paymentMethod === "CASH";
      const orderType = isCash ? "ONSITE" : "ONLINE";
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (isCash ? 1 : 7));
      const reservationExpiry = isCash ? expiresAt : null;

      // 6. Part orders require full payment — no partial/installment allowed
      if (!isCash && !dto.paymentProofUrl) {
        throw new BadRequestException(`Payment proof is required for online orders`);
      }
      const advanceAmount = isCash ? 0 : amount;
      const balanceDue = isCash ? amount : 0;

      // 7. Create part order
const partOrder = await tx.partOrder.create({
         data: {
           orderNumber,
           partId: dto.partId,
           partInventoryId: dto.partInventoryId,
           branchId: inventory.branchId,
           customerName: dto.customerName,
           customerPhone: dto.customerPhone,
           customerAddress: dto.customerAddress || null,
           quantity: dto.quantity,
           amount,
           paymentMethod: dto.paymentMethod,
           paymentAccountId: dto.paymentMethod !== 'CASH' ? (dto.paymentAccountId || null) : null,
           status: OrderStatus.PENDING_PAYMENT,
           expiresAt,
           reservationExpiry,
           orderType,
           pickupType: isCash ? "ONSITE_PICKUP" : "DELIVERY",
           customerId: user.id,
           paidAmount: isCash ? 0 : amount,
           balanceDue: isCash ? amount : 0,
           isInstallmentPlan: false,
           paymentState: isCash ? PaymentState.DUE : PaymentState.PAID,
         },
        include: {
          part: true,
          partInventory: { include: { branch: true } },
          branch: true,
        },
      });

      // 8. Reserve the stock
      await tx.partInventory.update({
        where: { id: dto.partInventoryId },
        data: { reservedQuantity: { increment: dto.quantity } },
      });

      // 9. Create payment transaction
      const transaction = await tx.partPaymentTransaction.create({
        data: {
          partOrderId: partOrder.id,
          amount: isCash ? amount : advanceAmount,
          method: dto.paymentMethod,
          status: !isCash && dto.paymentProofUrl
            ? PaymentStatus.VERIFICATION_PENDING
            : PaymentStatus.PENDING,
          paymentProofUrl: dto.paymentProofUrl || null,
          processedById: user.id,
          originalAmount: isCash ? amount : advanceAmount,
        },
      });

      // 10. Revenue recognition JV (full amount → AR)
      const arAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AR } });
      const revAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.REVENUE } });

      if (arAcc && revAcc) {
        await tx.journalEntry.create({
          data: {
            entryNo: `JV-SALE-${orderNumber}`,
            description: `Part Sale registered for ${orderNumber}`,
            sourceRef: orderNumber,
            status: JournalStatus.POSTED,
            lines: {
              create: [
                { accountId: arAcc.id, debit: amount, credit: 0 },
                { accountId: revAcc.id, debit: 0, credit: amount },
              ]
            }
          }
        });
      }

      return { order: partOrder, transaction };
    });

    await this.orderAlertsService.createAlertsForPartOrder(
      result.order.id,
      dto.paymentMethod === "CASH" ? AlertType.NEW_ORDER : AlertType.PAYMENT_PENDING
    );

    return result;
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
        transactions: {
          include: {
            processedBy: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
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
   * For CUSTOMER role or customer view: filters by the logged-in user id
   * Supports isCompleted filter: true=DELIVERED/CANCELLED, false=active orders
   */
  async getPartOrders(query: QueryPartOrdersDto, user?: any) {
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

    if (query.partId) {
      where.partId = query.partId;
    }

    if (query.processedById) {
      where.processedById = query.processedById;
    }

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
      ];
    }

    this.applyCustomerScope(where, user, query.isCustomerView);

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
          transactions: {
            include: {
              processedBy: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
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
        transactions: {
          include: {
            processedBy: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
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

    const updatedOrder = await this.prisma.client.$transaction(async (tx) => {
      if (status === OrderStatus.CONFIRMED && currentStatus === OrderStatus.PAID) {
        const reservedQuantity = order.partInventory.reservedQuantity;
        if (order.partInventory.quantity < order.quantity || reservedQuantity < order.quantity) {
          throw new BadRequestException("Insufficient reserved stock to confirm this order");
        }
      }

      if (status === OrderStatus.CANCELLED) {
        await this.restorePartOrderStock(tx, order);
        // Reverse COGS + restore Inventory GL only if stock was actually deducted
        if (this.isStockDeductedStatus(order.status)) {
          await this.reversePartCogs(tx, order.orderNumber, order.partId, order.quantity);
        }
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

      // Update payment transaction status when order is paid or beyond
      if (status === OrderStatus.PAID || status === OrderStatus.CONFIRMED || status === OrderStatus.READY_FOR_DELIVERY || status === OrderStatus.DELIVERED) {
        await tx.partPaymentTransaction.updateMany({
          where: {
            partOrderId: id,
            status: { in: [PaymentStatus.PENDING, PaymentStatus.VERIFICATION_PENDING] }
          },
          data: {
            status: PaymentStatus.SUCCESS,
            verifiedAt: new Date(),
            verifiedById: user.id,
          },
        });
      }

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

        // Post COGS + reduce Inventory GL now that stock is deducted
        await this.postPartCogs(tx, updatedOrder.orderNumber, order.partId, order.quantity);
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "PART_ORDER",
          entityId: id,
          oldValue: { status: currentStatus },
          newValue: { status, orderNumber: order.orderNumber },
        },
      });

      return updatedOrder;
    });

    // AFTER transaction commits, send customer notification
    if (order && order.customerId && currentStatus !== status) {
      let alertType = AlertType.ORDER_STATUS_UPDATED;
      
      if (status === OrderStatus.CANCELLED) {
        alertType = AlertType.ORDER_CANCELLED;
      } else if (status === OrderStatus.DELIVERED) {
        alertType = AlertType.ORDER_DELIVERED;
      }

      await this.orderAlertsService.createCustomerAlertForPartOrder(
        id,
        order.customerId!,
        alertType
      );
    }

    return updatedOrder;
  }

  /**
   * Cancel part order and restore stock
   */
  async cancelPartOrder(id: string, user: any) {
    return this.prisma.client.$transaction(async (tx) => {
      // Fetch order with all non-failed payment transactions and their linked accounts
      const order = await tx.partOrder.findUnique({
        where: { id },
        include: {
          transactions: {
            where: { status: { not: PaymentStatus.FAILED } },
            include: {
              account: { select: { id: true, name: true, subtype: true } },
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException(`Part order with ID ${id} not found`);
      }

      this.assertPartOrderAccess(order, user);

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

      // Mark each non-failed payment transaction as CANCELLED/reversed individually
      for (const txn of order.transactions) {
        await tx.partPaymentTransaction.update({
          where: { id: txn.id },
          data: {
            status: PaymentStatus.CANCELLED,
            isReversed: true,
            reversedAt: new Date(),
            reversedById: user.id,
          },
        });
      }

      await this.restorePartOrderStock(tx, order);

      // 3. Reverse COGS and restore Inventory value (only if stock was actually deducted)
      const stockDeducted = order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.READY_FOR_DELIVERY || order.status === OrderStatus.DELIVERED;
      if (stockDeducted) {
        await this.reversePartCogs(tx, order.orderNumber, order.partId, order.quantity);
      }

      // Reverse Accounting Entries
      const arAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AR } });
      const revAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.REVENUE } });

      // 1. Reverse the original sale entry: DR Revenue, CR A/R
      if (arAcc && revAcc) {
        await tx.journalEntry.create({
          data: {
            entryNo: `JV-REV-${order.orderNumber}`,
            description: `Reversal of part sale for ${order.orderNumber}`,
            sourceRef: order.orderNumber,
            status: JournalStatus.POSTED,
            isReversal: true,
            lines: {
              create: [
                { accountId: revAcc.id, debit: Number(order.amount), credit: 0 },
                { accountId: arAcc.id, debit: 0, credit: Number(order.amount) },
              ]
            }
          }
        });
      }

      // 2. Per-payment reversal: for each collected payment, DR A/R, CR the payment account
      //    Handles multiple partial payments and any mix of payment methods correctly.
      if (arAcc) {
        const successfulTxns = order.transactions.filter(
          (txn) => txn.status === PaymentStatus.SUCCESS || txn.status === PaymentStatus.CANCELLED
        );

        for (const txn of successfulTxns) {
          const txnAmount = Number(txn.amount);
          if (txnAmount <= 0) continue;

          // Resolve payment account: use linked account, fallback by method
          let paymentAccId: string | null = (txn as any).account?.id ?? null;
          if (!paymentAccId) {
            const fallbackSubtype = (txn.method as string) === 'CASH'
              ? AccountSubtype.CASH
              : AccountSubtype.BANK;
            const fallback = await tx.account.findFirst({ where: { subtype: fallbackSubtype } });
            paymentAccId = fallback?.id ?? null;
          }

          if (!paymentAccId) continue;

          await tx.journalEntry.create({
            data: {
              entryNo: `JV-REVPAY-${txn.id.substring(0, 8)}`,
              description: `Reversal of ${txn.method} payment (${txn.id.substring(0, 8)}) for ${order.orderNumber}`,
              sourceRef: txn.id,
              status: JournalStatus.POSTED,
              isReversal: true,
              lines: {
                create: [
                  { accountId: arAcc.id, debit: txnAmount, credit: 0 },
                  { accountId: paymentAccId, debit: 0, credit: txnAmount },
                ]
              }
            }
          });
        }
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "PART_ORDER",
          entityId: order.id,
          oldValue: { status: order.status },
          newValue: { status: OrderStatus.CANCELLED, orderNumber: order.orderNumber },
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
    const result = await this.prisma.client.$transaction(async (tx) => {
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

      // 5. Resolve partial payment
      const totalAmount = dto.amount;
      const initialPayment = dto.initialPaymentAmount !== undefined ? dto.initialPaymentAmount : totalAmount;
      const balance = totalAmount - initialPayment;

      let paymentState: PaymentState = PaymentState.DUE;
      if (initialPayment >= totalAmount) paymentState = PaymentState.PAID;
      else if (initialPayment > 0) paymentState = PaymentState.PARTIAL;

      const isDelivered = paymentState === PaymentState.PAID;

      // 6. Create PartOrder
      const partOrder = await tx.partOrder.create({
        data: {
          orderNumber,
          partId: dto.partId,
          partInventoryId: inventory.id,
          branchId: inventory.branchId,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerAddress: dto.customerAddress || null,
          quantity: dto.quantity,
          amount: totalAmount,
          paymentMethod: dto.paymentMethod,
          status: isDelivered ? OrderStatus.DELIVERED : OrderStatus.CONFIRMED,
          paymentVerified: true,
          processedById: user.id,
          customerId: dto.customerId ?? null,
          paidAmount: initialPayment,
          balanceDue: balance,
          isInstallmentPlan: dto.isInstallmentPlan || false,
          paymentState,
        },
      });

      // 6. Record StockMovement
      await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          movementType: "STOCK_OUT",
          quantity: -dto.quantity,
          reason: `Manual sale: ${orderNumber}`,
          performedById: user.id,
        },
      });

      // 6b. Post COGS + reduce Inventory GL for the deducted stock
      await this.postPartCogs(tx, orderNumber, dto.partId, dto.quantity);

      // 7. Create Payment Transaction (only if something was paid upfront)
      let transaction: any = null;
      if (initialPayment > 0) {
        // Resolve payment account
        let paymentAcc: any = null;
        if (dto.paymentMethod === 'CASH') {
          paymentAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.CASH } });
        } else if (dto.accountId) {
          paymentAcc = await tx.account.findUnique({ where: { id: dto.accountId } });
        }
        if (!paymentAcc) {
          paymentAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.BANK } });
        }

        transaction = await tx.partPaymentTransaction.create({
          data: {
            partOrderId: partOrder.id,
            amount: initialPayment,
            method: dto.paymentMethod,
            status: PaymentStatus.SUCCESS,
            verifiedAt: new Date(),
            verifiedById: user.id,
            accountId: paymentAcc?.id,
            processedById: user.id,
            originalAmount: initialPayment,
          },
        });

        const arAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AR } });
        const revAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.REVENUE } });

        if (arAcc && revAcc) {
          await tx.journalEntry.create({
            data: {
              entryNo: `JV-SALE-${orderNumber}`,
              description: `Part Sale registered for ${orderNumber}`,
              sourceRef: orderNumber,
              status: JournalStatus.POSTED,
              lines: {
                create: [
                  { accountId: arAcc.id, debit: totalAmount, credit: 0 },
                  { accountId: revAcc.id, debit: 0, credit: totalAmount },
                ]
              }
            }
          });
        }

        if (paymentAcc && arAcc) {
          await tx.journalEntry.create({
            data: {
              entryNo: `JV-PAY-${transaction.id.substring(0, 8)}`,
              description: `Payment received for part order ${orderNumber} via ${dto.paymentMethod}`,
              sourceRef: transaction.id,
              status: JournalStatus.POSTED,
              lines: {
                create: [
                  { accountId: paymentAcc.id, debit: initialPayment, credit: 0 },
                  { accountId: arAcc.id, debit: 0, credit: initialPayment },
                ]
              }
            }
          });
        }
      } else {
        // No upfront payment — still record the sale revenue JV
        const arAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AR } });
        const revAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.REVENUE } });
        if (arAcc && revAcc) {
          await tx.journalEntry.create({
            data: {
              entryNo: `JV-SALE-${orderNumber}`,
              description: `Part Sale registered for ${orderNumber} (balance due)`,
              sourceRef: orderNumber,
              status: JournalStatus.POSTED,
              lines: {
                create: [
                  { accountId: arAcc.id, debit: totalAmount, credit: 0 },
                  { accountId: revAcc.id, debit: 0, credit: totalAmount },
                ]
              }
            }
          });
        }
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.CREATE,
          entityType: "PART_ORDER",
          entityId: partOrder.id,
          newValue: { ...dto, orderNumber: partOrder.orderNumber },
        },
      });

      return partOrder;
    });

    await this.orderAlertsService.createAlertsForPartOrder(
      result.id, 
      AlertType.NEW_ORDER
    );

    return result;
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
          oldValue: { status: order.status },
          newValue: { status: OrderStatus.DELIVERED, completedOnsite: true, orderNumber: order.orderNumber },
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

      // 5. Update part order status to DELIVERED
      const updatedOrder = await tx.partOrder.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.DELIVERED,
          processedById: user.id,
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
          oldValue: { status: order.status },
          newValue: { status: OrderStatus.DELIVERED, pickedByCustomer: true, orderNumber: order.orderNumber },
        },
      });

      return updatedOrder;
    });
  }

  /**
   * Upload payment proof for a part order
   */
  async uploadPartOrderPaymentProof(partOrderId: string, paymentProofUrl: string, user: any) {
    const order = await this.prisma.client.partOrder.findUnique({
      where: { id: partOrderId },
    });

    if (!order) {
      throw new NotFoundException(`Part order with ID ${partOrderId} not found`);
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        `Cannot upload payment proof for part order in ${order.status} status`
      );
    }

    // Find the pending transaction
    const transaction = await this.prisma.client.partPaymentTransaction.findFirst({
      where: {
        partOrderId,
        status: PaymentStatus.VERIFICATION_PENDING,
      },
    });

    if (!transaction) {
      throw new BadRequestException(
        "No pending verification transaction found for this part order"
      );
    }

    // Update transaction with payment proof URL
    const updatedTransaction = await this.prisma.client.partPaymentTransaction.update({
      where: { id: transaction.id },
      data: {
        paymentProofUrl,
      },
    });

    await this.prisma.client.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: AuditAction.UPDATE,
        entityType: "PART_PAYMENT_TRANSACTION",
        entityId: transaction.id,
        newValue: { paymentProofUrl, orderNumber: order.orderNumber },
      },
    });

    return updatedTransaction;
  }

  /**
   * Verify payment for a part order (admin only)
   */
  async verifyPartOrderPayment(partOrderId: string, verified: boolean, user: any) {
    // Fetch order first to get customerId for notification
    const order = await this.prisma.client.partOrder.findUnique({
      where: { id: partOrderId },
    });

    if (!order) {
      throw new NotFoundException(`Part order with ID ${partOrderId} not found`);
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        `Part order is not in PENDING_PAYMENT status. Current status: ${order.status}`
      );
    }

    const newStatus = verified ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
    const orderStatus = verified ? OrderStatus.PAID : OrderStatus.PENDING_PAYMENT;

    const result = await this.prisma.client.$transaction(async (tx) => {
      // Find pending transaction first
      const pendingTransaction = await tx.partPaymentTransaction.findFirst({
        where: {
          partOrderId,
          status: PaymentStatus.VERIFICATION_PENDING,
        },
      });

      if (!pendingTransaction) {
        throw new BadRequestException(
          "No pending verification transaction found for this part order"
        );
      }

      // Update transaction status
      const transaction = await tx.partPaymentTransaction.update({
        where: { id: pendingTransaction.id },
        data: {
          status: newStatus,
          verifiedAt: new Date(),
        },
      });

      // If verified, update order status — paidAmount was already set at order creation
      if (verified) {
        await tx.partOrder.update({
          where: { id: partOrderId },
          data: {
            status: OrderStatus.CONFIRMED,
            paymentVerified: true,
            processedById: user.id,
            paymentState: Number(order.balanceDue) <= 0 ? PaymentState.PAID : PaymentState.PARTIAL,
          },
        });

        const arAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AR } });

        // Resolve the payment account: prefer the account the customer selected at order time,
        // fall back to subtype-based lookup for backward compatibility.
        let paymentAcc: any = null;
        if (transaction.method === "CASH") {
          paymentAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.CASH } });
        } else if (order.paymentAccountId) {
          paymentAcc = await tx.account.findUnique({ where: { id: order.paymentAccountId } });
        }
        if (!paymentAcc) {
          paymentAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.BANK } });
        }

        if (paymentAcc && arAcc) {
          // Link the transaction to the resolved account
          await tx.partPaymentTransaction.update({
            where: { id: transaction.id },
            data: { accountId: paymentAcc.id },
          });

          await tx.journalEntry.create({
            data: {
              entryNo: `JV-PAY-${transaction.id.substring(0, 8)}`,
              description: `Payment verified for part order ${order.orderNumber} via ${transaction.method}`,
              sourceRef: transaction.id,
              status: JournalStatus.POSTED,
              lines: {
                create: [
                  { accountId: paymentAcc.id, debit: Number(transaction.amount), credit: 0 },
                  { accountId: arAcc.id, debit: 0, credit: Number(transaction.amount) },
                ]
              }
            }
          });
        }
      } else {
        await tx.partOrder.update({
          where: { id: partOrderId },
          data: {
            paymentVerified: false,
            processedById: user.id,
          },
        });

        // Reverse Sale JV
        const arAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AR } });
        const revAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.REVENUE } });
        
        if (arAcc && revAcc) {
          await tx.journalEntry.create({
            data: {
              entryNo: `JV-REV-${order.orderNumber}`,
              description: `Reversal of part sale for ${order.orderNumber} due to failed payment`,
              sourceRef: order.orderNumber,
              status: JournalStatus.POSTED,
              lines: {
                create: [
                  { accountId: revAcc.id, debit: Number(order.amount), credit: 0 },
                  { accountId: arAcc.id, debit: 0, credit: Number(order.amount) },
                ]
              }
            }
          });
        }
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "PART_PAYMENT_TRANSACTION",
          entityId: transaction.id,
          oldValue: { status: PaymentStatus.VERIFICATION_PENDING },
          newValue: { status: newStatus, verified, orderNumber: order.orderNumber },
        },
      });

      return { transaction, orderStatus };
    });

    // AFTER transaction commits, send customer notification
    if (order.customerId) {
      const alertType = verified 
        ? AlertType.PAYMENT_VERIFIED 
        : AlertType.PAYMENT_FAILED;
      
      await this.orderAlertsService.createCustomerAlertForPartOrder(
        partOrderId,
        order.customerId!,
        alertType
      );
    }

    return result;
  }

/**
    * Record payment for a part order
    */
  async recordPartOrderPayment(partOrderId: string, dto: { amount: number; method: PaymentMethod; referenceNumber?: string; accountId?: string }, user: any) {
    const order = await this.prisma.client.partOrder.findUnique({
      where: { id: partOrderId },
      include: {
        partInventory: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Part order with ID ${partOrderId} not found`);
    }

    this.assertPartOrderAccess(order, user);

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        `Part order is not in PENDING_PAYMENT status. Current status: ${order.status}`
      );
    }

    return this.prisma.client.$transaction(async (tx) => {
      const existingTx = await tx.partPaymentTransaction.findFirst({
        where: { partOrderId, status: { in: [PaymentStatus.PENDING, PaymentStatus.VERIFICATION_PENDING] } }
      });

      const txStatus = dto.method === "CASH" ? PaymentStatus.SUCCESS : PaymentStatus.VERIFICATION_PENDING;

      let transaction;
      if (existingTx) {
        transaction = await tx.partPaymentTransaction.update({
          where: { id: existingTx.id },
          data: {
            amount: dto.amount,
            method: dto.method,
            gatewayReference: dto.referenceNumber || null,
            status: txStatus,
            verifiedAt: txStatus === PaymentStatus.SUCCESS ? new Date() : null,
            verifiedById: txStatus === PaymentStatus.SUCCESS ? user.id : null,
          },
        });
      } else {
        transaction = await tx.partPaymentTransaction.create({
          data: {
            partOrderId,
            amount: dto.amount,
            method: dto.method,
            gatewayReference: dto.referenceNumber || null,
            status: txStatus,
            verifiedAt: txStatus === PaymentStatus.SUCCESS ? new Date() : null,
            verifiedById: txStatus === PaymentStatus.SUCCESS ? user.id : null,
            processedById: user.id,
            originalAmount: dto.amount,
          },
        });
      }

      // For cash payments, update order status to PAID
      if (dto.method === "CASH") {
        await tx.partOrder.update({
          where: { id: partOrderId },
          data: {
            status: OrderStatus.PAID,
            paymentVerified: true,
            processedById: user.id,
            paidAmount: order.amount,
            balanceDue: 0,
            paymentState: PaymentState.PAID
          },
        });
      }

      // Generate Journal Entry for Payment if successful
      if (txStatus === PaymentStatus.SUCCESS) {
        const cashAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.CASH } });
        const arAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AR } });
        
        // For online payments: use selected accountId if provided, otherwise fallback to generic BANK account
        let paymentAcc: any = cashAcc;
        if (dto.method !== "CASH") {
          if (dto.accountId) {
            paymentAcc = await tx.account.findUnique({ where: { id: dto.accountId } });
          } else {
            // Fallback: find any bank account for backward compatibility
            paymentAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.BANK } });
          }
        }

        if (paymentAcc && arAcc) {
          await tx.journalEntry.create({
            data: {
              entryNo: `JV-PAY-${transaction.id.substring(0, 8)}`,
              description: `Payment received for part order ${order.orderNumber} via ${dto.method}`,
              sourceRef: transaction.id,
              status: JournalStatus.POSTED,
              lines: {
                create: [
                  { accountId: paymentAcc.id, debit: dto.amount, credit: 0 },
                  { accountId: arAcc.id, debit: 0, credit: dto.amount },
                ]
              }
            }
          });
          
          // Update transaction with the account
          await tx.partPaymentTransaction.update({
            where: { id: transaction.id },
            data: { accountId: paymentAcc.id }
          });
        }
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.PAYMENT,
          entityType: "PART_ORDER",
          entityId: partOrderId,
          newValue: { ...dto, orderNumber: order.orderNumber },
        },
      });

      return {
        transaction,
        orderStatus: dto.method === "CASH" ? OrderStatus.PAID : OrderStatus.PENDING_PAYMENT,
      };
    });
  }

  /**
   * Get revenue summary with filters for part orders
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

    // Get part orders with transactions
    const partOrders = await this.prisma.client.partOrder.findMany({
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
    const totalRevenue = partOrders.reduce((sum, order) => {
      const orderRevenue = order.transactions.reduce((txSum, tx) => txSum + Number(tx.amount), 0);
      return sum + orderRevenue;
    }, 0);

    const totalOrders = partOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group by branch
    const revenueByBranch = partOrders.reduce((acc, order) => {
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

  /**
   * Helper method to restore part stock depending on the status of the cancelled order
   */
  private async restorePartOrderStock(tx: any, order: any) {
    if (order.status === OrderStatus.PENDING_PAYMENT || order.status === OrderStatus.PAID) {
      // Stock was only reserved, not fully deducted
      await tx.partInventory.update({
        where: { id: order.partInventoryId },
        data: {
          reservedQuantity: { decrement: order.quantity },
        },
      });
    } else if (order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.READY_FOR_DELIVERY || order.status === OrderStatus.DELIVERED) {
      // Stock was fully deducted and reservation was cleared.
      // Increment quantity back.
      await tx.partInventory.update({
        where: { id: order.partInventoryId },
        data: {
          quantity: { increment: order.quantity },
        },
      });

      // Create stock movement record for restoration
      await tx.stockMovement.create({
        data: {
          inventoryId: order.partInventoryId,
          movementType: "STOCK_IN",
          quantity: order.quantity,
          reason: `Part order cancelled: ${order.orderNumber}`,
          performedById: order.processedById,
        },
      });
    }
  }

  /**
   * Returns true if the order had its physical stock actually deducted
   * (i.e. COGS + Inventory GL entries were posted at sale time).
   */
  private isStockDeductedStatus(status: OrderStatus): boolean {
    return (
      status === OrderStatus.CONFIRMED ||
      status === OrderStatus.READY_FOR_DELIVERY ||
      status === OrderStatus.DELIVERED
    );
  }

  /**
   * Post COGS + Inventory reduction for a part sale (mirrors bike sales).
   * DR COGS (5001), CR Inventory (1003) by cost = purchaseCost * quantity.
   */
  private async postPartCogs(tx: any, sourceRef: string, partId: string, quantity: number) {
    const part = await tx.part.findUnique({ where: { id: partId } });
    const cost = Number(part?.purchaseCost || 0) * quantity;
    if (cost <= 0) return;

    const cogsAcc = await tx.account.findUnique({ where: { code: '5001' } });
    const inventoryAcc = await tx.account.findUnique({ where: { code: '1003' } });
    if (!cogsAcc || !inventoryAcc) return;

    await tx.journalEntry.create({
      data: {
        entryNo: `JV-COGS-${sourceRef}`,
        description: `Cost of Goods Sold for part sale ${sourceRef}`,
        sourceRef,
        status: JournalStatus.POSTED,
        lines: {
          create: [
            { accountId: cogsAcc.id, debit: cost, credit: 0 },
            { accountId: inventoryAcc.id, debit: 0, credit: cost },
          ],
        },
      },
    });
  }

  /**
   * Reverse the COGS + Inventory entry posted at sale time.
   * DR Inventory (1003), CR COGS (5001) by cost = purchaseCost * quantity.
   */
  private async reversePartCogs(tx: any, sourceRef: string, partId: string, quantity: number) {
    const part = await tx.part.findUnique({ where: { id: partId } });
    const cost = Number(part?.purchaseCost || 0) * quantity;
    if (cost <= 0) return;

    const cogsAcc = await tx.account.findUnique({ where: { code: '5001' } });
    const inventoryAcc = await tx.account.findUnique({ where: { code: '1003' } });
    if (!cogsAcc || !inventoryAcc) return;

    await tx.journalEntry.create({
      data: {
        entryNo: `JV-REVCOGS-${sourceRef}`,
        description: `Reversal of COGS for part sale ${sourceRef}`,
        sourceRef,
        status: JournalStatus.POSTED,
        isReversal: true,
        lines: {
          create: [
            { accountId: inventoryAcc.id, debit: cost, credit: 0 },
            { accountId: cogsAcc.id, debit: 0, credit: cost },
          ],
        },
      },
    });
  }
}
