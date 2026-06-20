"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { theme, colors } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { getOrders } from "@/lib/api/orders";
import { getPartOrders } from "@/lib/api/part-orders";

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        return "Expired";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full"
      style={{
        backgroundColor: timeLeft === "Expired" ? "#FEE2E2" : "#FEF3C7",
        color: timeLeft === "Expired" ? "#991B1B" : "#92400E",
        border: timeLeft === "Expired" ? "1px solid #EF4444" : "1px solid #F59E0B",
      }}
    >
      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: timeLeft === "Expired" ? "#EF4444" : "#F59E0B" }} />
      {timeLeft === "Expired" ? "Order Expired" : `Pay in: ${timeLeft}`}
    </div>
  );
}

interface UnifiedOrder {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  expiresAt?: string;
  type: "BIKE" | "PART";
  
  // Bike order fields
  bike?: {
    model: {
      brand: string;
      modelName: string;
      year: number;
    };
    branch?: {
      name: string;
      city: string;
    };
  };
  negotiatedAmount?: number;
  
  // Part order fields
  part?: {
    name: string;
    sku: string;
  };
  quantity?: number;
  amount?: number;
  branch?: {
    name: string;
    city: string;
  };
}

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setOrders([]);  // clear stale data immediately so a previous session's orders never show
      const [bikesRes, partsRes] = await Promise.all([
        getOrders({ isCustomerView: true, isCompleted: activeTab === "history" }).catch(() => ({ orders: [] })),
        getPartOrders({ isCustomerView: true, isCompleted: activeTab === "history" }).catch(() => ({ orders: [] }))
      ]);

      const bikes: UnifiedOrder[] = (bikesRes.orders || []).map((o: any) => ({
        ...o,
        type: "BIKE"
      }));

      const parts: UnifiedOrder[] = (partsRes.orders || []).map((o: any) => ({
        ...o,
        type: "PART"
      }));

      const merged = [...bikes, ...parts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(merged);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [user, router, activeTab, fetchOrders]);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          border: "1px solid #F59E0B",
        };
      case "VERIFICATION_PENDING":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          border: "1px solid #D97706",
        };
      case "PAID":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
          border: "1px solid #3B82F6",
        };
      case "CONFIRMED":
        return {
          backgroundColor: "#E0E7FF",
          color: "#3730A3",
          border: "1px solid #6366F1",
        };
      case "READY_FOR_DELIVERY":
        return {
          backgroundColor: "#F3E8FF",
          color: "#6B21A8",
          border: "1px solid #A855F7",
        };
      case "DELIVERED":
        return {
          backgroundColor: "#D1FAE5",
          color: "#065F46",
          border: "1px solid #10B981",
        };
      case "CANCELLED":
        return {
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #EF4444",
        };
      default:
        return {
          backgroundColor: theme.backgrounds.tertiary,
          color: theme.text.secondary,
          border: `1px solid ${theme.borders.medium}`,
        };
    }
  };

  const getDisplayStatus = (order: UnifiedOrder) => {
    // 1. Terminal/Completed statuses always take precedence
    if (["DELIVERED", "CANCELLED", "PAID", "CONFIRMED", "READY_FOR_DELIVERY"].includes(order.status)) {
      return order.status;
    }
    
    // 2. Check for verification pending on online payments
    const hasVerificationPending = (order as any).transactions?.some((tx: any) => tx.status === "VERIFICATION_PENDING");
    if (hasVerificationPending) return "VERIFICATION_PENDING";
    
    // 3. Default fallback
    return order.status;
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ");
  };

  // Filter orders based on activeTab (history vs current)
  // NOTE: backend subset already uses `isCompleted`, but we keep this for UI safety.
  // Treat both delivered and cancelled as history, everything else as current.
  const filteredOrders = orders.filter((order) => {
    const isOrderCompleted = order.status === "DELIVERED" || order.status === "CANCELLED";
    return activeTab === "history" ? isOrderCompleted : !isOrderCompleted;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.accents.primary }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text.primary }}>
            My Orders
          </h1>
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Track your order status and details
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab("current");
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: activeTab === "current" ? theme.accents.primary : theme.backgrounds.tertiary,
                color: activeTab === "current" ? theme.text.inverse : theme.text.primary,
              }}
            >
              Current Orders
            </button>
            <button
              onClick={() => {
                setActiveTab("history");
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: activeTab === "history" ? theme.accents.primary : theme.backgrounds.tertiary,
                color: activeTab === "history" ? theme.text.inverse : theme.text.primary,
              }}
            >
              Order History
            </button>
          </div>
        </div>

        {error && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: "#FEE2E2", border: "1px solid #EF4444" }}
          >
            <p className="text-sm" style={{ color: "#991B1B" }}>{error}</p>
          </div>
        )}

        {filteredOrders.length === 0 && !error ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-lg mb-4" style={{ color: theme.text.secondary }}>
              {activeTab === "current" ? "You don't have any current orders" : "You don't have any order history"}
            </p>
            {activeTab === "current" && (
              <Link
                href="/bikes"
                className="inline-block px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                Browse Shop
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl p-6"
                style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span
                        className="inline-block px-3 py-1 text-xs font-medium rounded-full uppercase"
                        style={{
                          backgroundColor: order.type === "BIKE" ? colors.lime : theme.accents.primary,
                          color: theme.text.inverse,
                        }}
                      >
                        {order.type}
                      </span>
                      <span
                        className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                        style={getStatusBadgeStyle(getDisplayStatus(order))}
                      >
                        {getStatusLabel(getDisplayStatus(order))}
                      </span>
                      {activeTab === "current" && getDisplayStatus(order) === "PENDING_PAYMENT" && (order.expiresAt || order.createdAt) && (
                        <CountdownTimer expiresAt={order.expiresAt || order.createdAt} />
                      )}

                      <span className="text-xs" style={{ color: theme.text.muted }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {order.type === "BIKE" && order.bike ? (
                      <>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text.primary }}>
                          {order.bike.model.brand} {order.bike.model.modelName} ({order.bike.model.year})
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p style={{ color: theme.text.secondary }}>
                            <span className="font-medium" style={{ color: theme.text.primary }}>Order Number:</span> {order.orderNumber}
                          </p>
                          <p style={{ color: theme.text.secondary }}>
                            <span className="font-medium" style={{ color: theme.text.primary }}>Amount:</span> PKR {Number(order.negotiatedAmount).toLocaleString()}
                          </p>
                          <p style={{ color: theme.text.secondary }}>
                            <span className="font-medium" style={{ color: theme.text.primary }}>Branch:</span> {order.bike.branch?.name || "N/A"}, {order.bike.branch?.city || "N/A"}
                          </p>
                        </div>
                      </>
                    ) : order.type === "PART" && order.part ? (
                      <>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text.primary }}>
                          {order.part.name} (Qty: {order.quantity})
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p style={{ color: theme.text.secondary }}>
                            <span className="font-medium" style={{ color: theme.text.primary }}>Order Number:</span> {order.orderNumber}
                          </p>
                          <p style={{ color: theme.text.secondary }}>
                            <span className="font-medium" style={{ color: theme.text.primary }}>Amount:</span> PKR {Number(order.amount).toLocaleString()}
                          </p>
                          <p style={{ color: theme.text.secondary }}>
                            <span className="font-medium" style={{ color: theme.text.primary }}>SKU:</span> {order.part.sku}
                          </p>
                          <p style={{ color: theme.text.secondary }}>
                            <span className="font-medium" style={{ color: theme.text.primary }}>Branch:</span> {order.branch?.name || "N/A"}, {order.branch?.city || "N/A"}
                          </p>
                        </div>
                      </>
                    ) : null}
                  </div>
                  {(order.type === "BIKE" || order.type === "PART") ? (
                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity text-center"
                      style={{
                        backgroundColor: theme.accents.primary,
                        color: theme.text.inverse,
                      }}
                    >
                      View Details
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
