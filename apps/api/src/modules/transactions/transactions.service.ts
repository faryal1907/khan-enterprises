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
    const whereBike: any = {};
    const wherePart: any = {};

    if (query.status) {
      whereBike.status = query.status;
      wherePart.status = query.status;
    }
    if (query.method) {
      whereBike.method = query.method;
      wherePart.method = query.method;
    }
    if (query.dateFrom || query.dateTo) {
      whereBike.createdAt = {};
      wherePart.createdAt = {};
      if (query.dateFrom) {
        whereBike.createdAt.gte = new Date(query.dateFrom);
        wherePart.createdAt.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        whereBike.createdAt.lte = new Date(query.dateTo);
        wherePart.createdAt.lte = new Date(query.dateTo);
      }
    }
    if (query.branchId) {
      whereBike.order = { branchId: query.branchId };
      wherePart.partOrder = { branchId: query.branchId };
    }

    const [bikeTransactions, partTransactions] = await Promise.all([
      this.prisma.client.paymentTransaction.findMany({
        where: whereBike,
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
              branch: { select: { id: true, name: true, city: true } },
            },
          },
        },
      }),
      this.prisma.client.partPaymentTransaction.findMany({
        where: wherePart,
        select: {
          id: true,
          amount: true,
          method: true,
          status: true,
          gatewayReference: true,
          failureReason: true,
          createdAt: true,
          updatedAt: true,
          partOrder: {
            select: {
              id: true,
              orderNumber: true,
              customerName: true,
              customerPhone: true,
              amount: true,
              status: true,
              branch: { select: { id: true, name: true, city: true } },
            },
          },
        },
      })
    ]);

    const normalizedBike = bikeTransactions.map(t => ({ ...t, type: 'BIKE' }));
    const normalizedPart = partTransactions.map(t => ({
      id: t.id,
      amount: t.amount,
      method: t.method,
      status: t.status,
      gatewayReference: t.gatewayReference,
      failureReason: t.failureReason,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      type: 'PART',
      order: t.partOrder ? {
        id: t.partOrder.id,
        orderNumber: t.partOrder.orderNumber,
        customerName: t.partOrder.customerName,
        customerPhone: t.partOrder.customerPhone,
        negotiatedAmount: t.partOrder.amount,
        status: t.partOrder.status,
        branch: t.partOrder.branch,
      } : null,
    }));

    const all = [...normalizedBike, ...normalizedPart];
    all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return all;
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
      let isPart = false;
      let transaction: any = await tx.paymentTransaction.findUnique({
        where: { id },
        include: { order: true },
      });

      if (!transaction) {
        transaction = await tx.partPaymentTransaction.findUnique({
          where: { id },
          include: { partOrder: true },
        });
        isPart = true;
      }

      if (!transaction) {
        throw new NotFoundException("Transaction not found");
      }

      if (transaction.status !== PaymentStatus.SUCCESS) {
        throw new BadRequestException("Only SUCCESS transactions can be refunded");
      }

      let updatedTransaction;
      if (isPart) {
        updatedTransaction = await tx.partPaymentTransaction.update({
          where: { id },
          data: { status: PaymentStatus.REFUNDED },
        });

        const order = transaction.partOrder;
        if (order && order.status !== "CANCELLED") {
          await tx.partOrder.update({
            where: { id: order.id },
            data: { status: "CANCELLED", processedById: adminId },
          });

          // Stock logic: restore reserved
          await tx.partInventory.update({
            where: { id: order.partInventoryId },
            data: { reservedQuantity: { decrement: order.quantity } },
          });

          if (["CONFIRMED", "READY_FOR_DELIVERY", "DELIVERED"].includes(order.status)) {
            await tx.partInventory.update({
              where: { id: order.partInventoryId },
              data: { quantity: { increment: order.quantity } },
            });
          }
        }
      } else {
        updatedTransaction = await tx.paymentTransaction.update({
          where: { id },
          data: { status: PaymentStatus.REFUNDED },
        });

        const order = transaction.order;
        if (order && order.status !== "CANCELLED") {
          await tx.order.update({
            where: { id: order.id },
            data: { status: "CANCELLED", processedById: adminId },
          });

          await tx.bikeUnit.update({
            where: { id: order.bikeId },
            data: { status: "AVAILABLE", reservedUntil: null, soldAt: null },
          });
        }
      }

      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN",
          action: AuditAction.REFUND,
          entityType: isPart ? "PART_PAYMENT_TRANSACTION" : "PaymentTransaction",
          entityId: id,
          oldValue: JSON.stringify({ status: PaymentStatus.SUCCESS }),
          newValue: JSON.stringify({ status: PaymentStatus.REFUNDED }),
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
            bike: { include: { model: true } },
            branch: true,
          },
        },
      },
    });

    if (transaction && transaction.order) {
      return this.pdfService.generateInvoice(transaction.order);
    }

    const partTransaction = await this.prisma.client.partPaymentTransaction.findUnique({
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

    if (partTransaction && partTransaction.partOrder) {
      return this.pdfService.generateInvoice(partTransaction.partOrder);
    }

    throw new NotFoundException("Transaction or associated order not found");
  }
}
