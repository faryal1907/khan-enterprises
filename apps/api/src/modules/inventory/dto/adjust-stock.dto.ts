import { IsInt, IsEnum, IsNotEmpty, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { InventoryMovementType } from "@khan/prisma";

export class AdjustStockDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;

  @IsEnum(InventoryMovementType)
  @IsNotEmpty()
  movementType: InventoryMovementType;

  @IsString()
  @IsOptional()
  reason?: string;
}
