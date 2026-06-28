import { IsString, IsNotEmpty, IsIn, IsOptional, IsInt, Min } from 'class-validator';

export class TransferStockDto {
  @IsIn(['bike', 'part'])
  type: 'bike' | 'part';

  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  fromBranchId: string;

  @IsString()
  @IsNotEmpty()
  toBranchId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
