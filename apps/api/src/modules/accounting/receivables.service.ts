import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AccountSubtype, JournalStatus, PaymentState, ReceivablePartyType } from "@khan/prisma";

@Injectable()
export class ReceivablesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Party CRUD ────────────────────────────────────────────────────────────

  async getParties() {
    return this.prisma.client.receivableParty.findMany({
      where: { isActive: true },
      orderBy: [{ partyType: "asc" }, { name: "asc" }],
    });
  }

  async createParty(data: {
    name: string;
    partyType?: ReceivablePartyType;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
  }) {
    return this.prisma.client.receivableParty.create({ data });
  }

  async updateParty(id: string, data: {
    name?: string;
    partyType?: ReceivablePartyType;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
  }) {
    const party = await this.prisma.client.receivableParty.findUnique({ where: { id } });
    if (!party) throw new NotFoundException("Party not found");
    return this.prisma.client.receivableParty.update({ where: { id }, data });
  }

  // ─── Manual receivable entry ───────────────────────────────────────────────

  async createEntry(data: {
    partyId: string;
    amount: number;
    description: string;
    date: string;
    dueDate?: string;
    vendorId?: string;
  }) {
    const party = await this.prisma.client.receivableParty.findUnique({ where: { id: data.partyId } });
    if (!party) throw new NotFoundException("Party not found");
    if (data.amount <= 0) throw new BadRequestException("Amount must be greater than 0");

    // If sourcing from a vendor, validate vendor and balance
    if (data.vendorId) {
      const vendor = await this.prisma.client.vendor.findUnique({ where: { id: data.vendorId } });
      if (!vendor) throw new NotFoundException("Vendor not found");
      if (!vendor.isActive) throw new BadRequestException("Vendor is inactive");

      // Calculate vendor prepaid balance
      const [paid, allocated, defectiveReturned] = await Promise.all([
        this.prisma.client.vendorPayment.aggregate({ where: { vendorId: data.vendorId }, _sum: { amount: true } }),
        this.prisma.client.vendorAllocation.aggregate({ where: { vendorId: data.vendorId }, _sum: { totalAmount: true } }),
        this.prisma.client.vendorDefectiveReturn.aggregate({ where: { vendorId: data.vendorId }, _sum: { totalAmount: true } }),
      ]);
      const totalPaid = Number(paid._sum.amount ?? 0);
      const currentAllocated = Number(allocated._sum.totalAmount ?? 0) - Number(defectiveReturned._sum.totalAmount ?? 0);
      const vendorBalance = totalPaid - currentAllocated;

      if (data.amount > vendorBalance) {
        throw new BadRequestException(
          `Amount (Rs. ${data.amount.toLocaleString()}) exceeds vendor prepaid balance (Rs. ${vendorBalance.toLocaleString()}).`,
        );
      }
    }

    const entryDate = new Date(`${data.date}T12:00:00Z`);

    return this.prisma.client.$transaction(async (tx) => {
      const entry = await tx.receivableEntry.create({
        data: {
          partyId: data.partyId,
          amount: data.amount,
          description: data.description,
          date: entryDate,
          dueDate: data.dueDate ? new Date(`${data.dueDate}T12:00:00Z`) : null,
          balanceDue: data.amount,
          status: PaymentState.DUE,
          vendorId: data.vendorId ?? null,
        },
      });

      const arAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AR } });

      if (data.vendorId && arAcc) {
        // Vendor-sourced receivable: DR A/R, CR Vendor Prepaid
        const prepaidAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.VENDOR_PREPAID } });
        if (!prepaidAcc) {
          throw new NotFoundException("Vendor Prepaid account not found in Chart of Accounts");
        }

        const vendor = await tx.vendor.findUnique({ where: { id: data.vendorId } });

        // Create a VendorAllocation record so vendor balance stays consistent
        const allocation = await tx.vendorAllocation.create({
          data: {
            vendorId: data.vendorId,
            totalAmount: data.amount,
            date: entryDate,
            notes: `Receivable to ${party.name} — ${data.description}`,
          },
        });

        // Post journal entry: DR A/R / CR Vendor Prepaid
        const journalEntry = await tx.journalEntry.create({
          data: {
            entryNo: `JV-RCV-${entry.id.substring(0, 8)}`,
            date: entryDate,
            description: `Receivable from ${party.name} via ${vendor!.name} prepaid — ${data.description}`,
            sourceRef: entry.id,
            status: JournalStatus.POSTED,
            lines: {
              create: [
                { accountId: arAcc.id, debit: data.amount, credit: 0 },
                { accountId: prepaidAcc.id, debit: 0, credit: data.amount },
              ],
            },
          },
        });

        // Link journal entry to allocation
        await tx.vendorAllocation.update({
          where: { id: allocation.id },
          data: { journalEntryId: journalEntry.id },
        });
      } else if (arAcc) {
        // Standard receivable: DR A/R, CR Revenue
        const revenueAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.REVENUE } });
        if (revenueAcc) {
          await tx.journalEntry.create({
            data: {
              entryNo: `JV-RCV-${entry.id.substring(0, 8)}`,
              date: entryDate,
              description: `Receivable from ${party.name} — ${data.description}`,
              sourceRef: entry.id,
              status: JournalStatus.POSTED,
              lines: {
                create: [
                  { accountId: arAcc.id, debit: data.amount, credit: 0 },
                  { accountId: revenueAcc.id, debit: 0, credit: data.amount },
                ],
              },
            },
          });
        }
      }

      return entry;
    });
  }

  // ─── Aggregate receivables list (all parties) ─────────────────────────────

  async getReceivables() {
    // ── Order-based receivables (CUSTOMER parties) ─────────────────────────
    const orders = await this.prisma.client.order.findMany({
      where: { paymentVerified: true, status: { notIn: ["CANCELLED"] as any } },
      select: {
        id: true, orderNumber: true, customerName: true, customerPhone: true,
        customerId: true, totalAmount: true, paidAmount: true, balanceDue: true,
        paymentState: true, status: true, createdAt: true,
        bike: { select: { model: { select: { brand: true, modelName: true, year: true } } } },
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const partOrders = await this.prisma.client.partOrder.findMany({
      where: { paymentVerified: true, status: { notIn: ["CANCELLED"] as any } },
      select: {
        id: true, orderNumber: true, customerName: true, customerPhone: true,
        customerId: true, amount: true, paidAmount: true, balanceDue: true,
        paymentState: true, status: true, createdAt: true,
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Build phone→party map from existing ReceivableParty records (CUSTOMER type)
    const customerParties = await this.prisma.client.receivableParty.findMany({
      where: { partyType: ReceivablePartyType.CUSTOMER, isActive: true },
    });
    const partyByPhone = new Map(customerParties.map((p) => [p.customerPhone ?? "", p]));

    // Auto-create missing CUSTOMER parties for any phone not yet in the map
    const allPhones = new Set([
      ...orders.map((o) => o.customerPhone),
      ...partOrders.map((po) => po.customerPhone),
    ]);
    for (const phone of allPhones) {
      if (!partyByPhone.has(phone)) {
        const name = orders.find((o) => o.customerPhone === phone)?.customerName
          ?? partOrders.find((po) => po.customerPhone === phone)?.customerName
          ?? phone;
        const newParty = await this.prisma.client.receivableParty.upsert({
          where: { customerPhone: phone },
          update: {},
          create: { name, partyType: ReceivablePartyType.CUSTOMER, customerPhone: phone },
        });
        partyByPhone.set(phone, newParty);
      }
    }

    type PartyRow = {
      partyId: string | null;
      partyName: string;
      partyType: string;
      partyPhone: string | null;
      totalOutstanding: number;
      totalBilled: number;
      totalPaid: number;
      orderCount: number;
      latestDate: Date;
      lastPaymentDate: Date | null;
      status: "DUE" | "PARTIAL" | "OVERDUE" | "PAID";
    };

    const map = new Map<string, PartyRow>();

    const mergeOrder = (phone: string, name: string, billed: number, paid: number,
      outstanding: number, createdAt: Date, paymentState: string) => {
      const existing = map.get(phone);
      const party = partyByPhone.get(phone);
      const itemStatus = paymentState === "OVERDUE" ? "OVERDUE"
        : paymentState === "PARTIAL" ? "PARTIAL"
        : paymentState === "PAID" ? "PAID" : "DUE";

      if (existing) {
        existing.totalOutstanding += outstanding;
        existing.totalBilled += billed;
        existing.totalPaid += paid;
        existing.orderCount += 1;
        if (createdAt > existing.latestDate) existing.latestDate = createdAt;
        if (itemStatus === "OVERDUE") existing.status = "OVERDUE";
        else if (existing.status !== "OVERDUE" && itemStatus === "PARTIAL") existing.status = "PARTIAL";
        else if (existing.status !== "OVERDUE" && existing.status !== "PARTIAL" && itemStatus === "DUE") existing.status = "DUE";
      } else {
        map.set(phone, {
          partyId: party?.id ?? null,
          partyName: party?.name ?? name,
          partyType: "CUSTOMER",
          partyPhone: phone,
          totalOutstanding: outstanding,
          totalBilled: billed,
          totalPaid: paid,
          orderCount: 1,
          latestDate: createdAt,
          lastPaymentDate: null,
          status: itemStatus as any,
        });
      }
    };

    for (const o of orders) mergeOrder(o.customerPhone, o.customerName,
      Number(o.totalAmount), Number(o.paidAmount), Number(o.balanceDue), o.createdAt, o.paymentState);
    for (const po of partOrders) mergeOrder(po.customerPhone, po.customerName,
      Number(po.amount), Number(po.paidAmount), Number(po.balanceDue), po.createdAt, po.paymentState);

    // Compute last payment dates for customer parties
    const phones = Array.from(map.keys());
    if (phones.length > 0) {
      const bikePmts = await this.prisma.client.paymentTransaction.findMany({
        where: { order: { customerPhone: { in: phones }, status: { notIn: ["CANCELLED"] as any } }, status: "SUCCESS", verifiedAt: { not: null } },
        select: { verifiedAt: true, order: { select: { customerPhone: true } } },
        orderBy: { verifiedAt: "desc" },
      });
      const partPmts = await this.prisma.client.partPaymentTransaction.findMany({
        where: { partOrder: { customerPhone: { in: phones }, status: { notIn: ["CANCELLED"] as any } }, status: "SUCCESS", verifiedAt: { not: null } },
        select: { verifiedAt: true, partOrder: { select: { customerPhone: true } } },
        orderBy: { verifiedAt: "desc" },
      });
      for (const t of bikePmts) {
        const row = map.get(t.order!.customerPhone);
        if (row && !row.lastPaymentDate) row.lastPaymentDate = t.verifiedAt!;
      }
      for (const t of partPmts) {
        const row = map.get(t.partOrder!.customerPhone);
        if (row && !row.lastPaymentDate) row.lastPaymentDate = t.verifiedAt!;
      }
    }

    // ── Manual-entry receivables (non-CUSTOMER parties) ────────────────────
    const nonCustomerParties = await this.prisma.client.receivableParty.findMany({
      where: { partyType: { not: ReceivablePartyType.CUSTOMER }, isActive: true },
      include: {
        entries: {
          select: { amount: true, paidAmount: true, balanceDue: true, status: true, date: true },
        },
      },
    });

    const nonCustomerRows: PartyRow[] = nonCustomerParties
      .filter((p) => p.entries.length > 0)
      .map((p) => {
        const totalBilled = p.entries.reduce((s, e) => s + Number(e.amount), 0);
        const totalPaid = p.entries.reduce((s, e) => s + Number(e.paidAmount), 0);
        const totalOutstanding = p.entries.reduce((s, e) => s + Number(e.balanceDue), 0);
        const latestDate = p.entries.reduce((d, e) => e.date > d ? e.date : d, p.entries[0].date);
        const hasDue = p.entries.some((e) => e.status === "DUE");
        const hasPartial = p.entries.some((e) => e.status === "PARTIAL");
        const status: "DUE" | "PARTIAL" | "PAID" =
          totalOutstanding <= 0 ? "PAID" : hasPartial || (totalPaid > 0) ? "PARTIAL" : hasDue ? "DUE" : "PAID";
        return {
          partyId: p.id,
          partyName: p.name,
          partyType: p.partyType,
          partyPhone: p.phone,
          totalBilled,
          totalPaid,
          totalOutstanding,
          orderCount: p.entries.length,
          latestDate,
          lastPaymentDate: null,
          status,
        };
      });

    const customerRows = Array.from(map.values()).map((r) => ({
      ...r,
      status: r.totalOutstanding <= 0 ? "PAID" as const : r.status,
    }));

    return [...customerRows, ...nonCustomerRows];
  }

  // ─── Party ledger ──────────────────────────────────────────────────────────

  async getPartyLedger(partyId: string) {
    const party = await this.prisma.client.receivableParty.findUnique({ where: { id: partyId } });
    if (!party) throw new NotFoundException("Party not found");

    let runningBalance = 0;
    const entries: any[] = [];

    if (party.partyType === ReceivablePartyType.CUSTOMER && party.customerPhone) {
      const phone = party.customerPhone;
      const orders = await this.prisma.client.order.findMany({
        where: { customerPhone: phone, status: { notIn: ["CANCELLED"] as any } },
        include: {
          bike: { include: { model: { select: { brand: true, modelName: true, year: true } } } },
          branch: { select: { name: true } },
          transactions: { where: { status: "SUCCESS" },
            select: { id: true, amount: true, method: true, createdAt: true, verifiedAt: true },
            orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "asc" },
      });
      const partOrders = await this.prisma.client.partOrder.findMany({
        where: { customerPhone: phone, status: { notIn: ["CANCELLED"] as any } },
        include: {
          part: { select: { name: true } },
          branch: { select: { name: true } },
          transactions: { where: { status: "SUCCESS" },
            select: { id: true, amount: true, method: true, createdAt: true, verifiedAt: true },
            orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "asc" },
      });

      for (const o of orders) {
        runningBalance += Number(o.totalAmount);
        entries.push({ date: o.createdAt, type: "INVOICE", ref: o.orderNumber,
          description: `Bike Sale — ${o.bike.model.brand} ${o.bike.model.modelName} (${o.bike.model.year})`,
          debit: Number(o.totalAmount), credit: 0, balance: runningBalance,
          orderId: o.id, orderStatus: o.status, paymentState: o.paymentState, branch: o.branch.name });
        for (const t of o.transactions) {
          runningBalance -= Number(t.amount);
          entries.push({ date: t.verifiedAt ?? t.createdAt, type: "PAYMENT",
            ref: `PAY-${t.id.substring(0, 8)}`,
            description: `Payment received via ${t.method}`,
            debit: 0, credit: Number(t.amount), balance: runningBalance, orderId: o.id });
        }
      }
      for (const po of partOrders) {
        runningBalance += Number(po.amount);
        entries.push({ date: po.createdAt, type: "INVOICE", ref: po.orderNumber,
          description: `Part Sale — ${po.part.name}`,
          debit: Number(po.amount), credit: 0, balance: runningBalance,
          orderId: po.id, orderStatus: po.status, paymentState: po.paymentState, branch: po.branch.name });
        for (const t of po.transactions) {
          runningBalance -= Number(t.amount);
          entries.push({ date: t.verifiedAt ?? t.createdAt, type: "PAYMENT",
            ref: `PAY-${t.id.substring(0, 8)}`,
            description: `Payment received via ${t.method}`,
            debit: 0, credit: Number(t.amount), balance: runningBalance, orderId: po.id });
        }
      }
    } else {
      // Non-customer: manual entries
      const dbEntries = await this.prisma.client.receivableEntry.findMany({
        where: { partyId },
        include: {
          payments: {
            include: { account: { select: { name: true, subtype: true } } },
            orderBy: { collectedAt: "asc" },
          },
        },
        orderBy: { date: "asc" },
      });
      for (const e of dbEntries) {
        runningBalance += Number(e.amount);
        entries.push({ date: e.date, type: "INVOICE", ref: `RCV-${e.id.substring(0, 8).toUpperCase()}`,
          description: e.description, debit: Number(e.amount), credit: 0,
          balance: runningBalance, entryId: e.id, status: e.status });
        for (const p of e.payments) {
          runningBalance -= Number(p.amount);
          entries.push({ date: p.collectedAt, type: "PAYMENT",
            ref: `PMT-${p.id.substring(0, 8).toUpperCase()}`,
            description: `Payment via ${p.method === "ONLINE_TRANSFER" ? "Bank Transfer" : "Cash"}${p.account ? ` (${p.account.name})` : ""}`,
            debit: 0, credit: Number(p.amount), balance: runningBalance, entryId: e.id });
        }
      }
    }

    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalBilled = entries.filter((e) => e.type === "INVOICE").reduce((s, e) => s + e.debit, 0);
    const totalPaid = entries.filter((e) => e.type === "PAYMENT").reduce((s, e) => s + e.credit, 0);

    return {
      party: { id: party.id, name: party.name, partyType: party.partyType,
        phone: party.customerPhone ?? party.phone },
      summary: { totalBilled, totalPaid, totalOutstanding: totalBilled - totalPaid },
      entries,
    };
  }

  // ─── Collect payment ───────────────────────────────────────────────────────

  async collectPayment(
    partyId: string,
    amount: number,
    paymentMethod: string,
    userId: string,
    notes?: string,
    accountId?: string,
  ) {
    if (amount <= 0) throw new BadRequestException("Amount must be greater than 0");

    const party = await this.prisma.client.receivableParty.findUnique({ where: { id: partyId } });
    if (!party) throw new NotFoundException("Party not found");

    return this.prisma.client.$transaction(async (tx) => {
      const arAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AR } });
      let paymentAcc: any = null;
      if (accountId) {
        paymentAcc = await tx.account.findUnique({ where: { id: accountId } });
      } else if (paymentMethod === "ONLINE_TRANSFER") {
        paymentAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.BANK } });
      } else {
        paymentAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.CASH } });
      }
      if (!paymentAcc || !arAcc) throw new BadRequestException("Required accounting accounts not found");

      if (party.partyType === ReceivablePartyType.CUSTOMER && party.customerPhone) {
        // Customer: allocate against orders (oldest first) — existing logic
        return this._collectFromOrders(tx, party, amount, paymentMethod, userId, notes, paymentAcc, arAcc);
      } else {
        // Non-customer: allocate against manual ReceivableEntry records (oldest first)
        return this._collectFromEntries(tx, party, amount, paymentMethod, userId, notes, paymentAcc, arAcc);
      }
    });
  }

  private async _collectFromOrders(tx: any, party: any, amount: number,
    paymentMethod: string, userId: string, notes: string | undefined,
    paymentAcc: any, arAcc: any) {
    const phone = party.customerPhone;
    const outstandingOrders = await tx.order.findMany({
      where: { customerPhone: phone, paymentState: { in: ["DUE", "PARTIAL", "OVERDUE"] }, status: { notIn: ["CANCELLED"] as any } },
      orderBy: { createdAt: "asc" },
    });
    const outstandingPartOrders = await tx.partOrder.findMany({
      where: { customerPhone: phone, paymentState: { in: ["DUE", "PARTIAL", "OVERDUE"] }, status: { notIn: ["CANCELLED"] as any } },
      orderBy: { createdAt: "asc" },
    });

    let remaining = amount;
    const allocations: any[] = [];
    for (const o of outstandingOrders) {
      if (remaining <= 0) break;
      const allocated = Math.min(remaining, Number(o.balanceDue));
      remaining -= allocated;
      allocations.push({ orderId: o.id, allocated, isPartOrder: false });
    }
    for (const po of outstandingPartOrders) {
      if (remaining <= 0) break;
      const allocated = Math.min(remaining, Number(po.balanceDue));
      remaining -= allocated;
      allocations.push({ orderId: po.id, allocated, isPartOrder: true });
    }

    const totalAllocated = amount - remaining;
    for (const alloc of allocations) {
      if (alloc.isPartOrder) {
        const po = outstandingPartOrders.find((o: any) => o.id === alloc.orderId)!;
        const txRecord = await tx.partPaymentTransaction.create({ data: {
          partOrderId: alloc.orderId, amount: alloc.allocated, method: paymentMethod as any,
          status: "SUCCESS", verifiedAt: new Date(), verifiedById: userId, accountId: paymentAcc.id,
        }});
        const newPaid = Number(po.paidAmount) + alloc.allocated;
        const newBalance = Number(po.amount) - newPaid;
        await tx.partOrder.update({ where: { id: alloc.orderId }, data: {
          paidAmount: newPaid, balanceDue: newBalance,
          paymentState: newPaid >= Number(po.amount) ? "PAID" : "PARTIAL",
        }});
        await tx.journalEntry.create({ data: {
          entryNo: `JV-RCVBL-${txRecord.id.substring(0, 8)}`,
          description: `Payment from ${party.name} for ${po.orderNumber}${notes ? ` — ${notes}` : ""}`,
          sourceRef: txRecord.id, status: JournalStatus.POSTED,
          lines: { create: [
            { accountId: paymentAcc.id, debit: alloc.allocated, credit: 0 },
            { accountId: arAcc.id, debit: 0, credit: alloc.allocated },
          ]},
        }});
      } else {
        const o = outstandingOrders.find((x: any) => x.id === alloc.orderId)!;
        const txRecord = await tx.paymentTransaction.create({ data: {
          orderId: alloc.orderId, amount: alloc.allocated, method: paymentMethod as any,
          status: "SUCCESS", verifiedAt: new Date(), verifiedById: userId, accountId: paymentAcc.id,
        }});
        await tx.paymentAllocation.create({ data: { paymentId: txRecord.id, orderId: alloc.orderId, allocatedAmount: alloc.allocated }});
        const newPaid = Number(o.paidAmount) + alloc.allocated;
        const newBalance = Number(o.totalAmount) - newPaid;
        const newState = newPaid >= Number(o.totalAmount) ? "PAID" : "PARTIAL";
        await tx.order.update({ where: { id: alloc.orderId }, data: {
          paidAmount: newPaid, balanceDue: newBalance, paymentState: newState,
          status: newState === "PAID" ? "PAID" : o.status,
        }});
        await tx.journalEntry.create({ data: {
          entryNo: `JV-RCVBL-${txRecord.id.substring(0, 8)}`,
          description: `Payment from ${party.name} for ${o.orderNumber}${notes ? ` — ${notes}` : ""}`,
          sourceRef: txRecord.id, status: JournalStatus.POSTED,
          lines: { create: [
            { accountId: paymentAcc.id, debit: alloc.allocated, credit: 0 },
            { accountId: arAcc.id, debit: 0, credit: alloc.allocated },
          ]},
        }});
      }
    }
    return { totalReceived: amount, totalAllocated, advanceAmount: remaining, isAdvance: remaining > 0,
      message: remaining > 0
        ? `Rs. ${totalAllocated.toLocaleString()} allocated. Rs. ${remaining.toLocaleString()} held as advance.`
        : `Rs. ${totalAllocated.toLocaleString()} collected and allocated successfully.` };
  }

  private async _collectFromEntries(tx: any, party: any, amount: number,
    paymentMethod: string, userId: string, notes: string | undefined,
    paymentAcc: any, arAcc: any) {
    const outstanding = await tx.receivableEntry.findMany({
      where: { partyId: party.id, status: { in: ["DUE", "PARTIAL", "OVERDUE"] } },
      orderBy: { date: "asc" },
    });

    let remaining = amount;
    for (const entry of outstanding) {
      if (remaining <= 0) break;
      const allocated = Math.min(remaining, Number(entry.balanceDue));
      remaining -= allocated;

      const newPaid = Number(entry.paidAmount) + allocated;
      const newBalance = Number(entry.amount) - newPaid;
      const newStatus = newPaid >= Number(entry.amount) ? "PAID" : "PARTIAL";

      await tx.receivableEntry.update({ where: { id: entry.id }, data: {
        paidAmount: newPaid, balanceDue: newBalance, status: newStatus,
      }});

      const pmtRecord = await tx.receivablePayment.create({ data: {
        entryId: entry.id, amount: allocated,
        method: paymentMethod as any, accountId: paymentAcc.id,
        notes: notes ?? null, recordedById: userId,
      }});

      const je = await tx.journalEntry.create({ data: {
        entryNo: `JV-RCVBL-${pmtRecord.id.substring(0, 8)}`,
        description: `Payment from ${party.name}${notes ? ` — ${notes}` : ""}`,
        sourceRef: pmtRecord.id, status: JournalStatus.POSTED,
        lines: { create: [
          { accountId: paymentAcc.id, debit: allocated, credit: 0 },
          { accountId: arAcc.id, debit: 0, credit: allocated },
        ]},
      }});

      await tx.receivablePayment.update({ where: { id: pmtRecord.id }, data: { journalEntryId: je.id }});
    }

    const totalAllocated = amount - remaining;
    return { totalReceived: amount, totalAllocated, advanceAmount: remaining, isAdvance: remaining > 0,
      message: `Rs. ${totalAllocated.toLocaleString()} collected successfully.` };
  }

  // ─── Payment accounts ──────────────────────────────────────────────────────

  async getPaymentAccounts() {
    return this.prisma.client.account.findMany({
      where: { subtype: { in: [AccountSubtype.BANK, AccountSubtype.EWALLET, AccountSubtype.CASH] }, isActive: true },
      select: { id: true, code: true, name: true, subtype: true, accountNumber: true },
      orderBy: [{ subtype: "asc" }, { name: "asc" }],
    });
  }

  // ─── Legacy customer-phone-based methods (kept for backward compat) ────────

  async getCustomerLedger(customerPhone: string) {
    // Find or surface party by phone
    let party = await this.prisma.client.receivableParty.findFirst({ where: { customerPhone } });
    if (!party) {
      // Auto-create a CUSTOMER party from order data
      const order = await this.prisma.client.order.findFirst({ where: { customerPhone } });
      const name = order?.customerName ?? customerPhone;
      party = await this.prisma.client.receivableParty.create({
        data: { name, partyType: ReceivablePartyType.CUSTOMER, customerPhone },
      });
    }
    return this.getPartyLedger(party.id);
  }

  async getCustomerStatement(customerPhone: string) {
    const ledger = await this.getCustomerLedger(customerPhone);
    return { ...ledger, generatedAt: new Date() };
  }

  async collectPaymentByPhone(customerPhone: string, amount: number, paymentMethod: string,
    userId: string, notes?: string, accountId?: string) {
    let party = await this.prisma.client.receivableParty.findFirst({ where: { customerPhone } });
    if (!party) {
      const order = await this.prisma.client.order.findFirst({ where: { customerPhone } });
      party = await this.prisma.client.receivableParty.create({
        data: { name: order?.customerName ?? customerPhone, partyType: ReceivablePartyType.CUSTOMER, customerPhone },
      });
    }
    return this.collectPayment(party.id, amount, paymentMethod, userId, notes, accountId);
  }
}
