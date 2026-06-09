import { IsString, IsNotEmpty, IsUUID, IsOptional } from "class-validator";

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

  @IsUUID()
  @IsNotEmpty()
  modelId: string;

  @IsUUID()
  @IsNotEmpty()
  vendorId: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;
}
