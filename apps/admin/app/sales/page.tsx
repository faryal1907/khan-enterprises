"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { getBranches } from "@/lib/api/inventory";
import { getOrders, getPartOrders, type OrderFilters } from "@/lib/api/orders";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { Branch, OrderStatus, PaymentStatus, UserRole } from "@/lib/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { AsyncButton } from "@/components/async-button";

type StaffOption = {
  id: string;
  fullName: string;
  role: string;
};

type SaleRecord = {
  id: string;
  orderNumber: string;
  customerName: string;
  negotiatedAmount?: number;
  totalAmount?: number;
  amount?: number;
  quantity?: number;
  status: OrderStatus;
  type: "BIKE" | "PART";
  createdAt: string;
  bike?: {
    model?: {
      brand?: string;
      modelName?: string;
    };
  };
  part?: {
    name?: string;
  };
  processedBy?: {
    id: string;
    fullName: string;
  } | null;
  transactions?: Array<{ status: PaymentStatus }>;
};

const completedStatuses = new Set<OrderStatus>([
  OrderStatus.PAID,
  OrderStatus.CONFIRMED,
  OrderStatus.READY_FOR_DELIVERY,
  OrderStatus.DELIVERED,
]);

function getDateRange(range: string) {
  const now = new Date();
  const start = new Date(now);

  if (range === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (range === "week") {
    start.setDate(now.getDate() - 7);
  } else if (range === "month") {
    start.setMonth(now.getMonth() - 1);
  } else if (range === "year") {
    start.setFullYear(now.getFullYear() - 1);
  } else {
    return {};
  }

  return {
    dateFrom: start.toISOString(),
    dateTo: now.toISOString(),
  };
}

function getSaleAmount(sale: SaleRecord) {
  return Number(sale.negotiatedAmount || sale.totalAmount || sale.amount || 0);
}

function getSaleItemLabel(sale: SaleRecord) {
  if (sale.type === "BIKE") {
    return `${sale.bike?.model?.brand || ""} ${sale.bike?.model?.modelName || ""}`.trim() || "Bike";
  }

  return `${sale.part?.name || "Part"} (x${sale.quantity || 0})`;
}



function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function SalesRecordsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isBranchScoped = !isAdmin && Boolean(user?.branchId);

  const [filters, setFilters] = useState({
    dateRange: "",
    staff: "",
    branch: "",
    search: "",
  });
  const debouncedSearch = useDebouncedValue(filters.search, 300);

  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [staffList, setStaffList] = useState<StaffOption[]>([]);

  useEffect(() => {
    if (!user) return;

    getBranches()
      .then((data) => setBranches(data.branches || []))
      .catch(() => setBranches([]));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (isBranchScoped) {
      setFilters((prev) => ({ ...prev, branch: user.branchId || "" }));
    }
  }, [isBranchScoped, user]);

  useEffect(() => {
    if (!user) return;
    if (!isAdmin && user.role !== UserRole.MANAGER) return;

    api.get("/auth/users")
      .then((res) => {
        const users = res.data.users || [];
        setStaffList(users.filter((staff: StaffOption) => (
          staff.role === UserRole.SALES_STAFF || staff.role === UserRole.MANAGER
        )));
      })
      .catch(() => setStaffList([]));
  }, [isAdmin, user]);

  const requestFilters = useMemo<OrderFilters>(() => ({
    branchId: filters.branch || undefined,
    processedById: filters.staff || undefined,
    search: debouncedSearch || undefined,
    limit: 100,
    ...getDateRange(filters.dateRange),
  }), [debouncedSearch, filters.branch, filters.dateRange, filters.staff]);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [ordersRes, partOrdersRes] = await Promise.all([
        getOrders(requestFilters),
        getPartOrders(requestFilters),
      ]);

      const records: SaleRecord[] = [
        ...(ordersRes.orders || []).map((order: Omit<SaleRecord, "type">) => ({ ...order, type: "BIKE" as const })),
        ...(partOrdersRes.orders || []).map((order: Omit<SaleRecord, "type">) => ({ ...order, type: "PART" as const })),
      ];

      const completed = records
        .filter((sale) => completedStatuses.has(sale.status))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setSales(completed);
    } catch (fetchError: any) {
      setError(fetchError.response?.data?.message || "Failed to load sales records");
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, [requestFilters]);

  useEffect(() => {
    if (!user) return;
    fetchSales();
  }, [fetchSales, user]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    if (key === "branch" && isBranchScoped) return;
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportCSV = () => {
    const headers = ["Order Number", "Customer", "Items", "Total (Rs)", "Source", "Status", "Staff", "Date"];
    const rows = sales.map((sale) => [
      sale.orderNumber,
      sale.customerName,
      getSaleItemLabel(sale),
      getSaleAmount(sale),
      sale.type,
      sale.status,
      sale.processedBy?.fullName || "",
      new Date(sale.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sales_export_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
              Sales Records
            </h1>
            <p style={{ color: theme.text.secondary }}>
              View completed bike and part sales from orders and part orders
            </p>
          </div>
          <AsyncButton onClick={() => router.push("/sales/new")}>
            Register Sale
          </AsyncButton>
        </div>

        <div
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
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
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last 12 Months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Staff
              </label>
              <select
                value={filters.staff}
                onChange={(e) => handleFilterChange("staff", e.target.value)}
                disabled={staffList.length === 0}
                className="w-full px-3 py-2 rounded text-sm disabled:opacity-60"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Staff</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.fullName} ({staff.role.replace(/_/g, " ")})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Branch
              </label>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange("branch", e.target.value)}
                disabled={isBranchScoped}
                className="w-full px-3 py-2 rounded text-sm disabled:opacity-60"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
              {!isAdmin && (
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  {isBranchScoped ? "Filtered to your assigned branch" : "No branch assigned, global sales view"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
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
                placeholder="Order, customer, phone, chassis"
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-lg overflow-x-auto"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                {["Order Number", "Customer", "Items", "Total", "Source", "Status", "Staff", "Date", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8" style={{ color: theme.text.secondary }}>
                    Loading sales records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="text-center py-8" style={{ color: theme.text.secondary }}>
                    <div className="flex flex-col items-center gap-3">
                      <span>{error}</span>
                      <AsyncButton onClick={fetchSales}>Retry</AsyncButton>
                    </div>
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8" style={{ color: theme.text.secondary }}>
                    No completed sales found
                  </td>
                </tr>
              ) : sales.map((sale) => {
                const statusColor = "#22c55e";

                return (
                  <tr
                    key={`${sale.type}-${sale.id}`}
                    onClick={() => router.push(sale.type === "PART" ? `/part-orders/${sale.id}` : `/orders/${sale.id}`)}
                    className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    style={{ borderBottom: `1px solid ${theme.borders.light}` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: theme.text.primary }}>
                      {sale.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {sale.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {getSaleItemLabel(sale)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      Rs. {getSaleAmount(sale).toLocaleString()}
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
                        {sale.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className="inline-block px-2 py-1 text-xs font-medium rounded uppercase"
                        style={{
                          backgroundColor: `${statusColor}20`,
                          color: statusColor,
                          border: `1px solid ${statusColor}`,
                        }}
                      >
                        {sale.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {sale.processedBy?.fullName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(sale.type === "PART" ? `/part-orders/${sale.id}` : `/orders/${sale.id}`);
                        }}
                        className="text-sm font-medium transition-colors hover:opacity-70 bg-transparent border-none p-0 cursor-pointer"
                        style={{ color: theme.accents.primary }}
                      >
                        View Order
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleExportCSV}
            disabled={sales.length === 0}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
