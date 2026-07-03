"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { theme } from "@/lib/colors";
import { AsyncButton } from "@/components/async-button";
import { returnDefectiveInventory, getVendorReturnableInventory } from "@/lib/api/vendors";
import { numberToWords } from "@/lib/number-to-words";

type ReturnableBike = {
  id: string;
  chassisNumber: string;
  model: { brand: string; modelName: string };
  unitCost: number;
};

type ReturnablePart = {
  id: string;
  quantity: number;
  part: { id: string; name: string; sku: string };
  branch: { id: string; name: string };
  unitCost: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendorId: string;
  vendorName: string;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n);

const today = () => new Date().toISOString().split("T")[0];

export function ReturnDefectiveInventoryModal({
  isOpen,
  onClose,
  onSuccess,
  vendorId,
  vendorName,
}: Props) {
  const [returnableBikes, setReturnableBikes] = useState<ReturnableBike[]>([]);
  const [returnableParts, setReturnableParts] = useState<ReturnablePart[]>([]);
  const [loadingRef, setLoadingRef] = useState(true);

  const [selectedBikeIds, setSelectedBikeIds] = useState<string[]>([]);
  const [partReturns, setPartReturns] = useState<{ partInventoryId: string; quantity: number }[]>([]);

  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedBikeIds([]);
    setPartReturns([]);
    setDate(today());
    setNotes("");
    setLoadingRef(true);

    getVendorReturnableInventory(vendorId)
      .then((res) => {
        setReturnableBikes(res.bikes ?? []);
        setReturnableParts(res.parts ?? []);
      })
      .catch(() => toast.error("Failed to load returnable inventory"))
      .finally(() => setLoadingRef(false));
  }, [isOpen, vendorId]);

  const selectedBikes = returnableBikes.filter((b) => selectedBikeIds.includes(b.id));
  const bikeTotal = selectedBikes.reduce((s, b) => s + b.unitCost, 0);
  const partTotal = partReturns.reduce((s, pr) => {
    const part = returnableParts.find((p) => p.id === pr.partInventoryId);
    return s + (part?.unitCost ?? 0) * pr.quantity;
  }, 0);
  const total = bikeTotal + partTotal;

  const handlePartQuantityChange = (partInventoryId: string, quantity: number) => {
    setPartReturns((prev) => {
      const existing = prev.find((p) => p.partInventoryId === partInventoryId);
      if (existing) {
        return prev.map((p) =>
          p.partInventoryId === partInventoryId ? { ...p, quantity } : p,
        );
      }
      return [...prev, { partInventoryId, quantity }];
    });
  };

  const handleSubmit = async () => {
    if (selectedBikeIds.length === 0 && partReturns.length === 0) {
      return toast.error("Select at least one bike or part to return");
    }
    if (!date) return toast.error("Date is required");

    // Validate part quantities
    for (const pr of partReturns) {
      if (pr.quantity <= 0) return toast.error("Part return quantity must be greater than 0");
      const part = returnableParts.find((p) => p.id === pr.partInventoryId);
      if (part && pr.quantity > part.quantity) {
        return toast.error(`Cannot return more than available stock for ${part.part.name}`);
      }
    }

    setSaving(true);
    try {
      const res = await returnDefectiveInventory(vendorId, {
        bikeIds: selectedBikeIds,
        partReturns: partReturns.filter((pr) => pr.quantity > 0),
        date,
        notes: notes.trim() || undefined,
      });
      toast.success(
        `Defective return recorded — ${res.bikesRemoved} bike(s) removed, ${res.partsProcessed} part type(s) adjusted. ` +
          `Vendor balance increased to ${fmt(res.newPrepaidBalance)}`,
      );
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to record defective return");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6"
        style={{ border: `1px solid ${theme.borders.light}` }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>
              Return Defective Inventory
            </h2>
            <p className="text-sm mt-0.5" style={{ color: theme.text.secondary }}>
              {vendorName} — remove from inventory and add value back to vendor balance
            </p>
          </div>
        </div>

        {loadingRef ? (
          <div className="py-16 text-center text-sm" style={{ color: theme.text.muted }}>
            Loading returnable inventory...
          </div>
        ) : (
          <>
            {/* ── Return Details ───────────────────────────────────────────── */}
            <div
              className="rounded-xl p-4 mb-6 space-y-4"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    Return Date *
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                    style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    Notes (optional)
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                    style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                    placeholder="e.g. Defective items returned"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Reason - Defects only */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                  Reason *
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
                  >
                    Defective
                  </span>
                </div>
              </div>
            </div>

            {/* ── Select Bikes ─────────────────────────────────────────────── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>
                    Select Bikes to Return
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                    Serialized bikes (individual units) originally from this vendor
                  </p>
                </div>
              </div>

              {returnableBikes.length === 0 ? (
                <p
                  className="text-xs py-4 text-center rounded-lg border"
                  style={{ color: theme.text.muted, borderColor: theme.borders.light }}
                >
                  No bikes available for return from this vendor.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-3 px-1">
                    <div className="col-span-1" />
                    <div className="col-span-4 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>
                      Bike
                    </div>
                    <div className="col-span-3 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>
                      Chassis Number
                    </div>
                    <div className="col-span-3 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>
                      Unit Cost
                    </div>
                  </div>
                  {returnableBikes.map((bike) => (
                    <div
                      key={bike.id}
                      className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border"
                      style={{
                        borderColor: theme.borders.light,
                        backgroundColor: selectedBikeIds.includes(bike.id)
                          ? "#fef2f2"
                          : theme.backgrounds.secondary,
                      }}
                    >
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedBikeIds.includes(bike.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBikeIds((prev) => [...prev, bike.id]);
                            } else {
                              setSelectedBikeIds((prev) => prev.filter((id) => id !== bike.id));
                            }
                          }}
                        />
                      </div>
                      <div className="col-span-4 text-sm" style={{ color: theme.text.primary }}>
                        {bike.model.brand} {bike.model.modelName}
                      </div>
                      <div className="col-span-3 text-xs" style={{ color: theme.text.muted }}>
                        {bike.chassisNumber}
                      </div>
                      <div className="col-span-3 text-sm font-medium" style={{ color: theme.text.primary }}>
                        {fmt(bike.unitCost)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Select Parts ─────────────────────────────────────────────── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>
                    Select Parts to Return
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                    Parts with available stock
                  </p>
                </div>
              </div>

              {returnableParts.length === 0 ? (
                <p
                  className="text-xs py-4 text-center rounded-lg border"
                  style={{ color: theme.text.muted, borderColor: theme.borders.light }}
                >
                  No parts available for return from this vendor.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-3 px-1">
                    <div className="col-span-4 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>
                      Part
                    </div>
                    <div className="col-span-2 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>
                      Available
                    </div>
                    <div className="col-span-2 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>
                      Return Qty
                    </div>
                    <div className="col-span-3 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>
                      Unit Cost
                    </div>
                    <div className="col-span-1 text-xs font-medium uppercase tracking-wide text-right" style={{ color: theme.text.muted }}>
                      Line Total
                    </div>
                  </div>
                  {returnableParts.map((part) => {
                    const returnQty = partReturns.find((r) => r.partInventoryId === part.id)?.quantity ?? 0;
                    const lineTotal = returnQty * part.unitCost;
                    return (
                      <div
                        key={part.id}
                        className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border"
                        style={{
                          borderColor: theme.borders.light,
                          backgroundColor: returnQty > 0 ? "#fef2f2" : theme.backgrounds.secondary,
                        }}
                      >
                        <div className="col-span-4 text-sm" style={{ color: theme.text.primary }}>
                          {part.part.name}
                        </div>
                        <div className="col-span-2 text-xs" style={{ color: theme.text.muted }}>
                          {part.quantity}
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            min="0"
                            max={part.quantity}
                            className="w-full border rounded px-2 py-1.5 text-sm outline-none"
                            style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                            placeholder="0"
                            value={returnQty > 0 ? returnQty : ""}
                            onChange={(e) => {
                              const qty = Number(e.target.value) || 0;
                              if (qty > part.quantity) {
                                toast.error(`Cannot return more than available (${part.quantity})`);
                                return;
                              }
                              handlePartQuantityChange(part.id, qty);
                            }}
                          />
                        </div>
                        <div className="col-span-3 text-sm" style={{ color: theme.text.primary }}>
                          {fmt(part.unitCost)}
                        </div>
                        <div className="col-span-1 text-right text-xs font-semibold" style={{ color: theme.text.primary }}>
                          {returnQty > 0 ? fmt(lineTotal) : "—"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Review Return ─────────────────────────────────────────────── */}
            {total > 0 && (
              <div
                className="rounded-xl p-4 space-y-2 text-sm mb-4"
                style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
              >
                <div className="flex justify-between">
                  <span style={{ color: theme.text.secondary }}>Bikes total</span>
                  <span className="font-semibold" style={{ color: theme.text.primary }}>{fmt(bikeTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.text.secondary }}>Parts total</span>
                  <span className="font-semibold" style={{ color: theme.text.primary }}>{fmt(partTotal)}</span>
                </div>
                <div
                  className="border-t pt-2 flex justify-between"
                  style={{ borderColor: theme.borders.light }}
                >
                  <span className="font-semibold" style={{ color: theme.text.primary }}>Total Return Value</span>
                  <span className="font-bold" style={{ color: "#059669" }}>{fmt(total)}</span>
                </div>
                {total > 0 && (
                  <p className="text-xs font-medium text-emerald-600 pt-1">{numberToWords(total)}</p>
                )}
                <div
                  className="mt-2 p-2 rounded text-xs space-y-1"
                  style={{ backgroundColor: theme.backgrounds.tertiary }}
                >
                  <p className="font-semibold mb-1" style={{ color: theme.text.muted }}>Journal Entry</p>
                  <div className="flex justify-between">
                    <span style={{ color: theme.text.primary }}>CR — Inventory (1003)</span>
                    <span>{fmt(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.text.primary }}>DR — Vendor Advance / Prepaid (1500)</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation warning */}
            {total > 0 && (
              <div
                className="rounded-xl p-4 text-xs mb-4"
                style={{ backgroundColor: "#fef2f2", border: "1px solid #fecdd3" }}
              >
                <p className="font-semibold text-red-800 mb-1">After confirmation:</p>
                <ul className="space-y-1 text-red-700 list-disc list-inside">
                  <li>
                    Selected bikes will be permanently removed from inventory.
                  </li>
                  <li>
                    Part stock quantities will be reduced.
                  </li>
                  <li>
                    The vendor's Outstanding Balance will increase by {fmt(total)}.
                  </li>
                </ul>
              </div>
            )}

            <div
              className="flex justify-end gap-3 pt-5 border-t"
              style={{ borderColor: theme.borders.light }}
            >
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-sm font-medium"
                style={{ color: theme.text.primary, borderColor: theme.borders.medium }}
              >
                Cancel
              </button>
              <AsyncButton
                loading={saving}
                disabled={loadingRef || total <= 0}
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-semibold text-white rounded-md disabled:opacity-40"
                style={{ backgroundColor: "#dc2626" }}
              >
                Confirm Return
              </AsyncButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
