import { IsEnum, IsUUID, IsOptional, IsInt, Min, IsDateString, IsBoolean } from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus } from "@khan/prisma";

export class QueryOrdersDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isCompleted?: boolean;

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
