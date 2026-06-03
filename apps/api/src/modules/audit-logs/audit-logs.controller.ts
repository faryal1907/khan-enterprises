import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuditLogsService } from "./audit-logs.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("audit-logs")
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  /**
   * GET /api/audit-logs
   * Returns all audit logs
   */
  @Get()
  async getAllAuditLogs() {
    const auditLogs = await this.auditLogsService.getAllAuditLogs();
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
