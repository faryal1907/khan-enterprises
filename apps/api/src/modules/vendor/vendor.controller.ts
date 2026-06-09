import { Controller, Get, UseGuards } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("vendors")
@UseGuards(JwtAuthGuard)
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
