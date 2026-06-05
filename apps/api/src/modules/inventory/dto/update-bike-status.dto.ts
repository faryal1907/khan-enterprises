import { IsEnum, IsNotEmpty } from "class-validator";
import { BikeStatus } from "@khan/prisma";

export class UpdateBikeStatusDto {
  @IsEnum(BikeStatus)
  @IsNotEmpty()
  status: BikeStatus;
}
