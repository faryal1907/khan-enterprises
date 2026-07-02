import { IsString, IsNotEmpty, IsNumber, IsDateString, IsEnum, IsOptional, IsBoolean, Min } from 'class-validator';
import { ExpenseCategory } from '@khan/prisma';

export class CreateExpenseDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  date: string;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  branchId: string;

  /**
   * Payment account to debit if paying now. Optional — if omitted, expense is
   * recorded as unpaid (DR Expense / CR Accounts Payable) and can be paid later.
   */
  @IsString()
  @IsOptional()
  paymentAccountId?: string;

  /**
   * Whether to record an upfront payment at creation time.
   * Defaults to true for backward compatibility.
   */
  @IsBoolean()
  @IsOptional()
  payNow?: boolean;
}
