import { IsString, IsInt, IsDecimal, IsEnum, IsNotEmpty, Min } from 'class-validator';
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
  @IsNotEmpty()
  customerAddress: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;
}
