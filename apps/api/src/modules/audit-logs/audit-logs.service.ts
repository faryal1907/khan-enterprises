import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { QueryAuditLogsDto } from "./dto/query-audit-logs.dto";

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Return all audit logs with user details. */
  async getAllAuditLogs(query: QueryAuditLogsDto) {
    const where: any = {};

    if (query.action) {
      where.action = query.action;
    }
    if (query.entity) {
      where.entityType = query.entity;
    }
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) {
        where.createdAt.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.createdAt.lte = new Date(query.dateTo);
      }
    }
    if (query.user) {
      where.OR = [
        { user: { email: { contains: query.user, mode: "insensitive" } } },
        { user: { fullName: { contains: query.user, mode: "insensitive" } } },
      ];
    }

    return this.prisma.client.auditLog.findMany({
      where,
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        ipAddress: true,
        oldValue: true,
        newValue: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Return a single audit log by ID with full details including changes. */
  async getAuditLogById(id: string) {
    const auditLog = await this.prisma.client.auditLog.findUnique({
      where: { id },
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        ipAddress: true,
        oldValue: true,
        newValue: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    if (!auditLog) {
      throw new NotFoundException("Audit log not found");
    }

    // Parse changes from oldValue and newValue JSON
    let changes: Array<{ field: string; oldValue: string; newValue: string }> = [];
    
    if (auditLog.oldValue && auditLog.newValue) {
      const oldData = typeof auditLog.oldValue === 'string' 
        ? JSON.parse(auditLog.oldValue) 
        : auditLog.oldValue;
      const newData = typeof auditLog.newValue === 'string' 
        ? JSON.parse(auditLog.newValue) 
        : auditLog.newValue;

      const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
      
      changes = Array.from(allKeys).map(key => ({
        field: key,
        oldValue: String(oldData[key] ?? '—'),
        newValue: String(newData[key] ?? '—'),
      }));
    }

    return {
      id: auditLog.id,
      timestamp: auditLog.createdAt,
      userId: auditLog.user?.id,
      userEmail: auditLog.user?.email,
      userRole: auditLog.user?.role,
      action: auditLog.action,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      ipAddress: auditLog.ipAddress,
      changes,
    };
  }
}
