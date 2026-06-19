import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';

export enum RevenueDuration {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
  CUSTOM = 'CUSTOM',
}

export class RevenueQueryDto {
  @IsEnum(RevenueDuration)
  duration: RevenueDuration;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  branchId?: string;
}
