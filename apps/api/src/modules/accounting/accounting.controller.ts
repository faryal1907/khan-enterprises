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
  async getJournals(
    @Query("dateFrom") dateFrom?: string,
    @Query("dateTo") dateTo?: string,
    @Query("journalType") journalType?: string,
    @Query("accountId") accountId?: string,
    @Query("vendorId") vendorId?: string,
    @Query("customerId") customerId?: string,
  ) {
    return this.accountingService.getJournalEntries({
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(new Date(dateTo).setHours(23, 59, 59, 999)) : undefined,
      journalType,
      accountId,
      vendorId,
      customerId,
    });
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
    @Body() data: { amount: number; paymentMethod: any; accountId?: string },
    @Request() req: any,
  ) {
    return this.payablesService.payPayable(
      id,
      data.amount,
      data.paymentMethod,
      req.user.id,
      data.accountId,
    );
  }

  @Post("payables/payee/:payeeAccountId/pay")
  @Roles(UserRole.ADMIN)
  async payPayablesByPayeeAccountId(
    @Param("payeeAccountId") payeeAccountId: string,
    @Body() data: { amount: number; paymentMethod: any; accountId?: string },
    @Request() req: any,
  ) {
    return this.payablesService.payPayablesByPayeeAccountId(
      payeeAccountId,
      data.amount,
      data.paymentMethod,
      req.user.id,
      data.accountId,
    );
  }

  @Post("payables/payments/:paymentId/undo")
  @Roles(UserRole.ADMIN)
  async undoPayablePayment(
    @Param("paymentId") paymentId: string,
    @Request() req: any,
  ) {
    return this.payablesService.undoPayablePayment(paymentId, req.user.id);
  }

  @Post("payables/:payableId/undo-all")
  @Roles(UserRole.ADMIN)
  async undoPayableAllPayments(
    @Param("payableId") payableId: string,
    @Request() req: any,
  ) {
    return this.payablesService.undoPayableAllPayments(payableId, req.user.id);
  }

  @Post("payables/payee/:payeeAccountId/undo-all")
  @Roles(UserRole.ADMIN)
  async undoPayablePaymentsByPayeeAccountId(
    @Param("payeeAccountId") payeeAccountId: string,
    @Request() req: any,
  ) {
    return this.payablesService.undoPayablePaymentsByPayeeAccountId(payeeAccountId, req.user.id);
  }

  @Delete("payables/:payableId")
  @Roles(UserRole.ADMIN)
  async deletePayable(@Param("payableId") payableId: string) {
    return this.payablesService.deletePayable(payableId);
  }

  @Delete("payables/payee/:payeeId")
  @Roles(UserRole.ADMIN)
  async deletePayablesByPayee(@Param("payeeId") payeeId: string) {
    return this.payablesService.deletePayablesByPayee(payeeId);
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

  @Get("receivables/parties")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getParties() {
    return this.receivablesService.getParties();
  }

  @Post("receivables/parties")
  @Roles(UserRole.ADMIN)
  async createParty(@Body() data: { name: string; partyType?: string; phone?: string; email?: string; address?: string; notes?: string }) {
    return this.receivablesService.createParty(data as any);
  }

  @Delete("receivables/parties/:partyId")
  @Roles(UserRole.ADMIN)
  async deleteParty(@Param("partyId") partyId: string) {
    return this.receivablesService.deleteParty(partyId);
  }

  @Delete("receivables/entries/:entryId")
  @Roles(UserRole.ADMIN)
  async deleteReceivableEntry(@Param("entryId") entryId: string) {
    return this.receivablesService.deleteEntry(entryId);
  }

  @Post("receivables/entries")
  @Roles(UserRole.ADMIN)
  async createEntry(@Body() data: { partyId: string; amount: number; description: string; date: string; dueDate?: string; vendorId?: string }) {
    return this.receivablesService.createEntry(data);
  }

  @Get("receivables/parties/:partyId/ledger")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getPartyLedger(@Param("partyId") partyId: string) {
    return this.receivablesService.getPartyLedger(partyId);
  }

  @Post("receivables/parties/:partyId/collect")
  @Roles(UserRole.ADMIN)
  async collectFromParty(
    @Param("partyId") partyId: string,
    @Body() data: { amount: number; paymentMethod: string; notes?: string; accountId?: string },
    @Request() req: any,
  ) {
    return this.receivablesService.collectPayment(partyId, data.amount, data.paymentMethod, req.user.id, data.notes, data.accountId);
  }

  // ─── Legacy phone-based routes (kept for existing order flows) ────────────

  @Get("receivables/:customerPhone/ledger")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getCustomerLedger(@Param("customerPhone") customerPhone: string) {
    return this.receivablesService.getCustomerLedger(customerPhone);
  }

  @Get("receivables/:customerPhone/statement")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getCustomerStatement(@Param("customerPhone") customerPhone: string) {
    return this.receivablesService.getCustomerStatement(customerPhone);
  }

  @Post("receivables/:customerPhone/collect")
  @Roles(UserRole.ADMIN)
  async collectReceivable(
    @Param("customerPhone") customerPhone: string,
    @Body() data: { amount: number; paymentMethod: string; notes?: string; accountId?: string },
    @Request() req: any,
  ) {
    return this.receivablesService.collectPaymentByPhone(customerPhone, data.amount, data.paymentMethod, req.user.id, data.notes, data.accountId);
  }

  // ─── Undo Operations ─────────────────────────────────────────────────────────

  @Post("receivables/payments/:receivablePaymentId/undo")
  @Roles(UserRole.ADMIN)
  async undoReceivablePayment(
    @Param("receivablePaymentId") receivablePaymentId: string,
    @Request() req: any,
  ) {
    return this.receivablesService.undoReceivablePayment(receivablePaymentId, req.user.id);
  }

  @Post("receivables/orders/:orderId/payments/:paymentId/undo")
  @Roles(UserRole.ADMIN)
  async undoOrderPayment(
    @Param("orderId") orderId: string,
    @Param("paymentId") paymentId: string,
    @Request() req: any,
  ) {
    return this.receivablesService.undoOrderPayment(orderId, paymentId, req.user.id);
  }

  @Post("receivables/part-orders/:partOrderId/payments/:paymentId/undo")
  @Roles(UserRole.ADMIN)
  async undoPartOrderPayment(
    @Param("partOrderId") partOrderId: string,
    @Param("paymentId") paymentId: string,
    @Request() req: any,
  ) {
    return this.receivablesService.undoPartOrderPayment(partOrderId, paymentId, req.user.id);
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  /** Parse a YYYY-MM-DD string as noon UTC to avoid timezone day-shift issues */
  private parseDateLocal(dateStr: string): Date {
    return new Date(`${dateStr}T12:00:00Z`);
  }
}
