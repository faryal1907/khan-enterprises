import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@khan/prisma';

export class CreateManualOrderDto {
  @IsString()
  @IsNotEmpty()
  chassisNumber: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerCNIC: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salePrice: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
