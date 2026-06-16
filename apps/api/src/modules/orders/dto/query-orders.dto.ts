import { IsEnum, IsOptional, IsInt, Min, IsDateString, IsString } from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus } from "@khan/prisma";

export class QueryOrdersDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  processedById?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
