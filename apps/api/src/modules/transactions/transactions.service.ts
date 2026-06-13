import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { QueryTransactionsDto } from "./dto/query-transactions.dto";
import { PaymentStatus, AuditAction } from "@khan/prisma";
import { PdfService } from "../pdf/pdf.service";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService
  ) {}

  /** Return all payment transactions with order and branch details. */
  async getAllTransactions(query: QueryTransactionsDto) {
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }
    if (query.method) {
      where.method = query.method;
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
    if (query.branchId) {
      where.order = {
        branchId: query.branchId,
      };
    }

    return this.prisma.client.paymentTransaction.findMany({
      where,
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

  /** Refund a transaction and log the action */
  async refundTransaction(id: string, adminId: string) {
    return this.prisma.client.$transaction(async (tx) => {
      const transaction = await tx.paymentTransaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        throw new NotFoundException("Transaction not found");
      }

      if (transaction.status !== PaymentStatus.SUCCESS) {
        throw new BadRequestException("Only SUCCESS transactions can be refunded");
      }

      const updatedTransaction = await tx.paymentTransaction.update({
        where: { id },
        data: {
          status: PaymentStatus.REFUNDED,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN",
          action: AuditAction.REFUND,
          entityType: "PaymentTransaction",
          entityId: id,
          oldValue: { status: PaymentStatus.SUCCESS },
          newValue: { status: PaymentStatus.REFUNDED },
        },
      });

      return updatedTransaction;
    });
  }

  /** Get a receipt (invoice) stream for a transaction */
  async getReceiptStream(id: string) {
    const transaction = await this.prisma.client.paymentTransaction.findUnique({
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

    if (!transaction || !transaction.order) {
      throw new NotFoundException("Transaction or associated order not found");
    }

    return this.pdfService.generateInvoice(transaction.order);
  }
}
