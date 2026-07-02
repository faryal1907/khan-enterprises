"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { theme } from "@/lib/colors";
import { AsyncButton } from "@/components/async-button";
import { allocateVendorInventory } from "@/lib/api/vendors";
import { getBikeModels, getBranches } from "@/lib/api/inventory";
import { numberToWords } from "@repo/utils";

type ModelOption = { id: string; brand: string; modelName: string; year: number };
type BranchOption = { id: string; name: string };

// One row per bike model received
type BikeLine = { modelId: string; quantity: string; unitCost: string };
// One row per part type received (part may not yet exist in catalog — just a name)
type PartLine = { partName: string; quantity: string; unitCost: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendorId: string;
  vendorName: string;
  currentBalance: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n);

const today = () => new Date().toISOString().split("T")[0];

export function AllocateInventoryModal({
  isOpen,
  onClose,
  onSuccess,
  vendorId,
  vendorName,
  currentBalance,
}: Props) {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [loadingRef, setLoadingRef] = useState(true);

  // ── Top-level allocation fields ───────────────────────────────────────────
  const [branchId, setBranchId] = useState("");
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");

  // ── Line items ────────────────────────────────────────────────────────────
  const [bikeLines, setBikeLines] = useState<BikeLine[]>([]);
  const [partLines, setPartLines] = useState<PartLine[]>([]);

  const [saving, setSaving] = useState(false);

  // ── Load reference data on open ───────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setBranchId("");
    setDate(today());
    setNotes("");
    setBikeLines([]);
    setPartLines([]);
    setLoadingRef(true);

    Promise.all([getBikeModels(), getBranches()])
      .then(([modelsRes, branchRes]) => {
        setModels(modelsRes.bikeModels ?? []);
        setBranches(branchRes.branches ?? []);
        // Pre-select first branch if only one
        if ((branchRes.branches ?? []).length === 1) {
          setBranchId(branchRes.branches[0].id);
        }
      })
      .catch(() => toast.error("Failed to load reference data"))
      .finally(() => setLoadingRef(false));
  }, [isOpen]);

  // ── Bike line helpers ─────────────────────────────────────────────────────
  const addBikeLine = () =>
    setBikeLines((prev) => [...prev, { modelId: "", quantity: "", unitCost: "" }]);

  const updateBikeLine = (i: number, field: keyof BikeLine, value: string) =>
    setBikeLines((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)),
    );

  const removeBikeLine = (i: number) =>
    setBikeLines((prev) => prev.filter((_, idx) => idx !== i));

  // ── Part line helpers ─────────────────────────────────────────────────────
  const addPartLine = () =>
    setPartLines((prev) => [...prev, { partName: "", quantity: "", unitCost: "" }]);

  const updatePartLine = (i: number, field: keyof PartLine, value: string) =>
    setPartLines((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)),
    );

  const removePartLine = (i: number) =>
    setPartLines((prev) => prev.filter((_, idx) => idx !== i));

  // ── Totals ────────────────────────────────────────────────────────────────
  const bikeTotal = useMemo(
    () =>
      bikeLines.reduce(
        (s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitCost) || 0),
        0,
      ),
    [bikeLines],
  );

  const partTotal = useMemo(
    () =>
      partLines.reduce(
        (s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitCost) || 0),
        0,
      ),
    [partLines],
  );

  const total = bikeTotal + partTotal;
  const remaining = currentBalance - total;

  // Total bike units that will be created
  const totalBikeUnits = bikeLines.reduce((s, l) => s + (Number(l.quantity) || 0), 0);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!branchId) return toast.error("Select a branch for this allocation");
    if (!date) return toast.error("Date is required");
    if (bikeLines.length === 0 && partLines.length === 0)
      return toast.error("Add at least one bike model or part line");
    if (total <= 0) return toast.error("Total must be greater than 0");
    if (total > currentBalance)
      return toast.error(`Total (${fmt(total)}) exceeds vendor balance (${fmt(currentBalance)})`);

    for (const l of bikeLines) {
      if (!l.modelId) return toast.error("Select a model for each bike line");
      if (!(Number(l.quantity) > 0)) return toast.error("Quantity must be > 0 for all bike lines");
      if (!(Number(l.unitCost) > 0)) return toast.error("Unit cost must be > 0 for all bike lines");
    }
    for (const l of partLines) {
      if (!l.partName.trim()) return toast.error("Enter a part name for each part line");
      if (!(Number(l.quantity) > 0)) return toast.error("Quantity must be > 0 for all part lines");
      if (!(Number(l.unitCost) > 0)) return toast.error("Unit cost must be > 0 for all part lines");
    }

    setSaving(true);
    try {
      const res = await allocateVendorInventory(vendorId, {
        branchId,
        date,
        notes: notes.trim() || undefined,
        bikes: bikeLines.map((l) => ({
          modelId: l.modelId,
          quantity: Number(l.quantity),
          unitCost: Number(l.unitCost),
        })),
        parts: partLines.map((l) => ({
          partName: l.partName.trim(),
          quantity: Number(l.quantity),
          unitCost: Number(l.unitCost),
        })),
      });
      toast.success(
        `Allocation recorded — ${res.bikesCreated} bike unit(s) created, ${res.partsProcessed} part type(s) updated. ` +
          `New balance: ${fmt(res.newPrepaidBalance)}`,
      );
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to record allocation");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6"
        style={{ border: `1px solid ${theme.borders.light}` }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>
              Record Inventory Delivery
            </h2>
            <p className="text-sm mt-0.5" style={{ color: theme.text.secondary }}>
              {vendorName} — deduct from prepaid balance and create inventory
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: theme.text.muted }}>Vendor balance</p>
            <p className="text-sm font-bold" style={{ color: "#d97706" }}>
              {fmt(currentBalance)}
            </p>
          </div>
        </div>

        {loadingRef ? (
          <div className="py-16 text-center text-sm" style={{ color: theme.text.muted }}>
            Loading...
          </div>
        ) : (
          <>
            {/* ── Allocation header fields ────────────────────────────────── */}
            <div
              className="rounded-xl p-4 mb-6 space-y-4"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <div className="grid grid-cols-3 gap-4">
                {/* Branch — single selection for whole allocation */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    Branch *
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm outline-none bg-white"
                    style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                  >
                    <option value="">Select branch...</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                {/* Date */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    Delivery Date *
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
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    Notes
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                    style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                    placeholder="e.g. July delivery batch"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              {branchId && (
                <p className="text-xs" style={{ color: theme.text.muted }}>
                  All bikes and parts in this allocation will be assigned to{" "}
                  <span className="font-semibold" style={{ color: theme.text.primary }}>
                    {branches.find((b) => b.id === branchId)?.name}
                  </span>
                </p>
              )}
            </div>

            {/* ── Bikes section ───────────────────────────────────────────── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>
                    Bikes Received
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                    Specify model and quantity. Bike units will be created as Pending Setup.
                  </p>
                </div>
                <button
                  onClick={addBikeLine}
                  className="text-xs px-3 py-1.5 rounded font-semibold"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    color: theme.accents.primary,
                    border: `1px solid ${theme.borders.light}`,
                  }}
                >
                  + Add Model
                </button>
              </div>

              {bikeLines.length === 0 ? (
                <p
                  className="text-xs py-4 text-center rounded-lg border"
                  style={{ color: theme.text.muted, borderColor: theme.borders.light }}
                >
                  No bikes added. Click "+ Add Model" to specify received bike models.
                </p>
              ) : (
                <div className="space-y-2">
                  {/* Column headers */}
                  <div className="grid grid-cols-12 gap-3 px-1">
                    <div className="col-span-5 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>Model</div>
                    <div className="col-span-2 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>Qty</div>
                    <div className="col-span-3 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>Unit Cost (Rs)</div>
                    <div className="col-span-1 text-xs font-medium uppercase tracking-wide text-right" style={{ color: theme.text.muted }}>Line Total</div>
                    <div className="col-span-1" />
                  </div>
                  {bikeLines.map((line, i) => {
                    const lineTotal = (Number(line.quantity) || 0) * (Number(line.unitCost) || 0);
                    return (
                      <div
                        key={i}
                        className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border"
                        style={{ borderColor: theme.borders.light, backgroundColor: theme.backgrounds.secondary }}
                      >
                        <div className="col-span-5">
                          <select
                            className="w-full border rounded px-2 py-1.5 text-sm outline-none bg-white"
                            style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                            value={line.modelId}
                            onChange={(e) => updateBikeLine(i, "modelId", e.target.value)}
                          >
                            <option value="">Select model...</option>
                            {models.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.brand} {m.modelName} ({m.year})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            min="1"
                            className="w-full border rounded px-2 py-1.5 text-sm outline-none"
                            style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                            placeholder="Qty"
                            value={line.quantity}
                            onChange={(e) => updateBikeLine(i, "quantity", e.target.value)}
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            className="w-full border rounded px-2 py-1.5 text-sm outline-none"
                            style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                            placeholder="e.g. 315000"
                            value={line.unitCost}
                            onChange={(e) => updateBikeLine(i, "unitCost", e.target.value)}
                          />
                        </div>
                        <div className="col-span-1 text-right text-xs font-semibold" style={{ color: theme.text.primary }}>
                          {lineTotal > 0 ? fmt(lineTotal) : "—"}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button
                            onClick={() => removeBikeLine(i)}
                            className="text-red-400 hover:text-red-600 text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-xs font-semibold pr-1 pt-1" style={{ color: theme.text.secondary }}>
                    <span>
                      {totalBikeUnits > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                          {totalBikeUnits} bike unit{totalBikeUnits !== 1 ? "s" : ""} will be created as Pending Setup
                        </span>
                      )}
                    </span>
                    <span>Bikes subtotal: {fmt(bikeTotal)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Parts section ────────────────────────────────────────────── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>
                    Parts Received
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                    Enter part name, quantity, and unit cost. Inventory will be updated immediately.
                  </p>
                </div>
                <button
                  onClick={addPartLine}
                  className="text-xs px-3 py-1.5 rounded font-semibold"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    color: theme.accents.primary,
                    border: `1px solid ${theme.borders.light}`,
                  }}
                >
                  + Add Part
                </button>
              </div>

              {partLines.length === 0 ? (
                <p
                  className="text-xs py-4 text-center rounded-lg border"
                  style={{ color: theme.text.muted, borderColor: theme.borders.light }}
                >
                  No parts added. Click "+ Add Part" to enter received parts.
                </p>
              ) : (
                <div className="space-y-2">
                  {/* Column headers */}
                  <div className="grid grid-cols-12 gap-3 px-1">
                    <div className="col-span-5 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>Part Name</div>
                    <div className="col-span-2 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>Qty</div>
                    <div className="col-span-3 text-xs font-medium uppercase tracking-wide" style={{ color: theme.text.muted }}>Unit Cost (Rs)</div>
                    <div className="col-span-1 text-xs font-medium uppercase tracking-wide text-right" style={{ color: theme.text.muted }}>Line Total</div>
                    <div className="col-span-1" />
                  </div>
                  {partLines.map((line, i) => {
                    const lineTotal = (Number(line.quantity) || 0) * (Number(line.unitCost) || 0);
                    return (
                      <div
                        key={i}
                        className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border"
                        style={{ borderColor: theme.borders.light, backgroundColor: theme.backgrounds.secondary }}
                      >
                        <div className="col-span-5">
                          <input
                            type="text"
                            className="w-full border rounded px-2 py-1.5 text-sm outline-none"
                            style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                            placeholder="e.g. Evee C1 Fast Charger"
                            value={line.partName}
                            onChange={(e) => updatePartLine(i, "partName", e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            min="1"
                            className="w-full border rounded px-2 py-1.5 text-sm outline-none"
                            style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                            placeholder="Qty"
                            value={line.quantity}
                            onChange={(e) => updatePartLine(i, "quantity", e.target.value)}
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            className="w-full border rounded px-2 py-1.5 text-sm outline-none"
                            style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                            placeholder="e.g. 8500"
                            value={line.unitCost}
                            onChange={(e) => updatePartLine(i, "unitCost", e.target.value)}
                          />
                        </div>
                        <div className="col-span-1 text-right text-xs font-semibold" style={{ color: theme.text.primary }}>
                          {lineTotal > 0 ? fmt(lineTotal) : "—"}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button
                            onClick={() => removePartLine(i)}
                            className="text-red-400 hover:text-red-600 text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="text-right text-xs font-semibold pr-1" style={{ color: theme.text.secondary }}>
                    Parts subtotal: {fmt(partTotal)}
                  </div>
                </div>
              )}
            </div>

            {/* ── Balance summary ──────────────────────────────────────────── */}
            {total > 0 && (
              <div
                className="rounded-xl p-4 space-y-2 text-sm mb-4"
                style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
              >
                <div className="flex justify-between">
                  <span style={{ color: theme.text.secondary }}>Vendor balance before</span>
                  <span className="font-semibold" style={{ color: theme.text.primary }}>{fmt(currentBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.text.secondary }}>Total inventory value</span>
                  <span className="font-semibold" style={{ color: theme.text.primary }}>− {fmt(total)}</span>
                </div>
                <div
                  className="border-t pt-2 flex justify-between"
                  style={{ borderColor: theme.borders.light }}
                >
                  <span className="font-semibold" style={{ color: theme.text.primary }}>Balance after</span>
                  <span className="font-bold" style={{ color: remaining >= 0 ? "#059669" : "#dc2626" }}>
                    {fmt(remaining)}
                  </span>
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
                    <span style={{ color: theme.text.primary }}>DR — Inventory (1003)</span>
                    <span>{fmt(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.text.primary }}>CR — Vendor Advance / Prepaid (1500)</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Pending Setup info box ───────────────────────────────────── */}
            {(totalBikeUnits > 0 || partLines.length > 0) && (
              <div
                className="rounded-xl p-4 text-xs mb-4"
                style={{ backgroundColor: "#fffbeb", border: "1px solid #fcd34d" }}
              >
                <p className="font-semibold text-amber-800 mb-1">After recording this allocation:</p>
                <ul className="space-y-1 text-amber-700 list-disc list-inside">
                  {totalBikeUnits > 0 && (
                    <li>
                      {totalBikeUnits} bike unit{totalBikeUnits !== 1 ? "s" : ""} will appear in inventory as{" "}
                      <strong>Pending Setup</strong>. Go to Bikes → edit each unit to enter chassis and engine numbers. Status will automatically become Available.
                    </li>
                  )}
                  {partLines.length > 0 && (
                    <li>
                      Part inventory quantities will be increased immediately. New parts created through this allocation will need a proper SKU assigned via Parts → Edit.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </>
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
            disabled={loadingRef || !branchId || total <= 0 || total > currentBalance}
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-semibold text-white rounded-md disabled:opacity-40"
            style={{ backgroundColor: theme.accents.primary }}
          >
            Record Allocation
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}
