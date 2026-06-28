"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { getOrderByNumber } from "@/lib/api/orders";
import { getPartOrderByNumber } from "@/lib/api/part-orders";
import { createDeliveryRequest } from "@/lib/api/deliveries";
import { MapPicker } from "@/components/map-picker";

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
    let isMounted = true;
    setTimeout(() => {
      if (isMounted) setTimeLeft(calculateTimeLeft());
    }, 0);
    const timer = setInterval(() => {
      if (isMounted) setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
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
  expiresAt?: string;
  reservationExpiry?: string;
  type: "BIKE" | "PART";
  orderType?: string;
  pickupType?: string;
  
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
    actualSalePrice?: number;
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
    deliveryCost?: number;
  } | null;
}

export default function OrderStatusPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState<{
    deliveryAddress: string;
    preferredTimeWindow: string;
    contactNumber: string;
    latitude?: number;
    longitude?: number;
  }>({
    deliveryAddress: "",
    preferredTimeWindow: "",
    contactNumber: "",
  });
  const [submittingDelivery, setSubmittingDelivery] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");

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
    } catch (err: unknown) {
      console.error("Failed to fetch order:", err);
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrder();
    }, 0);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  // handlePickupFromStore removed as it was unused
  // handlePickupFromStore removed as it was unused

  const handleDeliveryRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    try {
      setSubmittingDelivery(true);
      setDeliveryError("");
      
      const payload = { ...deliveryForm };
      if (!payload.preferredTimeWindow?.trim()) {
        delete (payload as { preferredTimeWindow?: string }).preferredTimeWindow;
      }

      await createDeliveryRequest(order.id, payload, order.type);
      // Refresh order data to show delivery status
      await fetchOrder();
      setShowDeliveryForm(false);
      setDeliveryForm({ deliveryAddress: "", preferredTimeWindow: "", contactNumber: "" });
    } catch (err: unknown) {
      console.error("Failed to create delivery request:", err);
      const msg = (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      if (Array.isArray(msg)) {
        setDeliveryError(msg.join(", "));
      } else {
        setDeliveryError(msg || "Failed to create delivery request");
      }
    } finally {
      setSubmittingDelivery(false);
    }
  };

  // handleUploadPaymentProof removed as it was unused

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

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ");
  };

  // Same getDisplayStatus logic as the list page
  const getDisplayStatus = (order: Order) => {
    // 1. Terminal/Completed statuses always take precedence
    if (["DELIVERED", "CANCELLED", "PAID", "CONFIRMED", "READY_FOR_DELIVERY"].includes(order.status)) {
      return order.status;
    }
    
    // 2. Check for verification pending on online payments
    const hasVerificationPending = order.transactions?.some((tx) => tx.status === "VERIFICATION_PENDING");
    if (hasVerificationPending) return "VERIFICATION_PENDING";
    
    // 3. Default fallback
    return order.status;
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

  const displayStatus = getDisplayStatus(order);
  const isPendingPayment = order.status === "PENDING_PAYMENT";
  const hasVerificationPending = order.transactions?.some((tx) => tx.status === "VERIFICATION_PENDING");
  const isConfirmed = order.status === "CONFIRMED" || order.status === "PAID";
  const isCash = order.paymentMethod === "CASH";
  
  // Order is paid online (has a SUCCESS transaction) - show Payment Received in timeline
  const hasSuccessTransaction = order.transactions?.some((tx) => tx.status === "SUCCESS");
  
  // Can request delivery: order is CONFIRMED/PAID, no delivery yet, and not cash (cash = onsite pickup)
  const canRequestDelivery = isConfirmed && !order.delivery && !isCash;
  
  // Show order reserved for cash orders that are still in pending payment
  const showReservedNotice = order.status === "PENDING_PAYMENT" && isCash && order.reservationExpiry;

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

        {/* Status Badge - uses same getDisplayStatus as list page */}
        <div className="mb-6">
          <span
            className="inline-block px-4 py-2 text-sm font-medium rounded-full"
            style={getStatusBadgeStyle(displayStatus)}
          >
            {getStatusLabel(displayStatus)}
          </span>
        </div>

        {/* Pending Payment Notice */}
        {isPendingPayment && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: "#FEF3C7", border: "1px solid #F59E0B" }}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <svg className="w-6 h-6" style={{ color: "#92400E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-semibold" style={{ color: "#92400E" }}>
                    {hasVerificationPending ? "Awaiting Admin Verification" : "Payment Pending"}
                  </h2>
                  {displayStatus === "PENDING_PAYMENT" && isCash && <CountdownTimer expiresAt={order.expiresAt || order.createdAt} />}
                </div>

                {/* Cash order - show visit branch message */}
                {isCash && !hasVerificationPending && (
                  <p className="text-sm mb-3" style={{ color: "#92400E" }}>
                    Please visit your nearest branch to complete payment and confirm your order.
                  </p>
                )}

                {/* Online order with verification pending */}
                {hasVerificationPending && (
                  <p className="text-sm mb-3" style={{ color: "#92400E" }}>
                    Your payment proof has been submitted. Our team will verify it shortly.
                  </p>
                )}

                {/* Online order without verification pending - show upload button */}
                {!isCash && !hasVerificationPending && (
                  <div className="space-y-3">
                    <p className="text-sm" style={{ color: "#92400E" }}>
                      Please complete your payment and upload the proof below for verification.
                    </p>
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delivery/Pickup Selection Section - for online orders after payment is confirmed */}
        {canRequestDelivery && !showDeliveryForm && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: "#E0E7FF", border: "1px solid #6366F1" }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="shrink-0">
                <svg className="w-6 h-6" style={{ color: "#3730A3" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2" style={{ color: "#3730A3" }}>
                  Would you like to request delivery for your {order.type === "BIKE" ? "bike" : "order"}?
                </h2>
                <p className="text-sm mb-4" style={{ color: "#3730A3" }}>
                  Your order is confirmed! Please request delivery in case you want it to be delivered to your location, rather than picking it up from the branch yourself.
                </p>
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Delivery Option */}
              
              
                <button
                  onClick={() => setShowDeliveryForm(true)}
                  className="w-full px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: "#6366F1",
                    color: "white",
                  }}
                >
                  Request Delivery
                </button>
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
                  Pinpoint Exact Location (Optional but recommended)
                </label>
                <div className="mb-4">
                  <MapPicker
                    onLocationSelected={(lat: number, lng: number) => {
                      setDeliveryForm(prev => ({ 
                        ...prev, 
                        latitude: lat, 
                        longitude: lng
                      }));
                    }}
                  />
                  {deliveryForm.latitude && deliveryForm.longitude && (
                    <p className="text-xs mt-2 text-green-600 font-medium">
                      ✓ Exact location pinned successfully
                    </p>
                  )}
                </div>
                
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
                  Delivery Address *
                </label>
                <textarea
                  required
                  minLength={10}
                  rows={3}
                  value={deliveryForm.deliveryAddress}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryAddress: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Enter your complete delivery address (House, Street, Area) - Min 10 chars"
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
                  minLength={10}
                  type="tel"
                  value={deliveryForm.contactNumber}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, contactNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Enter your contact number for delivery coordination - Min 10 chars"
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
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
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

            {/* Payment Received - only when a SUCCESS transaction exists, no isOnsitePickup restriction */}
            {hasSuccessTransaction && order.transactions && order.transactions.length > 0 && (
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#10B981", color: "white" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m7-5a2 2 0 11-4 0 2 2 0 014 0z" />
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

            {/* Reservation Notice - only for cash orders still pending payment */}
            {showReservedNotice && (
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#F59E0B", color: "white" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold" style={{ color: theme.text.primary }}>Order Reserved</h3>
                    {order.reservationExpiry && <CountdownTimer expiresAt={order.reservationExpiry} />}
                  </div>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>
                    Your order is reserved for <strong>24 hours</strong>. Please visit the store to complete payment and pick up your order.
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Status */}
            {order.delivery && (
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
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
                        <span className="font-semibold"></span> {order.delivery.notes}
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
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
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
                {order.type === "BIKE" ? "Base Amount" : "Amount"}
              </span>
              <span className="font-semibold" style={{ color: theme.text.primary }}>
                PKR {Number(order.type === "BIKE" ? (order.bike?.actualSalePrice || order.bike?.model?.basePrice || 0) : order.amount).toLocaleString()}
              </span>
            </div>
            {order.delivery && order.delivery.deliveryCost && (
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: theme.text.secondary }}>Delivery Charges</span>
                <span className="font-semibold" style={{ color: theme.text.primary }}>
                  PKR {Number(order.delivery.deliveryCost).toLocaleString()}
                </span>
              </div>
            )}
            {order.delivery && order.delivery.deliveryCost && (
              <div className="flex justify-between pt-2 border-t" style={{ borderColor: theme.borders.light }}>
                <span className="text-sm font-semibold" style={{ color: theme.text.primary }}>Total Amount</span>
                <span className="font-semibold" style={{ color: theme.text.primary }}>
                  PKR {(Number(order.type === "BIKE" ? (order.bike?.actualSalePrice || order.bike?.model?.basePrice || 0) : (order.amount || 0)) + Number(order.delivery.deliveryCost)).toLocaleString()}
                </span>
              </div>
            )}
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
                      backgroundColor: transaction.status === "SUCCESS" ? "#D1FAE5" : 
                        transaction.status === "PENDING" ? "#FEF3C7" : 
                        transaction.status === "CANCELLED" ? theme.backgrounds.tertiary : "#FEE2E2",
                      color: transaction.status === "SUCCESS" ? "#065F46" : 
                        transaction.status === "PENDING" ? "#92400E" : 
                        transaction.status === "CANCELLED" ? theme.text.secondary : "#991B1B",
                      border: transaction.status === "CANCELLED" ? `1px solid ${theme.borders.medium}` : undefined,
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