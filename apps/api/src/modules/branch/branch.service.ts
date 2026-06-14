import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditAction } from "@khan/prisma";

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {}

  /** Return all branches with their manager info and staff count. */
  async getAllBranches() {
    return this.prisma.client.branch.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        address: true,
        phoneNumber: true,
        createdAt: true,
        manager: {
          select: { id: true, fullName: true, email: true, phoneNumber: true },
        },
        _count: {
          select: { users: true, bikeInventory: true, partInventory: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  /** Return a single branch by ID with full detail. */
  async getBranchById(id: string) {
    const branch = await this.prisma.client.branch.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        city: true,
        address: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
        manager: {
          select: { id: true, fullName: true, email: true, phoneNumber: true },
        },
        users: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            status: true,
          },
        },
        _count: {
          select: { bikeInventory: true, partInventory: true, orders: true },
        },
      },
    });

    if (!branch) {
      throw new NotFoundException(`Branch with id "${id}" not found.`);
    }

    return branch;
  }

  async createBranch(
    dto: {
      name: string;
      city: string;
      address: string;
      phoneNumber: string;
      managerId?: string;
    },
    adminId: string
  ) {
    return this.prisma.client.$transaction(async (tx) => {
      const branch = await tx.branch.create({
        data: {
          name: dto.name,
          city: dto.city,
          address: dto.address,
          phoneNumber: dto.phoneNumber,
          managerId: dto.managerId || null,
        },
        select: {
          id: true,
          name: true,
          city: true,
          address: true,
          phoneNumber: true,
          createdAt: true,
          manager: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN",
          action: AuditAction.CREATE,
          entityType: "BRANCH",
          entityId: branch.id,
          newValue: JSON.stringify(dto),
        },
      });

      return branch;
    });
  }

  async updateBranch(
    id: string,
    dto: {
      name?: string;
      city?: string;
      address?: string;
      phoneNumber?: string;
      managerId?: string | null;
    },
    adminId: string
  ) {
    return this.prisma.client.$transaction(async (tx) => {
      const oldBranch = await tx.branch.findUnique({
        where: { id },
        select: { name: true, city: true, address: true, phoneNumber: true, managerId: true },
      });

      if (!oldBranch) {
        throw new NotFoundException(`Branch with id "${id}" not found.`);
      }

      const branch = await tx.branch.update({
        where: { id },
        data: dto,
        select: {
          id: true,
          name: true,
          city: true,
          address: true,
          phoneNumber: true,
          updatedAt: true,
          manager: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN",
          action: AuditAction.UPDATE,
          entityType: "BRANCH",
          entityId: branch.id,
          oldValue: JSON.stringify(oldBranch),
          newValue: JSON.stringify(dto),
        },
      });

      return branch;
    });
  }

  async deleteBranch(id: string, adminId: string) {
    return this.prisma.client.$transaction(async (tx) => {
      const oldBranch = await tx.branch.findUnique({
        where: { id },
      });

      if (!oldBranch) {
        throw new NotFoundException(`Branch with id "${id}" not found.`);
      }

      await tx.branch.delete({ where: { id } });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN",
          action: AuditAction.DELETE,
          entityType: "BRANCH",
          entityId: id,
          oldValue: JSON.stringify({ name: oldBranch.name, city: oldBranch.city }),
        },
      });

      return { message: "Branch deleted successfully." };
    });
  }

  async getBranchMetrics(id: string, user: any) {
    // A manager scoped to a branch can only view their own branch's metrics.
    // A manager with no branchId (global manager) can view any branch, like an admin.
    if (user.role === "MANAGER" && user.branchId && user.branchId !== id) {
      throw new ForbiddenException("You can only view metrics for your own branch.");
    }

    const branch = await this.prisma.client.branch.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            bikeInventory: true,
            partInventory: true,
            orders: true,
            users: true,
          },
        },
      },
    });

    if (!branch) {
      throw new NotFoundException(`Branch with id "${id}" not found.`);
    }

    // Calculate additional metrics
    const orders = await this.prisma.client.order.findMany({
      where: { branchId: id },
      select: {
        negotiatedAmount: true,
        status: true,
        createdAt: true,
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.negotiatedAmount), 0);
    const completedOrders = orders.filter((o) => o.status === "PAID" || o.status === "CONFIRMED").length;
    const pendingOrders = orders.filter((o) => o.status === "PENDING_PAYMENT").length;

    // Get recent orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = orders.filter((o) => o.createdAt >= thirtyDaysAgo).length;

    return {
      branch: {
        id: branch.id,
        name: branch.name,
      },
      metrics: {
        inventory: {
          bikes: branch._count.bikeInventory,
          parts: branch._count.partInventory,
        },
        staff: branch._count.users,
        orders: {
          total: branch._count.orders,
          completed: completedOrders,
          pending: pendingOrders,
          recent: recentOrders,
        },
        revenue: {
          total: totalRevenue,
          averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
        },
      },
    };
  }

  async transferStock(
    dto: {
      type: "bike" | "part";
      itemId: string;
      fromBranchId: string;
      toBranchId: string;
      quantity?: number;
    },
    adminId: string
  ) {
    return this.prisma.client.$transaction(async (tx) => {
    if (dto.type === "bike") {
      // Transfer a single bike unit
      const bikeUnit = await this.prisma.client.bikeUnit.findUnique({
        where: { id: dto.itemId },
      });

      if (!bikeUnit) {
        throw new NotFoundException("Bike unit not found.");
      }

      if (bikeUnit.branchId !== dto.fromBranchId) {
        throw new Error("Bike unit is not in the source branch.");
      }

      await tx.bikeUnit.update({
        where: { id: dto.itemId },
        data: { branchId: dto.toBranchId },
      });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN",
          action: AuditAction.UPDATE,
          entityType: "INVENTORY",
          entityId: dto.itemId,
          oldValue: JSON.stringify({ branchId: dto.fromBranchId }),
          newValue: JSON.stringify({ branchId: dto.toBranchId, transferType: "bike" }),
        },
      });

      return { message: "Bike transferred successfully." };
    } else {
      // Transfer parts (with quantity)
      if (!dto.quantity || dto.quantity <= 0) {
        throw new Error("Quantity must be greater than 0 for part transfers.");
      }

      const fromInventory = await tx.partInventory.findUnique({
        where: {
          partId_branchId: {
            partId: dto.itemId,
            branchId: dto.fromBranchId,
          },
        },
      });

      if (!fromInventory) {
        throw new NotFoundException("Source inventory not found.");
      }

      if (fromInventory.quantity < dto.quantity) {
        throw new Error("Insufficient stock in source branch.");
      }

      // Update source inventory
      await tx.partInventory.update({
        where: {
          partId_branchId: {
            partId: dto.itemId,
            branchId: dto.fromBranchId,
          },
        },
        data: {
          quantity: { decrement: dto.quantity },
        },
      });

      // Update or create destination inventory
      const toInventory = await tx.partInventory.findUnique({
        where: {
          partId_branchId: {
            partId: dto.itemId,
            branchId: dto.toBranchId,
          },
        },
      });

      if (toInventory) {
        await tx.partInventory.update({
          where: {
            partId_branchId: {
              partId: dto.itemId,
              branchId: dto.toBranchId,
            },
          },
          data: {
            quantity: { increment: dto.quantity },
          },
        });
      } else {
        await tx.partInventory.create({
          data: {
            partId: dto.itemId,
            branchId: dto.toBranchId,
            quantity: dto.quantity,
            reservedQuantity: 0,
            reorderLevel: 5,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: adminId,
          userRole: "ADMIN",
          action: AuditAction.UPDATE,
          entityType: "INVENTORY",
          entityId: dto.itemId,
          newValue: JSON.stringify({ 
            transferType: "part", 
            quantity: dto.quantity, 
            fromBranchId: dto.fromBranchId, 
            toBranchId: dto.toBranchId 
          }),
        },
      });

      return { message: "Parts transferred successfully." };
    }
    });
  }
}
