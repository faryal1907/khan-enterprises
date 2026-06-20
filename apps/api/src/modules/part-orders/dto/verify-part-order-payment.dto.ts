import { IsBoolean, IsNotEmpty } from "class-validator";

export class VerifyPartOrderPaymentDto {
  @IsBoolean()
  @IsNotEmpty()
  verified: boolean = false;
}
