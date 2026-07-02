import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { AuditAction, UserRole, PaymentState } from '@khan/prisma';

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

    const branch = await this.prisma.client.branch.findUnique({
      where: { id: createExpenseDto.branchId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    const { paymentAccountId, payNow, ...expenseData } = createExpenseDto;
    const amount = expenseData.amount;
    const expenseDate = new Date(expenseData.date);

    // Determine expense account code (salary vs general)
    const isSalary = expenseData.category === 'SALARY';
    const expenseAccountCode = isSalary ? '5002' : '5003';
    const expenseAccount = await this.prisma.client.account.findUnique({
      where: { code: expenseAccountCode },
    });

    const result = await this.prisma.client.$transaction(async (tx) => {
      // Create the core expense record
      const expense = await tx.expense.create({
        data: {
          ...expenseData,
          recordedById: user.id,
        },
      });

      // Determine initial payment state
      const initialPaid = (payNow && paymentAccountId) ? amount : 0;
      const initialRemaining = amount - initialPaid;
      const initialStatus: PaymentState =
        initialPaid >= amount
          ? PaymentState.PAID
          : initialPaid > 0
          ? PaymentState.PARTIAL
          : PaymentState.DUE;

      // Create a Payable record so partial payments can be tracked
      const payableRef = `EXP-${expense.id.substring(0, 8).toUpperCase()}`;
      const payable = await tx.payable.create({
        data: {
          ref: payableRef,
          type: 'EXPENSE',
          partyName: expenseData.description || expenseData.category,
          description: expenseData.description || null,
          total: amount,
          paid: initialPaid,
          remaining: initialRemaining,
          dueDate: expenseDate,
          status: initialStatus,
        },
      });

      // If paying now (full or partial upfront payment), post the journal entry
      if (payNow && paymentAccountId && initialPaid > 0 && expenseAccount) {
        // DR Expense account / CR Payment account
        await tx.journalEntry.create({
          data: {
            entryNo: `JV-EXP-${expense.id.substring(0, 8)}`,
            date: expenseDate,
            description: expenseData.description || `Expense - ${expenseData.category}`,
            sourceRef: expense.id,
            status: 'POSTED',
            lines: {
              create: [
                { accountId: expenseAccount.id, debit: initialPaid, credit: 0 },
                { accountId: paymentAccountId, debit: 0, credit: initialPaid },
              ],
            },
          },
        });
      } else if (!payNow && expenseAccount) {
        // Expense on credit — DR Expense account / CR Accounts Payable (AP)
        const apAccount = await tx.account.findFirst({ where: { subtype: 'AP' } });
        if (apAccount) {
          await tx.journalEntry.create({
            data: {
              entryNo: `JV-EXP-${expense.id.substring(0, 8)}`,
              date: expenseDate,
              description: expenseData.description || `Expense (unpaid) - ${expenseData.category}`,
              sourceRef: expense.id,
              status: 'POSTED',
              lines: {
                create: [
                  { accountId: expenseAccount.id, debit: amount, credit: 0 },
                  { accountId: apAccount.id, debit: 0, credit: amount },
                ],
              },
            },
          });
        }
      }

      return { expense, payable };
    });

    await this.auditLogsService.logAction(
      user.id,
      AuditAction.CREATE,
      'Expense',
      result.expense.id,
      null,
      result.expense,
      ipAddress,
    );

    return { ...result.expense, payable: result.payable };
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

    // Attach payable info (status, paid, remaining) to each expense
    const expenseIds = expenses.map((e) => e.id);
    const payables = expenseIds.length
      ? await this.prisma.client.payable.findMany({
          where: {
            ref: { in: expenseIds.map((id) => `EXP-${id.substring(0, 8).toUpperCase()}`) },
          },
          select: { ref: true, total: true, paid: true, remaining: true, status: true, id: true },
        })
      : [];

    const payableByRef = new Map(payables.map((p) => [p.ref, p]));

    return expenses.map((exp) => {
      const ref = `EXP-${exp.id.substring(0, 8).toUpperCase()}`;
      const payable = payableByRef.get(ref) ?? null;
      return {
        ...exp,
        payable: payable
          ? {
              id: payable.id,
              total: Number(payable.total),
              paid: Number(payable.paid),
              remaining: Number(payable.remaining),
              status: payable.status,
            }
          : null,
      };
    });
  }

  /**
   * Get expense payment history — all journal entries linked to an expense's payable.
   */
  async getExpensePaymentHistory(expenseId: string) {
    const expense = await this.prisma.client.expense.findUnique({
      where: { id: expenseId },
      include: {
        branch: { select: { name: true } },
        recordedBy: { select: { fullName: true } },
      },
    });

    if (!expense) throw new NotFoundException('Expense not found');

    const ref = `EXP-${expenseId.substring(0, 8).toUpperCase()}`;
    const payable = await this.prisma.client.payable.findFirst({
      where: { ref },
      include: {
        allocations: {
          include: {
            payment: {
              include: { account: { select: { name: true, subtype: true } } },
            },
          },
          orderBy: { payment: { createdAt: 'asc' } },
        },
      },
    });

    // Also fetch journal entries by sourceRef to show accounting entries
    const journals = await this.prisma.client.journalEntry.findMany({
      where: { sourceRef: expenseId },
      include: { lines: { include: { account: { select: { name: true, code: true } } } } },
      orderBy: { date: 'asc' },
    });

    return {
      expense: {
        ...expense,
        amount: Number(expense.amount),
      },
      payable: payable
        ? {
            id: payable.id,
            ref: payable.ref,
            total: Number(payable.total),
            paid: Number(payable.paid),
            remaining: Number(payable.remaining),
            status: payable.status,
          }
        : null,
      payments: (payable?.allocations ?? []).map((alloc) => ({
        id: alloc.id,
        amount: Number(alloc.allocatedAmount),
        method: alloc.payment.method,
        account: alloc.payment.account?.name ?? '—',
        date: alloc.payment.createdAt,
      })),
      journals,
    };
  }
}
