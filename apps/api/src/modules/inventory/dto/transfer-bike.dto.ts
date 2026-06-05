import { IsUUID, IsNotEmpty } from "class-validator";

export class TransferBikeDto {
  @IsUUID()
  @IsNotEmpty()
  branchId: string;
}
