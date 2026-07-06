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
        id: v.id,
        name: v.name,
        contactPerson: v.contactPerson,
        phoneNumber: v.phoneNumber,
        email: v.email,
        address: v.address,
        isActive: v.isActive,
        commissionRate: Number(v.commissionRate),
        prepaidBalance: await this.getVendorBalance(v.id),
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
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
      id: vendor.id,
      name: vendor.name,
      contactPerson: vendor.contactPerson,
      phoneNumber: vendor.phoneNumber,
      email: vendor.email,
      address: vendor.address,
      isActive: vendor.isActive,
      commissionRate: Number(vendor.commissionRate),
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
    commissionRate?: number;
  }) {
    const vendor = await this.prisma.client.vendor.create({ data });
    return {
      id: vendor.id,
      name: vendor.name,
      contactPerson: vendor.contactPerson,
      phoneNumber: vendor.phoneNumber,
      email: vendor.email,
      address: vendor.address,
      isActive: vendor.isActive,
      commissionRate: Number(vendor.commissionRate),
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
    };
  }

  async updateVendor(
    vendorId: string,
    data: {
      name?: string;
      contactPerson?: string;
      phoneNumber?: string;
      email?: string;
      address?: string;
      commissionRate?: number;
    },
  ) {
    const vendor = await this.prisma.client.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) throw new NotFoundException("Vendor not found");

    const updated = await this.prisma.client.vendor.update({
      where: { id: vendorId },
      data,
    });

    return {
      id: updated.id,
      name: updated.name,
      contactPerson: updated.contactPerson,
      phoneNumber: updated.phoneNumber,
      email: updated.email,
      address: updated.address,
      isActive: updated.isActive,
      commissionRate: Number(updated.commissionRate),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
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

    const updated = await this.prisma.client.vendor.update({
      where: { id: vendorId },
      data: { isActive: false },
    });

    return {
      id: updated.id,
      name: updated.name,
      contactPerson: updated.contactPerson,
      phoneNumber: updated.phoneNumber,
      email: updated.email,
      address: updated.address,
      isActive: updated.isActive,
      commissionRate: Number(updated.commissionRate),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  // ─── Balance ───────────────────────────────────────────────────────────────

  async getVendorBalance(vendorId: string): Promise<number> {
    const [paid, allocated, defectiveReturned] = await Promise.all([
      this.prisma.client.vendorPayment.aggregate({
        where: { vendorId },
        _sum: { amount: true },
      }),
      this.prisma.client.vendorAllocation.aggregate({
        where: { vendorId },
        _sum: { totalAmount: true },
      }),
      this.prisma.client.vendorDefectiveReturn.aggregate({
        where: { vendorId },
        _sum: { totalAmount: true },
      }),
    ]);

    const totalPaid = Number(paid._sum.amount ?? 0);
    const totalAllocated = Number(allocated._sum.totalAmount ?? 0);
    const totalDefectiveReturned = Number(defectiveReturned._sum.totalAmount ?? 0);
    // Current allocated value still in stock = total allocations - returns
    const currentAllocated = totalAllocated - totalDefectiveReturned;

    return totalPaid - currentAllocated;
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

    const defectiveReturns = await this.prisma.client.vendorDefectiveReturn.findMany({
      where: { vendorId },
      include: {
        bikes: {
          select: {
            id: true,
            chassisNumber: true,
            modelBrand: true,
            modelName: true,
            unitCost: true,
          },
        },
        partLines: {
          include: {
            partInventory: {
              include: {
                part: { select: { id: true, name: true, sku: true } },
                branch: { select: { id: true, name: true } },
              },
            },
          },
        },
        recordedBy: { select: { id: true, fullName: true } },
      },
      orderBy: { date: "asc" },
    });

    const entries: {
      kind: "PAYMENT" | "ALLOCATION" | "DEFECTIVE_RETURN";
      date: Date;
      id: string;
      amount?: number;
      totalAmount?: number;
      notes: string | null;
      fromAccount?: { code: string; name: string };
      bikes: any[];
      partLines: any[];
      recordedBy: { fullName: string } | null;
    }[] = [
      ...payments.map((p) => ({
        kind: "PAYMENT" as const,
        date: p.date,
        id: p.id,
        amount: Number(p.amount),
        notes: p.notes,
        fromAccount: p.fromAccount,
        recordedBy: p.recordedBy,
        bikes: [],
        partLines: [],
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
      ...defectiveReturns.map((r) => ({
        kind: "DEFECTIVE_RETURN" as const,
        date: r.date,
        id: r.id,
        totalAmount: Number(r.totalAmount),
        notes: r.notes,
        bikes: r.bikes.map((rb) => ({
          id: rb.id,
          chassisNumber: rb.chassisNumber,
          model: { brand: rb.modelBrand, modelName: rb.modelName },
          unitCost: Number(rb.unitCost),
        })),
        partLines: r.partLines.map((pl) => ({
          id: pl.id,
          quantity: pl.quantity,
          unitCost: Number(pl.unitCost),
          totalCost: Number(pl.totalCost),
          part: pl.partInventory.part,
          branch: pl.partInventory.branch,
        })),
        recordedBy: r.recordedBy,
      })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    let runningBalance = 0;
    const ledger = entries.map((entry) => {
      if (entry.kind === "PAYMENT") {
        runningBalance += (entry.amount as number);
        return { ...entry, balance: runningBalance };
      } else if (entry.kind === "DEFECTIVE_RETURN") {
        // Returns increase the balance (we get value back)
        runningBalance += (entry.totalAmount as number);
        return { ...entry, balance: runningBalance };
      } else {
        runningBalance -= (entry.totalAmount as number);
        return { ...entry, balance: runningBalance };
      }
    });

    const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
    const totalAllocated = allocations.reduce((s, a) => s + Number(a.totalAmount), 0);
    const totalDefectiveReturned = defectiveReturns.reduce((s, r) => s + Number(r.totalAmount), 0);
    // Current allocated value still in stock = total allocations - returns
    const currentAllocated = totalAllocated - totalDefectiveReturned;
    const prepaidBalance = totalPaid - currentAllocated;

    return {
      vendor: {
        id: vendor.id,
        name: vendor.name,
        contactPerson: vendor.contactPerson,
        phoneNumber: vendor.phoneNumber,
        email: vendor.email,
        address: vendor.address,
        commissionRate: Number(vendor.commissionRate ?? 0),
      },
      summary: {
        totalPaid,
        totalAllocated: currentAllocated,
        totalDefectiveReturned,
        prepaidBalance,
      },
      ledger,
    };
  }

  // ─── Get vendor-allocated inventory eligible for return ───────────────────────
  // Returns bikes (with their original allocation cost) and parts that can be returned
  async getReturnableInventory(vendorId: string) {
    const vendor = await this.prisma.client.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) throw new NotFoundException("Vendor not found");

    // Get available bikes that were allocated from this vendor
    const returnableBikes = await this.prisma.client.bikeUnit.findMany({
      where: {
        vendorId,
        status: "AVAILABLE",
      },
      include: {
        model: { select: { brand: true, modelName: true } },
      },
      orderBy: { model: { brand: "asc" } },
    });

    // Get part inventories with their original allocation costs
    const returnableParts = await this.prisma.client.partInventory.findMany({
      where: {
        quantity: { gt: 0 },
        part: {
          allocationLines: {
            some: {
              allocation: { vendorId },
            },
          },
        },
      },
      include: {
        part: { select: { id: true, name: true, sku: true, sellingPrice: true } },
        branch: { select: { id: true, name: true } },
      },
      orderBy: { part: { name: "asc" } },
    });

    // Fetch original unit costs for parts from most recent vendor allocation
    const partsWithCosts = await Promise.all(
      returnableParts.map(async (inv) => {
        const originalLine = await this.prisma.client.vendorAllocationPartLine.findFirst({
          where: {
            partId: inv.partId,
            allocation: { vendorId },
          },
          orderBy: { allocation: { date: "desc" } },
        });
        return {
          ...inv,
          unitCost: originalLine ? Number(originalLine.unitCost) : Number(inv.part.sellingPrice) || 0,
        };
      }),
    );

    return {
      bikes: returnableBikes.map((b) => ({
        id: b.id,
        chassisNumber: b.chassisNumber,
        model: { brand: b.model.brand, modelName: b.model.modelName },
        unitCost: Number(b.purchaseCost || 0),
      })),
      parts: partsWithCosts.map((p) => ({
        id: p.id,
        quantity: p.quantity,
        part: p.part,
        branch: p.branch,
        unitCost: p.unitCost,
      })),
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

      const allowedSubtypes: string[] = [AccountSubtype.CASH, AccountSubtype.BANK, AccountSubtype.EWALLET];
      if (!allowedSubtypes.includes(fromAccount.subtype)) {
        throw new BadRequestException(
          `Account "${fromAccount.name}" cannot be used as a payment source. ` +
          `Only Cash, Bank, or E-Wallet accounts are allowed.`,
        );
      }

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
      bikes: { modelId: string; quantity: number; unitCost?: number }[];
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

    const resolvedBikes: { modelId: string; quantity: number; unitCost: number }[] = [];
    let bikeTotal = 0;
    const commissionRate = Number(vendor.commissionRate ?? 0);

    // Validate bike model rows and calculate unit cost automatically
    for (const b of data.bikes) {
      if (b.quantity <= 0) throw new BadRequestException("Bike quantity must be greater than 0");
      const model = await this.prisma.client.bikeModel.findUnique({ where: { id: b.modelId } });
      if (!model) throw new NotFoundException(`Bike model ${b.modelId} not found`);
      
      const salePrice = Number(model.basePrice);
      const commissionAmount = salePrice * (commissionRate / 100);
      const unitCost = salePrice - commissionAmount;

      resolvedBikes.push({ modelId: b.modelId, quantity: b.quantity, unitCost });
      bikeTotal += unitCost * b.quantity;
    }

    // Validate part rows
    for (const p of data.parts) {
      if (!p.partName.trim()) throw new BadRequestException("Part name is required for all part lines");
      if (p.quantity <= 0) throw new BadRequestException("Part quantity must be greater than 0");
      if (p.unitCost <= 0) throw new BadRequestException("Part unit cost must be greater than 0");
    }

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
      // Models were already validated above, no need to re-validate in transaction
      // unless concurrency is a major concern, but it's fine for now.

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
      for (const b of resolvedBikes) {
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

  // ─── Return Defective Inventory ────────────────────────────────────────────────
  // CR Inventory / DR Vendor Prepaid (reverses an allocation)
  async returnDefectiveInventory(
    vendorId: string,
    data: {
      bikeIds: string[];
      partReturns: { partInventoryId: string; quantity: number }[];
      date: string;
      notes?: string;
    },
    userId: string,
  ) {
    const vendor = await this.prisma.client.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException("Vendor not found");

    if (data.bikeIds.length === 0 && data.partReturns.length === 0) {
      throw new BadRequestException("At least one bike or part must be returned");
    }

    return this.prisma.client.$transaction(async (tx) => {
      // Validate and fetch bikes to return
      const bikesToReturn = await tx.bikeUnit.findMany({
        where: {
          id: { in: data.bikeIds },
          vendorId,
          status: "AVAILABLE",
        },
        include: { model: true },
      });

      if (bikesToReturn.length !== data.bikeIds.length) {
        throw new BadRequestException("Some bikes are not available or not allocated to this vendor");
      }

      // Validate and fetch part inventories to return
      const partInventoryChecks = await Promise.all(
        data.partReturns.map(async (pr) => {
          const inv = await tx.partInventory.findUnique({
            where: { id: pr.partInventoryId },
            include: { part: true, branch: true },
          });
          if (!inv) throw new NotFoundException(`Part inventory ${pr.partInventoryId} not found`);
          if (inv.quantity < pr.quantity) {
            throw new BadRequestException(
              `Insufficient stock for ${inv.part.name}. Available: ${inv.quantity}`,
            );
          }
          // Check that part was originally allocated from this vendor
          const originalAllocation = await tx.vendorAllocationPartLine.findFirst({
            where: {
              partId: inv.partId,
              allocation: { vendorId },
            },
            orderBy: { allocation: { date: "desc" } },
          });
          if (!originalAllocation) {
            throw new BadRequestException(
              `Part ${inv.part.name} was not allocated from this vendor`,
            );
          }
          return { ...pr, partInventory: inv };
        }),
      );

      // Calculate total return value
      const bikeTotal = bikesToReturn.reduce((s, b) => s + Number(b.purchaseCost || 0), 0);

      // Fetch unit costs from original allocation for parts
      const partTotalsWithCosts = await Promise.all(
        partInventoryChecks.map(async (pr) => {
          const originalLine = await tx.vendorAllocationPartLine.findFirst({
            where: {
              partId: pr.partInventory.partId,
              allocation: { vendorId },
            },
            orderBy: { allocation: { date: "desc" } },
          });
          const unitCost = originalLine ? Number(originalLine.unitCost) : Number(pr.partInventory.part.sellingPrice) || 0;
          return {
            partInventoryId: pr.partInventoryId,
            quantity: pr.quantity,
            unitCost,
            totalCost: pr.quantity * unitCost,
          };
        }),
      );

      const partTotal = partTotalsWithCosts.reduce((s, p) => s + p.totalCost, 0);
      const totalAmount = bikeTotal + partTotal;

      if (totalAmount <= 0) {
        throw new BadRequestException("Return value must be greater than 0");
      }

      const inventoryAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.INVENTORY } });
      const prepaidAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.VENDOR_PREPAID } });
      if (!inventoryAcc || !prepaidAcc) {
        throw new NotFoundException("Inventory or Vendor Prepaid account not found in Chart of Accounts");
      }

      const returnDate = new Date(`${data.date}T12:00:00Z`);
      const entryNo = `JV-DR-${Date.now()}`;

      // Create journal entry: CR Inventory / DR Vendor Prepaid
      const journalEntry = await tx.journalEntry.create({
        data: {
          entryNo,
          date: returnDate,
          description: `Defective inventory returned to ${vendor.name}`,
          notes: data.notes,
          status: JournalStatus.POSTED,
          lines: {
            create: [
              { accountId: inventoryAcc.id, debit: 0, credit: totalAmount },
              { accountId: prepaidAcc.id, debit: totalAmount, credit: 0 },
            ],
          },
        },
      });

      // Create defective return record
      const defectiveReturn = await tx.vendorDefectiveReturn.create({
        data: {
          vendorId,
          totalAmount,
          date: returnDate,
          notes: data.notes ?? null,
          journalEntryId: journalEntry.id,
          recordedById: userId,
        },
      });

      // Create bike return lines and delete bikes (remove from inventory)
      for (const bike of bikesToReturn) {
        await tx.vendorDefectiveReturnBike.create({
          data: {
            returnId: defectiveReturn.id,
            chassisNumber: bike.chassisNumber,
            modelBrand: bike.model.brand,
            modelName: bike.model.modelName,
            unitCost: bike.purchaseCost ?? 0,
          },
        });

        await tx.bikeUnit.delete({ where: { id: bike.id } });
      }

      // Create part return lines and adjust stock
      for (const pt of partTotalsWithCosts) {
        await tx.vendorDefectiveReturnPartLine.create({
          data: {
            returnId: defectiveReturn.id,
            partInventoryId: pt.partInventoryId,
            quantity: pt.quantity,
            unitCost: pt.unitCost,
            totalCost: pt.totalCost,
          },
        });

        // Create stock movement record for the return
        await tx.stockMovement.create({
          data: {
            inventoryId: pt.partInventoryId,
            movementType: "STOCK_OUT" as any,
            quantity: pt.quantity,
            reason: "Defective return to vendor",
            performedById: userId,
          },
        });

        await tx.partInventory.update({
          where: { id: pt.partInventoryId },
          data: { quantity: { decrement: pt.quantity } },
        });
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId,
          userRole: "ADMIN" as any,
          action: "DEFECTIVE_RETURN" as any,
          entityType: "VendorDefectiveReturn",
          entityId: defectiveReturn.id,
          ipAddress: "system",
        },
      });

      const newBalance = await this.getVendorBalance(vendorId);

      return {
        return: { id: defectiveReturn.id },
        journalEntry: { id: journalEntry.id, entryNo: journalEntry.entryNo },
        bikesRemoved: bikesToReturn.length,
        partsProcessed: partTotalsWithCosts.length,
        totalReturned: totalAmount,
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
