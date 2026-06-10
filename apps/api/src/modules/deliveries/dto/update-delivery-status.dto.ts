import { IsEnum, IsOptional, IsString } from "class-validator";
import { DeliveryStatus } from "@khan/prisma";

export class UpdateDeliveryStatusDto {
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
