import { IsNumber, IsString, IsOptional, Min } from "class-validator";

export class CounterOfferDto {
  @IsNumber()
  @Min(1)
  counterAmount: number;

  @IsString()
  @IsOptional()
  adminResponse?: string;
}
