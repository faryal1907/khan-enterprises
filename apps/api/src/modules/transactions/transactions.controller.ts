import { Controller, Get, Param, Post, Query, Res, UseGuards } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { QueryTransactionsDto } from "./dto/query-transactions.dto";
import { Response } from "express";
import { PdfService } from "../pdf/pdf.service";

@Controller("transactions")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "MANAGER", "SALES_STAFF")
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly pdfService: PdfService
  ) {}

  /**
   * GET /api/transactions
   * Returns all payment transactions
   */
  @Get()
  async getAllTransactions(@Query() query: QueryTransactionsDto) {
    return this.transactionsService.getTransactions(query);
  }

  /**
   * GET /api/transactions/:id
   * Returns a single transaction by ID
   */
  @Get(":id")
  async getTransaction(@Param("id") id: string, @CurrentUser() user: any) {
    return this.transactionsService.getTransactionById(id);
  }

  /**
   * GET /api/transactions/:id/receipt
   * Download receipt as PDF
   */
  @Get(":id/receipt")
  async downloadReceipt(@Param("id") id: string, @Res() res: Response) {
    const transaction = await this.transactionsService.getTransactionById(id);
    
    const pdfStream = this.pdfService.generateReceipt(transaction);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="receipt-${id}.pdf"`,
    });

    pdfStream.pipe(res);
  }
}