import { IsEnum, IsUUID, IsOptional, IsInt, Min, IsDateString, IsBoolean, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { OrderStatus, OrderType, PickupType } from "@khan/prisma";

// class-transformer's @Type(() => Boolean) converts the string "false" to true
// because new Boolean("false") is truthy. Use an explicit Transform instead.
function toBoolean({ value }: { value: any }): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

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
  @Transform(toBoolean)
  isCompleted?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(toBoolean)
  isCustomerView?: boolean;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  processedById?: string;

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
