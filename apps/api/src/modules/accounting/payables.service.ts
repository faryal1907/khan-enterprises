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

      // Reverse payable: decrease paid, increase remaining
      const newPaid = Number(payable.paid) - Number(allocation.allocatedAmount);
      const newRemaining = Number(payable.total) - newPaid;
      let newState: PaymentState = PaymentState.DUE;
      if (newPaid > 0) newState = PaymentState.PARTIAL;

      await tx.payable.update({
        where: { id: payable.id },
        data: {
          paid: newPaid,
          remaining: newRemaining,
          status: newState
        }
      });

      // Delete payment allocation
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
            newPaidAmount: newPaid,
            newRemainingAmount: newRemaining,
            newStatus: newState
          }
        }
      });

      return {
        success: true,
        message: 'Payment successfully undone',
        payable: {
          id: payable.id,
          ref: payable.ref,
          newPaid,
          newRemaining,
          newStatus: newState
        },
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

    const allocations = await this.prisma.client.paymentAllocation.findMany({
      where: { payableId },
      include: {
        payment: true
      },
      orderBy: { payment: { createdAt: 'desc' } }
    });

    const results: any[] = [];
    for (const allocation of allocations) {
      if (!allocation.payment.isReversed && allocation.payment.status === 'SUCCESS') {
        try {
          const result = await this.undoPayablePayment(allocation.paymentId, userId);
          results.push({ paymentId: allocation.paymentId, success: true, result });
        } catch (error: any) {
          results.push({ paymentId: allocation.paymentId, success: false, error: error.message });
        }
      }
    }

    // Check if there is still a paid amount (due to payNow at expense creation)
    const payable = await this.prisma.client.payable.findUnique({ where: { id: payableId } });
    if (payable && Number(payable.paid) > 0) {
      await this.prisma.client.$transaction(async (tx) => {
        const remainingPaid = Number(payable.paid);
        const newRemaining = Number(payable.total);

        await tx.payable.update({
          where: { id: payableId },
          data: {
            paid: 0,
            remaining: newRemaining,
            status: PaymentState.DUE
          }
        });

        // If this payable came from an expense, we need to adjust the original expense journal entry
        if (payable.expenseId) {
          const expenseJournalEntry = await tx.journalEntry.findFirst({
            where: {
              sourceRef: payable.expenseId,
              status: JournalStatus.POSTED,
              isReversal: false
            },
            include: { lines: true }
          });

          if (expenseJournalEntry) {
            const apAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AP } });
            // Find the line that credited the payment account
            const creditLine = expenseJournalEntry.lines.find(l => Number(l.credit) > 0);
            
            if (apAcc && creditLine) {
              await tx.journalEntry.create({
                data: {
                  entryNo: `REV-EXP-${expenseJournalEntry.entryNo.split('-').pop()}`,
                  date: new Date(),
                  description: `Undo initial payment for ${payable.ref}`,
                  status: JournalStatus.POSTED,
                  isManual: true,
                  isReversal: true,
                  sourceRef: payable.id, // Mark to avoid duplicate reversals
                  lines: {
                    create: [
                      // Debit the bank/cash account that was originally credited
                      { accountId: creditLine.accountId, debit: remainingPaid, credit: 0 },
                      // Credit the AP account
                      { accountId: apAcc.id, debit: 0, credit: remainingPaid }
                    ]
                  }
                }
              });
            }
          }
        }

        results.push({ paymentId: 'initial_payment', success: true, result: { message: 'Initial payment reversed' } });
      });
    }

    return {
      totalProcessed: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
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
