"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { getOrders, getPartOrders } from "@/lib/api/orders";

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

  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<any[]>([]);

  // Fetch branches
  useEffect(() => {
    import("@/lib/api/inventory").then(({ getBranches }) => {
      getBranches().then((data: any) => setBranches(data.branches || []));
    }).catch(console.error);
  }, []);

  // Set branch filter to user's branch if not admin
  useEffect(() => {
    if (!isAdmin && user?.branchId) {
      setFilters((prev) => ({ ...prev, branch: user.branchId || "" }));
    }
  }, [isAdmin, user?.branchId]);

  // Fetch sales data
  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const [ordersRes, partOrdersRes] = await Promise.all([
          getOrders({
            branchId: filters.branch,
            search: filters.search
          }).catch(() => ({ orders: [] })),
          getPartOrders({
            branchId: filters.branch,
            search: filters.search
          }).catch(() => ({ orders: [] })),
        ]);
        
        const allOrders = [
          ...(ordersRes.orders || []).map((o: any) => ({ ...o, type: "BIKE" })),
          ...(partOrdersRes.orders || []).map((o: any) => ({ ...o, type: "PART" }))
        ];
        
        // Filter out incomplete orders to show only actual sales
        const completedStatuses = ["PAID", "CONFIRMED", "READY_FOR_DELIVERY", "DELIVERED"];
        const completed = allOrders
          .filter((o) => completedStatuses.includes(o.status))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setSales(completed);
      } catch (error) {
        console.error("Failed to fetch sales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    // Prevent non-admins from changing branch filter
    if (key === "branch" && !isAdmin) {
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportCSV = () => {
    const headers = [
      "Order Number",
      "Customer",
      "Items",
      "Total (Rs)",
      "Source",
      "Status",
      "Staff",
      "Date",
    ];

    const csvRows = sales.map((sale) => [
      sale.orderNumber,
      `"${sale.customerName}"`,
      `"${sale.type === "BIKE" ? `${sale.bike?.model?.brand} ${sale.bike?.model?.modelName}` : `${sale.part?.name} (x${sale.quantity})`}"`,
      sale.negotiatedAmount || sale.totalAmount || sale.amount || 0,
      sale.type,
      sale.status,
      `"${sale.processedBy?.fullName || ""}"`,
      new Date(sale.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sales_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
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
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8" style={{ color: theme.text.secondary }}>
                    Loading sales records...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8" style={{ color: theme.text.secondary }}>
                    No completed sales found
                  </td>
                </tr>
              ) : sales.map((sale) => (
                <tr 
                  key={sale.id} 
                  onClick={() => router.push(`/orders/${sale.id}`)}
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
                    {sale.type === "BIKE" ? `${sale.bike?.model?.brand} ${sale.bike?.model?.modelName}` : `${sale.part?.name} (x${sale.quantity})`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                    Rs. {(sale.negotiatedAmount || sale.totalAmount || sale.amount || 0).toLocaleString()}
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
                        backgroundColor: "#22c55e20",
                        color: "#22c55e",
                        border: `1px solid #22c55e`,
                      }}
                    >
                      {sale.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                    {sale.processedBy?.fullName || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      href={`/orders/${sale.id}`}
                      className="text-sm font-medium transition-colors hover:opacity-70"
                      style={{ color: theme.accents.primary }}
                    >
                      View Order
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export CSV */}
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
