import { Controller, Get, UseGuards } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("vendors")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "MANAGER", "SALES_STAFF")
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  /**
   * GET /api/vendors
   * Returns all vendors for dropdown reference.
   */
  @Get()
  async getVendors() {
    const vendors = await this.vendorService.getAllVendors();
    return { count: vendors.length, vendors };
  }
}
