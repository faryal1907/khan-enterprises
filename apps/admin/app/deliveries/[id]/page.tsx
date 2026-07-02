"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { getDeliveryById, updateDeliveryStatus } from "@/lib/api/deliveries";

export default function DeliveryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryCost, setDeliveryCost] = useState<string>("");

  useEffect(() => {
    if (delivery) {
      setDeliveryCost(delivery.deliveryCost ? String(delivery.deliveryCost) : "");
    }
  }, [delivery]);

  useEffect(() => {
    if (id) {
      fetchDelivery();
    }
  }, [id]);

  const fetchDelivery = async () => {
    try {
      setLoading(true);
      const data = await getDeliveryById(id as string);
      setDelivery(data);
    } catch (err: any) {
      console.error("Failed to fetch delivery:", err);
      setError(err.response?.data?.message || "Failed to load delivery details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    setSelectedStatus(status);
    setShowNotesModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!delivery || !selectedStatus) return;
    
    try {
      setUpdating(true);
      const payload: any = { status: selectedStatus as any, notes };
      if (deliveryCost !== "") {
        payload.deliveryCost = parseFloat(deliveryCost);
      }
      await updateDeliveryStatus(delivery.id, payload);
      await fetchDelivery();
      setShowNotesModal(false);
      setNotes("");
      setSelectedStatus("");
    } catch (err: any) {
      console.error("Failed to update delivery status:", err);
      setError(err.response?.data?.message || "Failed to update delivery status");
    } finally {
      setUpdating(false);
    }
  };

  const getDeliveryStatusStyle = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          border: "1px solid #F59E0B",
        };
      case "UNDER_REVIEW":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
          border: "1px solid #3B82F6",
        };
      case "APPROVED":
        return {
          backgroundColor: "#E0E7FF",
          color: "#3730A3",
          border: "1px solid #6366F1",
        };
      case "IN_TRANSIT":
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
      default:
        return {
          backgroundColor: theme.backgrounds.tertiary,
          color: theme.text.secondary,
          border: `1px solid ${theme.borders.medium}`,
        };
    }
  };

  const getNextStatuses = (currentStatus: string) => {
    const transitions: Record<string, string[]> = {
      "REQUESTED": ["UNDER_REVIEW", "APPROVED"],
      "UNDER_REVIEW": ["APPROVED", "REQUESTED"],
      "APPROVED": ["IN_TRANSIT", "UNDER_REVIEW"],
      "IN_TRANSIT": ["DELIVERED", "APPROVED"],
      "DELIVERED": [],
    };
    return transitions[currentStatus] || [];
  };

  if (loading) {
    return (
      <div className="px-4 py-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.accents.primary }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="px-4 py-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-lg p-6 md:p-8 text-center"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm md:text-base" style={{ color: theme.text.secondary }}>{error || "Delivery not found"}</p>
            <button
              onClick={() => router.push("/deliveries")}
              className="mt-3 md:mt-4 px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
              style={{
                backgroundColor: theme.accents.primary,
                color: theme.text.inverse,
              }}
            >
              Back to Delivery Queue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 md:mb-6">
          <h1
            className="text-2xl md:text-3xl font-bold mb-1 md:mb-2"
            style={{ color: theme.text.primary }}
          >
            Delivery Details
          </h1>
          <p className="text-sm md:text-base" style={{ color: theme.text.secondary }}>
            View delivery request and manage delivery status
          </p>
        </div>

        {/* Order Information */}
        <div
          className="rounded-lg p-4 md:p-6 mb-4 md:mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-3 md:mb-4"
            style={{ color: theme.text.primary }}
          >
            Order Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Order Number
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.order?.orderNumber || delivery.partOrder?.orderNumber || "N/A"}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Order Date
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.order?.createdAt ? new Date(delivery.order.createdAt).toLocaleDateString() :
                 delivery.partOrder?.createdAt ? new Date(delivery.partOrder.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Order Status
              </label>
              <span
                className="inline-block px-2 py-1 text-xs font-medium rounded"
                style={{
                  backgroundColor: "#E0E7FF",
                  color: "#3730A3",
                  border: "1px solid #6366F1",
                }}
              >
                {delivery.order?.status?.replace(/_/g, " ") || delivery.partOrder?.status?.replace(/_/g, " ") || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div
          className="rounded-lg p-4 md:p-6 mb-4 md:mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-3 md:mb-4"
            style={{ color: theme.text.primary }}
          >
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Name
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.order?.customerName || delivery.partOrder?.customerName || "N/A"}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Phone
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.order?.customerPhone || delivery.partOrder?.customerPhone || "N/A"}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Address
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.deliveryAddress || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div
          className="rounded-lg p-4 md:p-6 mb-4 md:mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-3 md:mb-4"
            style={{ color: theme.text.primary }}
          >
            Delivery Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Delivery Address
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.deliveryAddress}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Preferred Time Window
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.preferredTimeWindow || "Not specified"}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Contact Number
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.contactNumber}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Requested Date
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {new Date(delivery.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Current Status
              </label>
              <span
                className="inline-block px-2 py-1 text-xs font-medium rounded"
                style={getDeliveryStatusStyle(delivery.status)}
              >
                {delivery.status.replace(/_/g, " ")}
              </span>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Branch
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.order?.branch ? `${delivery.order.branch.name}, ${delivery.order.branch.city}` :
                 delivery.partOrder?.branch ? `${delivery.partOrder.branch.name}, ${delivery.partOrder.branch.city}` : "N/A"}
              </p>
            </div>
            
            {/* Added Extra Information */}
            {delivery.distanceFromBranch != null && (
              <div>
                <label
                  className="block text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: theme.text.muted }}
                >
                  Distance
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {delivery.distanceFromBranch.toFixed(2)} km
                </p>
              </div>
            )}
            
            {(delivery.latitude || delivery.longitude) && (
              <div>
                <label
                  className="block text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: theme.text.muted }}
                >
                  Pinned Coordinates
                </label>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {delivery.latitude}, {delivery.longitude}
                </p>
              </div>
            )}
            
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Delivery Charges
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.deliveryCost ? `Rs. ${Number(delivery.deliveryCost).toLocaleString()}` : "Not Set"}
              </p>
            </div>
            
            {delivery.notes && (
              <div className="col-span-1 md:col-span-3">
                <label
                  className="block text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: theme.text.muted }}
                >
                  Notes
                </label>
                <div
                  className="text-sm p-3 rounded-lg"
                  style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.primary }}
                >
                  {delivery.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Section */}
        {delivery.status !== "DELIVERED" && getNextStatuses(delivery.status).length > 0 && (
          <div
            className="rounded-lg p-4 md:p-6 mb-4 md:mb-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-3 md:mb-4"
              style={{ color: theme.text.primary }}
            >
              Update Status
            </h3>
            <div className="flex flex-col-reverse sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
              {getNextStatuses(delivery.status).map((nextStatus) => (
                <button
                  key={nextStatus}
                  onClick={() => handleStatusUpdate(nextStatus)}
                  disabled={updating}
                  className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 w-full sm:w-auto text-center"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  Mark as {nextStatus.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes Modal */}
        {showNotesModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              onClick={() => setShowNotesModal(false)}
            />
            <div
              className="relative rounded-lg p-4 md:p-6 w-full max-w-sm sm:max-w-md mx-4"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
                Update Delivery Details
              </h3>
              <div className="mb-4">
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Delivery Charges (Rs.)
                </label>
                <input
                  type="number"
                  value={deliveryCost}
                  onChange={(e) => setDeliveryCost(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="e.g. 500"
                />
              </div>
              <div className="mb-4 md:mb-6">
                <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Add any notes about this status change..."
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    color: theme.text.secondary,
                    border: `1px solid ${theme.borders.medium}`,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusUpdate}
                  disabled={updating}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  {updating ? "Updating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-4 md:mt-6">
          <button
            onClick={() => router.push("/deliveries")}
            className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70 text-center"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back to Delivery Queue
          </button>
          <button
            onClick={() => {
              if (delivery.order?.id) router.push(`/orders/${delivery.order.id}`);
              else if (delivery.partOrder?.id) router.push(`/part-orders/${delivery.partOrder.id}`);
            }}
            disabled={!delivery.order?.id && !delivery.partOrder?.id}
            className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            View Order
          </button>
        </div>
      </div>
    </div>
  );
}
