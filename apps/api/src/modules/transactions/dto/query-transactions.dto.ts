import { IsEnum, IsOptional, IsDateString, IsString } from "class-validator";
import { PaymentMethod } from "@khan/prisma";

export class QueryTransactionsDto {
  @IsString()
  @IsOptional()
  status?: string;

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
