import { IsString, IsOptional, IsNumber, IsArray } from "class-validator";

export class UpdateBikeUnitDto {
  @IsString()
  @IsOptional()
  vendorId?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  media?: string[];
}
