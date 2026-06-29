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

  @IsString()
  @IsOptional()
  chassisNumber?: string;

  @IsString()
  @IsOptional()
  engineNumber?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  media?: string[];

  @IsNumber()
  @IsOptional()
  onlineDiscountPercent?: number;
}
