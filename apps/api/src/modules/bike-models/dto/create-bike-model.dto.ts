import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
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
  basePrice: number;
}
