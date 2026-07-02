import { Controller, Post, Get, Body, Query, Param, UseGuards, Ip } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MANAGER')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

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
