"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AsyncButton } from "@/components/async-button";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { getBranches } from "@/lib/api/inventory";
import { getOrders, getPartOrders, type OrderFilters } from "@/lib/api/orders";
import { getDashboardStats } from "@/lib/api/dashboard";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { Branch, DashboardStats, Order, OrderStatus, UserRole } from "@/lib/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type OrderKind = "BIKE" | "PART";
type OrderRow = Order & {
  type: OrderKind;
  amount?: number;
  quantity?: number;
  part?: { name?: string };
};

function getOrderItemLabel(order: OrderRow) {
  if (order.type === "BIKE") {
    return `${order.bike?.model?.brand || ""} ${order.bike?.model?.modelName || ""}`.trim() || "Bike";
  }

  return `${order.part?.name || "Part"} (x${order.quantity || 0})`;
}

function getOrderAmount(order: OrderRow) {
  return Number(order.type === "BIKE" ? order.bike?.actualSalePrice : order.amount || 0);
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function OrdersListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isBranchScoped = !isAdmin && Boolean(user?.branchId);

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    branchId: "",
    dateFrom: "",
    dateTo: "",
    search: "",
    orderType: "",
    pickupType: "",
  });
  const debouncedSearch = useDebouncedValue(filters.search, 300);

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<OrderKind>((searchParams.get("type") as OrderKind) || "BIKE");

  useEffect(() => {
    if (!user) return;

    getBranches()
      .then((data) => setBranches(data.branches || []))
      .catch(() => setBranches([]));
      
    getDashboardStats()
      .then((data) => setStats(data))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (isBranchScoped) {
      setFilters((prev) => ({ ...prev, branchId: user.branchId || "" }));
    }
  }, [isBranchScoped, user]);

  const requestFilters = useMemo<OrderFilters>(() => ({
    status: filters.status || undefined,
    branchId: filters.branchId || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
    search: debouncedSearch || undefined,
    orderType: filters.orderType || undefined,
    pickupType: filters.pickupType || undefined,
    limit: 100,
  }), [debouncedSearch, filters.branchId, filters.dateFrom, filters.dateTo, filters.status, filters.orderType, filters.pickupType]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const response = activeTab === "BIKE"
        ? await getOrders(requestFilters)
        : await getPartOrders(requestFilters);

      setOrders((response.orders || []).map((order: Omit<OrderRow, "type">) => ({
        ...order,
        type: activeTab,
      })));
    } catch (fetchError: any) {
      setError(fetchError.response?.data?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, requestFilters, user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    if (key === "branchId" && isBranchScoped) return;
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportCSV = () => {
    const headers = ["Order Number", "Item Type", "Order Type", "Pickup Type", "Customer", "Item", "Branch", "Amount", "Payment Method", "Status", "Created Date"];
    const rows = orders.map((order) => [
      order.orderNumber,
      order.type,
      order.orderType || "-",
      order.pickupType || "-",
      order.customerName,
      getOrderItemLabel(order),
      order.branch?.name || "",
      getOrderAmount(order),
      order.paymentMethod || "",
      order.status,
      new Date(order.createdAt).toLocaleDateString(),
    ]);

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeTab.toLowerCase()}_orders_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 py-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.text.primary }}>
            Orders
          </h1>
          <p className="text-sm md:text-base" style={{ color: theme.text.secondary }}>
            Manage bike and part customer orders.
          </p>
        </div>

        <div className="flex space-x-4 md:space-x-6 mb-4 md:mb-6 border-b overflow-x-auto scrollbar-hide" style={{ borderColor: theme.borders.light }}>
          {(["BIKE", "PART"] as OrderKind[]).map((tab) => {
            const pendingCount = tab === "BIKE" ? stats?.bikeOrdersWaitingPayment : stats?.partOrdersWaitingPayment;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-2 py-3 text-sm font-medium border-b-2 transition-colors relative"
                style={{
                  borderColor: activeTab === tab ? theme.accents.primary : "transparent",
                  color: activeTab === tab ? theme.text.primary : theme.text.secondary,
                }}
              >
                {tab === "BIKE" ? "Bike Orders" : "Part Orders"}
                {!!pendingCount && pendingCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white ">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          className="rounded-lg p-4 md:p-5 mb-4 md:mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(event) => handleFilterChange("status", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Statuses</option>
                <option value={OrderStatus.PENDING_PAYMENT}>Pending Payment</option>
                <option value={OrderStatus.PAID}>Paid</option>
                <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                <option value={OrderStatus.READY_FOR_DELIVERY}>Ready for Delivery</option>
                <option value={OrderStatus.DELIVERED}>Delivered</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Branch
              </label>
              <select
                value={filters.branchId}
                onChange={(event) => handleFilterChange("branchId", event.target.value)}
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
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {!isAdmin && (
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  {isBranchScoped ? "Filtered to your assigned branch" : "No branch assigned, global orders view"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(event) => handleFilterChange("dateFrom", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(event) => handleFilterChange("dateTo", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(event) => handleFilterChange("search", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                placeholder="Order, customer, phone, chassis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Order Type
              </label>
              <select
                value={filters.orderType}
                onChange={(event) => handleFilterChange("orderType", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Types</option>
                <option value="ONLINE">Online</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Pickup Type
              </label>
              <select
                value={filters.pickupType}
                onChange={(event) => handleFilterChange("pickupType", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Pickups</option>
                <option value="DELIVERY">Delivery</option>
                <option value="ONSITE_PICKUP">Onsite Pickup</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg overflow-x-auto"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                {["Order Number", "Type", "Pickup", "Customer", "Item", "Branch", "Amount", "Payment Method", "Status", "Created Date"].map((header) => (
                  <th key={header} className="px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-3 md:px-6 py-6 md:py-8 text-center text-sm md:text-base" style={{ color: theme.text.secondary }}>
                    Loading orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="px-3 md:px-6 py-6 md:py-8 text-center text-sm md:text-base" style={{ color: theme.text.secondary }}>
                    <div className="flex flex-col items-center gap-3">
                      <span>{error}</span>
                      <AsyncButton onClick={fetchOrders}>Retry</AsyncButton>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 md:px-6 py-6 md:py-8 text-center text-sm md:text-base" style={{ color: theme.text.secondary }}>
                    No orders found
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr
                  key={`${order.type}-${order.id}`}
                  style={{ borderBottom: `1px solid ${theme.borders.light}`, cursor: "pointer" }}
                  onClick={() => router.push(order.type === "BIKE" ? `/orders/${order.id}` : `/part-orders/${order.id}`)}
                  className="hover:opacity-80"
                >
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium" style={{ color: theme.text.primary }}>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={order.type === "BIKE" ? `/orders/${order.id}` : `/part-orders/${order.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline text-inherit"
                      >
                        {order.orderNumber}
                      </Link>
                      {Number((order as any).balanceDue) > 0 && (
                        <span className="text-yellow-500" title="Outstanding balance">
                          ★
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                    {order.orderType === "ONLINE" ? "Online" : "Onsite"}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                    {order.pickupType === "DELIVERY" ? "Delivery" : "Pickup"}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                    {order.customerName}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                    {getOrderItemLabel(order)}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                    {order.branch?.name || "-"}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                    Rs. {getOrderAmount(order).toLocaleString()}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                    {order.paymentMethod?.replace(/_/g, " ") || "-"}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end mt-3 md:mt-4">
          <button
            onClick={handleExportCSV}
            disabled={orders.length === 0}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-center"
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
