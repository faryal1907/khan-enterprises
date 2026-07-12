import { IsString, IsOptional, IsNumber, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class UpdatePartDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  sellingPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  purchaseCost?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  reorderLevel?: number;
}
