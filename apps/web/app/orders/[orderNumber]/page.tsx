"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { getOrderByNumber } from "@/lib/api/orders";
import { getPartOrderByNumber } from "@/lib/api/part-orders";
import { createDeliveryRequest, getDeliveryByOrderId } from "@/lib/api/deliveries";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerCNIC?: string;
  customerAddress: string;
  negotiatedAmount?: number;
  amount?: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  type: "BIKE" | "PART";
  
  // Bike order fields
  bike?: {
    id: string;
    chassisNumber: string;
    engineNumber: string;
    model: {
      brand: string;
      modelName: string;
      year: number;
      basePrice: number;
    };
    branch: {
      id: string;
      name: string;
      city: string;
      address: string;
      phoneNumber: string | null;
    };
  };
  
  // Part order fields
  part?: {
    id: string;
    name: string;
    sku: string;
  };
  quantity?: number;
  branch?: {
    id: string;
    name: string;
    city: string;
    address: string;
    phoneNumber: string | null;
  };
  
  transactions: Array<{
    id: string;
    amount: number;
    method: string;
    status: string;
    gatewayReference: string | null;
    createdAt: string;
  }>;
  delivery: {
    id: string;
    deliveryAddress: string;
    preferredTimeWindow?: string;
    contactNumber: string;
    status: string;
    approvedAt: string | null;
    deliveredAt: string | null;
    createdAt: string;
    updatedAt: string;
    notes?: string;
  } | null;
}

export default function OrderStatusPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({
    deliveryAddress: "",
    preferredTimeWindow: "",
    contactNumber: "",
  });
  const [submittingDelivery, setSubmittingDelivery] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const orderNum = orderNumber as string;
      
      // Detect if it's a part order by the order number prefix
      if (orderNum.startsWith("PART-")) {
        const data = await getPartOrderByNumber(orderNum);
        setOrder({ ...data, type: "PART" });
      } else {
        const data = await getOrderByNumber(orderNum);
        setOrder({ ...data, type: "BIKE" });
      }
    } catch (err: any) {
      console.error("Failed to fetch order:", err);
      setError(err.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    try {
      setSubmittingDelivery(true);
      setDeliveryError("");
      await createDeliveryRequest(order.id, deliveryForm, order.type);
      // Refresh order data to show delivery status
      await fetchOrder();
      setShowDeliveryForm(false);
      setDeliveryForm({ deliveryAddress: "", preferredTimeWindow: "", contactNumber: "" });
    } catch (err: any) {
      console.error("Failed to create delivery request:", err);
      setDeliveryError(err.response?.data?.message || "Failed to create delivery request");
    } finally {
      setSubmittingDelivery(false);
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

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="rounded-xl p-12 text-center max-w-md" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <p style={{ color: theme.text.secondary }}>{error || "Order not found"}</p>
          <Link href="/bikes" className="inline-block mt-4 text-sm hover:opacity-70" style={{ color: theme.accents.primary }}>
            Browse Bikes
          </Link>
        </div>
      </div>
    );
  }

  const isPendingPayment = order.status === "PENDING_PAYMENT";
  const isConfirmed = order.status === "CONFIRMED" || order.status === "PAID";
  const canRequestDelivery = isConfirmed && !order.delivery;

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text.primary }}>
            Order Status
          </h1>
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Order Number: {order.orderNumber}
          </p>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span
            className="inline-block px-4 py-2 text-sm font-medium rounded-full"
            style={getStatusBadgeStyle(order.status)}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>

        {/* Pending Payment Notice */}
        {isPendingPayment && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: "#FEF3C7", border: "1px solid #F59E0B" }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" style={{ color: "#92400E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2" style={{ color: "#92400E" }}>
                  Payment Pending
                </h2>
                <p className="text-sm" style={{ color: "#92400E" }}>
                  Please visit your nearest branch to complete payment and confirm your order.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Request Section */}
        {canRequestDelivery && !showDeliveryForm && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: "#E0E7FF", border: "1px solid #6366F1" }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" style={{ color: "#3730A3" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2" style={{ color: "#3730A3" }}>
                  Request Delivery
                </h2>
                <p className="text-sm mb-4" style={{ color: "#3730A3" }}>
                  Your order is confirmed! Request delivery to have your bike delivered to your location.
                </p>
                <button
                  onClick={() => setShowDeliveryForm(true)}
                  className="px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: "#6366F1",
                    color: "white",
                  }}
                >
                  Request Delivery
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Request Form */}
        {showDeliveryForm && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: theme.text.primary }}>
                Delivery Details
              </h2>
              <button
                onClick={() => setShowDeliveryForm(false)}
                className="text-sm hover:opacity-70"
                style={{ color: theme.text.secondary }}
              >
                Cancel
              </button>
            </div>

            {deliveryError && (
              <div
                className="rounded-lg p-4 mb-4"
                style={{ backgroundColor: "#FEE2E2", border: "1px solid #EF4444" }}
              >
                <p className="text-sm" style={{ color: "#991B1B" }}>{deliveryError}</p>
              </div>
            )}

            <form onSubmit={handleDeliveryRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={deliveryForm.deliveryAddress}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryAddress: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Enter your complete delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
                  Preferred Time Window (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryForm.preferredTimeWindow}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, preferredTimeWindow: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="e.g., 9AM - 12PM, Weekdays"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
                  Contact Number *
                </label>
                <input
                  required
                  type="tel"
                  value={deliveryForm.contactNumber}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, contactNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Enter your contact number for delivery coordination"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeliveryForm(false)}
                  className="px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    color: theme.text.primary,
                    border: `1px solid ${theme.borders.medium}`,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDelivery}
                  className="px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  {submittingDelivery ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Order Status Timeline */}
        <div
          className="rounded-xl p-8 mb-6"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
        >
          <h2 className="text-xl font-semibold mb-6" style={{ color: theme.text.primary }}>
            Order Timeline
          </h2>
          <div className="space-y-6">
            {/* Order Created */}
            <div className="flex gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold" style={{ color: theme.text.primary }}>Order Created</h3>
                  <span className="text-xs" style={{ color: theme.text.muted }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm" style={{ color: theme.text.secondary }}>
                  Your order has been successfully created.
                </p>
              </div>
            </div>

            {/* Payment Status */}
            {order.transactions && order.transactions.length > 0 && order.status !== "PENDING_PAYMENT" && (
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#10B981", color: "white" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold" style={{ color: theme.text.primary }}>Payment Received</h3>
                    <span className="text-xs" style={{ color: theme.text.muted }}>
                      {new Date(order.transactions[0].createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>
                    Payment of PKR {Number(order.transactions[0].amount).toLocaleString()} received via {order.transactions[0].method}.
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Status */}
            {order.delivery && (
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#6366F1", color: "white" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold" style={{ color: theme.text.primary }}>
                      Delivery {order.delivery.status.replace(/_/g, " ")}
                    </h3>
                    <span className="text-xs" style={{ color: theme.text.muted }}>
                      {new Date(order.delivery.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>
                    Delivery to: {order.delivery.deliveryAddress}
                    {order.delivery.preferredTimeWindow && ` (${order.delivery.preferredTimeWindow})`}
                  </p>
                  {order.delivery.contactNumber && (
                    <p className="text-sm mt-1" style={{ color: theme.text.secondary }}>
                      Contact: {order.delivery.contactNumber}
                    </p>
                  )}
                  {order.delivery.notes && (
                    <div
                      className="mt-3 p-3 rounded-lg"
                      style={{ backgroundColor: "#E0E7FF", border: "1px solid #6366F1" }}
                    >
                      <p className="text-sm" style={{ color: "#3730A3" }}>
                        <span className="font-semibold">Note from admin:</span> {order.delivery.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Delivered */}
            {order.delivery && order.delivery.deliveredAt && (
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#10B981", color: "white" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold" style={{ color: theme.text.primary }}>Order Delivered</h3>
                    <span className="text-xs" style={{ color: theme.text.muted }}>
                      {new Date(order.delivery.deliveredAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>
                    Your order has been successfully delivered.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bike Information */}
        {order.type === "BIKE" && order.bike && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
              Bike Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Brand</p>
                <p className="font-medium" style={{ color: theme.text.primary }}>{order.bike.model.brand}</p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Model</p>
                <p className="font-medium" style={{ color: theme.text.primary }}>
                  {order.bike.model.modelName} ({order.bike.model.year})
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Chassis Number</p>
                <p className="font-medium" style={{ color: theme.text.primary }}>{order.bike.chassisNumber}</p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Engine Number</p>
                <p className="font-medium" style={{ color: theme.text.primary }}>{order.bike.engineNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* Part Information */}
        {order.type === "PART" && order.part && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
              Part Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Part Name</p>
                <p className="font-medium" style={{ color: theme.text.primary }}>{order.part.name}</p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.muted }}>SKU</p>
                <p className="font-medium" style={{ color: theme.text.primary }}>{order.part.sku}</p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Quantity</p>
                <p className="font-medium" style={{ color: theme.text.primary }}>{order.quantity}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: theme.text.secondary }}>
                {order.type === "BIKE" ? "Negotiated Amount" : "Amount"}
              </span>
              <span className="font-semibold" style={{ color: theme.text.primary }}>
                PKR {Number(order.type === "BIKE" ? order.negotiatedAmount : order.amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: theme.text.secondary }}>Payment Method</span>
              <span className="font-medium" style={{ color: theme.text.primary }}>{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: theme.text.secondary }}>Branch</span>
              <span className="font-medium" style={{ color: theme.text.primary }}>
                {order.type === "BIKE" && order.bike?.branch?.name && order.bike.branch?.city
                  ? `${order.bike.branch.name}, ${order.bike.branch.city}`
                  : order.type === "PART" && order.branch?.name && order.branch?.city
                  ? `${order.branch.name}, ${order.branch.city}`
                  : "Not available"}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Transactions */}
        {order.transactions && order.transactions.length > 0 && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
              Payment Transactions
            </h2>
            <div className="space-y-3">
              {order.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-3 rounded"
                  style={{ backgroundColor: theme.backgrounds.tertiary }}
                >
                  <div>
                    <p className="font-medium text-sm" style={{ color: theme.text.primary }}>
                      PKR {Number(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs" style={{ color: theme.text.muted }}>
                      {transaction.method} • {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className="px-2 py-1 text-xs font-medium rounded"
                    style={{
                      backgroundColor: transaction.status === "SUCCESS" ? "#D1FAE5" : "#FEE2E2",
                      color: transaction.status === "SUCCESS" ? "#065F46" : "#991B1B",
                    }}
                  >
                    {transaction.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Branch Information */}
        {(order.type === "BIKE" && order.bike?.branch) || (order.type === "PART" && order.branch) ? (
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
              Branch Information
            </h2>
            <div className="space-y-2">
              <p className="text-sm" style={{ color: theme.text.secondary }}>
                <span className="font-medium" style={{ color: theme.text.primary }}>Name:</span> {order.type === "BIKE" ? order.bike?.branch?.name : order.branch?.name}
              </p>
              <p className="text-sm" style={{ color: theme.text.secondary }}>
                <span className="font-medium" style={{ color: theme.text.primary }}>Address:</span> {order.type === "BIKE" ? order.bike?.branch?.address : order.branch?.address}
              </p>
              {(order.type === "BIKE" ? order.bike?.branch?.phoneNumber : order.branch?.phoneNumber) && (
                <p className="text-sm" style={{ color: theme.text.secondary }}>
                  <span className="font-medium" style={{ color: theme.text.primary }}>Phone:</span> {order.type === "BIKE" ? order.bike?.branch?.phoneNumber : order.branch?.phoneNumber}
                </p>
              )}
            </div>
          </div>
        ) : null}

        {/* Bookmark Reminder */}
        <div
          className="rounded-xl p-6 mt-6"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            💡 Bookmark this page to track your order status. You can return anytime using this link.
          </p>
        </div>
      </div>
    </div>
  );
}
