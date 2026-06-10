import { IsString, IsOptional, IsNotEmpty, MinLength } from "class-validator";

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  deliveryAddress: string;

  @IsString()
  @IsOptional()
  preferredTimeWindow?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  contactNumber: string;
}
