import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber, Min, IsEnum } from "class-validator";
import { PaymentMethod } from "@khan/prisma";

export class CreateOfferDto {
  @IsString()
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

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  userId?: string;
}
