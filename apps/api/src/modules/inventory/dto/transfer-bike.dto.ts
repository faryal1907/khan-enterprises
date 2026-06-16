import { IsString, IsNotEmpty } from "class-validator";

export class TransferBikeDto {
  @IsString()
  @IsNotEmpty()
  branchId: string;
}
