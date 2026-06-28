import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  private async getGlobalDiscount(key: string): Promise<number> {
    const setting = await this.prisma.client.systemSetting.findUnique({ where: { key } });
    return setting?.value ? parseFloat(setting.value) : 0;
  }

  /**
   * Get list of available bikes with filters
   * Always returns bikes with status = AVAILABLE
   */
  async getBikes(filters: {
    modelId?: string;
    priceMin?: number;
    priceMax?: number;
    branchId?: string;
    vendorId?: string;
  }) {
    const where: any = {
      status: "AVAILABLE",
    };

    if (filters.modelId) {
      where.modelId = filters.modelId;
    }

    if (filters.branchId) {
      where.branchId = filters.branchId;
    }

    if (filters.vendorId) {
      where.vendorId = filters.vendorId;
    }

    if (filters.priceMin || filters.priceMax) {
      where.model = {
        ...where.model,
        basePrice: {},
      };
      if (filters.priceMin) {
        where.model.basePrice = { ...where.model.basePrice, gte: filters.priceMin };
      }
      if (filters.priceMax) {
        where.model.basePrice = { ...where.model.basePrice, lte: filters.priceMax };
      }
    }

    const bikes = await this.prisma.client.bikeUnit.findMany({
      where,
      select: {
        id: true,
        chassisNumber: true,
        engineNumber: true,
        serialNumber: true,
        status: true,
        price: true,
        color: true,
        media: true,
        onlineDiscountPercent: true,
        model: true,
        branch: true,
        documents: {
          where: {
            fileType: "REGISTRATION_DOCUMENT",
          },
        },
      },
    });

    const globalDiscount = await this.getGlobalDiscount("GLOBAL_BIKE_DISCOUNT");

    return bikes.map(bike => ({
      ...bike,
      globalDiscountPercent: globalDiscount,
    }));
  }

  /**
   * Get single bike detail with public-safe documents only
   */
  async getBikeById(id: string) {
    const bike = await this.prisma.client.bikeUnit.findUnique({
      where: { id },
      select: {
        id: true,
        chassisNumber: true,
        engineNumber: true,
        serialNumber: true,
        status: true,
        price: true,
        color: true,
        media: true,
        onlineDiscountPercent: true,
        model: true,
        branch: true,
        documents: {
          where: {
            fileType: "REGISTRATION_DOCUMENT",
          },
        },
      },
    });

    if (!bike) {
      throw new Error("Bike not found");
    }

    const globalDiscount = await this.getGlobalDiscount("GLOBAL_BIKE_DISCOUNT");

    return {
      ...bike,
      globalDiscountPercent: globalDiscount,
    };
  }

  /**
   * Get list of parts with filters
   */
  async getParts(filters: {
    category?: string;
    search?: string;
    branchId?: string;
  }) {
    const where: any = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { sku: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.branchId) {
      where.inventories = {
        some: {
          branchId: filters.branchId,
          quantity: { gt: 0 },
        },
      };
    }

    const parts = await this.prisma.client.part.findMany({
      where,
      include: {
        inventories: {
          include: {
            branch: true,
          },
          where: {
            quantity: { gt: 0 },
          },
        },
      },
    });

    const globalDiscount = await this.getGlobalDiscount("GLOBAL_PART_DISCOUNT");

    return parts.map(part => ({
      ...part,
      globalDiscountPercent: globalDiscount,
    }));
  }

  /**
   * Get single part detail with per-branch stock
   */
  async getPartById(id: string) {
    const part = await this.prisma.client.part.findUnique({
      where: { id },
      include: {
        inventories: {
          include: {
            branch: true,
          },
        },
      },
    });

    if (!part) {
      throw new Error("Part not found");
    }

    const globalDiscount = await this.getGlobalDiscount("GLOBAL_PART_DISCOUNT");

    return {
      ...part,
      globalDiscountPercent: globalDiscount,
    };
  }

  /**
   * Search across bikes and parts
   */
  async search(query: string) {
    const bikes = await this.prisma.client.bikeUnit.findMany({
      where: {
        status: "AVAILABLE",
        OR: [
          {
            model: {
              modelName: { contains: query, mode: "insensitive" },
            },
          },
          {
            model: {
              brand: { contains: query, mode: "insensitive" },
            },
          },
        ],
      },
      include: {
        model: true,
        branch: true,
      },
      take: 10,
    });

    const parts = await this.prisma.client.part.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    });

    return { bikes, parts };
  }

  /**
   * Get all bike models
   */
  async getModels() {
    return this.prisma.client.bikeModel.findMany({
      orderBy: { modelName: 'asc' },
    });
  }

  /**
   * Get all branches
   */
  async getBranches() {
    return this.prisma.client.branch.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
