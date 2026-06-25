import { IsNumber, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class UpdateBulkDiscountDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discountPercent: number;
}
