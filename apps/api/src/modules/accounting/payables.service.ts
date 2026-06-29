import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PaymentState, JournalStatus, AccountSubtype } from "@khan/prisma";

@Injectable()
export class PayablesService {
  constructor(private readonly prisma: PrismaService) {}

  async payPayable(payableId: string, amount: number, paymentMethod: any, userId: string) {
    return this.prisma.client.$transaction(async (tx) => {
      const payable = await tx.payable.findUnique({
        where: { id: payableId }
      });

      if (!payable) throw new NotFoundException('Payable not found');
      if (amount > Number(payable.remaining)) throw new BadRequestException('Amount exceeds remaining balance');

      // Create Payment Transaction (outgoing)
      // Since it's outgoing, we'll store it as a negative amount or use a different type, 
      // but for now, we just link it via PaymentAllocation.
      
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

      const sourceSubtype = paymentMethod === 'ONLINE_TRANSFER' ? AccountSubtype.BANK : AccountSubtype.CASH;
      const sourceAcc = await tx.account.findFirst({ where: { subtype: sourceSubtype } });
      const apAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AP } });

      const txRecord = await tx.paymentTransaction.create({
        data: {
          amount: amount,
          method: paymentMethod,
          status: 'SUCCESS',
          verifiedAt: new Date(),
          verifiedById: userId,
          accountId: sourceAcc?.id,
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
}
