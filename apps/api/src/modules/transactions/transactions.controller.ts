import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
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
