import { IsNumber, IsString, IsNotEmpty, Min } from "class-validator";

export class CounterOfferDto {
  @IsNumber()
  @Min(1)
  counterAmount: number;

  @IsString()
  @IsNotEmpty()
  adminResponse: string;
}
