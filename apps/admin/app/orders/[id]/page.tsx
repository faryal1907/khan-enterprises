"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { OrderStatus, PaymentMethod, Order, PaymentTransaction } from "@/lib/types";
import { getOrderById, updateOrderStatus, cancelOrder, recordPayment } from "@/lib/api/orders";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [paymentData, setPaymentData] = useState({
    method: PaymentMethod.CASH,
    amount: 0,
    referenceNumber: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        setPaymentData((prev) => ({ ...prev, amount: data.negotiatedAmount }));
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

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

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(orderId, cancelReason);
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
      setShowCancelModal(false);
      setCancelReason("");
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleRecordPayment = async () => {
    try {
      await recordPayment(orderId, paymentData);
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Failed to record payment:", error);
    }
  };

  const getActionButton = () => {
    if (!order) return null;

    switch (order.status) {
      case OrderStatus.PENDING_PAYMENT:
        return (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Record Payment
          </button>
        );
      case OrderStatus.PAID:
        return (
          <button
            onClick={() => handleStatusUpdate(OrderStatus.CONFIRMED)}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Confirm Order
          </button>
        );
      case OrderStatus.CONFIRMED:
        return (
          <button
            onClick={() => handleStatusUpdate(OrderStatus.READY_FOR_DELIVERY)}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Mark Ready for Delivery
          </button>
        );
      case OrderStatus.READY_FOR_DELIVERY:
        return (
          <button
            onClick={() => handleStatusUpdate(OrderStatus.DELIVERED)}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Mark Delivered
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p style={{ color: theme.text.secondary }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p style={{ color: theme.text.secondary }}>Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text.primary }}
          >
            Order Details
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Order #{order.orderNumber}
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Info Card */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text.primary }}
            >
              Customer Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Name
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.customerName}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Phone
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.customerPhone}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  CNIC
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.customerCNIC}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Address
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.customerAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Bike Details Card */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text.primary }}
            >
              Bike Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Model
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.bike?.model?.brand} {order.bike?.model?.modelName}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Chassis Number
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.bike?.chassisNumber}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Engine Number
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.bike?.engineNumber}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Negotiated Amount
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Rs. {order.negotiatedAmount?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Status Card */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text.primary }}
            >
              Payment Status
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Order Status
                </label>
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
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Payment Method
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.paymentMethod}
                </p>
              </div>
              {order.offerId && (
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                    Originating Offer
                  </label>
                  <a
                    href={`/offers/${order.offerId}`}
                    className="text-sm font-medium transition-colors hover:opacity-70"
                    style={{ color: theme.accents.primary }}
                  >
                    View Offer #{order.offerId}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Status Card */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text.primary }}
            >
              Delivery Status
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Branch
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.branch?.name}
                </p>
              </div>
              {order.delivery && (
                <>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                      Delivery Status
                    </label>
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                      {order.delivery.status}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                      Delivery Address
                    </label>
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                      {order.delivery.deliveryAddress}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Payment Transactions Table */}
        {order.transactions && order.transactions.length > 0 && (
          <div
            className="rounded-lg p-6 mb-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text.primary }}
            >
              Payment Transactions
            </h3>
            <div
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: theme.backgrounds.tertiary }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: theme.backgrounds.primary, borderBottom: `1px solid ${theme.borders.light}` }}>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                      Method
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                      Gateway Reference
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.transactions.map((transaction: PaymentTransaction) => (
                    <tr key={transaction.id} style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                        Rs. {transaction.amount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                        {transaction.method}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                        {transaction.status}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                        {transaction.gatewayReference || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Status Action Bar */}
        {order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED && (
          <div
            className="rounded-lg p-6 mb-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text.primary }}
            >
              Actions
            </h3>
            <div className="flex space-x-4">
              {getActionButton()}
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: theme.text.inverse,
                }}
              >
                Cancel Order
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => router.push("/orders")}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back to Orders
          </button>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
              Cancel Order
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                rows={4}
                placeholder="Enter reason for cancellation..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={!cancelReason.trim()}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: theme.text.inverse,
                }}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
              Record Payment
            </h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                  Payment Method
                </label>
                <select
                  value={paymentData.method}
                  onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value as PaymentMethod })}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                >
                  <option value={PaymentMethod.CASH}>Cash</option>
                  <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
                  <option value={PaymentMethod.SAFEPAY}>Safepay</option>
                  <option value={PaymentMethod.JAZZCASH}>JazzCash</option>
                  <option value={PaymentMethod.RAAST}>Raast</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                  Amount
                </label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                />
              </div>
              {paymentData.method !== PaymentMethod.CASH && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                    Reference Number (optional)
                  </label>
                  <input
                    type="text"
                    value={paymentData.referenceNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, referenceNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter reference number..."
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={paymentData.amount <= 0}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
