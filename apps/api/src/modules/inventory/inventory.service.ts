import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** Return all serialized bike units with their model, vendor, and branch details. */
  async getAllBikes(branchId?: string) {
    return this.prisma.client.bikeUnit.findMany({
      where: branchId ? { branchId } : undefined,
      select: {
        id: true,
        chassisNumber: true,
        engineNumber: true,
        serialNumber: true,
        status: true,
        negotiatedPrice: true,
        reservedUntil: true,
        soldAt: true,
        createdAt: true,
        model: {
          select: {
            id: true,
            brand: true,
            modelName: true,
            year: true,
            engineCapacity: true,
            color: true,
            basePrice: true,
          },
        },
        vendor: {
          select: { id: true, name: true },
        },
        branch: {
          select: { id: true, name: true, city: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Return all part inventory records with part details and branch info. */
  async getAllParts(branchId?: string) {
    return this.prisma.client.partInventory.findMany({
      where: branchId ? { branchId } : undefined,
      select: {
        id: true,
        quantity: true,
        reservedQuantity: true,
        reorderLevel: true,
        updatedAt: true,
        part: {
          select: {
            id: true,
            name: true,
            sku: true,
            category: true,
            description: true,
            sellingPrice: true,
          },
        },
        branch: {
          select: { id: true, name: true, city: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }
}
