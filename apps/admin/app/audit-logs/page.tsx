"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { toast } from "sonner";

type AuditLog = {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  ipAddress: string | null;
  createdAt?: string;
  timestamp?: string;
  oldValue?: any;
  newValue?: any;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  // Fallbacks for older mapped records
  userId?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  details?: any;
};

export default function AuditLogsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [filters, setFilters] = useState({
    user: "",
    action: "",
    entity: "",
    dateFrom: "",
    dateTo: "",
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [logDetails, setLogDetails] = useState<any>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // Role check: Admin only
  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      router.push("/");
    }
  }, [user, router]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (filters.user) params.user = filters.user;
        if (filters.action) params.action = filters.action;
        if (filters.entity) params.entity = filters.entity;
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;

        const res = await api.get("/audit-logs", { params });
        setAuditLogs(res.data.auditLogs || []);
      } catch (err) {
        setError("Failed to load audit logs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [filters]);

  const handleViewDetails = async (logId: string) => {
    setSelectedLogId(logId);
    setIsDetailsLoading(true);
    setLogDetails(null);
    try {
      const res = await api.get(`/audit-logs/${logId}`);
      setLogDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch audit log details:", err);
      toast.error("Failed to load audit log details");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Timestamp", "User", "Role", "Action", "Entity", "Entity ID", "IP Address", "Details"];
    const rows = auditLogs.map((log: any) => {
      // Create a simplified details string from oldValue/newValue if present
      let detailsString = "—";
      if (log.oldValue || log.newValue) {
         detailsString = `Old: ${JSON.stringify(log.oldValue)} | New: ${JSON.stringify(log.newValue)}`;
      }

      return [
        new Date(log.timestamp || log.createdAt).toLocaleString(),
        log.user?.email || log.userEmail || "—",
        log.user?.role || log.userRole || "—",
        log.action,
        log.entityType || "—",
        log.entityId || "—",
        log.ipAddress || "—",
        `"${detailsString.replace(/"/g, '""')}"`, // Quote it for CSV
      ];
    });

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "audit-logs.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: theme.text.primary }}
            >
              Audit Logs
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: theme.text.secondary }}
            >
              Track all system activity and changes.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
              style={{
                backgroundColor: theme.accents.primary,
                color: theme.text.inverse,
              }}
            >
              Export CSV
            </button>
            
          </div>
        </div>

        {/* Filters */}
        <div
          className="rounded-lg p-4 mb-6"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                User
              </label>

              <input
                type="text"
                value={filters.user}
                onChange={(e) =>
                  handleFilterChange("user", e.target.value)
                }
                placeholder="Search user"
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Action
              </label>

              <select
                value={filters.action}
                onChange={(e) =>
                  handleFilterChange("action", e.target.value)
                }
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="LOGIN">Login</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Entity
              </label>

              <select
                value={filters.entity}
                onChange={(e) =>
                  handleFilterChange("entity", e.target.value)
                }
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Entities</option>
                <option value="BIKE">Bike</option>
                <option value="ORDER">Order</option>
                <option value="SALE">Sale</option>
                <option value="DELIVERY">Delivery</option>
                <option value="PART">Part</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                From
              </label>

              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  handleFilterChange("dateFrom", e.target.value)
                }
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                To
              </label>

              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  handleFilterChange("dateTo", e.target.value)
                }
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <table className="w-full">
            <thead>
              <tr
                style={{ backgroundColor: theme.backgrounds.secondary }}
              >
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: theme.text.secondary }}
                >
                  Timestamp
                </th>

                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: theme.text.secondary }}
                >
                  User
                </th>

                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: theme.text.secondary }}
                >
                  Role
                </th>

                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: theme.text.secondary }}
                >
                  Action
                </th>

                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: theme.text.secondary }}
                >
                  Entity
                </th>

                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: theme.text.secondary }}
                >
                  Entity ID
                </th>

                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: theme.text.secondary }}
                >
                  IP Address
                </th>

                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: theme.text.secondary }}
                >
                  Details
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    {error}
                  </td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    No audit logs found
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: `1px solid ${theme.borders.light}`,
                    }}
                  >
                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: theme.text.primary }}
                    >
                      {new Date((log.createdAt || log.timestamp) as string).toLocaleString()}
                    </td>

                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: theme.text.primary }}
                    >
                      {log.user?.email || log.userEmail || "—"}
                    </td>

                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: theme.text.primary }}
                    >
                      {log.user?.role || log.userRole || "—"}
                    </td>

                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: theme.text.primary }}
                    >
                      {log.action}
                    </td>

                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: theme.text.primary }}
                    >
                      {log.entityType || "—"}
                    </td>

                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: theme.text.primary }}
                    >
                      {log.entityId || "—"}
                    </td>

                <td
                  className="px-6 py-4 text-sm"
                  style={{ color: theme.text.primary }}
                >
                  {log.ipAddress || "—"}
                </td>

                <td
                  className="px-6 py-4 text-sm"
                  style={{ color: theme.text.primary }}
                >
                  <button
                    onClick={() => handleViewDetails(log.id)}
                    className="font-medium hover:opacity-70"
                    style={{ color: theme.accents.primary }}
                  >
                    View Details
                  </button>
                </td>

              </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedLogId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-2xl rounded-lg p-6 shadow-xl max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: theme.backgrounds.primary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: theme.text.primary }}
            >
              Audit Log Details
            </h3>

            {isDetailsLoading ? (
              <p className="text-center py-8" style={{ color: theme.text.secondary }}>Loading details...</p>
            ) : logDetails ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>Timestamp</span>
                    <p className="text-sm mt-1" style={{ color: theme.text.primary }}>{new Date(logDetails.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>User</span>
                    <p className="text-sm mt-1" style={{ color: theme.text.primary }}>{logDetails.userEmail || "System"} ({logDetails.userRole || "—"})</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>Action</span>
                    <p className="text-sm mt-1" style={{ color: theme.text.primary }}>{logDetails.action}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>Entity</span>
                    <p className="text-sm mt-1" style={{ color: theme.text.primary }}>{logDetails.entityType} ({logDetails.entityId})</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: theme.text.primary }}>Changes</h4>
                  {logDetails.changes && logDetails.changes.length > 0 ? (
                    <div className="rounded border overflow-hidden" style={{ borderColor: theme.borders.light }}>
                      <table className="w-full text-sm">
                        <thead style={{ backgroundColor: theme.backgrounds.secondary }}>
                          <tr>
                            <th className="px-4 py-2 text-left font-medium" style={{ color: theme.text.secondary }}>Field</th>
                            <th className="px-4 py-2 text-left font-medium" style={{ color: theme.text.secondary }}>Old Value</th>
                            <th className="px-4 py-2 text-left font-medium" style={{ color: theme.text.secondary }}>New Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: theme.borders.light }}>
                          {logDetails.changes.map((change: any, idx: number) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 font-mono text-xs" style={{ color: theme.text.primary }}>{change.field}</td>
                              <td className="px-4 py-2" style={{ color: theme.text.secondary }}>
                                <pre className="whitespace-pre-wrap font-sans max-h-24 overflow-y-auto">{change.oldValue}</pre>
                              </td>
                              <td className="px-4 py-2" style={{ color: theme.text.primary }}>
                                <pre className="whitespace-pre-wrap font-sans max-h-24 overflow-y-auto">{change.newValue}</pre>
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
                onClick={() => setSelectedLogId(null)}
                className="px-4 py-2 rounded font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.primary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}