"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { OrderStatus, PaymentMethod, Order, PaymentTransaction, UserRole } from "@/lib/types";
import { getOrderById, updateOrderStatus, cancelOrder, recordPayment, verifyPayment, downloadInvoice, markAsPickedByCustomer } from "@/lib/api/orders";
import { approveDelivery } from "@/lib/api/deliveries";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { getPaymentAccounts } from "@/lib/api/accounting";

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
  const [showRejectPaymentModal, setShowRejectPaymentModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rejectPaymentReason, setRejectPaymentReason] = useState("");
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState({
    method: PaymentMethod.ONLINE_TRANSFER,
    amount: 0,
    referenceNumber: "",
    accountId: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        // Default to remaining balance so partial payments adjust correctly
        const balanceDue = data.balanceDue !== undefined ? Number(data.balanceDue) : 0;
        const fullAmount = data.bike?.actualSalePrice ? Number(data.bike.actualSalePrice) : 0;
        setPaymentData((prev) => ({ ...prev, amount: balanceDue || fullAmount }));
      } catch (error: any) {
        console.warn("Failed to fetch order:", error?.message || error);
        toast.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (showPaymentModal) {
      getPaymentAccounts().then(setPaymentAccounts).catch(() => setPaymentAccounts([]));
    }
  }, [showPaymentModal]);

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
        accountId: paymentData.accountId || undefined,
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

  const handleVerifyPayment = async (transactionId: string) => {
    try {
      setActionLoading(true);
      await verifyPayment(orderId, transactionId, true);
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
      toast.success("Payment verified successfully");
    } catch (error: any) {
      console.warn("Failed to verify payment:", error?.message || error);
      toast.error(error?.message || "Failed to verify payment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async (transactionId: string) => {
    try {
      setActionLoading(true);
      await verifyPayment(orderId, transactionId, false, rejectPaymentReason);
      const updatedOrder = await getOrderById(orderId);
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




  const getActionButton = () => {
    if (!order) return null;

    switch (order.status) {
      case OrderStatus.PENDING_PAYMENT:
        if (pendingVerificationTx && canManageLifecycle) {
          return (
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <AsyncButton
                onClick={() => handleVerifyPayment(pendingVerificationTx.id)}
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
        // If delivery has been requested, show Record Payment if balance outstanding
        if (order.delivery) {
          if (Number((order as any).balanceDue) > 0) {
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
        // No delivery requested yet — show Record Payment if balance outstanding, otherwise Picked by Customer
        if (Number((order as any).balanceDue) > 0) {
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

  const pendingVerificationTx = order?.transactions?.find((tx) => tx.status === "VERIFICATION_PENDING");
  const latestTxWithProof = order?.transactions?.slice().reverse().find((tx) => tx.paymentProofUrl);

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
          <p className="text-sm md:text-base" style={{ color: theme.text.secondary }}>Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold mb-1 md:mb-2"
              style={{ color: theme.text.primary }}
            >
              Order Details
            </h1>
            <p className="text-sm md:text-base" style={{ color: theme.text.secondary }}>
              Order #{order.orderNumber}
            </p>
          </div>
          <button
            onClick={handleDownloadInvoice}
            disabled={actionLoading}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 w-full sm:w-auto text-center"
            style={{
              backgroundColor: theme.accents.secondary,
              color: theme.text.inverse,
            }}
          >
            {actionLoading ? "Working..." : "Download Invoice"}
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
            className="rounded-lg p-4 md:p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-3 md:mb-4"
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

          {/* Delivery Status Card */}
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
                      Processed By
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
                      <td className="px-4 py-3 whitespace-nowrap text-xs">
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
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                        {transaction.gatewayReference || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                        {(transaction as any).processedBy?.fullName || "—"}
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
            className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70 text-center"
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
           <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
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
      {showPaymentModal && (order as any) && (
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
                  Rs. {Number((order as any).totalAmount || (order as any).bike?.actualSalePrice || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>Already Paid</span>
                <span className="font-semibold text-emerald-600">
                  Rs. {Number((order as any).paidAmount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-1" style={{ borderColor: theme.borders.light }}>
                <span style={{ color: theme.text.secondary }}>Remaining Balance</span>
                <span className="font-semibold" style={{ color: theme.accents.error }}>
                  Rs. {Number((order as any).balanceDue || (order as any).totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

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
              {paymentData.amount > 0 && paymentData.amount < Number((order as any).balanceDue || (order as any).totalAmount || 0) && (
                <p className="text-xs mt-1 font-medium" style={{ color: "#D97706" }}>
                  Partial payment — Rs. {(Number((order as any).balanceDue || (order as any).totalAmount || 0) - paymentData.amount).toLocaleString()} will remain outstanding (receivable).
                </p>
              )}
              {paymentData.amount >= Number((order as any).balanceDue || (order as any).totalAmount || 0) && (
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
                  placeholder="Enter reference number..."
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
               disabled={paymentData.amount <= 0 || actionLoading || !paymentData.accountId}
               loading={actionLoading}
               loadingLabel="Recording..."
             >
               Record Payment
             </AsyncButton>
           </div>
        </ActionModal>
      )}


      {/* Reject Payment Modal */}
      {showRejectPaymentModal && pendingVerificationTx && (
        <ActionModal
          title="Reject Payment"
          onClose={() => {
            if (actionLoading) return;
            setShowRejectPaymentModal(false);
            setRejectPaymentReason("");
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
              Reason for Rejection
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
              placeholder="Enter reason for rejecting the payment proof..."
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
               onClick={() => handleRejectPayment(pendingVerificationTx.id)}
               disabled={!rejectPaymentReason.trim() || actionLoading}
               loading={actionLoading}
               loadingLabel="Rejecting..."
               style={{
                 backgroundColor: theme.accents.secondary,
               }}
             >
               Confirm Rejection
             </AsyncButton>
           </div>
        </ActionModal>
      )}
    </div>
  );
}
