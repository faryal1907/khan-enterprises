import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

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
}
