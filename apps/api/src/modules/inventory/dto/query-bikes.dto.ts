import { IsOptional, IsString, IsUUID, IsEnum, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { BikeStatus } from "@khan/prisma";

export class QueryBikesDto {
  @IsOptional()
  @IsUUID()
  branchId?: string;

  @IsOptional()
  @IsEnum(BikeStatus)
  status?: BikeStatus;

  @IsOptional()
  @IsString()
  modelId?: string;

  @IsOptional()
  @IsString()
  vendorId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
