import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PaymentStatus, AuditAction } from "@khan/prisma";

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

    return {
      ...transaction,
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
   * Get transaction statistics
   */
  async getTransactionStats(branchId?: string) {
    const where = branchId ? { order: { branchId } } : {};

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