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
  @IsNotEmpty()
  customerCNIC: string;

  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @IsNumber()
  @Min(1)
  offerAmount: number;

  @IsString()
  @IsOptional()
  message?: string;
}
