import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, Query } from "@nestjs/common";
import { AccountingService } from "./accounting.service";
import { PurchaseOrdersService } from "./purchase-orders.service";
import { PayablesService } from "./payables.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole, AccountCategory, AccountSubtype } from "@khan/prisma";

@Controller('accounting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountingController {
  constructor(
    private readonly accountingService: AccountingService,
    private readonly purchaseOrdersService: PurchaseOrdersService,
    private readonly payablesService: PayablesService,
  ) {}

  @Get('accounts')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getAccounts() {
    return this.accountingService.getAccounts();
  }

  @Post('accounts')
  @Roles(UserRole.ADMIN)
  async createAccount(@Body() data: { code: string; name: string; category: string; subtype: string; accountNumber?: string; openingBalance?: number }) {
    return this.accountingService.createAccount({
      ...data,
      category: data.category as AccountCategory,
      subtype: data.subtype as AccountSubtype
    });
  }

  @Patch('accounts/:id')
  @Roles(UserRole.ADMIN)
  async updateAccount(@Param('id') id: string, @Body() data: { name?: string; code?: string; category?: string; subtype?: string }) {
    return this.accountingService.updateAccount(id, {
      name: data.name,
      code: data.code,
      category: data.category as AccountCategory | undefined,
      subtype: data.subtype as AccountSubtype | undefined
    });
  }

  @Delete('accounts/:id')
  @Roles(UserRole.ADMIN)
  async deleteAccount(@Param('id') id: string) {
    return this.accountingService.deleteAccount(id);
  }

  @Get('accounts/:id/ledger')
  @Roles(UserRole.ADMIN)
  async getAccountLedger(@Param('id') id: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.accountingService.getAccountLedger(
      id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50
    );
  }

  @Get('accounts/:id/balance')
  @Roles(UserRole.ADMIN)
  async getAccountBalance(@Param('id') id: string) {
    return this.accountingService.getAccountBalance(id);
  }

  @Post('capital-contribution')
  @Roles(UserRole.ADMIN)
  async recordCapitalContribution(@Body() data: { destinationAccountId: string; amount: number; date: string; source?: string; reference?: string; notes?: string }) {
    return this.accountingService.recordCapitalContribution({
      ...data,
      date: this.parseDateLocal(data.date)
    });
  }

  @Post('owner-withdrawal')
  @Roles(UserRole.ADMIN)
  async recordOwnerWithdrawal(@Body() data: { sourceAccountId: string; amount: number; date: string; reason?: string; notes?: string }) {
    return this.accountingService.recordOwnerWithdrawal({
      ...data,
      date: this.parseDateLocal(data.date)
    });
  }

  @Post('internal-transfer')
  @Roles(UserRole.ADMIN)
  async recordInternalTransfer(@Body() data: { fromAccountId: string; toAccountId: string; amount: number; date: string; notes?: string }) {
    return this.accountingService.recordInternalTransfer({
      ...data,
      date: this.parseDateLocal(data.date)
    });
  }

  /** Parse a YYYY-MM-DD date string as noon UTC to avoid timezone-day-shift issues */
  private parseDateLocal(dateStr: string): Date {
    // Append T12:00:00Z so the date is stored as noon UTC — this way it
    // displays as the correct calendar day in any timezone (UTC+14 to UTC-12)
    return new Date(`${dateStr}T12:00:00Z`);
  }

  @Get('journals')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getJournals() {
    return this.accountingService.getJournalEntries();
  }

  @Post('journals')
  @Roles(UserRole.ADMIN)
  async createJournalEntry(@Body() data: { description: string, lines: { accountId: string, debit: number, credit: number }[] }) {
    return this.accountingService.createJournalEntry(data);
  }

  @Get('purchase-orders')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getPurchaseOrders() {
    return this.accountingService.getPurchaseOrders();
  }

  @Post('purchase-orders')
  @Roles(UserRole.ADMIN)
  async createPurchaseOrder(@Body() data: { vendorId: string; type: string; totalCost: number; items: any[] }) {
    return this.purchaseOrdersService.createPurchaseOrder(data);
  }

  @Post('purchase-orders/:id/receive')
  @Roles(UserRole.ADMIN)
  async receivePurchaseOrder(@Param('id') id: string, @Request() req: any) {
    return this.purchaseOrdersService.markAsReceived(id, req.user.id);
  }

  @Get('payables')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getPayables() {
    return this.accountingService.getPayables();
  }

  @Post('payables/:id/pay')
  @Roles(UserRole.ADMIN)
  async payPayable(
    @Param('id') id: string,
    @Body() data: { amount: number; paymentMethod: any },
    @Request() req: any
  ) {
    return this.payablesService.payPayable(id, data.amount, data.paymentMethod, req.user.id);
  }
}
