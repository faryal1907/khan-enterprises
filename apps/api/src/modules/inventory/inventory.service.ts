import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateBikeUnitDto } from "./dto/create-bike-unit.dto";
import { UpdateBikeUnitDto } from "./dto/update-bike-unit.dto";
import { QueryBikesDto } from "./dto/query-bikes.dto";
import { UpdateBikeStatusDto } from "./dto/update-bike-status.dto";
import { TransferBikeDto } from "./dto/transfer-bike.dto";
import { AttachDocumentDto } from "./dto/attach-document.dto";
import { CreatePartDto } from "./dto/create-part.dto";
import { UpdatePartDto } from "./dto/update-part.dto";
import { AdjustStockDto } from "./dto/adjust-stock.dto";

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** Return all serialized bike units with their model, vendor, and branch details. */
  async getAllBikes(query?: string | QueryBikesDto) {
    let branchId: string | undefined;
    let status: any;
    let modelId: string | undefined;
    let vendorId: string | undefined;
    let search: string | undefined;
    let page: number | undefined;
    let limit: number | undefined;

    if (typeof query === "string") {
      branchId = query;
    } else if (query) {
      branchId = query.branchId;
      status = query.status;
      modelId = query.modelId;
      vendorId = query.vendorId;
      search = query.search;
      page = query.page;
      limit = query.limit;
    }

    const where: any = {};
    if (branchId) {
      where.branchId = branchId;
    }
    if (status) {
      where.status = status;
    }
    if (modelId) {
      where.modelId = modelId;
    }
    if (vendorId) {
      where.vendorId = vendorId;
    }
    if (search) {
      where.OR = [
        { chassisNumber: { contains: search, mode: "insensitive" } },
        { engineNumber: { contains: search, mode: "insensitive" } },
        {
          model: {
            OR: [
              { modelName: { contains: search, mode: "insensitive" } },
              { brand: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit ? limit : undefined;

    return this.prisma.client.bikeUnit.findMany({
      where,
      skip,
      take,
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

  /** Fetch a single bike unit with documents and all associated relations. */
  async getBikeById(id: string) {
    const bike = await this.prisma.client.bikeUnit.findUnique({
      where: { id },
      include: {
        documents: true,
        model: true,
        vendor: true,
        branch: true,
      },
    });

    if (!bike) {
      throw new NotFoundException(`Bike with ID ${id} not found`);
    }

    return bike;
  }

  /** Create a new BikeUnit with default AVAILABLE status. Checks for duplicate chassis/engine numbers. */
  async createBike(dto: CreateBikeUnitDto) {
    // Check chassis number uniqueness
    const existingChassis = await this.prisma.client.bikeUnit.findUnique({
      where: { chassisNumber: dto.chassisNumber },
    });
    if (existingChassis) {
      throw new ConflictException(`Bike with chassis number ${dto.chassisNumber} already exists`);
    }

    // Check engine number uniqueness
    const existingEngine = await this.prisma.client.bikeUnit.findUnique({
      where: { engineNumber: dto.engineNumber },
    });
    if (existingEngine) {
      throw new ConflictException(`Bike with engine number ${dto.engineNumber} already exists`);
    }

    // Fetch the bike model to use its default basePrice if price is not provided
    const bikeModel = await this.prisma.client.bikeModel.findUnique({
      where: { id: dto.modelId },
    });
    if (!bikeModel) {
      throw new NotFoundException(`Bike model with id ${dto.modelId} not found`);
    }
    const finalPrice = dto.price !== undefined && dto.price !== null ? dto.price : bikeModel.basePrice;

    return this.prisma.client.bikeUnit.create({
      data: {
        chassisNumber: dto.chassisNumber,
        engineNumber: dto.engineNumber,
        branchId: dto.branchId,
        modelId: dto.modelId,
        vendorId: dto.vendorId,
        serialNumber: dto.serialNumber,
        status: "AVAILABLE",
        price: finalPrice,
        color: dto.color,
        media: dto.media || [],
      },
      include: {
        model: true,
        vendor: true,
        branch: true,
      },
    });
  }

  /** Update an existing bike unit's properties. */
  async updateBike(id: string, dto: UpdateBikeUnitDto) {
    await this.getBikeById(id);

    return this.prisma.client.bikeUnit.update({
      where: { id },
      data: {
        branchId: dto.branchId,
        vendorId: dto.vendorId,
        status: dto.status,
        price: dto.price,
        color: dto.color,
        media: dto.media,
      },
      include: {
        model: true,
        vendor: true,
        branch: true,
      },
    });
  }

  /** Delete a bike unit. */
  async deleteBike(id: string) {
    await this.getBikeById(id);

    return this.prisma.client.bikeUnit.delete({
      where: { id },
    });
  }

  /** Update status of a bike unit. */
  async updateBikeStatus(id: string, dto: UpdateBikeStatusDto) {
    await this.getBikeById(id);

    return this.prisma.client.bikeUnit.update({
      where: { id },
      data: { status: dto.status },
      include: {
        model: true,
        vendor: true,
        branch: true,
      },
    });
  }

  /** Transfer a bike unit to a different branch. */
  async transferBike(id: string, dto: TransferBikeDto) {
    await this.getBikeById(id);

    const targetBranch = await this.prisma.client.branch.findUnique({
      where: { id: dto.branchId },
    });
    if (!targetBranch) {
      throw new NotFoundException(`Destination branch with ID ${dto.branchId} not found`);
    }

    return this.prisma.client.bikeUnit.update({
      where: { id },
      data: { branchId: dto.branchId },
      include: {
        model: true,
        vendor: true,
        branch: true,
      },
    });
  }

  /** Attach a document record to a BikeUnit. */
  async attachDocument(bikeId: string, dto: AttachDocumentDto, userId?: string) {
    await this.getBikeById(bikeId);

    return this.prisma.client.document.create({
      data: {
        fileName: dto.fileName,
        fileUrl: dto.fileUrl,
        mimeType: dto.mimeType,
        fileSize: dto.fileSize,
        fileType: dto.fileType,
        bikeId: bikeId,
        uploadedById: userId || null,
      },
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

  /** Create a new Part and PartInventory atomically using prisma.$transaction(). */
  async createPart(dto: CreatePartDto) {
    // Check SKU uniqueness
    const existingSku = await this.prisma.client.part.findUnique({
      where: { sku: dto.sku },
    });
    if (existingSku) {
      throw new ConflictException(`Part with SKU ${dto.sku} already exists`);
    }

    // Check branch exists
    const branch = await this.prisma.client.branch.findUnique({
      where: { id: dto.branchId },
    });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${dto.branchId} not found`);
    }

    return this.prisma.client.$transaction(async (tx) => {
      const part = await tx.part.create({
        data: {
          name: dto.name,
          sku: dto.sku,
          category: dto.category,
          description: dto.description,
          sellingPrice: dto.sellingPrice,
        },
      });

      const inventory = await tx.partInventory.create({
        data: {
          partId: part.id,
          branchId: dto.branchId,
          quantity: dto.quantity,
          reorderLevel: dto.reorderLevel,
        },
        include: {
          part: true,
          branch: true,
        },
      });

      return inventory;
    });
  }

  /** Fetch a single Part with its PartInventory records per branch. */
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
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    return part;
  }

  /** Update Part metadata (name, sku, price, etc.). */
  async updatePart(id: string, dto: UpdatePartDto) {
    await this.getPartById(id);

    // Check SKU uniqueness if being updated
    if (dto.sku) {
      const existingSku = await this.prisma.client.part.findFirst({
        where: {
          sku: dto.sku,
          id: { not: id },
        },
      });
      if (existingSku) {
        throw new ConflictException(`Part with SKU ${dto.sku} already exists`);
      }
    }

    return this.prisma.client.part.update({
      where: { id },
      data: dto,
      include: {
        inventories: {
          include: {
            branch: true,
          },
        },
      },
    });
  }

  /** Update quantity by signed delta AND create StockMovement record with performedById, reason, and movementType — all in one transaction. */
  async adjustStock(inventoryId: string, dto: AdjustStockDto, userId?: string) {
    const inventory = await this.prisma.client.partInventory.findUnique({
      where: { id: inventoryId },
    });
    if (!inventory) {
      throw new NotFoundException(`PartInventory with ID ${inventoryId} not found`);
    }

    return this.prisma.client.$transaction(async (tx) => {
      const updatedInventory = await tx.partInventory.update({
        where: { id: inventoryId },
        data: {
          quantity: {
            increment: dto.quantity,
          },
        },
        include: {
          part: true,
          branch: true,
        },
      });

      const stockMovement = await tx.stockMovement.create({
        data: {
          inventoryId: inventoryId,
          movementType: dto.movementType,
          quantity: dto.quantity,
          reason: dto.reason,
          performedById: userId,
        },
        include: {
          performedBy: true,
        },
      });

      return { inventory: updatedInventory, movement: stockMovement };
    });
  }

  /** Paginated movement history for a PartInventory. */
  async getStockMovements(inventoryId: string, page: number = 1, limit: number = 20) {
    const inventory = await this.prisma.client.partInventory.findUnique({
      where: { id: inventoryId },
    });
    if (!inventory) {
      throw new NotFoundException(`PartInventory with ID ${inventoryId} not found`);
    }

    const skip = (page - 1) * limit;

    const [movements, total] = await Promise.all([
      this.prisma.client.stockMovement.findMany({
        where: { inventoryId },
        skip,
        take: limit,
        include: {
          performedBy: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.client.stockMovement.count({
        where: { inventoryId },
      }),
    ]);

    return {
      movements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /** Return PartInventory rows where quantity < reorderLevel. */
  async getLowStockItems(branchId?: string) {
    const inventories = await this.prisma.client.partInventory.findMany({
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
    });

    // Filter in memory where quantity < reorderLevel
    return inventories.filter((inv) => inv.quantity < inv.reorderLevel);
  }

  /** Return all PartInventory rows for a given Part. */
  async getBranchStockView(partId: string) {
    const part = await this.getPartById(partId);

    return this.prisma.client.partInventory.findMany({
      where: { partId },
      include: {
        branch: true,
        part: true,
      },
      orderBy: { quantity: "desc" },
    });
  }
}
