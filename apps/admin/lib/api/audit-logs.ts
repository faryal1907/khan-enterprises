import { api } from "../api-client";

export type AuditLogFilters = {
  user?: string;
  search?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export type AuditLogRecord = {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  ipAddress: string | null;
  createdAt: string;
  timestamp?: string;
  oldValue?: unknown;
  newValue?: unknown;
  userRole?: string | null;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  } | null;
  userId?: string | null;
  userEmail?: string | null;
  changes?: Array<{ field: string; oldValue: string; newValue: string }>;
};

export async function getAuditLogs(filters: AuditLogFilters = {}) {
  const response = await api.get("/audit-logs", { params: filters });
  return response.data;
}

export async function getAuditLogById(id: string) {
  const response = await api.get(`/audit-logs/${id}`);
  return response.data as AuditLogRecord;
}
