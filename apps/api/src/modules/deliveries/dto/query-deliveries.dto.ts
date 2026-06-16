import { IsEnum, IsOptional, IsInt, Min, IsDateString, IsString } from "class-validator";
import { Type } from "class-transformer";
import { DeliveryStatus } from "@khan/prisma";

export class QueryDeliveriesDto {
  @IsEnum(DeliveryStatus)
  @IsOptional()
  status?: DeliveryStatus;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  orderId?: string;

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
