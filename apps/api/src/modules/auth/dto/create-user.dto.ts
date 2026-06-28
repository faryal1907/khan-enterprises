import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsIn(['ADMIN', 'MANAGER', 'SALES_STAFF'])
  role: 'ADMIN' | 'MANAGER' | 'SALES_STAFF';

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  vendorId?: string;
}
