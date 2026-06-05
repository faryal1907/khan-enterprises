"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";

export default function SalesRecordsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [filters, setFilters] = useState({
    dateRange: "",
    staff: "",
    branch: "",
    search: "",
  });

  // Set branch filter to user's branch if not admin
  useEffect(() => {
    if (!isAdmin && user?.branchId) {
      setFilters((prev) => ({ ...prev, branch: user.branchId || "" }));
    }
  }, [isAdmin, user?.branchId]);

  const handleFilterChange = (key: string, value: string) => {
    // Prevent non-admins from changing branch filter
    if (key === "branch" && !isAdmin) {
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: theme.text.primary }}
            >
              Sales Records
            </h1>
            <p style={{ color: theme.text.secondary }}>
              View all completed sales (confirmed, paid, and delivered orders)
            </p>
          </div>
          <button
            onClick={() => router.push("/sales/new")}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Register Sale
          </button>
        </div>

        {/* Filters */}
        <div
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Staff
              </label>
              <select
                value={filters.staff}
                onChange={(e) => handleFilterChange("staff", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Staff</option>
                <option value="1">Staff Member 1</option>
                <option value="2">Staff Member 2</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Branch
              </label>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange("branch", e.target.value)}
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                  opacity: !isAdmin ? 0.6 : 1,
                }}
              >
                <option value="">All Branches</option>
                <option value="1">Islamabad HQ</option>
                <option value="2">Tordher Branch</option>
              </select>
              {!isAdmin && (
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  Filtered to your branch
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                placeholder="Order number or customer"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <table className="w-full">
            <thead>
              <tr
                style={{ backgroundColor: theme.backgrounds.secondary }}
              >
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className="inline-block px-2 py-1 text-xs font-medium rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      color: theme.text.secondary,
                      border: `1px solid ${theme.borders.medium}`,
                    }}
                  >
                    —
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className="inline-block px-2 py-1 text-xs font-medium rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      color: theme.text.secondary,
                      border: `1px solid ${theme.borders.medium}`,
                    }}
                  >
                    —
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a
                    href="/orders/1"
                    className="text-sm font-medium transition-colors hover:opacity-70"
                    style={{ color: theme.accents.primary }}
                  >
                    View Order
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Export CSV */}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
