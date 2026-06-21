import { IsNotEmpty } from "class-validator";

export class VerifyPaymentDto {
  @IsNotEmpty()
  transactionId: string;

  @IsNotEmpty()
  isApproved: boolean;

  reason?: string;
}
