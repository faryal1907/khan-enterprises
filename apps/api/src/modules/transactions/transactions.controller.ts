import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("transactions")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "MANAGER", "SALES_STAFF")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * GET /api/transactions
   * Returns all payment transactions
   */
  @Get()
  async getAllTransactions() {
    const transactions = await this.transactionsService.getAllTransactions();
    return { count: transactions.length, transactions };
  }

  /**
   * GET /api/transactions/:id
   * Returns a single transaction by ID
   */
  @Get(":id")
  async getTransaction(@Param("id") id: string) {
    return this.transactionsService.getTransactionById(id);
  }
}
