import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { AuditAction, UserRole, PaymentState, PayeeType } from '@khan/prisma';

@Injectable()
export class ExpensesService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService,
  ) {}

  // ─── Payee Accounts ────────────────────────────────────────────────────────

  async getPayeeAccounts() {
    return this.prisma.client.payeeAccount.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async createPayeeAccount(data: {
    name: string;
    type?: PayeeType;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
  }) {
    return this.prisma.client.payeeAccount.create({ data });
  }

  async updatePayeeAccount(
    id: string,
    data: {
      name?: string;
      type?: PayeeType;
      phone?: string;
      email?: string;
      address?: string;
      notes?: string;
    },
  ) {
    const payee = await this.prisma.client.payeeAccount.findUnique({ where: { id } });
    if (!payee) throw new NotFoundException('Payee account not found');
    return this.prisma.client.payeeAccount.update({ where: { id }, data });
  }

  /**
   * Get the full payable ledger for a payee account.
   * Returns all expenses grouped under this payee with running outstanding balance.
   */
  async getPayeeLedger(payeeAccountId: string) {
    const payee = await this.prisma.client.payeeAccount.findUnique({
      where: { id: payeeAccountId },
    });
    if (!payee) throw new NotFoundException('Payee account not found');

    // Get all expenses for this payee
    const expenses = await this.prisma.client.expense.findMany({
      where: { payeeAccountId },
      include: {
        branch: { select: { name: true } },
        recordedBy: { select: { fullName: true } },
      },
      orderBy: { date: 'asc' },
    });

    // Get all payables linked to these expenses
    const expenseIds = expenses.map((e) => e.id);
    const payables = expenseIds.length
      ? await this.prisma.client.payable.findMany({
          where: { expenseId: { in: expenseIds } },
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
        })
      : [];

    const payableByExpenseId = new Map(payables.map((p) => [p.expenseId!, p]));

    // Build running ledger entries
    type LedgerEntry = {
      date: Date;
      type: 'EXPENSE' | 'PAYMENT';
      ref: string;
      description: string;
      expenseId?: string;
      category?: string;
      branch?: string;
      recordedBy?: string;
      amount: number;   // expense amount (debit to payee)
      payment?: number; // payment amount (credit to payee)
      balance: number;
    };

    let runningBalance = 0;
    const entries: LedgerEntry[] = [];

    // For each expense, add an EXPENSE entry then all its payment entries (sorted by date)
    for (const exp of expenses) {
      const payable = payableByExpenseId.get(exp.id);
      const expAmount = Number(exp.amount);
      runningBalance += expAmount;

      entries.push({
        date: exp.date,
        type: 'EXPENSE',
        ref: `EXP-${exp.id.substring(0, 8).toUpperCase()}`,
        description: exp.description || exp.category.replace(/_/g, ' '),
        expenseId: exp.id,
        category: exp.category,
        branch: exp.branch?.name,
        recordedBy: exp.recordedBy?.fullName,
        amount: expAmount,
        balance: runningBalance,
      });

      if (payable) {
        for (const alloc of payable.allocations) {
          const pmtAmount = Number(alloc.allocatedAmount);
          runningBalance -= pmtAmount;
          entries.push({
            date: alloc.payment.createdAt,
            type: 'PAYMENT',
            ref: `PMT-${alloc.id.substring(0, 8).toUpperCase()}`,
            description: `Payment via ${alloc.payment.method === 'ONLINE_TRANSFER' ? 'Bank Transfer' : 'Cash'}${alloc.payment.account ? ` (${alloc.payment.account.name})` : ''}`,
            amount: 0,
            payment: pmtAmount,
            balance: runningBalance,
          });
        }
      }
    }

    // Sort all entries chronologically
    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Recompute running balance after sort
    let bal = 0;
    for (const entry of entries) {
      if (entry.type === 'EXPENSE') {
        bal += entry.amount;
      } else {
        bal -= entry.payment ?? 0;
      }
      entry.balance = bal;
    }

    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const totalPaid = payables.reduce((s, p) => s + Number(p.paid), 0);
    const totalOutstanding = totalExpenses - totalPaid;

    // Build a flat expense summary list (used by the Pay button in the frontend)
    const expenseSummaryList = expenses.map((exp) => {
      const payable = payableByExpenseId.get(exp.id);
      return {
        id: exp.id,
        date: exp.date,
        category: exp.category,
        description: exp.description,
        amount: Number(exp.amount),
        paid: payable ? Number(payable.paid) : 0,
        remaining: payable ? Number(payable.remaining) : Number(exp.amount),
        status: payable?.status ?? 'DUE',
        payableId: payable?.id ?? null,
        branch: exp.branch?.name ?? null,
        recordedBy: exp.recordedBy?.fullName ?? null,
      };
    });

    return {
      payee: {
        id: payee.id,
        name: payee.name,
        type: payee.type,
        phone: payee.phone,
        email: payee.email,
      },
      summary: {
        totalExpenses,
        totalPaid,
        totalOutstanding,
        expenseCount: expenses.length,
      },
      entries,
      expenses: expenseSummaryList,
    };
  }

  // ─── Payables list grouped by payee ────────────────────────────────────────

  /**
   * Returns all payee accounts with aggregated outstanding/paid/total,
   * mirroring how Receivables groups by customer.
   */
  async getPayablesGroupedByPayee(filters: { branchId?: string; dateFrom?: string; dateTo?: string }) {
    const expenseWhere: any = {};
    if (filters.branchId) expenseWhere.branchId = filters.branchId;
    if (filters.dateFrom || filters.dateTo) {
      expenseWhere.date = {};
      if (filters.dateFrom) expenseWhere.date.gte = new Date(filters.dateFrom);
      if (filters.dateTo) expenseWhere.date.lte = new Date(filters.dateTo);
    }

    // Get all expenses with payee info
    const expenses = await this.prisma.client.expense.findMany({
      where: { ...expenseWhere, payeeAccountId: { not: null } },
      include: {
        payeeAccount: true,
        branch: { select: { name: true } },
        recordedBy: { select: { fullName: true } },
      },
      orderBy: { date: 'desc' },
    });

    // Get payables for these expenses
    const expenseIds = expenses.map((e) => e.id);
    const payables = expenseIds.length
      ? await this.prisma.client.payable.findMany({
          where: { expenseId: { in: expenseIds } },
          select: { expenseId: true, total: true, paid: true, remaining: true, status: true, id: true },
        })
      : [];

    const payableByExpId = new Map(payables.map((p) => [p.expenseId!, p]));

    // Group by payee
    type PayeeGroup = {
      payeeId: string;
      payeeName: string;
      payeeType: string;
      payeePhone: string | null;
      totalExpenses: number;
      totalPaid: number;
      totalOutstanding: number;
      expenseCount: number;
      lastExpenseDate: Date;
      status: 'DUE' | 'PARTIAL' | 'PAID';
      expenses: any[];
    };

    const payeeMap = new Map<string, PayeeGroup>();

    for (const exp of expenses) {
      if (!exp.payeeAccount) continue;
      const payable = payableByExpId.get(exp.id);
      const expAmount = Number(exp.amount);
      const expPaid = payable ? Number(payable.paid) : 0;
      const expRemaining = payable ? Number(payable.remaining) : expAmount;
      const expStatus = payable?.status ?? 'DUE';

      const existing = payeeMap.get(exp.payeeAccountId!);
      const expDetail = {
        id: exp.id,
        date: exp.date,
        category: exp.category,
        description: exp.description,
        amount: expAmount,
        paid: expPaid,
        remaining: expRemaining,
        status: expStatus,
        branch: exp.branch?.name,
        recordedBy: exp.recordedBy?.fullName,
        payableId: payable?.id ?? null,
      };

      if (existing) {
        existing.totalExpenses += expAmount;
        existing.totalPaid += expPaid;
        existing.totalOutstanding += expRemaining;
        existing.expenseCount += 1;
        if (new Date(exp.date) > existing.lastExpenseDate) {
          existing.lastExpenseDate = new Date(exp.date);
        }
        existing.expenses.push(expDetail);
        // Update status: DUE > PARTIAL > PAID
        if (expStatus === 'DUE' && existing.status === 'PAID') existing.status = 'DUE';
        if (expStatus === 'PARTIAL' && existing.status === 'PAID') existing.status = 'PARTIAL';
        if (expStatus === 'DUE' && existing.status === 'PARTIAL') existing.status = 'DUE';
      } else {
        payeeMap.set(exp.payeeAccountId!, {
          payeeId: exp.payeeAccountId!,
          payeeName: exp.payeeAccount.name,
          payeeType: exp.payeeAccount.type,
          payeePhone: exp.payeeAccount.phone,
          totalExpenses: expAmount,
          totalPaid: expPaid,
          totalOutstanding: expRemaining,
          expenseCount: 1,
          lastExpenseDate: new Date(exp.date),
          status: expStatus === 'PAID' ? 'PAID' : expStatus === 'PARTIAL' ? 'PARTIAL' : 'DUE',
          expenses: [expDetail],
        });
      }
    }

    // Recalculate status based on totals
    const result = Array.from(payeeMap.values()).map((g) => ({
      ...g,
      status: g.totalOutstanding <= 0 ? 'PAID' : g.totalOutstanding < g.totalExpenses ? 'PARTIAL' : 'DUE',
    }));

    return result;
  }

  // ─── Create Expense ────────────────────────────────────────────────────────

  async create(createExpenseDto: CreateExpenseDto, user: any, ipAddress?: string) {
    if (user.role === UserRole.MANAGER && createExpenseDto.branchId !== user.branchId) {
      throw new ForbiddenException('Managers can only create expenses for their own branch');
    }

    const branch = await this.prisma.client.branch.findUnique({
      where: { id: createExpenseDto.branchId },
    });
    if (!branch) throw new NotFoundException('Branch not found');

    const payee = await this.prisma.client.payeeAccount.findUnique({
      where: { id: createExpenseDto.payeeAccountId },
    });
    if (!payee) throw new NotFoundException('Payee account not found');
    if (!payee.isActive) throw new BadRequestException('Payee account is inactive');

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
          amount: expenseData.amount,
          date: expenseDate,
          category: expenseData.category,
          description: expenseData.description,
          branchId: expenseData.branchId,
          payeeAccountId: expenseData.payeeAccountId,
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

      // Create a Payable record
      const payableRef = `EXP-${expense.id.substring(0, 8).toUpperCase()}`;
      const payable = await tx.payable.create({
        data: {
          ref: payableRef,
          type: 'EXPENSE',
          partyName: payee.name,
          description: expenseData.description || null,
          total: amount,
          paid: initialPaid,
          remaining: initialRemaining,
          dueDate: expenseDate,
          status: initialStatus,
          expenseId: expense.id,
        },
      });

      // Post journal entry
      if (payNow && paymentAccountId && initialPaid > 0 && expenseAccount) {
        // DR Expense account / CR Payment account (paid now)
        await tx.journalEntry.create({
          data: {
            entryNo: `JV-EXP-${expense.id.substring(0, 8)}`,
            date: expenseDate,
            description: `${expenseData.description || expenseData.category} — Paid to ${payee.name}`,
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
              description: `${expenseData.description || expenseData.category} (unpaid) — ${payee.name}`,
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

  // ─── Find All ──────────────────────────────────────────────────────────────

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
        payeeAccount: { select: { id: true, name: true, type: true } },
      },
      orderBy: { date: 'desc' },
    });

    // Attach payable info via direct expenseId FK
    const expenseIds = expenses.map((e) => e.id);
    const payables = expenseIds.length
      ? await this.prisma.client.payable.findMany({
          where: { expenseId: { in: expenseIds } },
          select: { expenseId: true, total: true, paid: true, remaining: true, status: true, id: true },
        })
      : [];

    const payableByExpId = new Map(payables.map((p) => [p.expenseId!, p]));

    return expenses.map((exp) => {
      const payable = payableByExpId.get(exp.id) ?? null;
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

  // ─── Payment History (per-expense) ────────────────────────────────────────

  async getExpensePaymentHistory(expenseId: string) {
    const expense = await this.prisma.client.expense.findUnique({
      where: { id: expenseId },
      include: {
        branch: { select: { name: true } },
        recordedBy: { select: { fullName: true } },
        payeeAccount: { select: { id: true, name: true, type: true } },
      },
    });

    if (!expense) throw new NotFoundException('Expense not found');

    const payable = await this.prisma.client.payable.findFirst({
      where: { expenseId },
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
