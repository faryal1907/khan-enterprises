import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  @Matches(/^03[0-9]{9}$/)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address?: string;
}
