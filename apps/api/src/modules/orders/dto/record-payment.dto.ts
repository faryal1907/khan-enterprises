import { IsNumber, IsString, IsEnum, IsOptional } from "class-validator";
import { PaymentMethod } from "@khan/prisma";

export class RecordPaymentDto {
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  referenceNumber?: string;
}
