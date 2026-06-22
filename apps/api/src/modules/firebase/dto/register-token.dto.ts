import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterFcmTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
