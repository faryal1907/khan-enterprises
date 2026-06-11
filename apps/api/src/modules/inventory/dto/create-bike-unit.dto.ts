import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsUUID } from "class-validator";

export class CreateBikeUnitDto {
  @IsString()
  @IsNotEmpty()
  chassisNumber: string;

  @IsString()
  @IsNotEmpty()
  engineNumber: string;

  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @IsString()
  @IsNotEmpty()
  modelId: string;

  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

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
