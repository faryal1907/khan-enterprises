import { Controller, Get, Post, Patch, Put, Query, Param, Body, UseGuards } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CreatePartDto } from "./dto/create-part.dto";
import { UpdatePartDto } from "./dto/update-part.dto";
import { AdjustStockDto } from "./dto/adjust-stock.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreateBikeUnitDto } from "./dto/create-bike-unit.dto";
import { UpdateBikeStatusDto } from "./dto/update-bike-status.dto";
import { TransferBikeDto } from "./dto/transfer-bike.dto";
import { AttachDocumentDto } from "./dto/attach-document.dto";
import { QueryBikesDto } from "./dto/query-bikes.dto";

@Controller("inventory")
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * POST /api/inventory/bikes
   * Creates a new BikeUnit with default AVAILABLE status.
   */
  @Post("bikes")
  @Roles("ADMIN")
  async createBike(@Body() dto: CreateBikeUnitDto) {
    return this.inventoryService.createBike(dto);
  }

  /**
   * GET /api/inventory/bikes
   * Returns all serialized motorcycle units, optionally filtered by branch/status/model/vendor/search.
   * SALES_STAFF: automatically scoped to their assigned vendor only.
   */
  @Get("bikes")
  async getBikes(@Query() query: QueryBikesDto, @CurrentUser() user: any) {
    // Enforce vendor scoping for SALES_STAFF
    if (user.role === "SALES_STAFF") {
      query.vendorId = user.vendorId ?? undefined;
    }
    const bikes = await this.inventoryService.getAllBikes(query);
    return { count: bikes.length, bikes };
  }

  /**
   * GET /api/inventory/bikes/:id
   * Returns a single bike unit with documents and all associated relations.
   */
  @Get("bikes/:id")
  async getBikeById(@Param("id") id: string) {
    return this.inventoryService.getBikeById(id);
  }

  /**
   * PATCH /api/inventory/bikes/:id/status
   * Updates status of a bike unit.
   */
  @Patch("bikes/:id/status")
  @Roles("ADMIN", "MANAGER")
  async updateBikeStatus(@Param("id") id: string, @Body() dto: UpdateBikeStatusDto) {
    return this.inventoryService.updateBikeStatus(id, dto);
  }

  /**
   * PATCH /api/inventory/bikes/:id/branch
   * Transfers a bike unit to a different branch.
   */
  @Patch("bikes/:id/branch")
  @Roles("ADMIN")
  async transferBike(@Param("id") id: string, @Body() dto: TransferBikeDto) {
    return this.inventoryService.transferBike(id, dto);
  }

  /**
   * POST /api/inventory/bikes/:id/documents
   * Attaches a document record to a BikeUnit.
   */
  @Post("bikes/:id/documents")
  @Roles("ADMIN")
  async attachDocument(
    @Param("id") id: string,
    @Body() dto: AttachDocumentDto,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.attachDocument(id, dto, user.id);
  }

  /**
   * GET /api/inventory/parts
   * GET /api/inventory/parts?branchId=<id>
   * Returns all parts inventory records, optionally filtered by branch.
   */
  @Get("parts")
  async getParts(@Query("branchId") branchId?: string) {
    const parts = await this.inventoryService.getAllParts(branchId);
    return { count: parts.length, parts };
  }

  /**
   * POST /api/inventory/parts
   * Creates a new Part and PartInventory atomically.
   */
  @Post("parts")
  @Roles("ADMIN", "MANAGER")
  async createPart(@Body() dto: CreatePartDto) {
    return this.inventoryService.createPart(dto);
  }

  /**
   * GET /api/inventory/parts/low-stock
   * GET /api/inventory/parts/low-stock?branchId=<id>
   * Returns PartInventory rows where quantity < reorderLevel.
   */
  @Get("parts/low-stock")
  @Roles("ADMIN", "MANAGER")
  async getLowStockItems(@Query("branchId") branchId?: string) {
    const items = await this.inventoryService.getLowStockItems(branchId);
    return { count: items.length, items };
  }

  /**
   * GET /api/inventory/parts/:id
   * Returns a single Part with its PartInventory records per branch.
   */
  @Get("parts/:id")
  async getPartById(@Param("id") id: string) {
    return this.inventoryService.getPartById(id);
  }

  /**
   * PUT /api/inventory/parts/:id
   * Updates Part metadata (name, sku, price, etc.).
   */
  @Put("parts/:id")
  @Roles("ADMIN", "MANAGER")
  async updatePart(@Param("id") id: string, @Body() dto: UpdatePartDto) {
    return this.inventoryService.updatePart(id, dto);
  }

  /**
   * GET /api/inventory/parts/:id/branch-stock
   * Returns all PartInventory rows for a given Part.
   */
  @Get("parts/:id/branch-stock")
  async getBranchStockView(@Param("id") id: string) {
    return this.inventoryService.getBranchStockView(id);
  }

  /**
   * POST /api/inventory/parts/:inventoryId/adjust-stock
   * Updates quantity by signed delta and creates StockMovement record.
   */
  @Post("parts/:inventoryId/adjust-stock")
  @Roles("ADMIN", "MANAGER")
  async adjustStock(
    @Param("inventoryId") inventoryId: string,
    @Body() dto: AdjustStockDto,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.adjustStock(inventoryId, dto, user.id);
  }

  /**
   * GET /api/inventory/parts/:inventoryId/movements
   * Returns paginated movement history for a PartInventory.
   */
  @Get("parts/:inventoryId/movements")
  async getStockMovements(
    @Param("inventoryId") inventoryId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "20",
  ) {
    return this.inventoryService.getStockMovements(
      inventoryId,
      parseInt(page),
      parseInt(limit),
    );
  }
}
