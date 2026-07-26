import { IsString, IsOptional } from "class-validator";

export class CompleteOrderDetailsDto {
  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @IsOptional()
  customerCNIC?: string;

  @IsString()
  @IsOptional()
  customerAddress?: string;
}
