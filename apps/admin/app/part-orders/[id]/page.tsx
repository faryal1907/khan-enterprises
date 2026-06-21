"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { OrderStatus, PaymentMethod, UserRole } from "@/lib/types";
import { getPartOrderById, updatePartOrderStatus, cancelPartOrder, downloadInvoice, markPartOrderAsPickedByCustomer, verifyPartPayment } from "@/lib/api/orders";
import { approveDelivery, rejectDelivery } from "@/lib/api/deliveries";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { OrderStatusBadge } from "@/components/order-status-badge";

export default function PartOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const orderId = params.id as string;
  const canManageLifecycle = user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRejectDeliveryModal, setShowRejectDeliveryModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectPaymentModal, setShowRejectPaymentModal] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPartOrderById(orderId);
      setOrder(data);
    } catch (fetchError: any) {
      setError(fetchError.response?.data?.message || "Failed to fetch part order");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setActionLoading(true);
      await updatePartOrderStatus(orderId, newStatus);
      await fetchOrder();
      toast.success("Order status updated");
    } catch (updateError: any) {
      toast.error(updateError.response?.data?.message || "Failed to update order status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setActionLoading(true);
      await cancelPartOrder(orderId);
      await fetchOrder();
      setShowCancelModal(false);
      toast.success("Order cancelled");
    } catch (cancelError: any) {
      toast.error(cancelError.response?.data?.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsPickedByCustomer = async () => {
    try {
      setActionLoading(true);
      await markPartOrderAsPickedByCustomer(orderId);
      const updatedOrder = await getPartOrderById(orderId);
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
      const updatedOrder = await getPartOrderById(orderId);
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
      const updatedOrder = await getPartOrderById(orderId);
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

  const handleVerifyPayment = async () => {
    try {
      setActionLoading(true);
      await verifyPartPayment(orderId, true);
      const updatedOrder = await getPartOrderById(orderId);
      setOrder(updatedOrder);
      toast.success("Payment verified successfully");
    } catch (error: any) {
      console.warn("Failed to verify payment:", error?.message || error);
      toast.error(error?.message || "Failed to verify payment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async () => {
    try {
      setActionLoading(true);
      await verifyPartPayment(orderId, false);
      const updatedOrder = await getPartOrderById(orderId);
      setOrder(updatedOrder);
      setShowRejectPaymentModal(false);
      toast.success("Payment rejected successfully");
    } catch (error: any) {
      console.warn("Failed to reject payment:", error?.message || error);
      toast.error(error?.message || "Failed to reject payment");
    } finally {
      setActionLoading(false);
    }
  };

  const pendingVerificationTx = order?.transactions?.find((tx: any) => tx.status === "VERIFICATION_PENDING");

  const getActionButton = () => {
    if (!order) return null;

    switch (order.status) {
      case OrderStatus.PENDING_PAYMENT:
        if (pendingVerificationTx && canManageLifecycle) {
          return (
            <div className="flex space-x-3">
              <AsyncButton
                onClick={() => handleVerifyPayment()}
                loading={actionLoading}
                className="px-6"
              >
                Verify Payment
              </AsyncButton>
              <button
                onClick={() => setShowRejectPaymentModal(true)}
                disabled={actionLoading}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: theme.text.inverse,
                }}
              >
                Reject Payment
              </button>
            </div>
          );
        }
        return (
          <AsyncButton
            onClick={() => handleStatusUpdate(OrderStatus.PAID)}
            loading={actionLoading}
            className="px-6"
          >
            Mark as Paid
          </AsyncButton>
        );
      case OrderStatus.PAID:
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
      setInvoiceLoading(true);
      await downloadInvoice(orderId, true);
      toast.success("Invoice downloaded successfully");
    } catch (invoiceError: any) {
      toast.error(invoiceError.response?.data?.message || "Failed to download invoice");
    } finally {
      setInvoiceLoading(false);
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
          <div className="flex flex-col items-start gap-3">
            <p style={{ color: theme.text.secondary }}>{error || "Part order not found"}</p>
            <AsyncButton onClick={fetchOrder}>Retry</AsyncButton>
          </div>
        </div>
      </div>
    );
  }

  const latestTxWithProof = order.transactions?.slice().reverse().find((tx: any) => tx.paymentProofUrl);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: theme.text.primary }}
            >
              Part Order Details
            </h1>
            <p style={{ color: theme.text.secondary }}>
              Order #{order.orderNumber}
            </p>
          </div>
          <button
            onClick={handleDownloadInvoice}
            disabled={invoiceLoading}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: theme.accents.secondary,
              color: theme.text.inverse,
            }}
          >
            {invoiceLoading ? "Downloading..." : "Download Invoice"}
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
                  Address
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.customerAddress || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Part Details Card */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text.primary }}
            >
              Part Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Part Name
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.part?.name}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  SKU
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.part?.sku}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Quantity
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.quantity}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Total Amount
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Rs. {Number(order.amount).toLocaleString()}
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

              {latestTxWithProof?.paymentProofUrl && (
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                    Payment Proof
                  </label>
                  <a
                    href={latestTxWithProof.paymentProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium underline transition-colors"
                    style={{ color: theme.accents.primary }}
                  >
                    View Proof Document
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Fulfillment Details Card */}
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
              {order.pickupType === "DELIVERY" && order.delivery && (
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
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Processed By
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {order.processedBy?.fullName || "—"}
                </p>
              </div>
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
                  {order.transactions.map((transaction: any) => (
                    <tr key={transaction.id} style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                        Rs. {Number(transaction.amount).toLocaleString()}
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
        {canManageLifecycle && order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED && (
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
                disabled={actionLoading}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
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

      {/* Reject Payment Modal */}
      {showRejectPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
              Reject Payment Proof
            </h3>
            <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
              Are you sure you want to reject this payment? The order will remain in Pending Payment status.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowRejectPaymentModal(false)}
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
                onClick={handleRejectPayment}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: theme.text.inverse,
                }}
              >
                {actionLoading ? "Rejecting..." : "Reject Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <ActionModal
          title="Cancel Part Order"
          onClose={() => {
            if (actionLoading) return;
            setShowCancelModal(false);
          }}
        >
          <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
            Are you sure you want to cancel this part order? Reserved or deducted stock will be restored according to the current order status.
          </p>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowCancelModal(false)}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                color: theme.text.secondary,
                border: `1px solid ${theme.borders.medium}`,
              }}
            >
              Go Back
            </button>
            <AsyncButton
              onClick={handleCancelOrder}
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
