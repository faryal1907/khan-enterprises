import { IsString, IsInt, Min, IsNotEmpty } from "class-validator";

export class TransferPartDto {
  @IsString()
  @IsNotEmpty()
  partId: string;

  @IsString()
  @IsNotEmpty()
  fromBranchId: string;

  @IsString()
  @IsNotEmpty()
  toBranchId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
