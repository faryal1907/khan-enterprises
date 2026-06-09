"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { getOrders } from "@/lib/api/orders";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  negotiatedAmount: number;
  paymentMethod: string;
  createdAt: string;
  bike: {
    id: string;
    chassisNumber: string;
    model: {
      brand: string;
      modelName: string;
      year: number;
    };
    branch: {
      name: string;
      city: string;
    };
  };
}

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data.orders || []);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(err.response?.data?.message || "Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          border: "1px solid #F59E0B",
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

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ");
  };

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

        {error && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: "#FEE2E2", border: "1px solid #EF4444" }}
          >
            <p className="text-sm" style={{ color: "#991B1B" }}>{error}</p>
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-lg mb-4" style={{ color: theme.text.secondary }}>
              You don't have any orders yet
            </p>
            <Link
              href="/bikes"
              className="inline-block px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: theme.accents.primary,
                color: theme.text.inverse,
              }}
            >
              Browse Bikes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl p-6"
                style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                        style={getStatusBadgeStyle(order.status)}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="text-xs" style={{ color: theme.text.muted }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
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
                  </div>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
