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
  @IsNotEmpty()
  customerEmail?: string;

  @IsString()
  @IsNotEmpty()
  customerCNIC?: string;

  @IsString()
  @IsNotEmpty()
  customerAddress?: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  paymentProofUrl?: string;
}
