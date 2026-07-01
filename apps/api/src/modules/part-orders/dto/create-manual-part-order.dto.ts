import { IsString, IsNotEmpty, IsNumber, Min, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@khan/prisma';

export class CreateManualPartOrderDto {
  @IsString()
  @IsNotEmpty()
  partId: string;

  @IsString()
  @IsOptional()
  partInventoryId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  /** Amount paid now — defaults to full amount if omitted */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  initialPaymentAmount?: number;

  @IsOptional()
  @IsBoolean()
  isInstallmentPlan?: boolean;

  /** Specific account (CASH/BANK/EWALLET) to credit the payment to */
  @IsString()
  @IsOptional()
  accountId?: string;

  @IsString()
  @IsOptional()
  customerId?: string;
}
