import { IsEnum, IsOptional, IsString, IsNumber } from "class-validator";
import { DeliveryStatus } from "@khan/prisma";

export class UpdateDeliveryStatusDto {
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  @IsNumber()
  deliveryCost?: number;
}
