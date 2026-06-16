import { IsEnum, IsString, IsOptional, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { OfferStatus } from "@khan/prisma";

export class QueryOffersDto {
  @IsEnum(OfferStatus)
  @IsOptional()
  status?: OfferStatus;

  @IsString()
  @IsOptional()
  bikeId?: string;

  @IsString()
  @IsOptional()
  branchId?: string;

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
