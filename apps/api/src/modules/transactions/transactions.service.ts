import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PaymentStatus, AuditAction } from "@khan/prisma";
import { QueryTransactionsDto } from "./dto/query-transactions.dto";

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get transaction by ID with order/part order details
   */
  async getTransactionById(id: string) {
    let transaction: any = await this.prisma.client.paymentTransaction.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            bike: {
              include: {
                model: true,
              },
            },
            branch: true,
          },
        },
      },
    });

    if (!transaction) {
      transaction = await this.prisma.client.partPaymentTransaction.findUnique({
        where: { id },
        include: {
          partOrder: {
            include: {
              part: true,
              branch: true,
            },
          },
        },
      });
    }

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    // Build timeline
    const timeline: Array<{ event: string; timestamp: Date }> = [
      {
        event: "Payment Initiated",
        timestamp: transaction.createdAt,
      },
    ];

    if (transaction.status === "SUCCESS") {
      timeline.push({
        event: "Payment Verified",
        timestamp: transaction.updatedAt,
      });
    } else if (transaction.status === "FAILED") {
      timeline.push({
        event: "Payment Failed",
        timestamp: transaction.updatedAt,
      });
    }

    const isPart = 'partOrder' in transaction;
    const orderData = isPart ? transaction.partOrder : transaction.order;

    return {
      id: transaction.id,
      amount: transaction.amount,
      method: transaction.method,
      status: transaction.status,
      gatewayReference: transaction.gatewayReference,
      failureReason: transaction.failureReason,
      gatewayResponse: transaction.gatewayResponse,
      webhookReceivedAt: transaction.webhookReceivedAt,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      type: isPart ? "PART" : "BIKE",
      order: {
        id: orderData.id,
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerAddress: orderData.customerAddress,
        negotiatedAmount: isPart ? orderData.amount : (orderData as any).bike?.actualSalePrice || 0,
        paymentMethod: orderData.paymentMethod,
        status: orderData.status,
        branch: orderData.branch,
      },
      timeline,
    };
  }

  /**
   * Get all transactions for an order
   */
  async getTransactionsByOrder(orderId: string) {
    const [bikeTransactions, partTransactions] = await Promise.all([
      this.prisma.client.paymentTransaction.findMany({
        where: { orderId },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.client.partPaymentTransaction.findMany({
        where: { partOrderId: orderId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return [...bikeTransactions, ...partTransactions];
  }

  /**
   * Get all transactions with filters
   */
  async getTransactions(query: QueryTransactionsDto) {
    const { status, method, branchId, dateFrom, dateTo } = query;

    const paymentWhere: any = { orderId: { not: null } };
    const partPaymentWhere: any = { partOrderId: { not: null } };

    if (status) {
      paymentWhere.status = status;
      partPaymentWhere.status = status;
    }

    if (method) {
      paymentWhere.method = method;
      partPaymentWhere.method = method;
    }

    if (branchId) {
      paymentWhere.order = { branchId };
      partPaymentWhere.partOrder = { branchId };
    }

    if (dateFrom || dateTo) {
      const dateFilter: any = {};
      if (dateFrom) {
        dateFilter.gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.lte = new Date(dateTo);
      }
      paymentWhere.createdAt = dateFilter;
      partPaymentWhere.createdAt = dateFilter;
    }

    const [bikeTx, partTx] = await Promise.all([
      this.prisma.client.paymentTransaction.findMany({
        where: paymentWhere,
        include: {
          order: {
            include: {
              branch: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.client.partPaymentTransaction.findMany({
        where: partPaymentWhere,
        include: {
          partOrder: {
            include: {
              branch: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const formattedBikeTx = bikeTx.map((tx) => ({
      id: tx.id,
      amount: Number(tx.amount),
      method: tx.method,
      status: tx.status,
      gatewayReference: tx.gatewayReference,
      failureReason: tx.failureReason,
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
      type: "BIKE" as const,
      order: tx.order ? {
        id: tx.order.id,
        orderNumber: tx.order.orderNumber,
        customerName: tx.order.customerName,
        customerPhone: tx.order.customerPhone,
        branch: tx.order.branch ? {
          id: tx.order.branch.id,
          name: tx.order.branch.name,
          city: tx.order.branch.city,
        } : null,
      } : null,
    }));

    const formattedPartTx = partTx.map((tx) => ({
      id: tx.id,
      amount: Number(tx.amount),
      method: tx.method,
      status: tx.status,
      gatewayReference: tx.gatewayReference,
      failureReason: tx.failureReason,
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
      type: "PART" as const,
      order: tx.partOrder ? {
        id: tx.partOrder.id,
        orderNumber: tx.partOrder.orderNumber,
        customerName: tx.partOrder.customerName,
        customerPhone: tx.partOrder.customerPhone,
        branch: tx.partOrder.branch ? {
          id: tx.partOrder.branch.id,
          name: tx.partOrder.branch.name,
          city: tx.partOrder.branch.city,
        } : null,
      } : null,
    }));

    const allTransactions = [...formattedBikeTx, ...formattedPartTx];
    allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      count: allTransactions.length,
      transactions: allTransactions,
    };
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(branchId?: string) {
    const where: any = branchId ? { order: { branchId }, orderId: { not: null } } : { orderId: { not: null } };

    const [
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      pendingTransactions,
      verificationPendingTransactions,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.client.paymentTransaction.count({ where }),
      this.prisma.client.paymentTransaction.count({
        where: { ...where, status: PaymentStatus.SUCCESS },
      }),
      this.prisma.client.paymentTransaction.count({
        where: { ...where, status: PaymentStatus.FAILED },
      }),
      this.prisma.client.paymentTransaction.count({
        where: { ...where, status: PaymentStatus.PENDING },
      }),
      this.prisma.client.paymentTransaction.count({
        where: { ...where, status: PaymentStatus.VERIFICATION_PENDING },
      }),
      this.prisma.client.paymentTransaction.aggregate({
        where: { ...where, status: PaymentStatus.SUCCESS },
        _sum: { amount: true },
      }),
    ]);

    return {
      total: totalTransactions,
      successful: successfulTransactions,
      failed: failedTransactions,
      pending: pendingTransactions,
      verificationPending: verificationPendingTransactions,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  }
}
