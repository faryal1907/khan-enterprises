import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateBikeUnitDto } from "./dto/create-bike-unit.dto";
import { UpdateBikeUnitDto } from "./dto/update-bike-unit.dto";
import { QueryBikesDto } from "./dto/query-bikes.dto";
import { UpdateBikeStatusDto } from "./dto/update-bike-status.dto";
import { TransferBikeDto } from "./dto/transfer-bike.dto";
import { TransferPartDto } from "./dto/transfer-part.dto";
import { AttachDocumentDto } from "./dto/attach-document.dto";
import { CreatePartDto } from "./dto/create-part.dto";
import { UpdatePartDto } from "./dto/update-part.dto";
import { AdjustStockDto } from "./dto/adjust-stock.dto";
import { AuditAction, BikeStatus, InventoryMovementType, OrderStatus, UserRole } from "@khan/prisma";

type InventoryUser = {
  id: string;
  role: UserRole;
  branchId: string | null;
};

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** Return all serialized bike units with their model, vendor, and branch details. */
  async getAllBikes(query: QueryBikesDto, user: InventoryUser) {
    let branchId = query.branchId;
    let status: any;
    let modelId: string | undefined;
    let vendorId: string | undefined;
    let search: string | undefined;
    let page: number | undefined;
    let limit: number | undefined;

    status = query.status;
    modelId = query.modelId;
    vendorId = query.vendorId;
    search = query.search;
    page = query.page;
    limit = query.limit;

    const where: any = {};
    if (user.role !== "ADMIN" && user.branchId) {
      branchId = user.branchId;
    }
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

    const currentPage = page || 1;
    const pageSize = limit || 20;
    const skip = (currentPage - 1) * pageSize;
    const summaryWhere = { ...where };
    delete summaryWhere.status;

    const [bikes, total, available, reserved, sold, inDelivery] = await Promise.all([
      this.prisma.client.bikeUnit.findMany({
        where,
        skip,
        take: pageSize,
        select: {
          id: true,
          chassisNumber: true,
          engineNumber: true,
          serialNumber: true,
          status: true,
          actualSalePrice: true,
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
      }),
      this.prisma.client.bikeUnit.count({ where }),
      this.prisma.client.bikeUnit.count({ where: { ...summaryWhere, status: BikeStatus.AVAILABLE } }),
      this.prisma.client.bikeUnit.count({ where: { ...summaryWhere, status: BikeStatus.RESERVED } }),
      this.prisma.client.bikeUnit.count({ where: { ...summaryWhere, status: BikeStatus.SOLD } }),
      this.prisma.client.bikeUnit.count({ where: { ...summaryWhere, status: BikeStatus.IN_DELIVERY } }),
    ]);

    return {
      bikes,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      summary: {
        total: available + reserved + sold + inDelivery,
        available,
        reserved,
        sold,
        inDelivery,
      },
    };
  }

  /** Fetch a single bike unit with documents and all associated relations. */
  async getBikeById(id: string, user?: InventoryUser) {
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
    this.assertBikeAccess(bike.branchId, user);

    return bike;
  }

  /** Create a new BikeUnit with default AVAILABLE status. Checks for duplicate chassis/engine numbers. */
  async createBike(dto: CreateBikeUnitDto, user: any) {
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

    return this.prisma.client.$transaction(async (tx) => {
      const bike = await tx.bikeUnit.create({
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

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.CREATE,
          entityType: "BIKE",
          entityId: bike.id,
          newValue: JSON.stringify(dto),
        },
      });

      return bike;
    });
  }

  /** Update an existing bike unit's properties. */
  async updateBike(id: string, dto: UpdateBikeUnitDto, user: any) {
    const oldBike = await this.getBikeById(id, user);

    return this.prisma.client.$transaction(async (tx) => {
      const bike = await tx.bikeUnit.update({
        where: { id },
        data: {
          vendorId: dto.vendorId,
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

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "BIKE",
          entityId: id,
          oldValue: JSON.stringify(oldBike),
          newValue: JSON.stringify(dto),
        },
      });

      return bike;
    });
  }

  /** Delete a bike unit. */
  async deleteBike(id: string, user: any) {
    const oldBike = await this.getBikeById(id, user);

    return this.prisma.client.$transaction(async (tx) => {
      const deletedBike = await tx.bikeUnit.delete({
        where: { id },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.DELETE,
          entityType: "BIKE",
          entityId: id,
          oldValue: JSON.stringify(oldBike),
        },
      });

      return deletedBike;
    });
  }

  /** Update status of a bike unit. */
  async updateBikeStatus(id: string, dto: UpdateBikeStatusDto, user: any) {
    const oldBike = await this.getBikeById(id, user);

    if (dto.status !== BikeStatus.AVAILABLE) {
      throw new BadRequestException(
        "SOLD, RESERVED, and IN_DELIVERY statuses are managed by offer, order, and delivery workflows.",
      );
    }
    if (oldBike.status === BikeStatus.SOLD || oldBike.status === BikeStatus.IN_DELIVERY) {
      throw new BadRequestException(`Cannot manually release a bike in ${oldBike.status} status.`);
    }

    // Check for any active non-cancelled orders
    const activeOrders = await this.prisma.client.order.count({
      where: { bikeId: id, status: { not: OrderStatus.CANCELLED } },
    });
    if (activeOrders > 0) {
      throw new BadRequestException(
        "This bike has an active order. Resolve that workflow instead of changing inventory status.",
      );
    }

    return this.prisma.client.$transaction(async (tx) => {
      const bike = await tx.bikeUnit.update({
        where: { id },
        data: {
          status: BikeStatus.AVAILABLE,
          reservedUntil: null,
          actualSalePrice: null,
        },
        include: {
          model: true,
          vendor: true,
          branch: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "BIKE",
          entityId: id,
          oldValue: JSON.stringify({ status: oldBike.status }),
          newValue: JSON.stringify({ status: dto.status }),
        },
      });

      return bike;
    });
  }

  /** Transfer a bike unit to a different branch. */
  async transferBike(id: string, dto: TransferBikeDto, user: any) {
    const oldBike = await this.getBikeById(id, user);

    if (oldBike.branchId === dto.branchId) {
      throw new BadRequestException("Destination branch must be different from the current branch.");
    }
    if (oldBike.status !== BikeStatus.AVAILABLE) {
      throw new BadRequestException("Only AVAILABLE bikes can be transferred between branches.");
    }

    const targetBranch = await this.prisma.client.branch.findUnique({
      where: { id: dto.branchId },
    });
    if (!targetBranch) {
      throw new NotFoundException(`Destination branch with ID ${dto.branchId} not found`);
    }

    return this.prisma.client.$transaction(async (tx) => {
      const bike = await tx.bikeUnit.update({
        where: { id },
        data: { branchId: dto.branchId },
        include: {
          model: true,
          vendor: true,
          branch: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "BIKE",
          entityId: id,
          oldValue: JSON.stringify({ branchId: oldBike.branchId }),
          newValue: JSON.stringify({ branchId: dto.branchId }),
        },
      });

      return bike;
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

  private assertBikeAccess(branchId: string, user?: InventoryUser) {
    if (user?.role !== "ADMIN" && user?.branchId && user.branchId !== branchId) {
      throw new NotFoundException("Bike not found");
    }
  }

  /** Return all part inventory records with part details and branch info. */
  async getAllParts(branchId?: string, search?: string, category?: string, user?: InventoryUser) {
    const where: any = {};
    if (user?.role !== "ADMIN" && user?.branchId) branchId = user.branchId;
    if (branchId) where.branchId = branchId;
    if (search || category) {
      where.part = {};
      if (category) where.part.category = category;
      if (search) {
        where.part.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    return this.prisma.client.partInventory.findMany({
      where,
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
  async createPart(dto: CreatePartDto, user: any) {
    this.assertBranchAccess(dto.branchId, user);
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

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.CREATE,
          entityType: "PART",
          entityId: part.id,
          newValue: JSON.stringify(dto),
        },
      });

      return inventory;
    });
  }

  /** Fetch a single Part with its PartInventory records per branch. */
  async getPartById(id: string, user?: InventoryUser) {
    const part = await this.prisma.client.part.findUnique({
      where: { id },
      include: {
        inventories: {
          where: user?.role !== "ADMIN" && user?.branchId ? { branchId: user.branchId } : undefined,
          include: {
            branch: true,
          },
        },
      },
    });

    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }
    if (user?.role !== UserRole.ADMIN && user?.branchId && part.inventories.length === 0) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    return part;
  }

  /** Update Part metadata (name, sku, price, etc.). */
  async updatePart(id: string, dto: UpdatePartDto, user: any) {
    const oldPart = await this.getPartById(id, user);

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

    return this.prisma.client.$transaction(async (tx) => {
      const part = await tx.part.update({
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

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "PART",
          entityId: id,
          oldValue: JSON.stringify({
            name: oldPart.name,
            sku: oldPart.sku,
            category: oldPart.category,
            sellingPrice: oldPart.sellingPrice,
          }),
          newValue: JSON.stringify(dto),
        },
      });

      return part;
    });
  }

  /** Delete a Part. Fails if the part is referenced by any PartOrder. */
  async deletePart(id: string, user: any) {
    const oldPart = await this.getPartById(id, user);

    // Check if there are any PartOrders linked to this part.
    // If there are, we cannot safely delete it.
    const partOrderExists = await this.prisma.client.partOrder.findFirst({
      where: { partId: id },
    });

    if (partOrderExists) {
      throw new BadRequestException("Cannot delete this part because it is referenced in past orders.");
    }

    return this.prisma.client.$transaction(async (tx) => {
      // Find all part inventories to delete their stock movements first
      const inventories = await tx.partInventory.findMany({
        where: { partId: id },
      });

      const inventoryIds = inventories.map(i => i.id);

      if (inventoryIds.length > 0) {
        // Delete all stock movements tied to these inventories
        await tx.stockMovement.deleteMany({
          where: { inventoryId: { in: inventoryIds } },
        });

        // Delete the part inventories
        await tx.partInventory.deleteMany({
          where: { partId: id },
        });
      }

      // Finally, delete the part
      const deletedPart = await tx.part.delete({
        where: { id },
      });

      // Log the deletion
      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.DELETE,
          entityType: "PART",
          entityId: id,
          oldValue: JSON.stringify(oldPart),
        },
      });

      return deletedPart;
    });
  }

  /** Update quantity by signed delta AND create StockMovement record with performedById, reason, and movementType — all in one transaction. */
  async adjustStock(inventoryId: string, dto: AdjustStockDto, user: InventoryUser) {
    const inventory = await this.prisma.client.partInventory.findUnique({
      where: { id: inventoryId },
    });
    if (!inventory) {
      throw new NotFoundException(`PartInventory with ID ${inventoryId} not found`);
    }
    this.assertBranchAccess(inventory.branchId, user);
    if (dto.quantity === 0) {
      throw new BadRequestException("Stock adjustment quantity cannot be zero.");
    }
    if (dto.movementType === InventoryMovementType.STOCK_IN && dto.quantity < 0) {
      throw new BadRequestException("STOCK_IN quantity must be positive.");
    }
    if (dto.movementType === InventoryMovementType.STOCK_OUT && dto.quantity > 0) {
      throw new BadRequestException("STOCK_OUT quantity must be negative.");
    }
    if (inventory.quantity + dto.quantity < inventory.reservedQuantity) {
      throw new BadRequestException(
        `Adjustment would reduce stock below the reserved quantity. Available to remove: ${inventory.quantity - inventory.reservedQuantity}`,
      );
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
          performedById: user.id,
        },
        include: {
          performedBy: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          action: AuditAction.UPDATE,
          entityType: "PART_INVENTORY",
          entityId: inventoryId,
          newValue: JSON.stringify(dto),
        },
      });

      return { inventory: updatedInventory, movement: stockMovement };
    });
  }

  /** Transfer part stock between branches atomically. */
  async transferPart(dto: TransferPartDto, user: any) {
    if (dto.fromBranchId === dto.toBranchId) {
      throw new BadRequestException("Source and destination branches cannot be the same");
    }
    this.assertBranchAccess(dto.fromBranchId, user);

    return this.prisma.client.$transaction(async (tx) => {
      // 1. Get source inventory
      const sourceInventory = await tx.partInventory.findUnique({
        where: {
          partId_branchId: {
            partId: dto.partId,
            branchId: dto.fromBranchId,
          },
        },
      });

      if (!sourceInventory) {
        throw new NotFoundException(`Source inventory not found for part ${dto.partId} in branch ${dto.fromBranchId}`);
      }

      const availableQuantity = sourceInventory.quantity - sourceInventory.reservedQuantity;
      if (availableQuantity < dto.quantity) {
        throw new BadRequestException(`Insufficient unreserved stock in source branch. Available: ${availableQuantity}`);
      }

      const destinationBranch = await tx.branch.findUnique({ where: { id: dto.toBranchId } });
      if (!destinationBranch) {
        throw new NotFoundException(`Destination branch with ID ${dto.toBranchId} not found`);
      }

      // 2. Decrement source inventory
      const updatedSource = await tx.partInventory.update({
        where: { id: sourceInventory.id },
        data: { quantity: { decrement: dto.quantity } },
      });

      await tx.stockMovement.create({
        data: {
          inventoryId: sourceInventory.id,
          movementType: "STOCK_OUT",
          quantity: -dto.quantity,
          reason: `Transfer to branch ${dto.toBranchId}`,
          performedById: user?.id,
        },
      });

      // 3. Increment or create destination inventory
      const updatedDest = await tx.partInventory.upsert({
        where: {
          partId_branchId: {
            partId: dto.partId,
            branchId: dto.toBranchId,
          },
        },
        create: {
          partId: dto.partId,
          branchId: dto.toBranchId,
          quantity: dto.quantity,
          reorderLevel: sourceInventory.reorderLevel,
        },
        update: {
          quantity: { increment: dto.quantity },
        },
      });

      await tx.stockMovement.create({
        data: {
          inventoryId: updatedDest.id,
          movementType: "STOCK_IN",
          quantity: dto.quantity,
          reason: `Transfer from branch ${dto.fromBranchId}`,
          performedById: user?.id,
        },
      });

      if (user?.id) {
        await tx.auditLog.create({
          data: {
            userId: user.id,
            userRole: user.role,
            action: AuditAction.UPDATE,
            entityType: "PART_INVENTORY",
            entityId: dto.partId,
            newValue: JSON.stringify({ type: 'TRANSFER', ...dto }),
          },
        });
      }

      return { source: updatedSource, destination: updatedDest };
    });
  }

  /** Paginated movement history for a PartInventory. */
  async getStockMovements(inventoryId: string, page: number = 1, limit: number = 20, user?: InventoryUser) {
    const inventory = await this.prisma.client.partInventory.findUnique({
      where: { id: inventoryId },
    });
    if (!inventory) {
      throw new NotFoundException(`PartInventory with ID ${inventoryId} not found`);
    }
    this.assertBranchAccess(inventory.branchId, user);

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

    // Filter in memory where available quantity (quantity - reservedQuantity) < reorderLevel
    return inventories.filter((inv) => inv.quantity - inv.reservedQuantity < inv.reorderLevel);
  }

  /** Return all PartInventory rows for a given Part. */
  async getBranchStockView(partId: string, user?: InventoryUser) {
    await this.getPartById(partId, user);

    return this.prisma.client.partInventory.findMany({
      where: {
        partId,
        ...(user?.role !== "ADMIN" && user?.branchId ? { branchId: user.branchId } : {}),
      },
      include: {
        branch: true,
        part: true,
      },
      orderBy: { quantity: "desc" },
    });
  }

  private assertBranchAccess(branchId: string, user?: InventoryUser) {
    if (user?.role !== "ADMIN" && user?.branchId && user.branchId !== branchId) {
      throw new NotFoundException("Inventory not found");
    }
  }
}