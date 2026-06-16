import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { BranchService } from "./branch.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("branches")
@UseGuards(JwtAuthGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  /**
   * GET /api/branches
   * Returns all branches with manager info and inventory/staff counts.
   */
  @Get()
  async getBranches(@CurrentUser() user: any) {
    const branches = await this.branchService.getAllBranches(user);
    return { count: branches.length, branches };
  }

  /**
   * GET /api/branches/:id
   * Returns a single branch with full detail including staff list.
   */
  @Get(":id")
  async getBranch(@Param("id") id: string, @CurrentUser() user: any) {
    const branch = await this.branchService.getBranchById(id, user);
    return { branch };
  }

  /**
   * POST /api/branches
   * Create a new branch. ADMIN only.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async createBranch(@Body() dto: any, @CurrentUser() admin: any) {
    return this.branchService.createBranch(dto, admin.id);
  }

  /**
   * PUT /api/branches/:id
   * Update a branch. ADMIN only.
   */
  @Put(":id")
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async updateBranch(@Param("id") id: string, @Body() dto: any, @CurrentUser() admin: any) {
    return this.branchService.updateBranch(id, dto, admin.id);
  }

  /**
   * DELETE /api/branches/:id
   * Delete a branch. ADMIN only.
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async deleteBranch(@Param("id") id: string, @CurrentUser() admin: any) {
    return this.branchService.deleteBranch(id, admin.id);
  }

  /**
   * GET /api/branches/:id/metrics
   * Get branch performance metrics. ADMIN, MANAGER.
   */
  @Get(":id/metrics")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  async getBranchMetrics(@Param("id") id: string, @CurrentUser() user: any) {
    return this.branchService.getBranchMetrics(id, user);
  }

  /**
   * POST /api/branches/transfer
   * Transfer stock between branches. ADMIN only.
   */
  @Post("transfer")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async transferStock(@Body() dto: any, @CurrentUser() admin: any) {
    return this.branchService.transferStock(dto, admin.id);
  }
}
