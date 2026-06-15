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
      await updateDeliveryStatus(delivery.id, { status: selectedStatus as any, notes });
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
      <div className="p-8">
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
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-lg p-8 text-center"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p style={{ color: theme.text.secondary }}>{error || "Delivery not found"}</p>
            <button
              onClick={() => router.push("/deliveries")}
              className="mt-4 px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
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
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text.primary }}
          >
            Delivery Details
          </h1>
          <p style={{ color: theme.text.secondary }}>
            View delivery request and manage delivery status
          </p>
        </div>

        {/* Order Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Order Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Order Number
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.order?.orderNumber || "N/A"}
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
                {delivery.order?.createdAt ? new Date(delivery.order.createdAt).toLocaleDateString() : "N/A"}
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
                {delivery.order?.status?.replace(/_/g, " ") || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Name
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {delivery.order?.customerName || "N/A"}
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
                {delivery.order?.customerPhone || "N/A"}
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
                {delivery.order?.customerAddress || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Delivery Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                {delivery.order?.branch ? `${delivery.order.branch.name}, ${delivery.order.branch.city}` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Delivery Timeline
          </h3>
          <div
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: theme.backgrounds.tertiary }}
          >
            <table className="w-full">
              <thead>
                <tr
                  style={{ backgroundColor: theme.backgrounds.primary, borderBottom: `1px solid ${theme.borders.light}` }}
                >
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                    —
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                    —
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                    —
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
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
          <div className="flex flex-wrap gap-3">
            {getNextStatuses(delivery.status).map((nextStatus) => (
              <button
                key={nextStatus}
                onClick={() => handleStatusUpdate(nextStatus)}
                disabled={updating}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: nextStatus === "APPROVED" || nextStatus === "DELIVERED" 
                    ? theme.accents.primary 
                    : theme.backgrounds.tertiary,
                  color: nextStatus === "APPROVED" || nextStatus === "DELIVERED"
                    ? theme.text.inverse
                    : theme.text.secondary,
                  border: nextStatus === "APPROVED" || nextStatus === "DELIVERED"
                    ? "none"
                    : `1px solid ${theme.borders.medium}`,
                }}
              >
                {nextStatus.replace(/_/g, " ")}
              </button>
            ))}
            <a
              href={`tel:${delivery.contactNumber}`}
              className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 inline-flex items-center"
              style={{
                backgroundColor: "#10B981",
                color: "white",
              }}
            >
              Contact Customer
            </a>
          </div>
        </div>

        {/* Notes Modal */}
        {showNotesModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              onClick={() => setShowNotesModal(false)}
            />
            <div
              className="relative rounded-lg p-6 w-full max-w-md"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
                Add Notes (Optional)
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg text-sm mb-4"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                placeholder="Add any notes about this status change..."
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
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
                  className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
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

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => router.push("/deliveries")}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back to Delivery Queue
          </button>
          <button
            onClick={() => delivery.order?.id && router.push(`/orders/${delivery.order.id}`)}
            disabled={!delivery.order?.id}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
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
