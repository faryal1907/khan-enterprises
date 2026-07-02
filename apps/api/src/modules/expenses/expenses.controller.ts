import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  Param,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PayeeType } from '@khan/prisma';

@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MANAGER')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  // ─── Payee Accounts ────────────────────────────────────────────────────────

  @Get('payees')
  async getPayees() {
    return this.expensesService.getPayeeAccounts();
  }

  @Post('payees')
  @Roles('ADMIN')
  async createPayee(
    @Body()
    data: {
      name: string;
      type?: PayeeType;
      phone?: string;
      email?: string;
      address?: string;
      notes?: string;
    },
  ) {
    return this.expensesService.createPayeeAccount(data);
  }

  @Patch('payees/:id')
  @Roles('ADMIN')
  async updatePayee(
    @Param('id') id: string,
    @Body()
    data: {
      name?: string;
      type?: PayeeType;
      phone?: string;
      email?: string;
      address?: string;
      notes?: string;
    },
  ) {
    return this.expensesService.updatePayeeAccount(id, data);
  }

  @Get('payees/:id/ledger')
  async getPayeeLedger(@Param('id') id: string) {
    return this.expensesService.getPayeeLedger(id);
  }

  // ─── Payables grouped by payee ────────────────────────────────────────────

  @Get('payables-by-payee')
  async getPayablesByPayee(
    @CurrentUser() user: any,
    @Query('branchId') branchId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.expensesService.getPayablesGroupedByPayee({ branchId, dateFrom, dateTo });
  }

  // ─── Expenses CRUD ────────────────────────────────────────────────────────

  @Post()
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: any,
    @Ip() ipAddress: string,
  ) {
    return this.expensesService.create(createExpenseDto, user, ipAddress);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('branchId') branchId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.expensesService.findAll(user, { branchId, dateFrom, dateTo });
  }

  @Get(':id/payment-history')
  async getPaymentHistory(@Param('id') id: string) {
    return this.expensesService.getExpensePaymentHistory(id);
  }
}
