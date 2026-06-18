import { IsNotEmpty, IsString } from 'class-validator';

export class MarkAsReadDto {
  @IsString()
  @IsNotEmpty()
  alertId: string;
}
