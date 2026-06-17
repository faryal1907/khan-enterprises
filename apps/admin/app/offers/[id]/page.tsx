"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { OfferStatusBadge } from "@/components/offer-status-badge";
import { acceptOffer, counterOffer, getOfferById, rejectOffer } from "@/lib/api/offers";
import { theme } from "@/lib/colors";
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

type ActionState = "accept" | "reject" | "counter" | null;

function formatCurrency(value: number | string | null | undefined) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
        {label}
      </label>
      <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
        {children || "-"}
      </p>
    </div>
  );
}

function Section({ title, children, tone }: { title: string; children: ReactNode; tone?: "success" | "info" }) {
  const style = tone === "success"
    ? { backgroundColor: "#D1FAE5", border: "1px solid #10B981" }
    : tone === "info"
      ? { backgroundColor: "#DBEAFE", border: "1px solid #3B82F6" }
      : { backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` };

  return (
    <div className="rounded-lg p-6 mb-6" style={style}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: tone === "success" ? "#065F46" : tone === "info" ? "#1E40AF" : theme.text.primary }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function OfferDetailPage() {
  const router = useRouter();
  const params = useParams();
  const offerId = params.id as string;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"reject" | "counter" | null>(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [adminResponse, setAdminResponse] = useState("");
  const [actionLoading, setActionLoading] = useState<ActionState>(null);

  const fetchOffer = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getOfferById(offerId);
      setOffer(data);
    } catch (fetchError: any) {
      setError(fetchError.response?.data?.message || "Failed to load offer");
      setOffer(null);
    } finally {
      setLoading(false);
    }
  }, [offerId]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

  const closeModal = () => {
    if (actionLoading) return;
    setModal(null);
    setCounterAmount("");
    setAdminResponse("");
  };

  const handleAccept = async () => {
    try {
      setActionLoading("accept");
      await acceptOffer(offerId);
      await fetchOffer();
      toast.success("Offer accepted and bike reserved for 48 hours");
    } catch (acceptError: any) {
      toast.error(acceptError.response?.data?.message || "Failed to accept offer");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!adminResponse.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setActionLoading("reject");
      await rejectOffer(offerId, { adminResponse: adminResponse.trim() });
      setModal(null);
      setAdminResponse("");
      await fetchOffer();
      toast.success("Offer rejected");
    } catch (rejectError: any) {
      toast.error(rejectError.response?.data?.message || "Failed to reject offer");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCounter = async () => {
    const amount = Number(counterAmount.replace(/,/g, ""));
    if (!amount || amount <= 0) {
      toast.error("Please provide a valid counter amount");
      return;
    }

    try {
      setActionLoading("counter");
      await counterOffer(offerId, {
        counterAmount: parseFloat(counterAmount.replace(/,/g, "")),
        ...(adminResponse.trim() && { adminResponse }),
      });
      setModal(null);
      setCounterAmount("");
      setAdminResponse("");
      await fetchOffer();
      toast.success("Counter offer sent");
    } catch (counterError: any) {
      toast.error(counterError.response?.data?.message || "Failed to send counter offer");
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

  if (error || !offer) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="mb-4" style={{ color: error ? theme.accents.secondary : theme.text.secondary }}>
            {error || "Offer not found"}
          </p>
          <div className="flex justify-center gap-3">
            <AsyncButton onClick={fetchOffer}>Retry</AsyncButton>
            <button
              onClick={() => router.push("/offers")}
              className="px-4 py-2 text-sm font-medium rounded"
              style={{ backgroundColor: theme.backgrounds.primary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
            >
              Back to Offers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canAct = offer.status === "PENDING";
  const isCountered = offer.status === "COUNTERED";
  const isAccepted = offer.status === "ACCEPTED";
  const isPaid = offer.status === "PAID";
  const listedPrice = offer.bike.price || offer.bike.model.basePrice || 0;

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text.primary }}>
              Offer Details
            </h1>
            <p style={{ color: theme.text.secondary }}>
              View and manage the customer negotiation.
            </p>
          </div>
          <OfferStatusBadge status={offer.status} />
        </div>

        <Section title="Customer Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Name">{offer.customerName}</Field>
            <Field label="Phone">{offer.customerPhone}</Field>
            <Field label="Email">{offer.customerEmail}</Field>
            <Field label="CNIC">{offer.customerCNIC}</Field>
            <div className="md:col-span-2">
              <Field label="Address">{offer.customerAddress}</Field>
            </div>
          </div>
        </Section>

        <Section title="Bike Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="Brand">{offer.bike.model.brand}</Field>
            <Field label="Model">{offer.bike.model.modelName} ({offer.bike.model.year})</Field>
            <Field label="Branch">{offer.bike.branch.name}, {offer.bike.branch.city}</Field>
            <Field label="Chassis Number">{offer.bike.chassisNumber}</Field>
            <Field label="Engine Number">{offer.bike.engineNumber}</Field>
          </div>
        </Section>

        <Section title="Offer Details">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                Listed Price
              </label>
              <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{formatCurrency(listedPrice)}</p>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                Original Offer
              </label>
              <p className="text-2xl font-bold" style={{ color: theme.accents.primary }}>{formatCurrency(offer.offerAmount)}</p>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>
                Counter Offer
              </label>
              <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                {offer.counterAmount ? formatCurrency(offer.counterAmount) : "-"}
              </p>
            </div>
            <Field label="Submitted">{new Date(offer.createdAt).toLocaleString()}</Field>
          </div>

          {offer.message && (
            <div className="mt-4">
              <Field label="Customer Message">{offer.message}</Field>
            </div>
          )}

          {offer.adminResponse && (
            <div className="mt-4">
              <Field label="Staff Response">{offer.adminResponse}</Field>
            </div>
          )}
        </Section>

        {offer.order && (
          <Section title="Order Created" tone="success">
            <Field label="Order Number">{offer.order.orderNumber}</Field>
          </Section>
        )}

        {canAct && (
          <Section title="Actions">
            <div className="flex flex-wrap gap-3">
              <AsyncButton onClick={handleAccept} loading={actionLoading === "accept"} loadingLabel="Accepting...">
                Accept Offer
              </AsyncButton>
              <AsyncButton
                onClick={() => setModal("reject")}
                disabled={Boolean(actionLoading)}
                style={{ backgroundColor: theme.accents.secondary }}
              >
                Reject Offer
              </AsyncButton>
              <AsyncButton
                onClick={() => setModal("counter")}
                disabled={Boolean(actionLoading)}
                style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
              >
                Counter Offer
              </AsyncButton>
            </div>
          </Section>
        )}

        {isCountered && (
          <Section title="Waiting for Customer Response" tone="info">
            <p className="text-sm" style={{ color: "#1E40AF" }}>
              Customer has been sent a counter offer of {formatCurrency(offer.counterAmount)}.
            </p>
          </Section>
        )}

        {isAccepted && (
          <Section title="Offer Accepted" tone="success">
            <p className="text-sm" style={{ color: "#065F46" }}>
              This offer has been accepted and the bike has been reserved for payment.
            </p>
          </Section>
        )}

        {isPaid && (
          <Section title="Offer Paid" tone="success">
            <p className="text-sm" style={{ color: "#065F46" }}>
              Payment has been received for this offer.
            </p>
          </Section>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={() => router.push("/offers")}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{ backgroundColor: theme.backgrounds.primary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
          >
            Back to Offers
          </button>
        </div>
      </div>

      {modal === "counter" && (
        <ActionModal title="Counter Offer" onClose={closeModal}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Counter Amount (Rs.)
              </label>
              <input
                type="text"
                value={counterAmount}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "");
                  setCounterAmount(value ? Number(value).toLocaleString() : "");
                }}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                placeholder="Enter counter amount"
              />
              {counterAmount && (
                <p className="text-sm mt-2 font-medium" style={{ color: "#059669" }}>
                  {numberToWords(Number(counterAmount.replace(/,/g, "")))}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Response Message
              </label>
              <textarea
                value={adminResponse}
                onChange={(event) => setAdminResponse(event.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                placeholder="Enter your response to the customer"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                disabled={Boolean(actionLoading)}
                className="px-4 py-2 text-sm font-medium rounded disabled:opacity-50"
                style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
              >
                Cancel
              </button>
              <AsyncButton onClick={handleCounter} loading={actionLoading === "counter"} loadingLabel="Sending...">
                Send Counter
              </AsyncButton>
            </div>
          </div>
        </ActionModal>
      )}

      {modal === "reject" && (
        <ActionModal title="Reject Offer" onClose={closeModal}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Rejection Reason
              </label>
              <textarea
                value={adminResponse}
                onChange={(event) => setAdminResponse(event.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                placeholder="Enter reason for rejection"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                disabled={Boolean(actionLoading)}
                className="px-4 py-2 text-sm font-medium rounded disabled:opacity-50"
                style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
              >
                Cancel
              </button>
              <AsyncButton
                onClick={handleReject}
                loading={actionLoading === "reject"}
                loadingLabel="Rejecting..."
                style={{ backgroundColor: theme.accents.secondary }}
              >
                Reject Offer
              </AsyncButton>
            </div>
          </div>
        </ActionModal>
      )}
    </div>
  );
}
