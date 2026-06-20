"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { OrderStatus, PaymentMethod, Order, PaymentTransaction, UserRole } from "@/lib/types";
import { getOrderById, updateOrderStatus, cancelOrder, recordPayment, downloadInvoice, markAsPickedByCustomer } from "@/lib/api/orders";
import { approveDelivery, rejectDelivery } from "@/lib/api/deliveries";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { OrderStatusBadge } from "@/components/order-status-badge";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const orderId = params.id as string;
  const canManageLifecycle = user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRejectDeliveryModal, setShowRejectDeliveryModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");
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
        setPaymentData((prev) => ({ ...prev, amount: data.bike?.actualSalePrice || 0 }));
      } catch (error: any) {
        console.warn("Failed to fetch order:", error?.message || error);
        toast.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setActionLoading(true);
      await updateOrderStatus(orderId, newStatus);
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
    } catch (error: any) {
      console.warn("Failed to update status:", error?.message || error);
      toast.error(error?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setActionLoading(true);
      await cancelOrder(orderId, cancelReason);
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
      setShowCancelModal(false);
      setCancelReason("");
    } catch (error: any) {
      console.warn("Failed to cancel order:", error?.message || error);
      toast.error(error?.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    try {
      setActionLoading(true);
      const paymentPayload = {
        ...paymentData,
        amount: Number(paymentData.amount),
      };
      await recordPayment(orderId, paymentPayload);
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
      setShowPaymentModal(false);
    } catch (error: any) {
      console.warn("Failed to record payment:", error?.message || error);
      toast.error(error?.message || "Failed to record payment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsPickedByCustomer = async () => {
    try {
      setActionLoading(true);
      await markAsPickedByCustomer(orderId);
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
      toast.success("Order marked as picked by customer");
    } catch (error: any) {
      console.warn("Failed to mark as picked by customer:", error?.message || error);
      toast.error(error?.message || "Failed to mark as picked by customer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveDelivery = async () => {
    if (!order?.delivery) return;
    try {
      setActionLoading(true);
      await approveDelivery(order.delivery.id);
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
      toast.success("Delivery approved successfully");
    } catch (error: any) {
      console.warn("Failed to approve delivery:", error?.message || error);
      toast.error(error?.message || "Failed to approve delivery");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDelivery = async () => {
    if (!order?.delivery) return;
    try {
      setActionLoading(true);
      await rejectDelivery(order.delivery.id, rejectReason);
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
      setShowRejectDeliveryModal(false);
      setRejectReason("");
      toast.success("Delivery rejected successfully");
    } catch (error: any) {
      console.warn("Failed to reject delivery:", error?.message || error);
      toast.error(error?.message || "Failed to reject delivery");
    } finally {
      setActionLoading(false);
    }
  };

  const getActionButton = () => {
    if (!order) return null;

    switch (order.status) {
      case OrderStatus.PENDING_PAYMENT:
        return (
          <AsyncButton
            onClick={() => setShowPaymentModal(true)}
            disabled={actionLoading}
            className="px-6"
          >
            Record Payment
          </AsyncButton>
        );
      case OrderStatus.PAID:
        if (!canManageLifecycle) return null;
        return (
          <AsyncButton
            onClick={() => handleStatusUpdate(OrderStatus.CONFIRMED)}
            loading={actionLoading}
            className="px-6"
          >
            Confirm Order
          </AsyncButton>
        );
      case OrderStatus.CONFIRMED:
        if (order.pickupType === "DELIVERY") {
          if (!order.delivery) return null;
          // Customer requested delivery - show approve/reject buttons
          if (order.delivery.status === "REQUESTED" || order.delivery.status === "UNDER_REVIEW") {
            return (
              <div className="flex space-x-3">
                <button
                  onClick={handleApproveDelivery}
                  disabled={actionLoading}
                  className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  Approve Delivery
                </button>
                <button
                  onClick={() => setShowRejectDeliveryModal(true)}
                  disabled={actionLoading}
                  className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: theme.accents.secondary,
                    color: theme.text.inverse,
                  }}
                >
                  Reject Delivery
                </button>
              </div>
            );
          }
          // Delivery already approved - show mark ready for delivery
          return (
            <button
              onClick={() => handleStatusUpdate(OrderStatus.READY_FOR_DELIVERY)}
              disabled={actionLoading}
              className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: theme.accents.primary,
                color: theme.text.inverse,
              }}
            >
              Mark Ready for Delivery
            </button>
          );
        }
        // No delivery request - show picked by customer button
        return (
          <button
            onClick={handleMarkAsPickedByCustomer}
            disabled={actionLoading}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Picked by Customer
          </button>
        );
      case OrderStatus.READY_FOR_DELIVERY:
        if (!canManageLifecycle) return null;
        return (
          <AsyncButton
            onClick={() => handleStatusUpdate(OrderStatus.DELIVERED)}
            loading={actionLoading}
            className="px-6"
          >
            Mark Delivered
          </AsyncButton>
        );
      default:
        return null;
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setActionLoading(true);
      await downloadInvoice(orderId, false);
      toast.success("Invoice downloaded successfully");
    } catch (error: any) {
      console.warn("Failed to download invoice:", error?.message || error);
      toast.error(error?.message || "Failed to download invoice");
    } finally {
      setActionLoading(false);
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
        <div className="flex justify-between items-start mb-6">
          <div>
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
          <button
            onClick={handleDownloadInvoice}
            disabled={actionLoading}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: theme.accents.secondary,
              color: theme.text.inverse,
            }}
          >
            {actionLoading ? "Working..." : "Download Invoice"}
          </button>
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
                  Sale Price
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Rs. {order.bike?.actualSalePrice?.toLocaleString() || "0"}
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
                <OrderStatusBadge status={order.status} />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Payment Method
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.paymentMethod}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Payment Verified
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.paymentVerified ? "Yes" : "No"}
                </p>
              </div>

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
              Fulfillment Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Order Type
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.orderType === "ONLINE" ? "Online" : "Onsite"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Pickup Type
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.pickupType === "DELIVERY" ? "Delivery" : "Onsite Pickup"}
                </p>
              </div>
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
              {canManageLifecycle && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  disabled={actionLoading}
                  className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: theme.accents.secondary,
                    color: theme.text.inverse,
                  }}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <ActionModal
          title="Cancel Order"
          onClose={() => {
            if (actionLoading) return;
            setShowCancelModal(false);
            setCancelReason("");
          }}
        >
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
              disabled={actionLoading}
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
            <AsyncButton
              onClick={handleCancelOrder}
              disabled={!cancelReason.trim() || actionLoading}
              loading={actionLoading}
              loadingLabel="Cancelling..."
              style={{
                backgroundColor: theme.accents.secondary,
              }}
            >
              Confirm Cancellation
            </AsyncButton>
          </div>
        </ActionModal>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <ActionModal
          title="Record Payment"
          onClose={() => {
            if (actionLoading) return;
            setShowPaymentModal(false);
          }}
        >
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                Payment Method
              </label>
              <select
                value={paymentData.method}
                onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value as PaymentMethod })}
                disabled={actionLoading}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value={PaymentMethod.CASH}>Cash</option>
                <option value={PaymentMethod.ONLINE_TRANSFER}>Online Transfer</option>
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
                disabled={actionLoading}
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
                  disabled={actionLoading}
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
            <AsyncButton
              onClick={handleRecordPayment}
              disabled={paymentData.amount <= 0 || actionLoading}
              loading={actionLoading}
              loadingLabel="Recording..."
            >
              Record Payment
            </AsyncButton>
          </div>
        </ActionModal>
      )}

      {/* Reject Delivery Modal */}
      {showRejectDeliveryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
              Reject Delivery Request
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                Reason for rejection (optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                rows={4}
                placeholder="Enter reason for rejection..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowRejectDeliveryModal(false);
                  setRejectReason("");
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
                onClick={handleRejectDelivery}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: theme.text.inverse,
                }}
              >
                {actionLoading ? "Rejecting..." : "Reject Delivery"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
