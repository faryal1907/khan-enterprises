import { Controller, Get, Param, Post, Query, Res, UseGuards } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { QueryTransactionsDto } from "./dto/query-transactions.dto";
import { Response } from "express";

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
  async getAllTransactions(@Query() query: QueryTransactionsDto, @CurrentUser() user: any) {
    const transactions = await this.transactionsService.getAllTransactions(query, user);
    return { count: transactions.length, transactions };
  }

  /**
   * POST /api/transactions/:id/refund
   * Initiates a refund for a transaction
   */
  @Post(":id/refund")
  @Roles("ADMIN")
  async refundTransaction(
    @Param("id") id: string,
    @CurrentUser() user: any
  ) {
    return this.transactionsService.refundTransaction(id, user);
  }

  /**
   * GET /api/transactions/:id/receipt
   * Downloads the receipt (invoice) PDF for a transaction
   */
  @Get(":id/receipt")
  async getReceipt(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Res() res: Response
  ) {
    const stream = await this.transactionsService.getReceiptStream(id, user);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${id}.pdf"`,
    });
    stream.pipe(res);
  }

  /**
   * GET /api/transactions/:id
   * Returns a single transaction by ID
   */
  @Get(":id")
  async getTransaction(@Param("id") id: string, @CurrentUser() user: any) {
    return this.transactionsService.getTransactionById(id, user);
  }
}
