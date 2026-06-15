import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuditLogsService } from "./audit-logs.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Query } from "@nestjs/common";
import { QueryAuditLogsDto } from "./dto/query-audit-logs.dto";

@Controller("audit-logs")
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  /**
   * GET /api/audit-logs
   * Returns all audit logs
   */
  @Get()
  async getAllAuditLogs(@Query() query: QueryAuditLogsDto) {
    const auditLogs = await this.auditLogsService.getAllAuditLogs(query);
    return { count: auditLogs.length, auditLogs };
  }

  /**
   * GET /api/audit-logs/:id
   * Returns a single audit log by ID
   */
  @Get(":id")
  async getAuditLog(@Param("id") id: string) {
    return this.auditLogsService.getAuditLogById(id);
  }
}
