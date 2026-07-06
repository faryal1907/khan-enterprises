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

    const dateFilter: any = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) dateFilter.lte = new Date(dateTo);
    const hasDateFilter = Object.keys(dateFilter).length > 0;

    // ── Bike order payments ────────────────────────────────────────────────
    const paymentWhere: any = { orderId: { not: null } };
    if (status) paymentWhere.status = status;
    if (method) paymentWhere.method = method;
    if (branchId) paymentWhere.order = { branchId };
    if (hasDateFilter) paymentWhere.createdAt = dateFilter;

    // ── Part order payments ────────────────────────────────────────────────
    const partPaymentWhere: any = { partOrderId: { not: null } };
    if (status) partPaymentWhere.status = status;
    if (method) partPaymentWhere.method = method;
    if (branchId) partPaymentWhere.partOrder = { branchId };
    if (hasDateFilter) partPaymentWhere.createdAt = dateFilter;

    // ── Payable payments (expense / PO payments — no orderId, but has payable allocation) ──
    const payableTxWhere: any = {
      orderId: null,
      allocations: { some: { payableId: { not: null } } },
    };
    if (status) payableTxWhere.status = status;
    if (method) payableTxWhere.method = method;
    if (hasDateFilter) payableTxWhere.createdAt = dateFilter;
    // branchId filter not applicable for payable payments (they have no branch link)

    // ── Receivable payments (manual ReceivableEntry collections) ──────────
    const receivablePaymentWhere: any = {};
    if (hasDateFilter) receivablePaymentWhere.createdAt = dateFilter;
    if (method) receivablePaymentWhere.method = method;
    // status filter: ReceivablePayments are always "SUCCESS" equivalent; skip if filtering for other statuses
    const includeReceivablePayments = !status || status === "SUCCESS";

    // ── Vendor payments ────────────────────────────────────────────────────
    const vendorPaymentWhere: any = {};
    if (hasDateFilter) vendorPaymentWhere.createdAt = dateFilter;
    // method filter: derive from fromAccount subtype — only apply if method specified
    // branchId filter: not applicable (vendor payments have no branch link)
    // status filter: vendor payments are always successful
    const includeVendorPayments = !status || status === "SUCCESS";

    const [bikeTx, partTx, payableTx, receivablePmts, vendorPmts] = await Promise.all([
      this.prisma.client.paymentTransaction.findMany({
        where: paymentWhere,
        include: { 
          order: { include: { branch: true } },
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
      this.prisma.client.partPaymentTransaction.findMany({
        where: partPaymentWhere,
        include: { 
          partOrder: { include: { branch: true } },
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
      this.prisma.client.paymentTransaction.findMany({
        where: payableTxWhere,
        include: {
          allocations: {
            include: {
              payable: { select: { id: true, ref: true, partyName: true, type: true, description: true } },
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
      }),
      includeReceivablePayments
        ? this.prisma.client.receivablePayment.findMany({
            where: receivablePaymentWhere,
            include: {
              entry: {
                select: {
                  id: true,
                  description: true,
                  party: { select: { id: true, name: true, partyType: true, phone: true } },
                },
              },
              account: { select: { id: true, name: true } },
              recordedBy: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          })
        : Promise.resolve([]),
      includeVendorPayments
        ? this.prisma.client.vendorPayment.findMany({
            where: vendorPaymentWhere,
            include: {
              vendor: { select: { id: true, name: true } },
              fromAccount: { select: { id: true, name: true, subtype: true } },
              recordedBy: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          })
        : Promise.resolve([]),
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
      processedBy: (tx as any).processedBy ? {
        id: (tx as any).processedBy.id,
        fullName: (tx as any).processedBy.fullName,
        email: (tx as any).processedBy.email,
      } : null,
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
      processedBy: (tx as any).processedBy ? {
        id: (tx as any).processedBy.id,
        fullName: (tx as any).processedBy.fullName,
        email: (tx as any).processedBy.email,
      } : null,
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

    const formattedPayableTx = payableTx.map((tx) => {
      const allocation = tx.allocations.find((a: any) => a.payable);
      const payable = allocation?.payable;
      return {
        id: tx.id,
        amount: Number(tx.amount),
        method: tx.method,
        status: tx.status,
        gatewayReference: tx.gatewayReference,
        failureReason: tx.failureReason,
        createdAt: tx.createdAt.toISOString(),
        updatedAt: tx.updatedAt.toISOString(),
        type: "PAYABLE" as const,
        processedBy: (tx as any).processedBy ? {
          id: (tx as any).processedBy.id,
          fullName: (tx as any).processedBy.fullName,
          email: (tx as any).processedBy.email,
        } : null,
        party: payable ? {
          name: payable.partyName,
          ref: payable.ref,
          description: payable.description ?? null,
          payableType: payable.type,
        } : null,
      };
    });

    const formattedReceivablePmts = (receivablePmts as any[]).map((pmt) => ({
      id: pmt.id,
      amount: Number(pmt.amount),
      method: pmt.method,
      status: "SUCCESS" as const,
      gatewayReference: null,
      failureReason: null,
      createdAt: pmt.createdAt.toISOString(),
      updatedAt: pmt.createdAt.toISOString(),
      type: "RECEIVABLE" as const,
      processedBy: pmt.recordedBy ? {
        id: pmt.recordedBy.id,
        fullName: pmt.recordedBy.fullName,
        email: pmt.recordedBy.email,
      } : null,
      party: pmt.entry ? {
        name: pmt.entry.party?.name ?? "—",
        partyType: pmt.entry.party?.partyType ?? null,
        description: pmt.entry.description ?? null,
        phone: pmt.entry.party?.phone ?? null,
      } : null,
    }));

    const formattedVendorPmts = (vendorPmts as any[]).map((pmt) => {
      // Derive a human-readable method from the source account subtype
      const subtype: string = pmt.fromAccount?.subtype ?? "";
      const derivedMethod = subtype === "CASH" ? "CASH" : "ONLINE_TRANSFER";
      return {
        id: pmt.id,
        amount: Number(pmt.amount),
        method: derivedMethod,
        status: "SUCCESS" as const,
        gatewayReference: null,
        failureReason: null,
        createdAt: pmt.createdAt.toISOString(),
        updatedAt: pmt.updatedAt.toISOString(),
        type: "VENDOR_PAYMENT" as const,
        processedBy: pmt.recordedBy ? {
          id: pmt.recordedBy.id,
          fullName: pmt.recordedBy.fullName,
          email: pmt.recordedBy.email,
        } : null,
        party: {
          name: pmt.vendor?.name ?? "—",
          ref: `VND-${pmt.id.substring(0, 8).toUpperCase()}`,
          description: pmt.notes ?? null,
          payableType: null,
          partyType: "VENDOR",
          phone: null,
        },
      };
    });

    // Apply method filter to vendor payments (post-fetch, since no method field on the model)
    const filteredVendorPmts = method
      ? formattedVendorPmts.filter((p) => p.method === method)
      : formattedVendorPmts;

    const allTransactions = [
      ...formattedBikeTx,
      ...formattedPartTx,
      ...formattedPayableTx,
      ...formattedReceivablePmts,
      ...filteredVendorPmts,
    ];
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
