import { IsString, IsNotEmpty, IsOptional, IsEnum, ValidateIf, IsNumber, Min } from 'class-validator';
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
  @IsNotEmpty()
  customerCNIC!: string;

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

  /**
   * Amount the customer will pay as advance (minimum 50% of online price).
   * Only applicable for ONLINE_TRANSFER. If omitted, defaults to 50%.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialPaymentAmount?: number;

  @IsOptional()
  @IsString()
  paymentAccountId?: string;
}
