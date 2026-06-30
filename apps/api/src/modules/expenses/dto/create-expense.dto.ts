import { IsString, IsNotEmpty, IsNumber, IsDateString, IsEnum, IsOptional, Min } from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  paymentAccountId: string;
}
