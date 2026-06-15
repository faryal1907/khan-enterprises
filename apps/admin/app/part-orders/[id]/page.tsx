"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { OrderStatus, PaymentMethod } from "@/lib/types";
import { getPartOrderById, updatePartOrderStatus, cancelPartOrder, downloadInvoice } from "@/lib/api/orders";
import { toast } from "sonner";

export default function PartOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getPartOrderById(orderId);
        setOrder(data);
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
      setActionLoading(true);
      await updatePartOrderStatus(orderId, newStatus);
      const updatedOrder = await getPartOrderById(orderId);
      setOrder(updatedOrder);
      toast.success("Order status updated");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update order status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setActionLoading(true);
      await cancelPartOrder(orderId);
      const updatedOrder = await getPartOrderById(orderId);
      setOrder(updatedOrder);
      setShowCancelModal(false);
      toast.success("Order cancelled");
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const getActionButton = () => {
    if (!order) return null;

    switch (order.status) {
      case OrderStatus.PENDING_PAYMENT:
        return (
          <button
            onClick={() => handleStatusUpdate(OrderStatus.PAID)}
            disabled={actionLoading}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Mark as Paid
          </button>
        );
      case OrderStatus.PAID:
        return (
          <button
            onClick={() => handleStatusUpdate(OrderStatus.CONFIRMED)}
            disabled={actionLoading}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
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
      case OrderStatus.READY_FOR_DELIVERY:
        return (
          <button
            onClick={() => handleStatusUpdate(OrderStatus.DELIVERED)}
            disabled={actionLoading}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
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

  const handleDownloadInvoice = async () => {
    try {
      setActionLoading(true);
      await downloadInvoice(orderId, true); // true for isPart
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Failed to download invoice:", error);
      toast.error("Failed to download invoice");
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
              Part Order Details
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
            Download Invoice
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
            </div>
          </div>

          {/* Branch Info Card */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text.primary }}
            >
              Location Info
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

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
              Cancel Part Order
            </h3>
            <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
              Are you sure you want to cancel this part order? The reserved stock will be restored.
            </p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
              >
                Go Back
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: theme.text.inverse,
                }}
              >
                {actionLoading ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
