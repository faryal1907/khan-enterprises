import { IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsIn(['ADMIN', 'MANAGER', 'SALES_STAFF'])
  role?: 'ADMIN' | 'MANAGER' | 'SALES_STAFF';

  @IsOptional()
  @IsString()
  branchId?: string | null;

  @IsOptional()
  @IsString()
  vendorId?: string | null;

  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}
