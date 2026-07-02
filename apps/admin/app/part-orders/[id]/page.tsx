"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { OrderStatus, PaymentMethod, UserRole } from "@/lib/types";
import { getPartOrderById, updatePartOrderStatus, cancelPartOrder, downloadInvoice, markPartOrderAsPickedByCustomer, verifyPartPayment, recordPartOrderPayment } from "@/lib/api/orders";
import { approveDelivery } from "@/lib/api/deliveries";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { getPaymentAccounts } from "@/lib/api/accounting";

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
  const [showRejectPaymentModal, setShowRejectPaymentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rejectPaymentReason, setRejectPaymentReason] = useState("");
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState({
    method: PaymentMethod.CASH,
    amount: 0,
    referenceNumber: "",
    accountId: "",
  });

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPartOrderById(orderId);
      setOrder(data);
      setPaymentData((prev) => ({ ...prev, amount: Number(data.balanceDue) > 0 ? Number(data.balanceDue) : Number(data.amount) || 0 }));
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

  useEffect(() => {
    if (showPaymentModal) {
      getPaymentAccounts().then(setPaymentAccounts).catch(() => setPaymentAccounts([]));
    }
  }, [showPaymentModal]);

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
      await cancelPartOrder(orderId, cancelReason);
      await fetchOrder();
      setShowCancelModal(false);
      setCancelReason("");
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




  const handleVerifyPayment = async () => {
    try {
      setActionLoading(true);
      await verifyPartPayment(orderId, true);
      // verifyPartPayment already sets the correct status (PAID or CONFIRMED based on balanceDue)
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
      await verifyPartPayment(orderId, false, rejectPaymentReason);
      const updatedOrder = await getPartOrderById(orderId);
      setOrder(updatedOrder);
      setShowRejectPaymentModal(false);
      setRejectPaymentReason("");
      toast.success("Payment rejected successfully");
    } catch (error: any) {
      console.warn("Failed to reject payment:", error?.message || error);
      toast.error(error?.message || "Failed to reject payment");
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
        accountId: paymentData.accountId || undefined,
      };
      const result = await recordPartOrderPayment(orderId, paymentPayload);
      // For cash payments, auto-confirm after recording (recordPartOrderPayment sets status to PAID for cash)
      // For online transfers, payment stays in VERIFICATION_PENDING - admin must verify via Verify Payment button
      if (paymentData.method === PaymentMethod.CASH) {
        await updatePartOrderStatus(orderId, OrderStatus.CONFIRMED);
      }
      const updatedOrder = await getPartOrderById(orderId);
      setOrder(updatedOrder);
      setShowPaymentModal(false);
      toast.success("Payment recorded successfully");
    } catch (error: any) {
      console.warn("Failed to record payment:", error?.message || error);
      toast.error(error?.message || "Failed to record payment");
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
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <AsyncButton
                onClick={() => handleVerifyPayment()}
                loading={actionLoading}
                className="px-4 md:px-6 w-full sm:w-auto"
              >
                Verify Payment
              </AsyncButton>
              <button
                onClick={() => setShowRejectPaymentModal(true)}
                disabled={actionLoading}
                className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 w-full sm:w-auto text-center"
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
            onClick={() => setShowPaymentModal(true)}
            disabled={actionLoading || !!pendingVerificationTx}
            className="px-4 md:px-6 w-full sm:w-auto"
          >
            {pendingVerificationTx ? "Verification Pending" : "Record Payment"}
          </AsyncButton>
        );
      case OrderStatus.PAID:
        if (!canManageLifecycle) return null;
        return (
          <AsyncButton
            onClick={() => handleStatusUpdate(OrderStatus.CONFIRMED)}
            loading={actionLoading}
            className="px-4 md:px-6 w-full sm:w-auto"
          >
            Confirm Order
          </AsyncButton>
        );
      case OrderStatus.CONFIRMED:
        if (order.delivery) {
          if (Number(order.balanceDue) > 0) {
            return (
              <AsyncButton
                onClick={() => setShowPaymentModal(true)}
                disabled={actionLoading}
                className="px-4 md:px-6 w-full sm:w-auto"
              >
                Record Payment
              </AsyncButton>
            );
          }
          return null;
        }
        if (Number(order.balanceDue) > 0) {
          return (
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <AsyncButton
                onClick={() => setShowPaymentModal(true)}
                disabled={actionLoading}
                className="px-4 md:px-6 w-full sm:w-auto"
              >
                Record Payment
              </AsyncButton>
              <button
                onClick={handleMarkAsPickedByCustomer}
                disabled={actionLoading}
                className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 w-full sm:w-auto text-center"
                style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
              >
                Picked by Customer
              </button>
            </div>
          );
        }
        return (
          <button
            onClick={handleMarkAsPickedByCustomer}
            disabled={actionLoading}
            className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 w-full sm:w-auto text-center"
            style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
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
            className="px-4 md:px-6 w-full sm:w-auto"
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
      <div className="px-4 py-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm md:text-base" style={{ color: theme.text.secondary }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-4 py-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm md:text-base" style={{ color: theme.text.secondary }}>{error || "Part order not found"}</p>
            <AsyncButton onClick={fetchOrder}>Retry</AsyncButton>
          </div>
        </div>
      </div>
    );
  }

  const latestTxWithProof = order.transactions?.slice().reverse().find((tx: any) => tx.paymentProofUrl);

  return (
    <div className="px-4 py-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold mb-1 md:mb-2"
              style={{ color: theme.text.primary }}
            >
              Part Order Details
            </h1>
            <p className="text-sm md:text-base" style={{ color: theme.text.secondary }}>
              Order #{order.orderNumber}
            </p>
          </div>
          <button
            onClick={handleDownloadInvoice}
            disabled={invoiceLoading}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 w-full sm:w-auto text-center"
            style={{
              backgroundColor: theme.accents.secondary,
              color: theme.text.inverse,
            }}
          >
            {invoiceLoading ? "Downloading..." : "Download Invoice"}
          </button>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Customer Info Card */}
          <div
            className="rounded-lg p-4 md:p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-3 md:mb-4"
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
            className="rounded-lg p-4 md:p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-3 md:mb-4"
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
            className="rounded-lg p-4 md:p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-3 md:mb-4"
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
            className="rounded-lg p-4 md:p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-3 md:mb-4"
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
            className="rounded-lg p-4 md:p-6 mb-4 md:mb-6 overflow-x-auto"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-3 md:mb-4"
              style={{ color: theme.text.primary }}
            >
              Payment Transactions
            </h3>
            <div
              className="rounded-lg overflow-hidden min-w-[640px]"
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
        {order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED && (
          <div
            className="rounded-lg p-4 md:p-6 mb-4 md:mb-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-3 md:mb-4"
              style={{ color: theme.text.primary }}
            >
              Actions
            </h3>
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              {getActionButton()}
              {canManageLifecycle && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  disabled={actionLoading}
                  className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 w-full sm:w-auto text-center"
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

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-4 md:mt-6">
          <button
            onClick={() => router.back()}
            className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-opacity opacity-70 hover:opacity-90 text-center"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Reject Payment Modal */}
      {showRejectPaymentModal && (
        <ActionModal
          title="Reject Payment Proof"
          onClose={() => {
            if (actionLoading) return;
            setShowRejectPaymentModal(false);
            setRejectPaymentReason("");
          }}
        >
          <div className="mb-4">
            <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
              Are you sure you want to reject this payment? The order will remain in Pending Payment status.
            </p>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
              Reason for rejection
            </label>
            <textarea
              value={rejectPaymentReason}
              onChange={(e) => setRejectPaymentReason(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${theme.borders.medium}`,
                color: theme.text.primary,
              }}
              rows={4}
              placeholder="Enter reason for rejection..."
              disabled={actionLoading}
            />
          </div>
           <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
             <button
               onClick={() => {
                 setShowRejectPaymentModal(false);
                 setRejectPaymentReason("");
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
               onClick={handleRejectPayment}
               disabled={!rejectPaymentReason.trim() || actionLoading}
               loading={actionLoading}
               loadingLabel="Rejecting..."
               style={{
                 backgroundColor: theme.accents.secondary,
               }}
             >
               Reject Payment
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
            {/* Order balance summary */}
            <div
              className="rounded-lg p-3 text-sm space-y-1"
              style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.light}` }}
            >
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>Total Amount</span>
                <span className="font-semibold" style={{ color: theme.text.primary }}>
                  Rs. {Number(order.amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>Already Paid</span>
                <span className="font-semibold text-emerald-600">
                  Rs. {Number(order.paidAmount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-1" style={{ borderColor: theme.borders.light }}>
                <span style={{ color: theme.text.secondary }}>Remaining Balance</span>
                <span className="font-semibold" style={{ color: theme.accents.error }}>
                  Rs. {Number(order.balanceDue || order.amount || 0).toLocaleString()}
                </span>
              </div>
            </div>

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
            {paymentData.method === PaymentMethod.ONLINE_TRANSFER && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                  Bank/E-Wallet Account
                </label>
                <select
                  value={paymentData.accountId}
                  onChange={(e) => setPaymentData({ ...paymentData, accountId: e.target.value })}
                  disabled={actionLoading}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                >
                  <option value="">Select an account</option>
                  {paymentAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.subtype === "BANK" ? "🏦" : "💳"} {acc.name} {acc.accountNumber ? `(${acc.accountNumber})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
              {paymentData.amount > 0 && paymentData.amount < Number(order.balanceDue || order.amount || 0) && (
                <p className="text-xs mt-1 font-medium" style={{ color: "#D97706" }}>
                  Partial payment — Rs. {(Number(order.balanceDue || order.amount || 0) - paymentData.amount).toLocaleString()} will remain outstanding (receivable).
                </p>
              )}
              {paymentData.amount >= Number(order.balanceDue || order.amount || 0) && (
                <p className="text-xs mt-1 font-medium text-emerald-600">
                  Full payment — no outstanding balance remaining.
                </p>
              )}
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
                  placeholder="e.g. Transaction ID"
                />
              </div>
            )}
          </div>
           <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
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
               disabled={paymentData.amount <= 0 || actionLoading || (paymentData.method === PaymentMethod.ONLINE_TRANSFER && !paymentData.accountId)}
               loading={actionLoading}
               loadingLabel="Recording..."
               style={{
                 backgroundColor: theme.accents.primary,
               }}
             >
               Record Payment
             </AsyncButton>
           </div>
        </ActionModal>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <ActionModal
          title="Cancel Part Order"
          onClose={() => {
            if (actionLoading) return;
            setShowCancelModal(false);
            setCancelReason("");
          }}
        >
          <div className="mb-4">
            <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
              Are you sure you want to cancel this part order? Reserved or deducted stock will be restored according to the current order status.
            </p>
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
           <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-4 md:mt-6">
             <button
               onClick={() => {
                 setShowCancelModal(false);
                 setCancelReason("");
               }}
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

    </div>
  );
}
