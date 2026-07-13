import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AccountCategory, AccountSubtype } from "@khan/prisma";

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

      if (['ASSET', 'EXPENSE'].includes(acc.category) || acc.subtype === 'DRAWINGS') {
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

  async getJournalEntries(filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    journalType?: string;
    accountId?: string;
    vendorId?: string;
    customerId?: string;
  }) {
    const where: any = {};

    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    if (filters?.journalType) {
      where.description = { contains: filters.journalType, mode: 'insensitive' };
    }

    if (filters?.accountId) {
      where.lines = { some: { accountId: filters.accountId } };
    }

    if (filters?.vendorId) {
      where.vendorPayment = { vendorId: filters.vendorId };
    }

    if (filters?.customerId) {
      where.description = { contains: filters.customerId, mode: 'insensitive' };
    }

    return this.prisma.client.journalEntry.findMany({
      where,
      include: {
        lines: {
          include: {
            account: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
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

  async createAccount(data: {
    code: string;
    name: string;
    category: AccountCategory;
    subtype: AccountSubtype;
    accountNumber?: string;
    openingBalance?: number;
  }) {
    const existingAccount = await this.prisma.client.account.findUnique({
      where: { code: data.code }
    });

    if (existingAccount) {
      throw new BadRequestException(`Account with code ${data.code} already exists`);
    }

    return this.prisma.client.account.create({
      data: {
        code: data.code,
        name: data.name,
        category: data.category,
        subtype: data.subtype,
        accountNumber: data.accountNumber,
        openingBalance: data.openingBalance || 0,
        isActive: true,
        isSystem: false
      }
    });
  }

  async updateAccount(id: string, data: {
    name?: string;
    code?: string;
    category?: AccountCategory;
    subtype?: AccountSubtype;
  }) {
    const account = await this.prisma.client.account.findUnique({
      where: { id },
      include: {
        lines: true
      }
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Check if account has journal entries
    const hasJournalEntries = account.lines.length > 0;
    let warning: string | null = null;

    if (hasJournalEntries) {
      warning = 'This account has journal entries. Changing code or category may affect historical data integrity.';
    }

    // If code is being changed, check for uniqueness
    if (data.code && data.code !== account.code) {
      const existingAccount = await this.prisma.client.account.findUnique({
        where: { code: data.code }
      });

      if (existingAccount) {
        throw new BadRequestException(`Account with code ${data.code} already exists`);
      }
    }

    const updatedAccount = await this.prisma.client.account.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.code && { code: data.code }),
        ...(data.category && { category: data.category }),
        ...(data.subtype && { subtype: data.subtype })
      }
    });

    return {
      ...updatedAccount,
      warning
    };
  }

  async deleteAccount(id: string, transferAccountId?: string) {
    const account = await this.prisma.client.account.findUnique({
      where: { id },
      include: { lines: { where: { journalEntry: { status: 'POSTED' } } } }
    });

    if (!account) throw new NotFoundException('Account not found');
    if (account.isSystem) throw new BadRequestException('Cannot delete system accounts');

    // Compute current balance
    const balance = await this.getAccountBalance(id);

    // If balance is non-zero, a transfer destination is required
    if (balance !== 0 && !transferAccountId) {
      throw new BadRequestException(
        `Account has a balance of ${balance}. Please transfer this amount to another account before deactivating.`
      );
    }

    return this.prisma.client.$transaction(async (tx) => {
      // Post a transfer journal entry to zero out the balance
      if (balance !== 0 && transferAccountId) {
        const destination = await tx.account.findUnique({ where: { id: transferAccountId } });
        if (!destination) throw new NotFoundException('Transfer destination account not found');
        if (!destination.isActive) throw new BadRequestException('Transfer destination account is inactive');
        if (destination.id === id) throw new BadRequestException('Cannot transfer to the same account');

        const entryNo = `JV-CLOSE-${Date.now()}`;
        await tx.journalEntry.create({
          data: {
            entryNo,
            description: `Balance transfer on deactivation: ${account.name} → ${destination.name}`,
            status: 'POSTED',
            lines: {
              create: [
                // CR the closing account (reduces its asset balance to zero)
                { accountId: id, debit: 0, credit: balance },
                // DR the destination account (adds the balance there)
                { accountId: transferAccountId, debit: balance, credit: 0 },
              ],
            },
          },
        });
      }

      const updatedAccount = await tx.account.update({
        where: { id },
        data: { isActive: false },
      });

      const hasJournalEntries = account.lines.length > 0;
      return {
        ...updatedAccount,
        warning: hasJournalEntries
          ? 'Account deactivated. Historical journal entries are preserved.'
          : null,
      };
    });
  }

  async getAccountLedger(id: string, page: number = 1, limit: number = 50) {
    const account = await this.prisma.client.account.findUnique({
      where: { id }
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const skip = (page - 1) * limit;

    const lines = await this.prisma.client.journalEntryLine.findMany({
      where: {
        accountId: id,
        journalEntry: {
          status: 'POSTED'
        }
      },
      include: {
        journalEntry: true
      },
      orderBy: {
        journalEntry: {
          date: 'asc'
        }
      },
      skip,
      take: limit
    });

    const total = await this.prisma.client.journalEntryLine.count({
      where: {
        accountId: id,
        journalEntry: {
          status: 'POSTED'
        }
      }
    });

    // Calculate running balance
    let runningBalance = Number(account.openingBalance) || 0;
    const isDebitAccount = ['ASSET', 'EXPENSE'].includes(account.category) || account.subtype === 'DRAWINGS';

    const ledgerWithBalance = lines.map(line => {
      const debit = Number(line.debit) || 0;
      const credit = Number(line.credit) || 0;

      if (isDebitAccount) {
        runningBalance += debit - credit;
      } else {
        runningBalance += credit - debit;
      }

      return {
        id: line.id,
        date: line.journalEntry.date,
        entryNo: line.journalEntry.entryNo,
        description: line.journalEntry.description,
        debit,
        credit,
        balance: runningBalance
      };
    });

    return {
      account: {
        id: account.id,
        code: account.code,
        name: account.name,
        category: account.category,
        subtype: account.subtype,
        openingBalance: Number(account.openingBalance)
      },
      ledger: ledgerWithBalance,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getAccountBalance(accountId: string): Promise<number> {
    const account = await this.prisma.client.account.findUnique({
      where: { id: accountId },
      include: {
        lines: {
          where: {
            journalEntry: {
              status: 'POSTED'
            }
          }
        }
      }
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    let balance = Number(account.openingBalance) || 0;
    let totalDebit = 0;
    let totalCredit = 0;

    account.lines.forEach(line => {
      totalDebit += Number(line.debit) || 0;
      totalCredit += Number(line.credit) || 0;
    });

    if (['ASSET', 'EXPENSE'].includes(account.category) || account.subtype === 'DRAWINGS') {
      balance += totalDebit - totalCredit;
    } else {
      balance += totalCredit - totalDebit;
    }

    return balance;
  }

  async recordCapitalContribution(data: {
    destinationAccountId: string;
    amount: number;
    date: Date;
    source?: string;
    reference?: string;
    notes?: string;
  }) {
    console.log("recordCapitalContribution called with:", JSON.stringify({
      destinationAccountId: data.destinationAccountId,
      amount: data.amount,
      date: data.date.toISOString(),
      source: data.source,
      notes: data.notes
    }));
    return this.prisma.client.$transaction(async (tx) => {
      console.log("Inside transaction for recordCapitalContribution");
      const destinationAccount = await tx.account.findUnique({
        where: { id: data.destinationAccountId }
      });
      console.log("Destination account found:", destinationAccount ? { id: destinationAccount.id, code: destinationAccount.code, category: destinationAccount.category, subtype: destinationAccount.subtype } : null);

      if (!destinationAccount) {
        throw new NotFoundException('Destination account not found');
      }

      if (destinationAccount.category !== 'ASSET') {
        throw new BadRequestException('Destination account must be an asset account (Cash, Bank, or E-Wallet)');
      }

      if (!['CASH', 'BANK', 'EWALLET'].includes(destinationAccount.subtype)) {
        throw new BadRequestException('Destination account must be Cash, Bank, or E-Wallet');
      }

      if (data.amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }

      const ownerCapitalAccount = await tx.account.findFirst({
        where: { code: '3001' }
      });
      console.log("Owner Capital account found:", ownerCapitalAccount ? { id: ownerCapitalAccount.id, code: ownerCapitalAccount.code } : null);

      if (!ownerCapitalAccount) {
        throw new NotFoundException('Owner Capital account not found');
      }

      const entryNo = `JV-${Date.now()}`;
      const description = data.source ? `Capital Contribution - ${data.source}` : 'Capital Contribution';

      console.log("Creating journal entry:", { entryNo, description, date: data.date, destinationAccountId: data.destinationAccountId, ownerCapitalId: ownerCapitalAccount.id, amount: data.amount });

      const journalEntry = await tx.journalEntry.create({
        data: {
          entryNo,
          date: data.date,
          description,
          notes: data.notes,
          status: 'POSTED',
          lines: {
            create: [
              {
                accountId: data.destinationAccountId,
                debit: data.amount,
                credit: 0
              },
              {
                accountId: ownerCapitalAccount.id,
                debit: 0,
                credit: data.amount
              }
            ]
          }
        },
        include: {
          lines: true
        }
      });
      console.log("Journal entry created with id:", journalEntry.id);

      return journalEntry;
    });
  }

  async recordOwnerWithdrawal(data: {
    sourceAccountId: string;
    amount: number;
    date: Date;
    reason?: string;
    notes?: string;
  }) {
    return this.prisma.client.$transaction(async (tx) => {
      const sourceAccount = await tx.account.findUnique({
        where: { id: data.sourceAccountId }
      });

      if (!sourceAccount) {
        throw new NotFoundException('Source account not found');
      }

      if (sourceAccount.category !== 'ASSET') {
        throw new BadRequestException('Source account must be an asset account (Cash, Bank, or E-Wallet)');
      }

      if (!['CASH', 'BANK', 'EWALLET'].includes(sourceAccount.subtype)) {
        throw new BadRequestException('Source account must be Cash, Bank, or E-Wallet');
      }

      if (data.amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }

      const currentBalance = await this.getAccountBalanceForTx(tx, data.sourceAccountId);
      if (currentBalance < data.amount) {
        throw new BadRequestException(`Insufficient balance. Current balance: ${currentBalance}, Withdrawal amount: ${data.amount}`);
      }

      const ownerDrawingsAccount = await tx.account.findFirst({
        where: { code: '3002' }
      });

      if (!ownerDrawingsAccount) {
        throw new NotFoundException('Owner Drawings account not found');
      }

      const entryNo = `JV-${Date.now()}`;
      const description = data.reason ? `Owner Withdrawal - ${data.reason}` : 'Owner Withdrawal';

      const journalEntry = await tx.journalEntry.create({
        data: {
          entryNo,
          date: data.date,
          description,
          notes: data.notes,
          status: 'POSTED',
          lines: {
            create: [
              {
                accountId: ownerDrawingsAccount.id,
                debit: data.amount,
                credit: 0
              },
              {
                accountId: data.sourceAccountId,
                debit: 0,
                credit: data.amount
              }
            ]
          }
        },
        include: {
          lines: true
        }
      });

      return journalEntry;
    });
  }

async recordInternalTransfer(data: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    date: Date;
    notes?: string;
  }) {
    return this.prisma.client.$transaction(async (tx) => {
      if (data.fromAccountId === data.toAccountId) {
        throw new BadRequestException('Source and destination accounts cannot be the same');
      }

      const fromAccount = await tx.account.findUnique({
        where: { id: data.fromAccountId }
      });

      const toAccount = await tx.account.findUnique({
        where: { id: data.toAccountId }
      });

      if (!fromAccount) {
        throw new NotFoundException('Source account not found');
      }

      if (!toAccount) {
        throw new NotFoundException('Destination account not found');
      }

      if (fromAccount.category !== 'ASSET' || toAccount.category !== 'ASSET') {
        throw new BadRequestException('Both accounts must be asset accounts');
      }

      if (!['CASH', 'BANK', 'EWALLET'].includes(fromAccount.subtype) || !['CASH', 'BANK', 'EWALLET'].includes(toAccount.subtype)) {
        throw new BadRequestException('Both accounts must be Cash, Bank, or E-Wallet');
      }

      if (data.amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }

      const currentBalance = await this.getAccountBalanceForTx(tx, data.fromAccountId);
      if (currentBalance < data.amount) {
        throw new BadRequestException(`Insufficient balance in source account. Current balance: ${currentBalance}, Transfer amount: ${data.amount}`);
      }

      const entryNo = `JV-${Date.now()}`;
      const description = `Internal Transfer: ${fromAccount.name} to ${toAccount.name}`;

      const journalEntry = await tx.journalEntry.create({
        data: {
          entryNo,
          date: data.date,
          description,
          notes: data.notes,
          status: 'POSTED',
          lines: {
            create: [
              {
                accountId: data.toAccountId,
                debit: data.amount,
                credit: 0
              },
              {
                accountId: data.fromAccountId,
                debit: 0,
                credit: data.amount
              }
            ]
          }
        },
        include: {
          lines: true
        }
      });

      return journalEntry;
    });
  }

  private async getAccountBalanceForTx(tx: any, accountId: string): Promise<number> {
    const account = await tx.account.findUnique({
      where: { id: accountId },
      include: {
        lines: {
          where: {
            journalEntry: {
              status: 'POSTED'
            }
          }
        }
      }
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    let balance = Number(account.openingBalance) || 0;
    let totalDebit = 0;
    let totalCredit = 0;

    account.lines.forEach((line: any) => {
      totalDebit += Number(line.debit) || 0;
      totalCredit += Number(line.credit) || 0;
    });

    if (['ASSET', 'EXPENSE'].includes(account.category) || account.subtype === 'DRAWINGS') {
      balance += totalDebit - totalCredit;
    } else {
      balance += totalCredit - totalDebit;
    }

    return balance;
  }

  async createReversingJournalEntry(originalJournalEntryId: string, userId: string, description: string) {
    return this.prisma.client.$transaction(async (tx) => {
      const originalEntry = await tx.journalEntry.findUnique({
        where: { id: originalJournalEntryId },
        include: { lines: true }
      });

      if (!originalEntry) {
        throw new NotFoundException('Original journal entry not found');
      }

      if (originalEntry.isReversal) {
        throw new BadRequestException('Cannot reverse a reversal entry');
      }

      const reversalEntryNo = `REV-${originalEntry.entryNo}`;
      const reversalDescription = `undo payable/receivable - ${originalEntry.description}`;

      const reversalEntry = await tx.journalEntry.create({
        data: {
          entryNo: reversalEntryNo,
          date: new Date(),
          description: reversalDescription,
          status: 'POSTED',
          isManual: true,
          isReversal: true,
          reversesJournalEntryId: originalJournalEntryId,
          lines: {
            create: originalEntry.lines.map(line => ({
              accountId: line.accountId,
              debit: line.credit, // Swap debit and credit
              credit: line.debit
            }))
          }
        },
        include: { lines: true }
      });

      return reversalEntry;
    });
  }
}
