import { Controller, Get, Post, Param, Body, UseGuards, Request } from "@nestjs/common";
import { AccountingService } from "./accounting.service";
import { PurchaseOrdersService } from "./purchase-orders.service";
import { PayablesService } from "./payables.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "@khan/prisma";

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
