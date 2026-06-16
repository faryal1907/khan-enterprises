import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AuditLogsService } from "./audit-logs.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { QueryAuditLogsDto } from "./dto/query-audit-logs.dto";

@Controller("audit-logs")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  /**
   * GET /api/audit-logs
   * Returns filtered audit logs. Admin only.
   */
  @Get()
  async getAllAuditLogs(@Query() query: QueryAuditLogsDto) {
    return this.auditLogsService.getAllAuditLogs(query);
  }

  /**
   * GET /api/audit-logs/:id
   * Returns a single audit log by ID. Admin only.
   */
  @Get(":id")
  async getAuditLog(@Param("id") id: string) {
    return this.auditLogsService.getAuditLogById(id);
  }
}
