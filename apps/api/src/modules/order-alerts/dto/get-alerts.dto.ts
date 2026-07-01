import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum AlertType {
  NEW_ORDER = 'NEW_ORDER',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  EXPIRY_WARNING = 'EXPIRY_WARNING',
  DELIVERY_REQUEST = 'DELIVERY_REQUEST',
  // Customer-specific alerts
  ORDER_STATUS_UPDATED = 'ORDER_STATUS_UPDATED',
  PAYMENT_VERIFIED = 'PAYMENT_VERIFIED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  DELIVERY_STATUS_UPDATED = 'DELIVERY_STATUS_UPDATED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  // Receivables alerts
  RECEIVABLES_PARTIAL_REMINDER = 'RECEIVABLES_PARTIAL_REMINDER',
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
