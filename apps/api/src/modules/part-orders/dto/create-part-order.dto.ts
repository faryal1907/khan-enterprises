import { IsString, IsInt, IsEnum, IsNotEmpty, IsOptional, Min, IsNumber } from 'class-validator';
import { PaymentMethod } from '@khan/prisma';

export class CreatePartOrderDto {
  @IsString()
  @IsNotEmpty()
  partId: string;

  @IsString()
  @IsNotEmpty()
  partInventoryId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsOptional()
  customerAddress?: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  paymentProofUrl?: string;

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
