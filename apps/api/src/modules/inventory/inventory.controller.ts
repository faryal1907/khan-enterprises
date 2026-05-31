import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

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
}
