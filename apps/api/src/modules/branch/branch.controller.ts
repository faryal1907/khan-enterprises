import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { BranchService } from "./branch.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

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
}
