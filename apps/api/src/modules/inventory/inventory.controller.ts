import { Controller, Get, Post, Patch, Query, Param, Body, UseGuards } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreatePartDto } from "./dto/create-part.dto";
import { UpdatePartDto } from "./dto/update-part.dto";
import { AdjustStockDto } from "./dto/adjust-stock.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("inventory")
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * GET /api/inventory/bikes
   * GET /api/inventory/bikes?branchId=<id>
   * Returns all serialized motorcycle units, optionally filtered by branch.
   */
  @Get("bikes")
  async getBikes(@Query("branchId") branchId?: string) {
    const bikes = await this.inventoryService.getAllBikes(branchId);
    return { count: bikes.length, bikes };
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
  async createPart(@Body() dto: CreatePartDto) {
    return this.inventoryService.createPart(dto);
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
   * PATCH /api/inventory/parts/:id
   * Updates Part metadata (name, sku, price, etc.).
   */
  @Patch("parts/:id")
  async updatePart(@Param("id") id: string, @Body() dto: UpdatePartDto) {
    return this.inventoryService.updatePart(id, dto);
  }

  /**
   * POST /api/inventory/parts/:inventoryId/adjust-stock
   * Updates quantity by signed delta and creates StockMovement record.
   */
  @Post("parts/:inventoryId/adjust-stock")
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

  /**
   * GET /api/inventory/parts/low-stock
   * GET /api/inventory/parts/low-stock?branchId=<id>
   * Returns PartInventory rows where quantity < reorderLevel.
   */
  @Get("parts/low-stock")
  async getLowStockItems(@Query("branchId") branchId?: string) {
    const items = await this.inventoryService.getLowStockItems(branchId);
    return { count: items.length, items };
  }

  /**
   * GET /api/inventory/parts/:id/branch-stock
   * Returns all PartInventory rows for a given Part.
   */
  @Get("parts/:id/branch-stock")
  async getBranchStockView(@Param("id") id: string) {
    return this.inventoryService.getBranchStockView(id);
  }
}
