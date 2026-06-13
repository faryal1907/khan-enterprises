"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole, OrderStatus, Order } from "@/lib/types";
import { getBranches } from "@/lib/api/inventory";
import { getOrders as fetchOrders, getPartOrders as fetchPartOrders } from "@/lib/api/orders";
import { toast } from "sonner";

export default function OrdersListPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [filters, setFilters] = useState({
    status: "",
    branchId: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"BIKE" | "PART">("BIKE");

  // Fetch branches on load
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getBranches();
        setBranches(data.branches || []);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };
    fetchBranches();
  }, []);

  // Set branch filter to user's branch if not admin
  useEffect(() => {
    if (!isAdmin && user?.branchId) {
      setFilters((prev) => ({ ...prev, branchId: user.branchId || "" }));
    }
  }, [isAdmin, user?.branchId]);

  // Fetch orders when filters or tab change
  useEffect(() => {
    const fetchOrdersData = async () => {
      setLoading(true);
      try {
        if (activeTab === "BIKE") {
          const res = await fetchOrders(filters).catch(() => ({ orders: [] }));
          setOrders((res.orders || []).map((o: any) => ({ ...o, type: "BIKE" })));
        } else {
          const res = await fetchPartOrders(filters).catch(() => ({ orders: [] }));
          setOrders((res.orders || []).map((o: any) => ({ ...o, type: "PART" })));
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersData();
  }, [filters, activeTab]);

  const handleFilterChange = (key: string, value: string) => {
    // Prevent non-admins from changing branch filter
    if (key === "branchId" && !isAdmin) {
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return "#f59e0b"; // amber
      case OrderStatus.PAID:
        return "#3b82f6"; // blue
      case OrderStatus.CONFIRMED:
        return "#6366f1"; // indigo
      case OrderStatus.READY_FOR_DELIVERY:
        return "#a855f7"; // purple
      case OrderStatus.DELIVERED:
        return "#22c55e"; // green
      case OrderStatus.CANCELLED:
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.text.primary }}
          >
            Orders
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Manage customer orders and payments
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 mb-6 border-b" style={{ borderColor: theme.borders.light }}>
          <button
            onClick={() => setActiveTab("BIKE")}
            className="px-2 py-3 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor: activeTab === "BIKE" ? theme.accents.primary : "transparent",
              color: activeTab === "BIKE" ? theme.text.primary : theme.text.secondary,
            }}
          >
            Bike Orders
          </button>
          <button
            onClick={() => setActiveTab("PART")}
            className="px-2 py-3 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor: activeTab === "PART" ? theme.accents.primary : "transparent",
              color: activeTab === "PART" ? theme.text.primary : theme.text.secondary,
            }}
          >
            Part Orders
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
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Status</option>
                <option value={OrderStatus.PENDING_PAYMENT}>Pending Payment</option>
                <option value={OrderStatus.PAID}>Paid</option>
                <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                <option value={OrderStatus.READY_FOR_DELIVERY}>Ready for Delivery</option>
                <option value={OrderStatus.DELIVERED}>Delivered</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
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
                value={filters.branchId}
                onChange={(e) => handleFilterChange("branchId", e.target.value)}
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
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
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
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
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
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
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
          className="rounded-lg overflow-hidden overflow-x-auto"
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
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm" style={{ color: theme.text.secondary }}>
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm" style={{ color: theme.text.secondary }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: `1px solid ${theme.borders.light}`, cursor: "pointer" }}
                    onClick={() => {
                      if ((order as any).type === "BIKE") {
                        router.push(`/orders/${order.id}`);
                      } else {
                        toast.info("Part order details page not yet implemented");
                      }
                    }}
                    className="hover:opacity-80"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: theme.text.primary }}>
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {(order as any).type === "BIKE" ? `${order.bike?.model?.brand} ${order.bike?.model?.modelName}` : `${(order as any).part?.name} (x${(order as any).quantity})`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {order.branch?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      Rs. {((order as any).type === "BIKE" ? order.negotiatedAmount : (order as any).amount)?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className="inline-block px-2 py-1 text-xs font-medium rounded"
                        style={{
                          backgroundColor: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                          border: `1px solid ${getStatusColor(order.status)}`,
                        }}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              )}
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
