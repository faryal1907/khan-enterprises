import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AccountingService {
  constructor(private readonly prisma: PrismaService) {}

  async getAccounts() {
    const accounts = await this.prisma.client.account.findMany({
      include: {
        lines: {
          where: {
            journalEntry: {
              status: 'POSTED'
            }
          }
        }
      },
      orderBy: { code: 'asc' }
    });

    return accounts.map(acc => {
      let balance = Number(acc.openingBalance) || 0;
      
      let totalDebit = 0;
      let totalCredit = 0;
      
      acc.lines.forEach(line => {
        totalDebit += Number(line.debit) || 0;
        totalCredit += Number(line.credit) || 0;
      });

      if (['ASSET', 'EXPENSE'].includes(acc.category)) {
        balance += totalDebit - totalCredit;
      } else {
        balance += totalCredit - totalDebit;
      }

      const { lines, ...accountData } = acc;
      return {
        ...accountData,
        balance
      };
    });
  }

  async getJournalEntries() {
    return this.prisma.client.journalEntry.findMany({
      include: {
        lines: {
          include: {
            account: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 100 // Limit for now
    });
  }

  async getPurchaseOrders() {
    return this.prisma.client.purchaseOrder.findMany({
      include: {
        vendor: true,
        items: true
      }
    });
  }

  async getPayables() {
    return this.prisma.client.payable.findMany({
      include: {
        purchaseOrder: true
      }
    });
  }

  async createJournalEntry(data: { description: string, lines: { accountId: string, debit: number, credit: number }[] }) {
    const totalDebit = data.lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
    const totalCredit = data.lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);

    if (totalDebit !== totalCredit) {
      throw new BadRequestException(`Total debits (${totalDebit}) must equal total credits (${totalCredit})`);
    }

    if (totalDebit <= 0) {
      throw new BadRequestException('Journal entry must have a non-zero value');
    }

    const entryNo = `MAN-JE-${Date.now()}`;

    return this.prisma.client.journalEntry.create({
      data: {
        entryNo,
        description: data.description,
        isManual: true,
        status: 'POSTED',
        lines: {
          create: data.lines.map(line => ({
            accountId: line.accountId,
            debit: line.debit || 0,
            credit: line.credit || 0
          }))
        }
      }
    });
  }
}
