import { IsEnum, IsOptional, IsDateString, IsString } from "class-validator";
import { PaymentStatus, PaymentMethod } from "@khan/prisma";

export class QueryTransactionsDto {
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}
