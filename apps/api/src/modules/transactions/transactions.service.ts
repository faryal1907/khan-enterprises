import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Return all payment transactions with order and branch details. */
  async getAllTransactions() {
    return this.prisma.client.paymentTransaction.findMany({
      select: {
        id: true,
        amount: true,
        method: true,
        status: true,
        gatewayReference: true,
        failureReason: true,
        createdAt: true,
        updatedAt: true,
        order: {
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            negotiatedAmount: true,
            status: true,
            branch: {
              select: { id: true, name: true, city: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Return a single transaction by ID with full details. */
  async getTransactionById(id: string) {
    const transaction = await this.prisma.client.paymentTransaction.findUnique({
      where: { id },
      select: {
        id: true,
        amount: true,
        method: true,
        status: true,
        gatewayReference: true,
        failureReason: true,
        gatewayResponse: true,
        webhookReceivedAt: true,
        createdAt: true,
        updatedAt: true,
        order: {
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            customerAddress: true,
            negotiatedAmount: true,
            paymentMethod: true,
            status: true,
            branch: {
              select: { id: true, name: true, city: true },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    // Build timeline from available data
    const timeline = [
      { event: "Payment Initiated", timestamp: transaction.createdAt },
    ];

    if (transaction.webhookReceivedAt) {
      timeline.push({
        event: "Webhook Received",
        timestamp: transaction.webhookReceivedAt,
      });
    }

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
    } else if (transaction.status === "REFUNDED") {
      timeline.push({
        event: "Refund Processed",
        timestamp: transaction.updatedAt,
      });
    }

    return {
      ...transaction,
      timeline,
    };
  }
}
