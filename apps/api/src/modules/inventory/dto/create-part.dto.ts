import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  sellingPrice: number;

  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  quantity: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  reorderLevel: number;
}
