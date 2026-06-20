import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@khan/prisma";
import { PrismaService } from "../../prisma/prisma.service";
import { QueryAuditLogsDto } from "./dto/query-audit-logs.dto";

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly auditLogSelect = {
    id: true,
    action: true,
    entityType: true,
    entityId: true,
    ipAddress: true,
    oldValue: true,
    newValue: true,
    userRole: true,
    createdAt: true,
    user: {
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    },
  } satisfies Prisma.AuditLogSelect;

  /** Return filtered audit logs with user details. */
  async getAllAuditLogs(query: QueryAuditLogsDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 100, 500);
    const where: Prisma.AuditLogWhereInput = {};

    if (query.action) {
      where.action = query.action;
    }

    const entityType = query.entityType || query.entity;
    if (entityType) {
      where.entityType = entityType;
    }

    if (query.entityId) {
      where.entityId = { contains: query.entityId, mode: "insensitive" };
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};

      if (query.dateFrom) {
        where.createdAt.gte = new Date(query.dateFrom);
      }

      if (query.dateTo) {
        const endOfDay = new Date(query.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        where.createdAt.lte = endOfDay;
      }
    }

    const search = query.user || query.search;
    if (search) {
      where.OR = [
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { entityType: { contains: search, mode: "insensitive" } },
        { entityId: { contains: search, mode: "insensitive" } },
      ];
    }

    const [auditLogs, count] = await this.prisma.client.$transaction([
      this.prisma.client.auditLog.findMany({
        where,
        select: this.auditLogSelect,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.client.auditLog.count({ where }),
    ]);

    return {
      count,
      page,
      limit,
      auditLogs,
    };
  }

  /** Return a single audit log by ID with full details including changes. */
  async getAuditLogById(id: string) {
    const auditLog = await this.prisma.client.auditLog.findUnique({
      where: { id },
      select: this.auditLogSelect,
    });

    if (!auditLog) {
      throw new NotFoundException("Audit log not found");
    }

    return {
      ...auditLog,
      timestamp: auditLog.createdAt,
      userId: auditLog.user?.id ?? null,
      userEmail: auditLog.user?.email ?? null,
      userRole: auditLog.user?.role ?? auditLog.userRole ?? null,
      changes: this.getChanges(auditLog.oldValue, auditLog.newValue),
    };
  }

  private getChanges(oldValue: Prisma.JsonValue | null, newValue: Prisma.JsonValue | null) {
    const oldData = this.toRecord(oldValue);
    const newData = this.toRecord(newValue);

    if (!oldData && !newData) {
      return [];
    }

    const allKeys = new Set([
      ...Object.keys(oldData ?? {}),
      ...Object.keys(newData ?? {}),
    ]);

    return Array.from(allKeys).map((key) => ({
      field: key,
      oldValue: this.formatValue(oldData?.[key]),
      newValue: this.formatValue(newData?.[key]),
    }));
  }

  private toRecord(value: Prisma.JsonValue | null): Record<string, unknown> | null {
    if (!value) {
      return null;
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return this.isRecord(parsed) ? parsed : { value: parsed };
      } catch {
        return { value };
      }
    }

    return this.isRecord(value) ? value : { value };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private formatValue(value: unknown) {
    if (value === undefined || value === null || value === "") {
      return "-";
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  }
}
