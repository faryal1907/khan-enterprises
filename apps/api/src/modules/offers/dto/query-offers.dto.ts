import { IsString, IsOptional, IsInt, Min, IsBoolean } from "class-validator";
import { Type } from "class-transformer";

export class QueryOffersDto {
  @IsString()
  @IsOptional()
  status?: string;

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