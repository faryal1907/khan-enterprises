import { IsString, IsNotEmpty } from "class-validator";

export class RejectOfferDto {
  @IsString()
  @IsNotEmpty()
  adminResponse: string;
}
