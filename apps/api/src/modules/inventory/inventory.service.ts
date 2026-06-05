import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateBikeUnitDto } from "./dto/create-bike-unit.dto";
import { QueryBikesDto } from "./dto/query-bikes.dto";
import { UpdateBikeStatusDto } from "./dto/update-bike-status.dto";
import { TransferBikeDto } from "./dto/transfer-bike.dto";
import { AttachDocumentDto } from "./dto/attach-document.dto";

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

    return this.prisma.client.bikeUnit.create({
      data: {
        chassisNumber: dto.chassisNumber,
        engineNumber: dto.engineNumber,
        branchId: dto.branchId,
        modelId: dto.modelId,
        vendorId: dto.vendorId,
        serialNumber: dto.serialNumber,
        status: "AVAILABLE",
      },
      include: {
        model: true,
        vendor: true,
        branch: true,
      },
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
}
