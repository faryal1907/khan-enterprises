import { IsOptional, IsString, IsDateString, IsEnum } from "class-validator";
import { AuditAction } from "@khan/prisma";

export class QueryAuditLogsDto {
  @IsString()
  @IsOptional()
  user?: string;

  @IsEnum(AuditAction)
  @IsOptional()
  action?: AuditAction;

  @IsString()
  @IsOptional()
  entity?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}
