import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@khan/prisma';

export enum OrderType {
  ONLINE = 'ONLINE',
  ONSITE = 'ONSITE',
}

export class CreateManualOrderDto {
  @IsString()
  @IsNotEmpty()
  chassisNumber!: string;

  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsString()
  @IsNotEmpty()
  customerCNIC!: string;

  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @IsString()
  @IsNotEmpty()
  customerAddress!: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salePrice!: number;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsEnum(OrderType)
  @IsOptional()
  orderType?: OrderType;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  actualSalePrice?: number;

  @IsOptional()
  isInstallmentPlan?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  initialPaymentAmount?: number;

  /** Specific account (CASH/BANK/EWALLET) to credit the payment to */
  @IsString()
  @IsOptional()
  accountId?: string;
}

