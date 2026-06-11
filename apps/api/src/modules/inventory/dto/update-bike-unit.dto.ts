import { IsString, IsOptional, IsNumber, IsArray, IsEnum, IsUUID } from "class-validator";
import { BikeStatus } from "@khan/prisma";

export class UpdateBikeUnitDto {
  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  vendorId?: string;

  @IsEnum(BikeStatus)
  @IsOptional()
  status?: BikeStatus;

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
