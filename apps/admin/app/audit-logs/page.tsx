"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";

type AuditLog = {
  id: string;
  timestamp: string;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  ipAddress: string | null;
  details: any;
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
        const res = await api.get("/audit-logs");
        setAuditLogs(res.data.auditLogs || []);
      } catch (err) {
        setError("Failed to load audit logs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const handleExportCSV = () => {
    const headers = ["Timestamp", "User", "Role", "Action", "Entity", "Entity ID", "IP Address", "Details"];
    const rows = auditLogs.map((log) => [
      new Date(log.timestamp).toLocaleString(),
      log.userEmail || "—",
      log.userRole || "—",
      log.action,
      log.entityType || "—",
      log.entityId || "—",
      log.ipAddress || "—",
      JSON.stringify(log.details),
    ]);

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
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: theme.text.primary }}
                    >
                      {log.userEmail || "—"}
                    </td>

                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: theme.text.primary }}
                    >
                      {log.userRole || "—"}
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
    </div>
  );
}