import { IsString, IsNotEmpty, IsNumber, Min, IsEnum, IsOptional } from 'class-validator';
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

  // Optional: link the order to a registered customer account.
  // Leave null for walk-in customers who have no account yet.
  @IsString()
  @IsOptional()
  customerId?: string;
}
