"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import {
  getOfferById,
  acceptOffer,
  rejectOffer,
  counterOffer,
} from "@/lib/api/offers";
import { numberToWords } from "@repo/utils";

interface Offer {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerCNIC: string | null;
  customerAddress: string | null;
  offerAmount: number;
  counterAmount: number | null;
  message: string | null;
  adminResponse: string | null;
  status: string;
  createdAt: string;
  bike: {
    id: string;
    chassisNumber: string;
    engineNumber: string;
    price?: number;
    model: {
      brand: string;
      modelName: string;
      year: number;
      basePrice?: number;
    };
    branch: {
      name: string;
      city: string;
    };
  };
  order: {
    id: string;
    orderNumber: string;
  } | null;
}

export default function OfferDetailPage() {
  const router = useRouter();
  const params = useParams();
  const offerId = params.id as string;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");
  const [adminResponse, setAdminResponse] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOffer();
  }, [offerId]);

  const fetchOffer = async () => {
    try {
      setLoading(true);
      const data = await getOfferById(offerId);
      setOffer(data);
    } catch (error) {
      console.error("Failed to fetch offer:", error);
      router.push("/offers");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setActionLoading(true);
      await acceptOffer(offerId);
      await fetchOffer();
      toast.success("Offer accepted successfully");
    } catch (error) {
      console.error("Failed to accept offer:", error);
      toast.error("Failed to accept offer. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!adminResponse.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setActionLoading(true);
      await rejectOffer(offerId, { adminResponse });
      setShowRejectModal(false);
      setAdminResponse("");
      await fetchOffer();
      toast.success("Offer rejected successfully");
    } catch (error) {
      console.error("Failed to reject offer:", error);
      toast.error("Failed to reject offer. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCounter = async () => {
    if (!counterAmount.trim()) {
      toast.error("Please provide a counter amount");
      return;
    }

    try {
      setActionLoading(true);
      await counterOffer(offerId, {
        counterAmount: parseFloat(counterAmount.replace(/,/g, "")),
        ...(adminResponse.trim() && { adminResponse }),
      });
      setShowCounterModal(false);
      setCounterAmount("");
      setAdminResponse("");
      await fetchOffer();
      toast.success("Counter offer sent successfully");
    } catch (error) {
      console.error("Failed to counter offer:", error);
      toast.error("Failed to counter offer. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          border: "1px solid #F59E0B",
        };
      case "ACCEPTED":
        return {
          backgroundColor: "#D1FAE5",
          color: "#065F46",
          border: "1px solid #10B981",
        };
      case "REJECTED":
        return {
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #EF4444",
        };
      case "COUNTERED":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
          border: "1px solid #3B82F6",
        };
      default:
        return {
          backgroundColor: theme.backgrounds.tertiary,
          color: theme.text.secondary,
          border: `1px solid ${theme.borders.medium}`,
        };
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto text-center" style={{ color: theme.text.secondary }}>
          Loading offer details...
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto text-center" style={{ color: theme.text.secondary }}>
          Offer not found
        </div>
      </div>
    );
  }

  const canAct = offer.status === "PENDING";
  const isCountered = offer.status === "COUNTERED";
  const isAccepted = offer.status === "ACCEPTED";

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text.primary }}
          >
            Offer Details
          </h1>
          <p style={{ color: theme.text.secondary }}>
            View and manage offer negotiation
          </p>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span
            className="inline-block px-3 py-1 text-sm font-medium rounded"
            style={getStatusBadgeStyle(offer.status)}
          >
            {offer.status}
          </span>
        </div>

        {/* Customer Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Name
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {offer.customerName}
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
                {offer.customerPhone}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Email
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {offer.customerEmail || "—"}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                CNIC
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {offer.customerCNIC || "—"}
              </p>
            </div>
            <div className="md:col-span-2">
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Address
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {offer.customerAddress || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Bike Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Bike Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Brand
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {offer.bike.model.brand}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Model
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {offer.bike.model.modelName} ({offer.bike.model.year})
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Branch
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {offer.bike.branch.name}, {offer.bike.branch.city}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Chassis Number
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {offer.bike.chassisNumber}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Engine Number
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {offer.bike.engineNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Offer Details */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Offer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Listed Price
              </label>
              <p
                className="text-2xl font-bold"
                style={{ color: theme.text.primary }}
              >
                Rs. {Number(offer.bike.price || offer.bike.model.basePrice || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Original Offer
              </label>
              <p
                className="text-2xl font-bold"
                style={{ color: theme.accents.primary }}
              >
                Rs. {Number(offer.offerAmount).toLocaleString()}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Counter Offer
              </label>
              <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                {offer.counterAmount
                  ? `Rs. ${Number(offer.counterAmount).toLocaleString()}`
                  : "—"}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Submitted
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {new Date(offer.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {offer.message && (
            <div className="mt-4">
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Customer Message
              </label>
              <p
                className="text-sm p-3 rounded"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.primary,
                }}
              >
                {offer.message}
              </p>
            </div>
          )}

          {offer.adminResponse && (
            <div className="mt-4">
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Admin Response
              </label>
              <p
                className="text-sm p-3 rounded"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.primary,
                }}
              >
                {offer.adminResponse}
              </p>
            </div>
          )}
        </div>

        {/* Order Information (if accepted) */}
        {offer.order && (
          <div
            className="rounded-lg p-6 mb-6"
            style={{
              backgroundColor: "#D1FAE5",
              border: "1px solid #10B981",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#065F46" }}
            >
              Order Created
            </h3>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: "#065F46" }}
              >
                Order Number
              </label>
              <p className="text-sm font-medium" style={{ color: "#065F46" }}>
                {offer.order.orderNumber}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        {canAct && (
          <div
            className="rounded-lg p-6 mb-6"
            style={{
              backgroundColor: theme.backgrounds.primary,
              border: `1px solid ${theme.borders.light}`,
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text.primary }}
            >
              Actions
            </h3>
            <div className="flex space-x-4">
              <button
                onClick={handleAccept}
                disabled={actionLoading}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                {actionLoading ? "Processing..." : "Accept Offer"}
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: theme.text.inverse,
                }}
              >
                Reject Offer
              </button>
              <button
                onClick={() => setShowCounterModal(true)}
                disabled={actionLoading}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
              >
                Counter Offer
              </button>
            </div>
          </div>
        )}

        {/* Waiting for customer (countered) */}
        {isCountered && (
          <div
            className="rounded-lg p-6 mb-6"
            style={{
              backgroundColor: "#DBEAFE",
              border: "1px solid #3B82F6",
            }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "#1E40AF" }}
            >
              Waiting for Customer Response
            </h3>
            <p className="text-sm" style={{ color: "#1E40AF" }}>
              Customer has been sent a counter offer of Rs.{" "}
              {Number(offer.counterAmount).toLocaleString()}. They can accept
              or reject this offer.
            </p>
          </div>
        )}

        {/* Read-only (accepted) */}
        {isAccepted && (
          <div
            className="rounded-lg p-6 mb-6"
            style={{
              backgroundColor: "#D1FAE5",
              border: "1px solid #10B981",
            }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "#065F46" }}
            >
              Offer Accepted
            </h3>
            <p className="text-sm" style={{ color: "#065F46" }}>
              This offer has been accepted and an order has been created.
            </p>
          </div>
        )}

        {/* Counter Modal */}
        {showCounterModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="rounded-lg p-6 max-w-md w-full mx-4"
              style={{
                backgroundColor: theme.backgrounds.primary,
                border: `1px solid ${theme.borders.light}`,
              }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Counter Offer
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Counter Amount (Rs.)
                  </label>
                  <input
                    type="text"
                    value={counterAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val) {
                        setCounterAmount(Number(val).toLocaleString());
                      } else {
                        setCounterAmount("");
                      }
                    }}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter counter amount"
                  />
                  {counterAmount && (
                    <p className="text-sm mt-2 font-medium" style={{ color: "#059669" }}>
                      {numberToWords(parseFloat(counterAmount.replace(/,/g, "")))}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Response Message
                  </label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter your response to the customer"
                  />
                </div>
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={() => {
                      setShowCounterModal(false);
                      setCounterAmount("");
                      setAdminResponse("");
                    }}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      color: theme.text.secondary,
                      border: `1px solid ${theme.borders.medium}`,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCounter}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: theme.accents.primary,
                      color: theme.text.inverse,
                    }}
                  >
                    {actionLoading ? "Sending..." : "Send Counter"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="rounded-lg p-6 max-w-md w-full mx-4"
              style={{
                backgroundColor: theme.backgrounds.primary,
                border: `1px solid ${theme.borders.light}`,
              }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Reject Offer
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Rejection Reason
                  </label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter reason for rejection"
                  />
                </div>
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setAdminResponse("");
                    }}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      color: theme.text.secondary,
                      border: `1px solid ${theme.borders.medium}`,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: theme.accents.secondary,
                      color: theme.text.inverse,
                    }}
                  >
                    {actionLoading ? "Rejecting..." : "Reject Offer"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => router.push("/offers")}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back to Offers
          </button>
        </div>
      </div>
    </div>
  );
}
