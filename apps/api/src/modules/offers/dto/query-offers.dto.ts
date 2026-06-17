import { IsEnum, IsString, IsOptional, IsInt, Min, IsBoolean } from "class-validator";
import { Type } from "class-transformer";
import { OfferStatus } from "@khan/prisma";

export class QueryOffersDto {
  @IsEnum(OfferStatus)
  @IsOptional()
  status?: OfferStatus;

  @IsString()
  @IsOptional()
  bikeId?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  includeConverted?: boolean;

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
