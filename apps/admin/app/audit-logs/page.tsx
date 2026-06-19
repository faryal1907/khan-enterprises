"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { getAuditLogById, getAuditLogs, type AuditLogRecord } from "@/lib/api/audit-logs";
import { toast } from "sonner";

const EMPTY = "-";
const ACTIONS = ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "APPROVE", "REJECT", "PAYMENT"];
const ENTITIES = [
  "BIKE",
  "BIKE_MODEL",
  "BRANCH",
  "DELIVERY",
  "DeliveryRequest",
  "INVENTORY",
  "OFFER",
  "ORDER",
  "Order",
  "PART",
  "PART_INVENTORY",
  "PART_ORDER",
  "PART_PAYMENT_TRANSACTION",
  "PaymentTransaction",
  "USER",
];

type Filters = {
  user: string;
  action: string;
  entityType: string;
  entityId: string;
  dateFrom: string;
  dateTo: string;
};

function cleanParams(filters: Filters) {
  return Object.fromEntries(
    Object.entries(filters)
      .map(([key, value]) => [key, value.trim()])
      .filter(([, value]) => Boolean(value)),
  );
}

function formatDate(value?: string) {
  if (!value) return EMPTY;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? EMPTY : date.toLocaleString();
}

function formatJson(value: unknown) {
  if (value === null || value === undefined || value === "") return EMPTY;
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function getUserLabel(log: AuditLogRecord) {
  return log.user?.email || log.userEmail || "System";
}

function getRoleLabel(log: AuditLogRecord) {
  return log.user?.role || log.userRole || EMPTY;
}

function csvCell(value: unknown) {
  const text = String(value ?? EMPTY);
  return `"${text.replace(/"/g, '""')}"`;
}

export default function AuditLogsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<Filters>({
    user: "",
    action: "",
    entityType: "",
    entityId: "",
    dateFrom: "",
    dateTo: "",
  });
  const debouncedFilters = useDebouncedValue(filters, 300);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [logDetails, setLogDetails] = useState<AuditLogRecord | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const canViewAuditLogs = user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (user && !canViewAuditLogs) {
      router.push("/");
    }
  }, [canViewAuditLogs, router, user]);

  const requestFilters = useMemo(() => cleanParams(debouncedFilters), [debouncedFilters]);

  const fetchAuditLogs = useCallback(async () => {
    if (!canViewAuditLogs) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getAuditLogs({ ...requestFilters, limit: 100 });
      setAuditLogs(response.auditLogs || []);
      setTotalCount(response.count || 0);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
      setError("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [canViewAuditLogs, requestFilters]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleViewDetails = async (logId: string) => {
    setSelectedLogId(logId);
    setDetailsLoading(true);
    setLogDetails(null);

    try {
      const details = await getAuditLogById(logId);
      setLogDetails(details);
    } catch (err) {
      console.error("Failed to fetch audit log details:", err);
      toast.error("Failed to load audit log details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const response = await getAuditLogs({ ...requestFilters, limit: 500 });
      const rows: AuditLogRecord[] = response.auditLogs || [];
      const headers = ["Timestamp", "User", "Role", "Action", "Entity", "Entity ID", "IP Address", "Old Value", "New Value"];
      const csvRows = rows.map((log) => [
        formatDate(log.createdAt || log.timestamp),
        getUserLabel(log),
        getRoleLabel(log),
        log.action,
        log.entityType || EMPTY,
        log.entityId || EMPTY,
        log.ipAddress || EMPTY,
        formatJson(log.oldValue),
        formatJson(log.newValue),
      ].map(csvCell));

      const csvContent = [headers.map(csvCell), ...csvRows].map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "audit-logs.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export audit logs:", err);
      toast.error("Failed to export audit logs");
    } finally {
      setExporting(false);
    }
  };

  const closeDetails = () => {
    if (detailsLoading) return;
    setSelectedLogId(null);
    setLogDetails(null);
  };

  if (!canViewAuditLogs && user) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-3 hover:opacity-70" style={{ color: theme.text.secondary }}>
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>Audit Logs</h1>
            <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
              Track system activity and critical changes. Showing {auditLogs.length} of {totalCount} records.
            </p>
          </div>

          <AsyncButton onClick={handleExportCSV} loading={exporting} loadingLabel="Exporting..." disabled={loading || auditLogs.length === 0}>
            Export CSV
          </AsyncButton>
        </div>

        <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>User</label>
              <input
                type="text"
                value={filters.user}
                onChange={(event) => handleFilterChange("user", event.target.value)}
                placeholder="Email or name"
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Action</label>
              <select
                value={filters.action}
                onChange={(event) => handleFilterChange("action", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              >
                <option value="">All Actions</option>
                {ACTIONS.map((action) => <option key={action} value={action}>{action}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Entity</label>
              <select
                value={filters.entityType}
                onChange={(event) => handleFilterChange("entityType", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              >
                <option value="">All Entities</option>
                {ENTITIES.map((entity) => <option key={entity} value={entity}>{entity}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Entity ID</label>
              <input
                type="text"
                value={filters.entityId}
                onChange={(event) => handleFilterChange("entityId", event.target.value)}
                placeholder="Any ID format"
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(event) => handleFilterChange("dateFrom", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(event) => handleFilterChange("dateTo", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                {["Timestamp", "User", "Role", "Action", "Entity", "Entity ID", "IP Address", "Details"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>Loading audit logs...</td></tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    <p className="mb-4">{error}</p>
                    <AsyncButton onClick={fetchAuditLogs}>Retry</AsyncButton>
                  </td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>No audit logs found</td></tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>{formatDate(log.createdAt || log.timestamp)}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>{getUserLabel(log)}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>{getRoleLabel(log)}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>{log.action}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>{log.entityType || EMPTY}</td>
                    <td className="px-6 py-4 text-sm font-mono" style={{ color: theme.text.primary }}>{log.entityId || EMPTY}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>{log.ipAddress || EMPTY}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleViewDetails(log.id)}
                        disabled={detailsLoading && selectedLogId === log.id}
                        className="font-medium hover:opacity-70 disabled:opacity-50"
                        style={{ color: theme.accents.primary }}
                      >
                        {detailsLoading && selectedLogId === log.id ? "Loading..." : "View Details"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLogId && (
        <ActionModal title="Audit Log Details" onClose={closeDetails} className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {detailsLoading ? (
            <p className="text-center py-8" style={{ color: theme.text.secondary }}>Loading details...</p>
          ) : logDetails ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Timestamp", formatDate(logDetails.timestamp || logDetails.createdAt)],
                  ["User", `${getUserLabel(logDetails)} (${getRoleLabel(logDetails)})`],
                  ["Action", logDetails.action],
                  ["Entity", `${logDetails.entityType || EMPTY} (${logDetails.entityId || EMPTY})`],
                  ["IP Address", logDetails.ipAddress || EMPTY],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>{label}</span>
                    <p className="text-sm mt-1 break-words" style={{ color: theme.text.primary }}>{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: theme.text.primary }}>Changes</h4>
                {logDetails.changes && logDetails.changes.length > 0 ? (
                  <div className="rounded border overflow-hidden" style={{ borderColor: theme.borders.light }}>
                    <table className="w-full text-sm">
                      <thead style={{ backgroundColor: theme.backgrounds.secondary }}>
                        <tr>
                          {["Field", "Old Value", "New Value"].map((header) => (
                            <th key={header} className="px-4 py-2 text-left font-medium" style={{ color: theme.text.secondary }}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {logDetails.changes.map((change) => (
                          <tr key={change.field} style={{ borderTop: `1px solid ${theme.borders.light}` }}>
                            <td className="px-4 py-2 font-mono text-xs align-top" style={{ color: theme.text.primary }}>{change.field}</td>
                            <td className="px-4 py-2 align-top" style={{ color: theme.text.secondary }}>
                              <pre className="whitespace-pre-wrap font-sans max-h-32 overflow-y-auto">{change.oldValue}</pre>
                            </td>
                            <td className="px-4 py-2 align-top" style={{ color: theme.text.primary }}>
                              <pre className="whitespace-pre-wrap font-sans max-h-32 overflow-y-auto">{change.newValue}</pre>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm italic" style={{ color: theme.text.secondary }}>No state changes recorded.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center py-8 text-red-500">Failed to load details.</p>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={closeDetails}
              disabled={detailsLoading}
              className="px-4 py-2 rounded font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.primary, border: `1px solid ${theme.borders.medium}` }}
            >
              Close
            </button>
          </div>
        </ActionModal>
      )}
    </div>
  );
}
