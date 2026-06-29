import { IsString, IsNotEmpty, IsOptional, IsEnum, ValidateIf, IsNumber } from 'class-validator';
import { PaymentMethod } from '@khan/prisma';

export class CreateCustomerOrderDto {
  @IsString()
  @IsNotEmpty()
  bikeId!: string;

  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @IsString()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsOptional()
  customerCNIC?: string;

  @IsString()
  @IsOptional()
  customerAddress?: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod!: PaymentMethod;

  @ValidateIf(o => o.paymentMethod !== 'CASH')
  @IsString()
  @IsNotEmpty()
  paymentProofUrl?: string;

  @IsOptional()
  isInstallmentPlan?: boolean;

  @IsOptional()
  @IsNumber()
  initialPaymentAmount?: number;
}
