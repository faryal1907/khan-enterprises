import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { PaymentMethod } from "@khan/prisma";

export class CompleteOrderDetailsDto {
  @IsString()
  @IsNotEmpty()
  customerCNIC: string;

  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
