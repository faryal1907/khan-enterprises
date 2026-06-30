import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { AuditAction, UserRole } from '@khan/prisma';
@Injectable()
export class ExpensesService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, user: any, ipAddress?: string) {
    if (user.role === UserRole.MANAGER && createExpenseDto.branchId !== user.branchId) {
      throw new ForbiddenException('Managers can only create expenses for their own branch');
    }

    // Verify branch exists
    const branch = await this.prisma.client.branch.findUnique({
      where: { id: createExpenseDto.branchId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    const { paymentAccountId, ...expenseData } = createExpenseDto;

    const expense = await this.prisma.client.expense.create({
      data: {
        ...expenseData,
        recordedById: user.id,
      },
    });

    // Accounting Entry for the Expense
    const isSalary = expenseData.category === 'SALARY';
    const expenseAccountCode = isSalary ? '5002' : '5003';
    
    const expenseAccount = await this.prisma.client.account.findUnique({
      where: { code: expenseAccountCode }
    });

    if (expenseAccount) {
    await this.prisma.client.journalEntry.create({
        data: {
          entryNo: `JV-EXP-${expense.id}`,
          date: new Date(expenseData.date),
          description: expenseData.description || `Expense - ${expenseData.category}`,
          sourceRef: expense.id,
          status: 'POSTED',
          lines: {
            create: [
              { accountId: expenseAccount.id, debit: expenseData.amount, credit: 0 },
              { accountId: paymentAccountId, debit: 0, credit: expenseData.amount },
            ]
          }
        }
      });
    }

    await this.auditLogsService.logAction(
      user.id,
      AuditAction.CREATE,
      'Expense',
      expense.id,
      null,
      expense,
      ipAddress,
    );

    return expense;
  }

  async findAll(user: any, filters: { branchId?: string; dateFrom?: string; dateTo?: string }) {
    const where: any = {};

    if (user.role === UserRole.MANAGER) {
      where.branchId = user.branchId;
    } else if (filters.branchId) {
      where.branchId = filters.branchId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.date.lte = new Date(filters.dateTo);
    }

    const expenses = await this.prisma.client.expense.findMany({
      where,
      include: {
        branch: { select: { name: true } },
        recordedBy: { select: { fullName: true } },
      },
      orderBy: { date: 'desc' },
    });

    return expenses;
  }
}
