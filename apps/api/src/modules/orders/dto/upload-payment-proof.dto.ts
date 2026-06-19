import { IsString, IsNotEmpty } from "class-validator";

export class UploadPaymentProofDto {
  @IsString()
  @IsNotEmpty()
  paymentProofUrl: string;
}
