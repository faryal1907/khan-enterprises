import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class VerifyPaymentDto {
  @IsNotEmpty()
  transactionId: string;

  @IsNotEmpty()
  isApproved: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}
