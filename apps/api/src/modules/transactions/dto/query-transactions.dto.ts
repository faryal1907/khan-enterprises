import { IsEnum, IsUUID, IsOptional, IsDateString } from "class-validator";
import { PaymentStatus, PaymentMethod } from "@khan/prisma";

export class QueryTransactionsDto {
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod;

  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}
