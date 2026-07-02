import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "@khan/prisma";

@Controller("vendors")
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // ─── List all vendors (with prepaid balances) ─────────────────────────────
  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES_STAFF)
  async getVendors() {
    const vendors = await this.vendorService.getAllVendors();
    return { count: vendors.length, vendors };
  }

  // ─── Get single vendor detail + balance summary ───────────────────────────
  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getVendorDetail(@Param("id") id: string) {
    return this.vendorService.getVendorDetail(id);
  }

  // ─── Get full ledger (payments + allocations with running balance) ─────────
  @Get(":id/ledger")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getVendorLedger(@Param("id") id: string) {
    return this.vendorService.getVendorLedger(id);
  }

  // ─── Get current prepaid balance only ────────────────────────────────────
  @Get(":id/balance")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getVendorBalance(@Param("id") id: string) {
    const balance = await this.vendorService.getVendorBalance(id);
    return { vendorId: id, prepaidBalance: balance };
  }

  // ─── Create vendor ────────────────────────────────────────────────────────
  @Post()
  @Roles(UserRole.ADMIN)
  async createVendor(
    @Body()
    data: {
      name: string;
      contactPerson?: string;
      phoneNumber?: string;
      email?: string;
      address?: string;
    },
  ) {
    return this.vendorService.createVendor(data);
  }

  // ─── Update vendor ────────────────────────────────────────────────────────
  @Patch(":id")
  @Roles(UserRole.ADMIN)
  async updateVendor(
    @Param("id") id: string,
    @Body()
    data: {
      name?: string;
      contactPerson?: string;
      phoneNumber?: string;
      email?: string;
      address?: string;
    },
  ) {
    return this.vendorService.updateVendor(id, data);
  }

  // ─── Soft-delete vendor (only if prepaid balance is zero) ─────────────────
  @Delete(":id")
  @Roles(UserRole.ADMIN)
  async deleteVendor(@Param("id") id: string) {
    return this.vendorService.deleteVendor(id);
  }

  // ─── Record a payment TO a vendor ─────────────────────────────────────────
  // DR Vendor Prepaid / CR fromAccount
  @Post(":id/pay")
  @Roles(UserRole.ADMIN)
  async recordPayment(
    @Param("id") id: string,
    @Body()
    data: {
      fromAccountId: string;
      amount: number;
      date: string;
      notes?: string;
    },
    @Request() req: any,
  ) {
    return this.vendorService.recordPayment(id, data, req.user.id);
  }

  // ─── Allocate received inventory against vendor prepaid balance ───────────
  // DR Inventory / CR Vendor Prepaid
  @Post(":id/allocate")
  @Roles(UserRole.ADMIN)
  async allocateInventory(
    @Param("id") id: string,
    @Body()
    data: {
      branchId: string;
      date: string;
      notes?: string;
      bikes: { modelId: string; quantity: number; unitCost: number }[];
      parts: { partName: string; quantity: number; unitCost: number }[];
    },
    @Request() req: any,
  ) {
    return this.vendorService.allocateInventory(id, data, req.user.id);
  }

  // ─── Return defective inventory to vendor ───────────────────────────────
  // CR Inventory / DR Vendor Prepaid (increases vendor balance)
  @Post(":id/return-defective")
  @Roles(UserRole.ADMIN)
  async returnDefective(
    @Param("id") id: string,
    @Body()
    data: {
      bikeIds: string[];
      partReturns: { partInventoryId: string; quantity: number }[];
      date: string;
      notes?: string;
    },
    @Request() req: any,
  ) {
    return this.vendorService.returnDefectiveInventory(id, data, req.user.id);
  }

  // ─── Get vendor-allocated inventory eligible for return ───────────────────────
  // Bikes that were allocated from this vendor and are currently AVAILABLE
  // Parts that were allocated from this vendor and have stock > 0
  @Get(":id/returnable-inventory")
  @Roles(UserRole.ADMIN)
  async getReturnableInventory(@Param("id") id: string) {
    return this.vendorService.getReturnableInventory(id);
  }
}
