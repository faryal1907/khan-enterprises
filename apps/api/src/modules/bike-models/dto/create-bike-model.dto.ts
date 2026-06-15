import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class CreateBikeModelDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  modelName: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1900)
  @Max(2100)
  year: number;

  @IsString()
  @IsOptional()
  engineCapacity?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0.01)
  basePrice: number;
}
