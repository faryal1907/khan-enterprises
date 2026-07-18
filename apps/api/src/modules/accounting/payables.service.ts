import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PaymentState, JournalStatus, AccountSubtype, UserRole, AuditAction } from "@khan/prisma";

@Injectable()
export class PayablesService {
  constructor(private readonly prisma: PrismaService) {}

  async deletePayable(payableId: string) {
    const payable = await this.prisma.client.payable.findUnique({
      where: { id: payableId },
      include: { allocations: true }
    });

    if (!payable) throw new NotFoundException('Payable not found');

    // Check if payable has any payment allocations (indicates payments made)
    if (payable.allocations.length > 0) {
      throw new BadRequestException('Cannot delete payable with payment transactions. Use undo functionality to reverse payments first.');
    }

    // Delete the payable
    await this.prisma.client.payable.delete({ where: { id: payableId } });

    return { success: true };
  }

  async deletePayablesByPayee(payeeId: string) {
    // Get all payables for this payee (via expenseId)
    const expenses = await this.prisma.client.expense.findMany({
      where: { payeeAccountId: payeeId },
      select: { id: true }
    });

    const expenseIds = expenses.map(e => e.id);

    if (expenseIds.length === 0) {
      throw new NotFoundException('No payables found for this payee');
    }

    const payables = await this.prisma.client.payable.findMany({
      where: { expenseId: { in: expenseIds } },
      include: { allocations: true }
    });

    // Check if any payable has payments
    const payablesWithPayments = payables.filter(p => p.allocations.length > 0);
    if (payablesWithPayments.length > 0) {
      throw new BadRequestException('Cannot delete payables with payment transactions. Use undo functionality to reverse payments first.');
    }

    // Delete all payables for this payee
    await this.prisma.client.payable.deleteMany({
      where: { expenseId: { in: expenseIds } }
    });

    return { success: true, deletedCount: payables.length };
  }

  async payPayable(
    payableId: string,
    amount: number,
    paymentMethod: any,
    userId: string,
    accountId?: string,
  ) {
    return this.prisma.client.$transaction(async (tx) => {
      const payable = await tx.payable.findUnique({
        where: { id: payableId }
      });

      if (!payable) throw new NotFoundException('Payable not found');
      if (amount > Number(payable.remaining)) throw new BadRequestException('Amount exceeds remaining balance');

      const newPaid = Number(payable.paid) + amount;
      const newRemaining = Number(payable.total) - newPaid;
      let newState: PaymentState = PaymentState.PARTIAL;
      if (newPaid >= Number(payable.total)) newState = PaymentState.PAID;

      await tx.payable.update({
        where: { id: payableId },
        data: {
          paid: newPaid,
          remaining: newRemaining,
          status: newState
        }
      });

      // Resolve source account: prefer explicit accountId, then fall back by method subtype
      let sourceAcc: any = null;
      if (accountId) {
        sourceAcc = await tx.account.findUnique({ where: { id: accountId } });
      } else {
        const sourceSubtype = paymentMethod === 'ONLINE_TRANSFER' ? AccountSubtype.BANK : AccountSubtype.CASH;
        sourceAcc = await tx.account.findFirst({ where: { subtype: sourceSubtype } });
      }

      const apAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AP } });

      const txRecord = await tx.paymentTransaction.create({
        data: {
          amount: amount,
          method: paymentMethod,
          status: 'SUCCESS',
          verifiedAt: new Date(),
          verifiedById: userId,
          accountId: sourceAcc?.id,
          processedById: userId,
          originalAmount: amount,
        }
      });

      await tx.paymentAllocation.create({
        data: {
          paymentId: txRecord.id,
          payableId: payableId,
          allocatedAmount: amount
        }
      });

      if (sourceAcc && apAcc) {
        await tx.journalEntry.create({
          data: {
            entryNo: `JV-OUT-${txRecord.id.substring(0, 8)}`,
            description: `Payment to ${payable.partyName} for ${payable.ref}`,
            sourceRef: txRecord.id,
            status: JournalStatus.POSTED,
            lines: {
              create: [
                { accountId: apAcc.id, debit: amount, credit: 0 },
                { accountId: sourceAcc.id, debit: 0, credit: amount },
              ]
            }
          }
        });
      }

      return txRecord;
    });
  }

  /**
   * Pay a payee by distributing an amount across their outstanding payables
   * (oldest first). Mirrors how receivable collections are distributed.
   */
  async payPayablesByPayeeAccountId(
    payeeAccountId: string,
    amount: number,
    paymentMethod: any,
    userId: string,
    accountId?: string,
  ) {
    if (amount <= 0) throw new BadRequestException('Amount must be greater than 0');

    // Validate source account up-front if provided
    if (accountId) {
      const acc = await this.prisma.client.account.findUnique({ where: { id: accountId } });
      if (!acc) throw new NotFoundException('Payment account not found');
    }

    // Traverse: PayeeAccount → Expense[] → Payable[] (outstanding, oldest first)
    const expenses = await this.prisma.client.expense.findMany({
      where: { payeeAccountId },
      select: { id: true },
    });
    const expenseIds = expenses.map((e) => e.id);

    const payables = await this.prisma.client.payable.findMany({
      where: { expenseId: { in: expenseIds }, remaining: { gt: 0 } },
      orderBy: { ref: 'asc' },
    });

    const totalOutstanding = payables.reduce((s, p) => s + Number(p.remaining), 0);
    if (totalOutstanding <= 0) throw new BadRequestException('No outstanding payables for this payee');
    if (amount > totalOutstanding) {
      throw new BadRequestException('Amount exceeds the total outstanding balance');
    }

    let remainingToPay = amount;
    for (const payable of payables) {
      if (remainingToPay <= 0) break;
      const payAmount = Math.min(Number(payable.remaining), remainingToPay);
      await this.payPayable(payable.id, payAmount, paymentMethod, userId, accountId);
      remainingToPay -= payAmount;
    }

    return { success: true, paid: amount };
  }

  async undoPayablePayment(paymentId: string, userId: string) {
    // Check if user is admin
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can undo payments');
    }

    return this.prisma.client.$transaction(async (tx) => {
      const payment = await tx.paymentTransaction.findUnique({
        where: { id: paymentId },
        include: {
          allocations: {
            include: {
              payable: true
            }
          }
        }
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      if (payment.isReversed) {
        throw new BadRequestException('Payment is already reversed');
      }

      if (payment.status !== 'SUCCESS') {
        throw new BadRequestException('Only successful payments can be undone');
      }

      const allocation = payment.allocations[0];
      if (!allocation || !allocation.payable) {
        throw new NotFoundException('Payment allocation not found');
      }

      const payable = allocation.payable;

      // Delete payment allocation (must go before payable delete to avoid FK constraint)
      await tx.paymentAllocation.delete({
        where: { id: allocation.id }
      });

      // Find original journal entry for this payment
      const originalJournalEntry = await tx.journalEntry.findFirst({
        where: {
          sourceRef: paymentId,
          status: JournalStatus.POSTED,
          isReversal: false
        }
      });

      let reversalJournalEntry: any = null;
      if (originalJournalEntry) {
        const reversalEntryNo = `REV-${originalJournalEntry.entryNo}`;
        const reversalDescription = `Reversal: ${originalJournalEntry.description}`;

        reversalJournalEntry = await tx.journalEntry.create({
          data: {
            entryNo: reversalEntryNo,
            date: new Date(),
            description: reversalDescription,
            status: JournalStatus.POSTED,
            isManual: true,
            isReversal: true,
            reversesJournalEntryId: originalJournalEntry.id,
            lines: {
              create: (await tx.journalEntryLine.findMany({
                where: { journalEntryId: originalJournalEntry.id }
              })).map(line => ({
                accountId: line.accountId,
                debit: line.credit,
                credit: line.debit
              }))
            }
          }
        });
      }

      // Mark payment as reversed
      await tx.paymentTransaction.update({
        where: { id: paymentId },
        data: {
          isReversed: true,
          reversedAt: new Date(),
          reversedById: userId
        }
      });

      // Check if any other non-reversed payments remain on this payable
      const remainingAllocations = await tx.paymentAllocation.findMany({
        where: { payableId: payable.id },
        include: { payment: true },
      });
      const remainingPaid = remainingAllocations
        .filter((a) => a.payment && !a.payment.isReversed && a.payment.status === 'SUCCESS')
        .reduce((sum, a) => sum + Number(a.allocatedAmount), 0);

      let payableDeleted = false;
      const expenseId = payable.expenseId;

      if (remainingPaid === 0) {
        // No payments remain — delete the payable (and its linked expense)
        await tx.payable.delete({ where: { id: payable.id } });
        if (expenseId) {
          await tx.expense.delete({ where: { id: expenseId } });
        }
        payableDeleted = true;
      } else {
        // Payments still exist — restore the payable balance
        const newRemaining = Number(payable.total) - remainingPaid;
        await tx.payable.update({
          where: { id: payable.id },
          data: {
            paid: remainingPaid,
            remaining: newRemaining,
            status: newRemaining <= 0 ? 'PAID' : remainingPaid > 0 ? 'PARTIAL' : 'DUE',
          },
        });
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId,
          userRole: UserRole.ADMIN,
          action: AuditAction.UNDO_PAYABLE_PAYMENT,
          entityType: 'PaymentTransaction',
          entityId: paymentId,
          oldValue: {
            amount: Number(payment.amount),
            payableId: payable.id,
            allocatedAmount: Number(allocation.allocatedAmount)
          },
          newValue: {
            isReversed: true,
            payableDeleted,
            expenseDeleted: payableDeleted && !!expenseId,
          }
        }
      });

      return {
        success: true,
        message: payableDeleted
          ? 'Payment reversed and payable entry deleted'
          : `Payment reversed. Payable updated — Rs. ${remainingPaid.toLocaleString()} still paid.`,
        payableDeleted,
        reversalJournalEntryId: reversalJournalEntry?.id
      };
    });
  }

  async undoPayableAllPayments(payableId: string, userId: string) {
    // Check if user is admin
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can undo payments');
    }

    return this.prisma.client.$transaction(async (tx) => {
      const payable = await tx.payable.findUnique({
        where: { id: payableId },
        include: {
          allocations: {
            include: { payment: true },
            orderBy: { payment: { createdAt: 'desc' } }
          }
        }
      });

      if (!payable) throw new NotFoundException('Payable not found');

      const results: any[] = [];

      // Reverse all PaymentTransaction allocations
      for (const allocation of payable.allocations) {
        const payment = allocation.payment;
        if (payment.isReversed || payment.status !== 'SUCCESS') continue;

        // Delete allocation first (FK constraint)
        await tx.paymentAllocation.delete({ where: { id: allocation.id } });

        // Create reversing journal entry
        const originalJE = await tx.journalEntry.findFirst({
          where: { sourceRef: payment.id, status: JournalStatus.POSTED, isReversal: false }
        });
        if (originalJE) {
          const lines = await tx.journalEntryLine.findMany({ where: { journalEntryId: originalJE.id } });
          await tx.journalEntry.create({
            data: {
              entryNo: `REV-${originalJE.entryNo}`,
              date: new Date(),
              description: `Reversal: ${originalJE.description}`,
              status: JournalStatus.POSTED,
              isManual: true,
              isReversal: true,
              reversesJournalEntryId: originalJE.id,
              lines: { create: lines.map(l => ({ accountId: l.accountId, debit: l.credit, credit: l.debit })) }
            }
          });
        }

        // Mark payment as reversed
        await tx.paymentTransaction.update({
          where: { id: payment.id },
          data: { isReversed: true, reversedAt: new Date(), reversedById: userId }
        });

        results.push({ paymentId: payment.id, success: true });
      }

      // Reverse any initial paid-at-creation amount (no PaymentTransaction)
      if (Number(payable.paid) > 0 && payable.allocations.length === 0) {
        if (payable.expenseId) {
          const expenseJE = await tx.journalEntry.findFirst({
            where: { sourceRef: payable.expenseId, status: JournalStatus.POSTED, isReversal: false },
            include: { lines: true }
          });
          if (expenseJE) {
            const apAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AP } });
            const creditLine = expenseJE.lines.find(l => Number(l.credit) > 0);
            if (apAcc && creditLine) {
              await tx.journalEntry.create({
                data: {
                  entryNo: `REV-EXP-${expenseJE.entryNo.split('-').pop()}`,
                  date: new Date(),
                  description: `Undo initial payment for ${payable.ref}`,
                  status: JournalStatus.POSTED,
                  isManual: true,
                  isReversal: true,
                  sourceRef: payable.id,
                  lines: {
                    create: [
                      { accountId: creditLine.accountId, debit: Number(payable.paid), credit: 0 },
                      { accountId: apAcc.id, debit: 0, credit: Number(payable.paid) }
                    ]
                  }
                }
              });
            }
          }
        }
        results.push({ paymentId: 'initial_payment', success: true, result: { message: 'Initial payment reversed' } });
      }

      // Delete the payable and its linked expense — this debt no longer needs to be paid
      const expenseId = payable.expenseId;
      await tx.payable.delete({ where: { id: payableId } });
      if (expenseId) {
        await tx.expense.delete({ where: { id: expenseId } });
      }

      return {
        totalProcessed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
        payableDeleted: true,
      };
    });
  }

  /**
   * Undo ALL payments for a given PayeeAccount (by payeeAccountId).
   * Traverses: payeeAccountId → Expense[] → Payable[] (via expenseId) → PaymentAllocation[]
   */
  async undoPayablePaymentsByPayeeAccountId(payeeAccountId: string, userId: string) {
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can undo payments');
    }

    // Traverse: PayeeAccount → Expense[] → Payable[] via expenseId
    const expenses = await this.prisma.client.expense.findMany({
      where: { payeeAccountId },
      select: { id: true }
    });

    if (expenses.length === 0) {
      return { totalProcessed: 0, successful: 0, failed: 0, results: [] };
    }

    const expenseIds = expenses.map(e => e.id);

    // Find all payables linked to those expenses
    const payables = await this.prisma.client.payable.findMany({
      where: { expenseId: { in: expenseIds } },
      select: { id: true }
    });

    if (payables.length === 0) {
      return { totalProcessed: 0, successful: 0, failed: 0, results: [] };
    }

    // Undo all payment allocations for those payables
    const allResults: any[] = [];
    for (const payable of payables) {
      const result = await this.undoPayableAllPayments(payable.id, userId);
      allResults.push({ payableId: payable.id, ...result });
    }

    const totalProcessed = allResults.reduce((s, r) => s + (r.totalProcessed ?? 0), 0);
    const successful = allResults.reduce((s, r) => s + (r.successful ?? 0), 0);
    const failed = allResults.reduce((s, r) => s + (r.failed ?? 0), 0);

    return { totalProcessed, successful, failed, results: allResults };
  }
}
