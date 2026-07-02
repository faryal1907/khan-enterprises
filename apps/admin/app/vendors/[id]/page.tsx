"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { getVendorLedger, updateVendor } from "@/lib/api/vendors";
import { VendorPaymentModal } from "../vendor-payment-modal";
import { AllocateInventoryModal } from "../allocate-inventory-modal";
import { ReturnDefectiveInventoryModal } from "../return-defective-inventory-modal";
import { AsyncButton } from "@/components/async-button";

type LedgerEntry =
  | {
      kind: "PAYMENT";
      id: string;
      date: string;
      amount: number;
      notes: string | null;
      fromAccount: { code: string; name: string };
      recordedBy: { fullName: string } | null;
      balance: number;
    }
  | {
      kind: "ALLOCATION";
      id: string;
      date: string;
      totalAmount: number;
      notes: string | null;
      bikes: { id: string; chassisNumber: string; model: { brand: string; modelName: string }; unitCost: number | null }[];
      partLines: { id: string; quantity: number; unitCost: number; totalCost: number; part: { name: string; sku: string }; branch: { name: string } }[];
      recordedBy: { fullName: string } | null;
      balance: number;
    }
  | {
      kind: "DEFECTIVE_RETURN";
      id: string;
      date: string;
      totalAmount: number;
      notes: string | null;
      bikes: { id: string; chassisNumber: string; model: { brand: string; modelName: string }; unitCost: number }[];
      partLines: { id: string; quantity: number; unitCost: number; totalCost: number; part: { name: string; sku: string }; branch: { name: string } }[];
      recordedBy: { fullName: string } | null;
      balance: number;
    };

type Summary = { totalPaid: number; totalAllocated: number; totalDefectiveReturned?: number; prepaidBalance: number };
type Vendor = { id: string; name: string; contactPerson: string | null; phoneNumber: string | null; email: string | null };

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [payOpen, setPayOpen] = useState(false);
  const [allocOpen, setAllocOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  // Edit
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", contactPerson: "", phoneNumber: "", email: "", address: "" });
  const [editSaving, setEditSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getVendorLedger(id);
      setVendor(res.vendor);
      setSummary(res.summary);
      setLedger(res.ledger ?? []);
    } catch {
      toast.error("Failed to load vendor data");
      router.push("/vendors");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { load(); }, [load]);

  const handleSaveEdit = async () => {
    setEditSaving(true);
    try {
      await updateVendor(id, {
        name: editForm.name.trim() || undefined,
        contactPerson: editForm.contactPerson.trim() || undefined,
        phoneNumber: editForm.phoneNumber.trim() || undefined,
        email: editForm.email.trim() || undefined,
        address: editForm.address.trim() || undefined,
      });
      toast.success("Vendor updated");
      setEditing(false);
      await load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update vendor");
    } finally {
      setEditSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm" style={{ color: theme.text.muted }}>
        Loading vendor…
      </div>
    );
  }

  if (!vendor || !summary) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/accounts"
        className="inline-flex items-center gap-1 text-sm font-medium hover:opacity-70"
        style={{ color: theme.text.secondary }}
      >
        ← Back to Accounts
      </Link>

      {/* Vendor card */}
      <div
        className="rounded-xl border p-6 shadow-sm"
        style={{ borderColor: theme.borders.light, backgroundColor: theme.backgrounds.primary }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                {[
                  { label: "Name", key: "name" },
                  { label: "Contact Person", key: "contactPerson" },
                  { label: "Phone", key: "phoneNumber" },
                  { label: "Email", key: "email" },
                  { label: "Address", key: "address" },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-28 text-xs font-medium shrink-0" style={{ color: theme.text.muted }}>{label}</span>
                    <input
                      type="text"
                      className="flex-1 border rounded px-2 py-1.5 text-sm outline-none"
                      style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                      value={(editForm as any)[key]}
                      onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <AsyncButton loading={editSaving} onClick={handleSaveEdit}
                    className="px-3 py-1.5 text-xs font-semibold text-white rounded"
                    style={{ backgroundColor: theme.accents.primary }}>
                    Save
                  </AsyncButton>
                  <button onClick={() => setEditing(false)}
                    className="px-3 py-1.5 text-xs font-medium border rounded"
                    style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold" style={{ color: theme.text.primary }}>{vendor.name}</h1>
                <div className="mt-2 space-y-0.5 text-sm" style={{ color: theme.text.secondary }}>
                  {vendor.contactPerson && <p>Contact: {vendor.contactPerson}</p>}
                  {vendor.phoneNumber && <p>Phone: {vendor.phoneNumber}</p>}
                  {vendor.email && <p>Email: {vendor.email}</p>}
                </div>
              </>
            )}
          </div>

          {isAdmin && !editing && (
            <button
              onClick={() => {
                setEditForm({
                  name: vendor.name ?? "",
                  contactPerson: (vendor as any).contactPerson ?? "",
                  phoneNumber: (vendor as any).phoneNumber ?? "",
                  email: (vendor as any).email ?? "",
                  address: (vendor as any).address ?? "",
                });
                setEditing(true);
              }}
              className="px-3 py-1.5 text-xs font-medium border rounded"
              style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}
            >
              Edit
            </button>
          )}
        </div>

        {/* Balance summary cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Total Paid", value: summary.totalPaid, color: "#059669" },
            { label: "Total Allocated", value: summary.totalAllocated, color: theme.text.primary },
            { label: "Outstanding Balance", value: summary.prepaidBalance, color: summary.prepaidBalance > 0 ? "#d97706" : theme.text.secondary },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border p-4 text-center"
              style={{ borderColor: theme.borders.light, backgroundColor: theme.backgrounds.secondary }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: theme.text.muted }}>{label}</p>
              <p className="text-xl font-bold" style={{ color }}>{fmt(value)}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        {isAdmin && (
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setPayOpen(true)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm"
              style={{ backgroundColor: theme.accents.primary }}
            >
              Make Payment
            </button>
            <button
              onClick={() => setAllocOpen(true)}
              disabled={summary.prepaidBalance <= 0}
              className="px-4 py-2 rounded-lg text-sm font-semibold border disabled:opacity-40"
              style={{ color: theme.accents.primary, borderColor: theme.accents.primary }}
            >
              Allocate Inventory
            </button>
            <button
              onClick={() => setReturnOpen(true)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm"
              style={{ backgroundColor: "#dc2626" }}
            >
              Return Defective Inventory
            </button>
            {summary.prepaidBalance <= 0 && (
              <p className="text-xs self-center" style={{ color: theme.text.muted }}>
                No balance to allocate against.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Ledger */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
          Transaction History
        </h2>

        {ledger.length === 0 ? (
          <div
            className="rounded-xl border p-10 text-center text-sm"
            style={{ borderColor: theme.borders.light, color: theme.text.muted }}
          >
            No transactions yet. Record a payment to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {[...ledger].reverse().map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border overflow-hidden shadow-sm"
                style={{ borderColor: theme.borders.light }}
              >
                {/* Entry header */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ backgroundColor: theme.backgrounds.secondary }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor:
                          entry.kind === "PAYMENT"
                            ? "#dcfce7"
                            : entry.kind === "DEFECTIVE_RETURN"
                              ? "#fef2f2"
                              : "#dbeafe",
                        color:
                          entry.kind === "PAYMENT"
                            ? "#166534"
                            : entry.kind === "DEFECTIVE_RETURN"
                              ? "#991b1b"
                              : "#1e40af",
                      }}
                    >
                      {entry.kind === "PAYMENT"
                        ? "PAYMENT"
                        : entry.kind === "DEFECTIVE_RETURN"
                          ? "DEFECTIVE RETURN"
                          : "ALLOCATION"}
                    </span>
                    <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
                      {fmtDate(entry.date)}
                    </span>
                    {entry.notes && (
                      <span className="text-xs" style={{ color: theme.text.muted }}>{entry.notes}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className="text-sm font-bold"
                      style={{
                        color:
                          entry.kind === "PAYMENT"
                            ? "#059669"
                            : entry.kind === "DEFECTIVE_RETURN"
                              ? "#059669"
                              : "#dc2626",
                      }}
                    >
                      {entry.kind === "PAYMENT"
                        ? "+"
                        : entry.kind === "DEFECTIVE_RETURN"
                          ? "+"
                          : "−"}{fmt(entry.kind === "PAYMENT" ? entry.amount : entry.totalAmount)}
                    </span>
                    <span className="text-xs" style={{ color: theme.text.muted }}>
                      Balance: <span className="font-semibold" style={{ color: theme.text.primary }}>{fmt(entry.balance)}</span>
                    </span>
                  </div>
                </div>

                {/* Entry detail */}
                <div className="px-4 py-3 text-xs space-y-1" style={{ color: theme.text.secondary }}>
                  {entry.kind === "PAYMENT" ? (
                    <p>
                      Paid from <span className="font-medium" style={{ color: theme.text.primary }}>{entry.fromAccount.code} — {entry.fromAccount.name}</span>
                      {entry.recordedBy && <> · by {entry.recordedBy.fullName}</>}
                    </p>
                  ) : (
                    <>
                      {entry.bikes.length > 0 && (
                        <div>
                          <span className="font-medium" style={{ color: theme.text.primary }}>Bikes: </span>
                          {entry.bikes.map((b) => (
                            <span key={b.id} className="mr-2">
                              {b.model.brand} {b.model.modelName} ({b.chassisNumber}) — {fmt(b.unitCost ?? 0)}
                            </span>
                          ))}
                        </div>
                      )}
                      {entry.partLines.length > 0 && (
                        <div>
                          <span className="font-medium" style={{ color: theme.text.primary }}>Parts: </span>
                          {entry.partLines.map((pl) => (
                            <span key={pl.id} className="mr-2">
                              {pl.quantity}× {pl.part.name} @ {fmt(pl.unitCost)} ({pl.branch.name}) — {fmt(pl.totalCost)}
                            </span>
                          ))}
                        </div>
                      )}
                      {entry.kind === "DEFECTIVE_RETURN" && entry.notes && (
                        <p>Reason: {entry.notes}</p>
                      )}
                      {entry.recordedBy && (
                        <p>Recorded by {entry.recordedBy.fullName}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <VendorPaymentModal
        isOpen={payOpen}
        onClose={() => setPayOpen(false)}
        onSuccess={load}
        vendorId={id}
        vendorName={vendor.name}
        currentBalance={summary.prepaidBalance}
      />
      <AllocateInventoryModal
        isOpen={allocOpen}
        onClose={() => setAllocOpen(false)}
        onSuccess={load}
        vendorId={id}
        vendorName={vendor.name}
        currentBalance={summary.prepaidBalance}
      />
      <ReturnDefectiveInventoryModal
        isOpen={returnOpen}
        onClose={() => setReturnOpen(false)}
        onSuccess={load}
        vendorId={id}
        vendorName={vendor.name}
      />
    </div>
  );
}