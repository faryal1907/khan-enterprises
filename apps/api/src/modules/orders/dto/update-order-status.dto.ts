import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatus } from "@khan/prisma";

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
