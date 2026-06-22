import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum AlertType {
  NEW_ORDER = 'NEW_ORDER',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  EXPIRY_WARNING = 'EXPIRY_WARNING',
  DELIVERY_REQUEST = 'DELIVERY_REQUEST',
}

export class GetAlertsDto {
  @IsOptional()
  @IsEnum(AlertType)
  alertType?: AlertType;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @Type(() => Boolean)
  unreadOnly?: boolean;
}
