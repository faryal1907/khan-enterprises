"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { getOfferById, acceptCounterOffer, rejectCounterOffer, cancelOffer } from "@/lib/api/offers";

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
  expiresAt: string | null;
  createdAt: string;
  bike: {
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
      name: string;
      city: string;
    };
  };
  order: {
    id: string;
    orderNumber: string;
  } | null;
}

export default function OfferStatusPage() {
  const { id } = useParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("CASH");

  useEffect(() => {
    fetchOffer();
  }, [id]);

  const fetchOffer = async () => {
    try {
      setLoading(true);
      const data = await getOfferById(id as string);
      setOffer(data);
    } catch (err: any) {
      console.error("Failed to fetch offer:", err);
      setError(err.response?.data?.message || "Failed to load offer details");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptCounter = async () => {
    // Show payment method selection modal first
    setShowPaymentMethodModal(true);
  };

  const confirmAcceptCounter = async () => {
    try {
      setAccepting(true);
      setShowPaymentMethodModal(false);
      await acceptCounterOffer(id as string, selectedPaymentMethod);
      await fetchOffer();
    } catch (err: any) {
      console.error("Failed to accept counter offer:", err);
      setError(err.response?.data?.message || "Failed to accept counter offer");
    } finally {
      setAccepting(false);
    }
  };

  const handleRejectCounter = async () => {
    try {
      setRejecting(true);
      await rejectCounterOffer(id as string, { message: "Counter offer rejected by customer" });
      await fetchOffer();
    } catch (err: any) {
      console.error("Failed to reject counter offer:", err);
      setError(err.response?.data?.message || "Failed to reject counter offer");
    } finally {
      setRejecting(false);
    }
  };

  const handleCancelOffer = async () => {
    try {
      setCancelling(true);
      await cancelOffer(id as string);
      await fetchOffer();
    } catch (err: any) {
      console.error("Failed to cancel offer:", err);
      setError(err.response?.data?.message || "Failed to cancel offer");
    } finally {
      setCancelling(false);
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
      case "EXPIRED":
        return {
          backgroundColor: "#F3F4F6",
          color: "#374151",
          border: "1px solid #6B7280",
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.accents.primary }} />
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="rounded-xl p-12 text-center max-w-md" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <p style={{ color: theme.text.secondary }}>{error || "Offer not found"}</p>
          <Link href="/bikes" className="inline-block mt-4 text-sm hover:opacity-70" style={{ color: theme.accents.primary }}>
            Browse Bikes
          </Link>
        </div>
      </div>
    );
  }

  const isCountered = offer.status === "COUNTERED";
  const isAccepted = offer.status === "ACCEPTED";
  const isPending = offer.status === "PENDING";
  const isRejected = offer.status === "REJECTED";
  const isExpired = offer.status === "EXPIRED";

  // Calculate time remaining until expiry
  const getTimeRemaining = () => {
    if (!offer.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(offer.expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text.primary }}>
            Offer Status
          </h1>
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Offer ID: {offer.id}
          </p>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span
            className="inline-block px-4 py-2 text-sm font-medium rounded-full"
            style={getStatusBadgeStyle(offer.status)}
          >
            {offer.status}
          </span>
          {timeRemaining && (
            <span className="ml-3 text-sm" style={{ color: theme.text.secondary }}>
              Expires in {timeRemaining.hours}h {timeRemaining.minutes}m
            </span>
          )}
        </div>

        {/* Negotiation Timeline */}
        <div
          className="rounded-xl p-8 mb-6"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
        >
          <h2 className="text-xl font-semibold mb-6" style={{ color: theme.text.primary }}>
            Negotiation History
          </h2>
          <div className="space-y-6">
            {/* Customer Submitted */}
            <div className="flex gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold" style={{ color: theme.text.primary }}>You submitted an offer</h3>
                  <span className="text-xs" style={{ color: theme.text.muted }}>
                    {new Date(offer.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>
                  Offered: <span className="font-medium" style={{ color: theme.text.primary }}>
                    PKR {Number(offer.offerAmount).toLocaleString()}
                  </span>
                </p>
                {offer.message && (
                  <p className="text-sm p-3 rounded" style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary }}>
                    "{offer.message}"
                  </p>
                )}
              </div>
            </div>

            {/* Admin Response (if countered) */}
            {isCountered && (
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.accents.secondary, color: theme.text.inverse }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold" style={{ color: theme.text.primary }}>Admin countered your offer</h3>
                  </div>
                  <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>
                    Counter offer: <span className="font-medium" style={{ color: theme.text.primary }}>
                      PKR {Number(offer.counterAmount).toLocaleString()}
                    </span>
                  </p>
                  {offer.adminResponse && (
                    <p className="text-sm p-3 rounded" style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary }}>
                      "{offer.adminResponse}"
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Accepted */}
            {isAccepted && (
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#10B981", color: "white" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: theme.text.primary }}>Offer Accepted</h3>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>
                    Your offer was accepted and an order has been created.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bike Information */}
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
              <p className="font-medium" style={{ color: theme.text.primary }}>{offer.bike.model.brand}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Model</p>
              <p className="font-medium" style={{ color: theme.text.primary }}>
                {offer.bike.model.modelName} ({offer.bike.model.year})
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Listed Price</p>
              <p className="font-medium" style={{ color: theme.text.primary }}>
                PKR {Number(offer.bike.price || offer.bike.model.basePrice).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Branch</p>
              <p className="font-medium" style={{ color: theme.text.primary }}>
                {offer.bike.branch.name}, {offer.bike.branch.city}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isCountered && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: "#DBEAFE", border: "1px solid #3B82F6" }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: "#1E40AF" }}>
              Counter Offer Available
            </h2>
            <p className="text-sm mb-4" style={{ color: "#1E40AF" }}>
              The admin has countered your offer with PKR {Number(offer.counterAmount).toLocaleString()}. You can accept this counter offer to proceed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleAcceptCounter}
                disabled={accepting}
                className="flex-1 px-6 py-3 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: "#3B82F6",
                  color: "white",
                }}
              >
                {accepting ? "Accepting..." : "Accept Counter Offer"}
              </button>
              <button
                onClick={handleRejectCounter}
                disabled={rejecting}
                className="flex-1 px-6 py-3 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: "#EF4444",
                  color: "white",
                }}
              >
                {rejecting ? "Rejecting..." : "Reject Counter Offer"}
              </button>
            </div>
          </div>
        )}

        {/* Cancel Offer Button for Pending/Countered offers */}
        {(isPending || isCountered) && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
              Cancel Offer
            </h2>
            <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
              You can cancel this offer at any time before it's accepted.
            </p>
            <button
              onClick={handleCancelOffer}
              disabled={cancelling}
              className="w-full px-6 py-3 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{
                backgroundColor: "#EF4444",
                color: "white",
              }}
            >
              {cancelling ? "Cancelling..." : "Cancel Offer"}
            </button>
          </div>
        )}

        {/* Order Information */}
        {isAccepted && offer.order && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: "#D1FAE5", border: "1px solid #10B981" }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: "#065F46" }}>
              Order Created
            </h2>
            <p className="text-sm mb-4" style={{ color: "#065F46" }}>
              Your offer was accepted! Complete payment to confirm your order.
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ color: "#065F46" }}>Order Number</p>
                <p className="font-semibold" style={{ color: "#065F46" }}>{offer.order.orderNumber}</p>
              </div>
              <Link
                href={`/orders/${offer.order.orderNumber}`}
                className="px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: "#10B981",
                  color: "white",
                }}
              >
                View Order
              </Link>
            </div>
          </div>
        )}

        {/* Bookmark Reminder */}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            💡 Bookmark this page to track your offer status. You can return anytime using this link.
          </p>
        </div>
      </div>

      {/* Payment Method Selection Modal */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 50 }}>
          <div
            className="rounded-xl p-6 max-w-md w-full"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
              Select Payment Method
            </h2>
            <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
              Please choose your preferred payment method before accepting the counter offer.
            </p>

            <div className="space-y-3 mb-6">
              <label className="flex items-center p-4 rounded-lg cursor-pointer" style={{ backgroundColor: theme.backgrounds.tertiary, border: selectedPaymentMethod === "CASH" ? `2px solid ${theme.accents.primary}` : `1px solid ${theme.borders.medium}` }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH"
                  checked={selectedPaymentMethod === "CASH"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium" style={{ color: theme.text.primary }}>Cash</p>
                  <p className="text-xs" style={{ color: theme.text.secondary }}>Pay at your nearest branch</p>
                </div>
              </label>

              <label className="flex items-center p-4 rounded-lg cursor-pointer" style={{ backgroundColor: theme.backgrounds.tertiary, border: selectedPaymentMethod === "BANK_TRANSFER" ? `2px solid ${theme.accents.primary}` : `1px solid ${theme.borders.medium}` }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={selectedPaymentMethod === "BANK_TRANSFER"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium" style={{ color: theme.text.primary }}>Bank Transfer</p>
                  <p className="text-xs" style={{ color: theme.text.secondary }}>Transfer via online banking</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentMethodModal(false)}
                className="flex-1 px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.primary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAcceptCounter}
                disabled={accepting}
                className="flex-1 px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                {accepting ? "Processing..." : "Confirm & Accept"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
