import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AccountSubtype, JournalStatus, PaymentState } from "@khan/prisma";

@Injectable()
export class ReceivablesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Aggregate outstanding balances per customer across both bike orders AND part orders.
   * Shows all payment-verified orders (including fully paid), so admin can see the full picture.
   */
  async getReceivables() {
    // ── 1. Fetch bike orders — all that have been payment-verified ─────────
    const orders = await this.prisma.client.order.findMany({
      where: {
        paymentVerified: true,
        status: { notIn: ["CANCELLED"] as any },
      },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        customerCNIC: true,
        customerId: true,
        totalAmount: true,
        paidAmount: true,
        balanceDue: true,
        paymentState: true,
        status: true,
        createdAt: true,
        isInstallmentPlan: true,
        bike: {
          select: {
            model: { select: { brand: true, modelName: true, year: true } },
          },
        },
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // ── 2. Fetch part orders — all that have been payment-verified ─────────
    const partOrders = await this.prisma.client.partOrder.findMany({
      where: {
        paymentVerified: true,
        status: { notIn: ["CANCELLED"] as any },
      },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        customerId: true,
        amount: true,
        paidAmount: true,
        balanceDue: true,
        paymentState: true,
        status: true,
        createdAt: true,
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // ── 3. Group by customer (customerPhone as key) ────────────────────────
    const customerMap = new Map<
      string,
      {
        customerId: string | null;
        customerName: string;
        customerPhone: string;
        totalOutstanding: number;
        totalBilled: number;
        totalPaid: number;
        orderCount: number;
        latestOrderDate: Date;
        status: "DUE" | "PARTIAL" | "OVERDUE" | "PAID";
      }
    >();

    // Helper to merge an order/partOrder into the map
    const mergeItem = (item: {
      customerPhone: string;
      customerName: string;
      customerId: string | null;
      billed: number;
      paid: number;
      outstanding: number;
      createdAt: Date;
      paymentState: string;
    }) => {
      const key = item.customerPhone;
      const existing = customerMap.get(key);

      const itemStatus =
        item.paymentState === PaymentState.OVERDUE
          ? "OVERDUE"
          : item.paymentState === PaymentState.PARTIAL
          ? "PARTIAL"
          : item.paymentState === PaymentState.PAID
          ? "PAID"
          : "DUE";

      if (existing) {
        existing.totalOutstanding += item.outstanding;
        existing.totalBilled += item.billed;
        existing.totalPaid += item.paid;
        existing.orderCount += 1;
        if (item.createdAt > existing.latestOrderDate) {
          existing.latestOrderDate = item.createdAt;
        }
        // Priority: OVERDUE > PARTIAL > DUE > PAID
        if (itemStatus === "OVERDUE") {
          existing.status = "OVERDUE";
        } else if (existing.status !== "OVERDUE" && itemStatus === "PARTIAL") {
          existing.status = "PARTIAL";
        } else if (existing.status !== "OVERDUE" && existing.status !== "PARTIAL" && itemStatus === "DUE") {
          existing.status = "DUE";
        }
      } else {
        customerMap.set(key, {
          customerId: item.customerId,
          customerName: item.customerName,
          customerPhone: item.customerPhone,
          totalOutstanding: item.outstanding,
          totalBilled: item.billed,
          totalPaid: item.paid,
          orderCount: 1,
          latestOrderDate: item.createdAt,
          status: itemStatus,
        });
      }
    };

    // Merge bike orders
    for (const order of orders) {
      mergeItem({
        customerPhone: order.customerPhone,
        customerName: order.customerName,
        customerId: order.customerId,
        billed: Number(order.totalAmount),
        paid: Number(order.paidAmount),
        outstanding: Number(order.balanceDue),
        createdAt: order.createdAt,
        paymentState: order.paymentState,
      });
    }

    // Merge part orders
    for (const po of partOrders) {
      mergeItem({
        customerPhone: po.customerPhone,
        customerName: po.customerName,
        customerId: po.customerId,
        billed: Number(po.amount),
        paid: Number(po.paidAmount),
        outstanding: Number(po.balanceDue),
        createdAt: po.createdAt,
        paymentState: po.paymentState,
      });
    }

    // Compute lastPaymentDate per customer from both payment transaction tables
    const customerPhones = Array.from(customerMap.keys());

    const bikeLastPayments = customerPhones.length > 0
      ? await this.prisma.client.paymentTransaction.findMany({
          where: {
            order: {
              customerPhone: { in: customerPhones },
              status: { notIn: ["CANCELLED"] as any },
            },
            status: "SUCCESS",
            verifiedAt: { not: null },
          },
          select: {
            verifiedAt: true,
            order: { select: { customerPhone: true } },
          },
          orderBy: { verifiedAt: "desc" },
        })
      : [];

    const partLastPayments = customerPhones.length > 0
      ? await this.prisma.client.partPaymentTransaction.findMany({
          where: {
            partOrder: {
              customerPhone: { in: customerPhones },
              status: { notIn: ["CANCELLED"] as any },
            },
            status: "SUCCESS",
            verifiedAt: { not: null },
          },
          select: {
            verifiedAt: true,
            partOrder: { select: { customerPhone: true } },
          },
          orderBy: { verifiedAt: "desc" },
        })
      : [];

    const customerLastPayment = new Map<string, Date>();
    for (const tx of bikeLastPayments) {
      const phone = tx.order!.customerPhone;
      if (!customerLastPayment.has(phone)) customerLastPayment.set(phone, tx.verifiedAt!);
    }
    for (const tx of partLastPayments) {
      const phone = tx.partOrder!.customerPhone;
      if (!customerLastPayment.has(phone)) customerLastPayment.set(phone, tx.verifiedAt!);
    }

    return Array.from(customerMap.entries()).map(([phone, data]) => ({
      customerPhone: phone,
      customerId: data.customerId,
      customerName: data.customerName,
      totalOutstanding: data.totalOutstanding,
      totalBilled: data.totalBilled,
      totalPaid: data.totalPaid,
      orderCount: data.orderCount,
      latestOrderDate: data.latestOrderDate,
      lastPaymentDate: customerLastPayment.get(phone) || null,
      // If all balances net to zero or less, always show as PAID regardless of stored paymentState
      status: data.totalOutstanding <= 0 ? "PAID" : data.status,
    }));
  }

  /**
   * Get customer ledger — all orders AND part orders for a customer phone number with drill-down.
   */
  async getCustomerLedger(customerPhone: string) {
    const orders = await this.prisma.client.order.findMany({
      where: {
        customerPhone,
        status: { notIn: ["CANCELLED"] as any },
      },
      include: {
        bike: {
          include: {
            model: { select: { brand: true, modelName: true, year: true } },
          },
        },
        branch: { select: { name: true } },
        transactions: {
          where: { status: "SUCCESS" },
          select: { id: true, amount: true, method: true, createdAt: true, verifiedAt: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const partOrders = await this.prisma.client.partOrder.findMany({
      where: {
        customerPhone,
        status: { notIn: ["CANCELLED"] as any },
      },
      include: {
        part: { select: { name: true } },
        branch: { select: { name: true } },
        transactions: {
          where: { status: "SUCCESS" },
          select: { id: true, amount: true, method: true, createdAt: true, verifiedAt: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    if (orders.length === 0 && partOrders.length === 0) {
      return {
        customerName: null,
        customerPhone,
        entries: [],
        summary: { totalBilled: 0, totalPaid: 0, totalOutstanding: 0 },
      };
    }

    // Build a running ledger across all orders (first bike orders, then part orders)
    let runningBalance = 0;
    const entries: any[] = [];

    for (const order of orders) {
      const invoiceAmount = Number(order.totalAmount);
      runningBalance += invoiceAmount;
      entries.push({
        date: order.createdAt,
        type: "INVOICE",
        ref: order.orderNumber,
        description: `Bike Sale - ${order.bike.model.brand} ${order.bike.model.modelName} (${order.bike.model.year})`,
        debit: invoiceAmount,
        credit: 0,
        balance: runningBalance,
        orderId: order.id,
        orderStatus: order.status,
        paymentState: order.paymentState,
        branch: order.branch.name,
      });

      for (const txn of order.transactions) {
        const paymentAmount = Number(txn.amount);
        runningBalance -= paymentAmount;
        entries.push({
          date: txn.verifiedAt ?? txn.createdAt,
          type: "PAYMENT",
          ref: `PAY-${txn.id.substring(0, 8)}`,
          description: `Payment received via ${txn.method}`,
          debit: 0,
          credit: paymentAmount,
          balance: runningBalance,
          orderId: order.id,
        });
      }
    }

    for (const po of partOrders) {
      const invoiceAmount = Number(po.amount);
      runningBalance += invoiceAmount;
      entries.push({
        date: po.createdAt,
        type: "INVOICE",
        ref: po.orderNumber,
        description: `Part Sale - ${po.part.name}`,
        debit: invoiceAmount,
        credit: 0,
        balance: runningBalance,
        orderId: po.id,
        orderStatus: po.status,
        paymentState: po.paymentState,
        branch: po.branch.name,
      });

      for (const txn of po.transactions) {
        const paymentAmount = Number(txn.amount);
        runningBalance -= paymentAmount;
        entries.push({
          date: txn.verifiedAt ?? txn.createdAt,
          type: "PAYMENT",
          ref: `PAY-${txn.id.substring(0, 8)}`,
          description: `Payment received via ${txn.method}`,
          debit: 0,
          credit: paymentAmount,
          balance: runningBalance,
          orderId: po.id,
        });
      }
    }

    const totalBilledOrders = orders.reduce((s, o) => s + Number(o.totalAmount), 0);
    const totalPaidOrders = orders.reduce((s, o) => s + Number(o.paidAmount), 0);
    const totalBilledParts = partOrders.reduce((s, p) => s + Number(p.amount), 0);
    const totalPaidParts = partOrders.reduce((s, p) => s + Number(p.paidAmount), 0);

    return {
      customerName: orders[0]?.customerName || partOrders[0]?.customerName || null,
      customerPhone,
      entries,
      summary: {
        totalBilled: totalBilledOrders + totalBilledParts,
        totalPaid: totalPaidOrders + totalPaidParts,
        totalOutstanding: (totalBilledOrders + totalBilledParts) - (totalPaidOrders + totalPaidParts),
      },
    };
  }

  /**
   * Get available payment accounts (Bank, E-Wallet, Cash) for payment method selection.
   */
  async getPaymentAccounts() {
    const accounts = await this.prisma.client.account.findMany({
      where: {
        subtype: { in: [AccountSubtype.BANK, AccountSubtype.EWALLET, AccountSubtype.CASH] },
        isActive: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        subtype: true,
        accountNumber: true,
      },
      orderBy: [{ subtype: "asc" }, { name: "asc" }],
    });
    return accounts;
  }

/**
    * Collect payment from a customer — allocate across outstanding orders (oldest-first).
    * Supports advance payments (credit held if amount > total outstanding).
    */
  async collectPayment(
    customerPhone: string,
    amount: number,
    paymentMethod: string,
    userId: string,
    notes?: string,
    accountId?: string,
  ) {
    if (amount <= 0) throw new BadRequestException("Amount must be greater than 0");

    return this.prisma.client.$transaction(async (tx) => {
      // Fetch all outstanding bike orders for this customer, oldest first
      const outstandingOrders = await tx.order.findMany({
        where: {
          customerPhone,
          paymentState: { in: [PaymentState.DUE, PaymentState.PARTIAL, PaymentState.OVERDUE] },
          status: { notIn: ["CANCELLED"] as any },
        },
        orderBy: { createdAt: "asc" },
      });

      // Fetch all outstanding part orders for this customer, oldest first
      const outstandingPartOrders = await tx.partOrder.findMany({
        where: {
          customerPhone,
          paymentState: { in: [PaymentState.DUE, PaymentState.PARTIAL, PaymentState.OVERDUE] },
          status: { notIn: ["CANCELLED"] as any },
        },
        orderBy: { createdAt: "asc" },
      });

      // Get accounting accounts
      const arAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AR } });
      
      // For online payments: use selected accountId if provided, otherwise fallback to generic account
      let paymentAcc: any = null;
      if (paymentMethod === "ONLINE_TRANSFER") {
        if (accountId) {
          paymentAcc = await tx.account.findUnique({ where: { id: accountId } });
        } else {
          // Fallback for backward compatibility
          paymentAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.BANK } });
        }
      } else {
        paymentAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.CASH } });
      }

      if (!paymentAcc || !arAcc) {
        throw new BadRequestException("Required accounting accounts not found");
      }

      let remaining = amount;
      const allocations: { orderId: string; allocated: number; isPartOrder: boolean }[] = [];

      // Allocate across bike orders
      for (const order of outstandingOrders) {
        if (remaining <= 0) break;
        const due = Number(order.balanceDue);
        const allocated = Math.min(remaining, due);
        remaining -= allocated;
        allocations.push({ orderId: order.id, allocated, isPartOrder: false });
      }

      // Allocate across part orders
      for (const po of outstandingPartOrders) {
        if (remaining <= 0) break;
        const due = Number(po.balanceDue);
        const allocated = Math.min(remaining, due);
        remaining -= allocated;
        allocations.push({ orderId: po.id, allocated, isPartOrder: true });
      }

      const totalAllocated = amount - remaining;
      const isAdvance = remaining > 0;
      const transactionIds: string[] = [];

      for (const alloc of allocations) {
        if (alloc.isPartOrder) {
          const po = outstandingPartOrders.find((o) => o.id === alloc.orderId)!;
          const txRecord = await tx.partPaymentTransaction.create({
            data: {
              partOrderId: alloc.orderId,
              amount: alloc.allocated,
              method: paymentMethod as any,
              status: "SUCCESS",
              verifiedAt: new Date(),
              verifiedById: userId,
              accountId: paymentAcc.id,
            },
          });
          transactionIds.push(txRecord.id);

          const newPaid = Number(po.paidAmount) + alloc.allocated;
          const newBalance = Number(po.amount) - newPaid;
          const newState = newPaid >= Number(po.amount) ? PaymentState.PAID : PaymentState.PARTIAL;

          await tx.partOrder.update({
            where: { id: alloc.orderId },
            data: {
              paidAmount: newPaid,
              balanceDue: newBalance,
              paymentState: newState,
            },
          });

          await tx.journalEntry.create({
            data: {
              entryNo: `JV-RCVBL-${txRecord.id.substring(0, 8)}`,
              description: `Payment collected from ${po.customerName} for ${po.orderNumber}${notes ? ` — ${notes}` : ""}`,
              sourceRef: txRecord.id,
              status: JournalStatus.POSTED,
              lines: {
                create: [
                  { accountId: paymentAcc.id, debit: alloc.allocated, credit: 0 },
                  { accountId: arAcc.id, debit: 0, credit: alloc.allocated },
                ],
              },
            },
          });
        } else {
          const order = outstandingOrders.find((o) => o.id === alloc.orderId)!;
          const txRecord = await tx.paymentTransaction.create({
            data: {
              orderId: alloc.orderId,
              amount: alloc.allocated,
              method: paymentMethod as any,
              status: "SUCCESS",
              verifiedAt: new Date(),
              verifiedById: userId,
              accountId: paymentAcc.id,
            },
          });
          transactionIds.push(txRecord.id);

          await tx.paymentAllocation.create({
            data: {
              paymentId: txRecord.id,
              orderId: alloc.orderId,
              allocatedAmount: alloc.allocated,
            },
          });

          const newPaid = Number(order.paidAmount) + alloc.allocated;
          const newBalance = Number(order.totalAmount) - newPaid;
          const newState = newPaid >= Number(order.totalAmount) ? PaymentState.PAID : PaymentState.PARTIAL;

          await tx.order.update({
            where: { id: alloc.orderId },
            data: {
              paidAmount: newPaid,
              balanceDue: newBalance,
              paymentState: newState,
              status: newState === PaymentState.PAID ? "PAID" : order.status,
            },
          });

          await tx.journalEntry.create({
            data: {
              entryNo: `JV-RCVBL-${txRecord.id.substring(0, 8)}`,
              description: `Payment collected from ${order.customerName} for ${order.orderNumber}${notes ? ` — ${notes}` : ""}`,
              sourceRef: txRecord.id,
              status: JournalStatus.POSTED,
              lines: {
                create: [
                  { accountId: paymentAcc.id, debit: alloc.allocated, credit: 0 },
                  { accountId: arAcc.id, debit: 0, credit: alloc.allocated },
                ],
              },
            },
          });
        }
      }

      return {
        totalReceived: amount,
        totalAllocated,
        advanceAmount: remaining,
        isAdvance,
        allocations,
        transactionIds,
        message: isAdvance
          ? `Rs. ${totalAllocated.toLocaleString()} allocated. Rs. ${remaining.toLocaleString()} held as advance credit.`
          : `Rs. ${totalAllocated.toLocaleString()} collected and allocated successfully.`,
      };
    });
  }

  /**
   * Customer statement — summary of all activity (invoices + payments).
   */
  async getCustomerStatement(customerPhone: string) {
    const ledger = await this.getCustomerLedger(customerPhone);

    const invoices = ledger.entries.filter((e) => e.type === "INVOICE");
    const payments = ledger.entries.filter((e) => e.type === "PAYMENT");

    return {
      customerName: ledger.customerName,
      customerPhone,
      generatedAt: new Date(),
      summary: ledger.summary,
      invoices,
      payments,
      ledger: ledger.entries,
    };
  }
}