import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
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
  customerEmail?: string;

  @IsString()
  customerCNIC?: string;

  @IsString()
  customerAddress?: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsOptional()
  paymentProofUrl?: string;
}
