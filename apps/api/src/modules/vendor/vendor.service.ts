import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AccountSubtype, BikeStatus, JournalStatus } from "@khan/prisma";

@Injectable()
export class VendorService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  async getAllVendors() {
    const vendors = await this.prisma.client.vendor.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    const withBalances = await Promise.all(
      vendors.map(async (v) => ({
        ...v,
        prepaidBalance: await this.getVendorBalance(v.id),
      })),
    );

    return withBalances;
  }

  async getVendorDetail(vendorId: string) {
    const vendor = await this.prisma.client.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) throw new NotFoundException("Vendor not found");

    const prepaidBalance = await this.getVendorBalance(vendorId);

    const totalPaid = await this.prisma.client.vendorPayment.aggregate({
      where: { vendorId },
      _sum: { amount: true },
    });

    const totalAllocated = await this.prisma.client.vendorAllocation.aggregate({
      where: { vendorId },
      _sum: { totalAmount: true },
    });

    return {
      ...vendor,
      prepaidBalance,
      totalPaid: Number(totalPaid._sum.amount ?? 0),
      totalAllocated: Number(totalAllocated._sum.totalAmount ?? 0),
    };
  }

  async createVendor(data: {
    name: string;
    contactPerson?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
  }) {
    return this.prisma.client.vendor.create({ data });
  }

  async updateVendor(
    vendorId: string,
    data: {
      name?: string;
      contactPerson?: string;
      phoneNumber?: string;
      email?: string;
      address?: string;
    },
  ) {
    const vendor = await this.prisma.client.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) throw new NotFoundException("Vendor not found");

    return this.prisma.client.vendor.update({
      where: { id: vendorId },
      data,
    });
  }

  async deleteVendor(vendorId: string) {
    const vendor = await this.prisma.client.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) throw new NotFoundException("Vendor not found");

    const balance = await this.getVendorBalance(vendorId);
    if (balance > 0) {
      throw new BadRequestException(
        `Vendor has an outstanding prepaid balance of Rs. ${balance.toLocaleString()}. ` +
          `Allocate or adjust this balance before deactivating.`,
      );
    }

    return this.prisma.client.vendor.update({
      where: { id: vendorId },
      data: { isActive: false },
    });
  }

  // ─── Balance ───────────────────────────────────────────────────────────────

  async getVendorBalance(vendorId: string): Promise<number> {
    const [paid, allocated] = await Promise.all([
      this.prisma.client.vendorPayment.aggregate({
        where: { vendorId },
        _sum: { amount: true },
      }),
      this.prisma.client.vendorAllocation.aggregate({
        where: { vendorId },
        _sum: { totalAmount: true },
      }),
    ]);

    return (
      Number(paid._sum.amount ?? 0) - Number(allocated._sum.totalAmount ?? 0)
    );
  }

  // ─── Ledger ────────────────────────────────────────────────────────────────

  async getVendorLedger(vendorId: string) {
    const vendor = await this.prisma.client.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) throw new NotFoundException("Vendor not found");

    const payments = await this.prisma.client.vendorPayment.findMany({
      where: { vendorId },
      include: {
        fromAccount: { select: { id: true, code: true, name: true } },
        recordedBy: { select: { id: true, fullName: true } },
      },
      orderBy: { date: "asc" },
    });

    const allocations = await this.prisma.client.vendorAllocation.findMany({
      where: { vendorId },
      include: {
        bikes: {
          select: {
            id: true,
            chassisNumber: true,
            model: { select: { brand: true, modelName: true } },
            purchaseCost: true,
          },
        },
        partLines: {
          include: {
            part: { select: { id: true, name: true, sku: true } },
            branch: { select: { id: true, name: true } },
          },
        },
        recordedBy: { select: { id: true, fullName: true } },
      },
      orderBy: { date: "asc" },
    });

    type LedgerEntry =
      | { kind: "PAYMENT"; date: Date; id: string; amount: number; notes: string | null; fromAccount: { code: string; name: string }; recordedBy: { fullName: string } | null }
      | { kind: "ALLOCATION"; date: Date; id: string; totalAmount: number; notes: string | null; bikes: any[]; partLines: any[]; recordedBy: { fullName: string } | null };

    const entries: LedgerEntry[] = [
      ...payments.map((p) => ({
        kind: "PAYMENT" as const,
        date: p.date,
        id: p.id,
        amount: Number(p.amount),
        notes: p.notes,
        fromAccount: p.fromAccount,
        recordedBy: p.recordedBy,
      })),
      ...allocations.map((a) => ({
        kind: "ALLOCATION" as const,
        date: a.date,
        id: a.id,
        totalAmount: Number(a.totalAmount),
        notes: a.notes,
        bikes: a.bikes,
        partLines: a.partLines,
        recordedBy: a.recordedBy,
      })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    let runningBalance = 0;
    const ledger = entries.map((entry) => {
      if (entry.kind === "PAYMENT") {
        runningBalance += entry.amount;
        return { ...entry, balance: runningBalance };
      } else {
        runningBalance -= entry.totalAmount;
        return { ...entry, balance: runningBalance };
      }
    });

    const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
    const totalAllocated = allocations.reduce((s, a) => s + Number(a.totalAmount), 0);

    return {
      vendor: {
        id: vendor.id,
        name: vendor.name,
        contactPerson: vendor.contactPerson,
        phoneNumber: vendor.phoneNumber,
        email: vendor.email,
      },
      summary: { totalPaid, totalAllocated, prepaidBalance: totalPaid - totalAllocated },
      ledger,
    };
  }

  // ─── Record Payment ────────────────────────────────────────────────────────

  async recordPayment(
    vendorId: string,
    data: { fromAccountId: string; amount: number; date: string; notes?: string },
    userId: string,
  ) {
    if (data.amount <= 0) throw new BadRequestException("Amount must be greater than 0");

    const vendor = await this.prisma.client.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException("Vendor not found");

    return this.prisma.client.$transaction(async (tx) => {
      const fromAccount = await tx.account.findUnique({ where: { id: data.fromAccountId } });
      if (!fromAccount) throw new NotFoundException("Funding account not found");
      if (!fromAccount.isActive) throw new BadRequestException("Funding account is inactive");

      const sourceBalance = await this._getAccountBalanceTx(tx, data.fromAccountId);
      if (sourceBalance < data.amount) {
        throw new BadRequestException(
          `Insufficient balance in "${fromAccount.name}". ` +
            `Available: Rs. ${sourceBalance.toLocaleString()}, Required: Rs. ${data.amount.toLocaleString()}`,
        );
      }

      const prepaidAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.VENDOR_PREPAID } });
      if (!prepaidAcc) {
        throw new NotFoundException(
          "Vendor Advance / Prepaid account (code 1500) not found. Please ensure it exists in the Chart of Accounts.",
        );
      }

      const paymentDate = new Date(`${data.date}T12:00:00Z`);
      const entryNo = `JV-VP-${Date.now()}`;

      const journalEntry = await tx.journalEntry.create({
        data: {
          entryNo,
          date: paymentDate,
          description: `Vendor Payment to ${vendor.name}`,
          notes: data.notes,
          status: JournalStatus.POSTED,
          lines: {
            create: [
              { accountId: prepaidAcc.id, debit: data.amount, credit: 0 },
              { accountId: fromAccount.id, debit: 0, credit: data.amount },
            ],
          },
        },
      });

      const payment = await tx.vendorPayment.create({
        data: {
          vendorId,
          fromAccountId: data.fromAccountId,
          amount: data.amount,
          date: paymentDate,
          notes: data.notes ?? null,
          journalEntryId: journalEntry.id,
          recordedById: userId,
        },
        include: {
          vendor: { select: { id: true, name: true } },
          fromAccount: { select: { id: true, code: true, name: true } },
        },
      });

      const newBalance = await this.getVendorBalance(vendorId);
      return {
        payment,
        journalEntry: { id: journalEntry.id, entryNo: journalEntry.entryNo },
        newPrepaidBalance: newBalance,
      };
    });
  }

  // ─── Allocate Inventory ────────────────────────────────────────────────────
  // New workflow:
  // - One branch selected for the whole allocation
  // - Bikes: specify model + quantity → system auto-creates BikeUnit records (PENDING_SETUP, no chassis/engine)
  // - Parts: specify part name + quantity + unit cost → increase PartInventory

  async allocateInventory(
    vendorId: string,
    data: {
      branchId: string;
      date: string;
      notes?: string;
      // Bike model rows — system creates BikeUnit records automatically
      bikes: { modelId: string; quantity: number; unitCost: number }[];
      // Part rows — increases PartInventory quantity
      parts: { partName: string; quantity: number; unitCost: number }[];
    },
    userId: string,
  ) {
    if (data.bikes.length === 0 && data.parts.length === 0) {
      throw new BadRequestException("At least one bike or part line is required");
    }

    const vendor = await this.prisma.client.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException("Vendor not found");

    const branch = await this.prisma.client.branch.findUnique({ where: { id: data.branchId } });
    if (!branch) throw new NotFoundException("Branch not found");

    // Validate bike model rows
    for (const b of data.bikes) {
      if (b.quantity <= 0) throw new BadRequestException("Bike quantity must be greater than 0");
      if (b.unitCost <= 0) throw new BadRequestException("Bike unit cost must be greater than 0");
    }

    // Validate part rows
    for (const p of data.parts) {
      if (!p.partName.trim()) throw new BadRequestException("Part name is required for all part lines");
      if (p.quantity <= 0) throw new BadRequestException("Part quantity must be greater than 0");
      if (p.unitCost <= 0) throw new BadRequestException("Part unit cost must be greater than 0");
    }

    const bikeTotal = data.bikes.reduce((s, b) => s + b.unitCost * b.quantity, 0);
    const partTotal = data.parts.reduce((s, p) => s + p.unitCost * p.quantity, 0);
    const totalAmount = bikeTotal + partTotal;

    if (totalAmount <= 0) throw new BadRequestException("Total allocation amount must be greater than 0");

    const currentBalance = await this.getVendorBalance(vendorId);
    if (totalAmount > currentBalance) {
      throw new BadRequestException(
        `Allocation total (Rs. ${totalAmount.toLocaleString()}) exceeds vendor prepaid balance (Rs. ${currentBalance.toLocaleString()}).`,
      );
    }

    return this.prisma.client.$transaction(async (tx) => {
      // Validate all bike models exist
      for (const b of data.bikes) {
        const model = await tx.bikeModel.findUnique({ where: { id: b.modelId } });
        if (!model) throw new NotFoundException(`Bike model ${b.modelId} not found`);
      }

      const inventoryAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.INVENTORY } });
      const prepaidAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.VENDOR_PREPAID } });
      if (!inventoryAcc || !prepaidAcc) {
        throw new NotFoundException("Inventory or Vendor Prepaid account not found in Chart of Accounts");
      }

      const allocationDate = new Date(`${data.date}T12:00:00Z`);
      const entryNo = `JV-VA-${Date.now()}`;

      // Post journal entry: DR Inventory / CR Vendor Prepaid
      const journalEntry = await tx.journalEntry.create({
        data: {
          entryNo,
          date: allocationDate,
          description: `Inventory received from ${vendor.name} — ${branch.name}`,
          notes: data.notes,
          status: JournalStatus.POSTED,
          lines: {
            create: [
              { accountId: inventoryAcc.id, debit: totalAmount, credit: 0 },
              { accountId: prepaidAcc.id, debit: 0, credit: totalAmount },
            ],
          },
        },
      });

      // ── Step 1: Resolve / create Part records BEFORE creating the allocation
      //    so that FK constraints are satisfied when we attach part lines.
      const resolvedParts: {
        partId: string;
        quantity: number;
        unitCost: number;
      }[] = [];

      for (let i = 0; i < data.parts.length; i++) {
        const p = data.parts[i];
        const trimmedName = p.partName.trim();

        // Look up existing part by name (case-insensitive)
        let part = await tx.part.findFirst({
          where: { name: { equals: trimmedName, mode: "insensitive" } },
        });

        if (!part) {
          // Create new Part with a placeholder SKU — owner fills it in later via Edit
          part = await tx.part.create({
            data: {
              name: trimmedName,
              sku: `PENDING-${Date.now()}-${i}`,
              category: "OTHER",
              sellingPrice: 0,
            },
          });
        }

        resolvedParts.push({ partId: part.id, quantity: p.quantity, unitCost: p.unitCost });

        // Upsert PartInventory for this branch
        await tx.partInventory.upsert({
          where: { partId_branchId: { partId: part.id, branchId: data.branchId } },
          update: { quantity: { increment: p.quantity } },
          create: { partId: part.id, branchId: data.branchId, quantity: p.quantity },
        });
      }

      // ── Step 2: Create VendorAllocation WITHOUT any inline part lines
      const allocation = await tx.vendorAllocation.create({
        data: {
          vendorId,
          totalAmount,
          date: allocationDate,
          notes: data.notes ?? null,
          journalEntryId: journalEntry.id,
          recordedById: userId,
        },
      });

      // ── Step 3: Now create VendorAllocationPartLine records with real partIds
      if (resolvedParts.length > 0) {
        await tx.vendorAllocationPartLine.createMany({
          data: resolvedParts.map((rp) => ({
            allocationId: allocation.id,
            partId: rp.partId,
            branchId: data.branchId,
            quantity: rp.quantity,
            unitCost: rp.unitCost,
            totalCost: rp.unitCost * rp.quantity,
          })),
        });
      }

      // ── Step 4: Create BikeUnit records (PENDING_SETUP, no chassis/engine yet)
      const createdBikeIds: string[] = [];
      let bikeCounter = Date.now();
      for (const b of data.bikes) {
        for (let i = 0; i < b.quantity; i++) {
          const placeholder = `PENDING-${bikeCounter++}-${i}`;
          const bike = await tx.bikeUnit.create({
            data: {
              vendorId,
              branchId: data.branchId,
              modelId: b.modelId,
              chassisNumber: placeholder,
              engineNumber: placeholder,
              status: BikeStatus.PENDING_SETUP,
              purchaseCost: b.unitCost,
              vendorAllocationId: allocation.id,
            },
          });
          createdBikeIds.push(bike.id);
        }
      }

      const newBalance = await this.getVendorBalance(vendorId);

      return {
        allocation: { id: allocation.id },
        journalEntry: { id: journalEntry.id, entryNo: journalEntry.entryNo },
        bikesCreated: createdBikeIds.length,
        partsProcessed: data.parts.length,
        totalAllocated: totalAmount,
        newPrepaidBalance: newBalance,
      };
    });
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private async _getAccountBalanceTx(tx: any, accountId: string): Promise<number> {
    const account = await tx.account.findUnique({
      where: { id: accountId },
      include: { lines: { where: { journalEntry: { status: "POSTED" } } } },
    });
    if (!account) throw new NotFoundException("Account not found");

    let balance = Number(account.openingBalance) || 0;
    let debits = 0;
    let credits = 0;
    for (const line of account.lines) {
      debits += Number(line.debit) || 0;
      credits += Number(line.credit) || 0;
    }

    const isDebitNormal =
      ["ASSET", "EXPENSE"].includes(account.category) || account.subtype === "DRAWINGS";

    return isDebitNormal ? balance + debits - credits : balance + credits - debits;
  }
}
