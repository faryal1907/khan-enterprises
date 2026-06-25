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

    const expense = await this.prisma.client.expense.create({
      data: {
        ...createExpenseDto,
        recordedById: user.id,
      },
    });

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
