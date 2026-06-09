import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { BranchService } from "./branch.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("branches")
@UseGuards(JwtAuthGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  /**
   * GET /api/branches
   * Returns all branches with manager info and inventory/staff counts.
   */
  @Get()
  async getBranches() {
    const branches = await this.branchService.getAllBranches();
    return { count: branches.length, branches };
  }

  /**
   * GET /api/branches/:id
   * Returns a single branch with full detail including staff list.
   */
  @Get(":id")
  async getBranch(@Param("id") id: string) {
    const branch = await this.branchService.getBranchById(id);
    return { branch };
  }

  /**
   * POST /api/branches
   * Create a new branch. ADMIN only.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async createBranch(@Body() dto: any) {
    return this.branchService.createBranch(dto);
  }

  /**
   * PUT /api/branches/:id
   * Update a branch. ADMIN only.
   */
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async updateBranch(@Param("id") id: string, @Body() dto: any) {
    return this.branchService.updateBranch(id, dto);
  }

  /**
   * DELETE /api/branches/:id
   * Delete a branch. ADMIN only.
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async deleteBranch(@Param("id") id: string) {
    return this.branchService.deleteBranch(id);
  }

  /**
   * GET /api/branches/:id/metrics
   * Get branch performance metrics. ADMIN only.
   */
  @Get(":id/metrics")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async getBranchMetrics(@Param("id") id: string) {
    return this.branchService.getBranchMetrics(id);
  }

  /**
   * POST /api/branches/transfer
   * Transfer stock between branches. ADMIN only.
   */
  @Post("transfer")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async transferStock(@Body() dto: any) {
    return this.branchService.transferStock(dto);
  }
}
