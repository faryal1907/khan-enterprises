import { IsEnum, IsUUID, IsOptional, IsInt, Min, IsDateString, IsBoolean, IsString } from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus, OrderType, PickupType } from "@khan/prisma";

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

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isCompleted?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isCustomerView?: boolean;

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

  @IsEnum(OrderType)
  @IsOptional()
  orderType?: OrderType;

  @IsEnum(PickupType)
  @IsOptional()
  pickupType?: PickupType;
}
