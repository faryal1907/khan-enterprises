import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEmail, IsNumber, Min } from "class-validator";

export class CreateOfferDto {
  @IsUUID()
  @IsNotEmpty()
  bikeId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsOptional()
  customerCNIC?: string;

  @IsString()
  @IsOptional()
  customerAddress?: string;

  @IsNumber()
  @Min(1)
  offerAmount: number;

  @IsString()
  @IsOptional()
  message?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;
}
