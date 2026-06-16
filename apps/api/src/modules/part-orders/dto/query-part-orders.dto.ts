import { IsEnum, IsUUID, IsOptional, IsInt, Min, IsDateString, IsBoolean, IsString } from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus } from "@khan/prisma";

export class QueryPartOrdersDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsUUID()
  @IsOptional()
  partId?: string;

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

  @IsString()
  @IsOptional()
  search?: string;

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
