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
  Query,
} from "@nestjs/common";
import { AccountingService } from "./accounting.service";
import { PayablesService } from "./payables.service";
import { ReceivablesService } from "./receivables.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole, AccountCategory, AccountSubtype } from "@khan/prisma";

@Controller("accounting")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountingController {
  constructor(
    private readonly accountingService: AccountingService,
    private readonly payablesService: PayablesService,
    private readonly receivablesService: ReceivablesService,
  ) {}

  // ─── Chart of Accounts ───────────────────────────────────────────────────

  @Get("accounts")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getAccounts() {
    return this.accountingService.getAccounts();
  }

  @Post("accounts")
  @Roles(UserRole.ADMIN)
  async createAccount(
    @Body()
    data: {
      code: string;
      name: string;
      category: string;
      subtype: string;
      accountNumber?: string;
      openingBalance?: number;
    },
  ) {
    return this.accountingService.createAccount({
      ...data,
      category: data.category as AccountCategory,
      subtype: data.subtype as AccountSubtype,
    });
  }

  @Patch("accounts/:id")
  @Roles(UserRole.ADMIN)
  async updateAccount(
    @Param("id") id: string,
    @Body()
    data: { name?: string; code?: string; category?: string; subtype?: string },
  ) {
    return this.accountingService.updateAccount(id, {
      name: data.name,
      code: data.code,
      category: data.category as AccountCategory | undefined,
      subtype: data.subtype as AccountSubtype | undefined,
    });
  }

  @Delete("accounts/:id")
  @Roles(UserRole.ADMIN)
  async deleteAccount(
    @Param("id") id: string,
    @Body() body: { transferAccountId?: string },
  ) {
    return this.accountingService.deleteAccount(id, body?.transferAccountId);
  }

  @Get("accounts/:id/ledger")
  @Roles(UserRole.ADMIN)
  async getAccountLedger(
    @Param("id") id: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.accountingService.getAccountLedger(
      id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get("accounts/:id/balance")
  @Roles(UserRole.ADMIN)
  async getAccountBalance(@Param("id") id: string) {
    return this.accountingService.getAccountBalance(id);
  }

  // ─── Owner Equity ─────────────────────────────────────────────────────────

  @Post("capital-contribution")
  @Roles(UserRole.ADMIN)
  async recordCapitalContribution(
    @Body()
    data: {
      destinationAccountId: string;
      amount: number;
      date: string;
      source?: string;
      reference?: string;
      notes?: string;
    },
  ) {
    return this.accountingService.recordCapitalContribution({
      ...data,
      date: this.parseDateLocal(data.date),
    });
  }

  @Post("owner-withdrawal")
  @Roles(UserRole.ADMIN)
  async recordOwnerWithdrawal(
    @Body()
    data: {
      sourceAccountId: string;
      amount: number;
      date: string;
      reason?: string;
      notes?: string;
    },
  ) {
    return this.accountingService.recordOwnerWithdrawal({
      ...data,
      date: this.parseDateLocal(data.date),
    });
  }

  @Post("internal-transfer")
  @Roles(UserRole.ADMIN)
  async recordInternalTransfer(
    @Body()
    data: {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
      date: string;
      notes?: string;
    },
  ) {
    return this.accountingService.recordInternalTransfer({
      ...data,
      date: this.parseDateLocal(data.date),
    });
  }

  // ─── Journal Entries ──────────────────────────────────────────────────────

  @Get("journals")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getJournals() {
    return this.accountingService.getJournalEntries();
  }

  @Post("journals")
  @Roles(UserRole.ADMIN)
  async createJournalEntry(
    @Body()
    data: {
      description: string;
      lines: { accountId: string; debit: number; credit: number }[];
    },
  ) {
    return this.accountingService.createJournalEntry(data);
  }

  // ─── Payables (non-vendor: expenses, salary, loans) ──────────────────────

  @Get("payables")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getPayables() {
    return this.accountingService.getPayables();
  }

  @Post("payables/:id/pay")
  @Roles(UserRole.ADMIN)
  async payPayable(
    @Param("id") id: string,
    @Body() data: { amount: number; paymentMethod: any },
    @Request() req: any,
  ) {
    return this.payablesService.payPayable(
      id,
      data.amount,
      data.paymentMethod,
      req.user.id,
    );
  }

  // ─── Receivables ──────────────────────────────────────────────────────────

  @Get("receivables")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getReceivables() {
    return this.receivablesService.getReceivables();
  }

  @Get("receivables/payment-accounts")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getPaymentAccounts() {
    return this.receivablesService.getPaymentAccounts();
  }

  @Get("receivables/:customerPhone/ledger")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getCustomerLedger(
    @Param("customerPhone") customerPhone: string,
  ) {
    return this.receivablesService.getCustomerLedger(customerPhone);
  }

  @Get("receivables/:customerPhone/statement")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getCustomerStatement(
    @Param("customerPhone") customerPhone: string,
  ) {
    return this.receivablesService.getCustomerStatement(customerPhone);
  }

  @Post("receivables/:customerPhone/collect")
  @Roles(UserRole.ADMIN)
  async collectReceivable(
    @Param("customerPhone") customerPhone: string,
    @Body()
    data: {
      amount: number;
      paymentMethod: string;
      notes?: string;
      accountId?: string;
    },
    @Request() req: any,
  ) {
    return this.receivablesService.collectPayment(
      customerPhone,
      data.amount,
      data.paymentMethod,
      req.user.id,
      data.notes,
      data.accountId,
    );
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  /** Parse a YYYY-MM-DD string as noon UTC to avoid timezone day-shift issues */
  private parseDateLocal(dateStr: string): Date {
    return new Date(`${dateStr}T12:00:00Z`);
  }
}
