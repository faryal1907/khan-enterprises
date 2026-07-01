import { IsNumber, IsString, IsIn, IsOptional, IsUUID, ValidateIf } from "class-validator";
import { PaymentMethod } from "@khan/prisma";

export class RecordPaymentDto {
  @IsString()
  @IsIn(Object.values(PaymentMethod))
  method: PaymentMethod;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ValidateIf(o => o.accountId !== undefined && o.accountId !== "")
  @IsUUID()
  @IsOptional()
  accountId?: string;
}
