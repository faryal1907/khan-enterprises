"use client";

import { useState, useEffect, useRef } from "react";
import { theme } from "@/lib/colors";
import {
  getReceivableParties, createReceivableParty, createReceivableEntry,
  RECEIVABLE_PARTY_TYPE_LABELS, ReceivablePartyType,
} from "@/lib/api/accounting";
import { getVendors } from "@/lib/api/vendors";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";
import { ActionModal } from "@/components/action-modal";

type Party = { id: string; name: string; partyType: ReceivablePartyType; phone?: string | null };
type VendorItem = { id: string; name: string; prepaidBalance: number };

const today = () => new Date().toISOString().slice(0, 10);

export function AddReceivableModal({
  isOpen, onClose, onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [parties, setParties] = useState<Party[]>([]);

  // Party search
  const [partySearch, setPartySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inline create party
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<ReceivablePartyType>("CUSTOMER");
  const [newPhone, setNewPhone] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Vendor source
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [useVendorSource, setUseVendorSource] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorItem | null>(null);
  const [vendorSearch, setVendorSearch] = useState("");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const vendorInputRef = useRef<HTMLInputElement>(null);

  // Receivable entry fields
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today());
  const [dueDate, setDueDate] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getReceivableParties().then(setParties).catch(() => setParties([]));
      getVendors()
        .then((res: { vendors: VendorItem[] }) => {
          setVendors(
            (res.vendors || [])
              .filter((v: VendorItem) => v.prepaidBalance > 0)
              .sort((a: VendorItem, b: VendorItem) => a.name.localeCompare(b.name)),
          );
        })
        .catch(() => setVendors([]));
      setSelectedParty(null);
      setPartySearch("");
      setShowCreate(false);
      setNewName(""); setNewType("CUSTOMER"); setNewPhone("");
      setAmount(""); setDescription(""); setDate(today()); setDueDate("");
      setUseVendorSource(false);
      setSelectedVendor(null);
      setVendorSearch("");
    }
  }, [isOpen]);

  const filtered = parties.filter((p) =>
    p.name.toLowerCase().includes(partySearch.toLowerCase()) ||
    RECEIVABLE_PARTY_TYPE_LABELS[p.partyType].toLowerCase().includes(partySearch.toLowerCase())
  );

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const handleSelect = (p: Party) => {
    setSelectedParty(p);
    setPartySearch(p.name);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setSelectedParty(null);
    setPartySearch("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelectVendor = (v: VendorItem) => {
    setSelectedVendor(v);
    setVendorSearch(v.name);
    setShowVendorDropdown(false);
  };

  const handleClearVendor = () => {
    setSelectedVendor(null);
    setVendorSearch("");
    setTimeout(() => vendorInputRef.current?.focus(), 50);
  };

  const handleCreateParty = async () => {
    if (!newName.trim()) return toast.error("Party name is required");
    setIsCreating(true);
    try {
      const p = await createReceivableParty({ name: newName.trim(), partyType: newType, phone: newPhone.trim() || undefined });
      setParties((prev) => [...prev, p].sort((a, b) => a.name.localeCompare(b.name)));
      handleSelect(p);
      setShowCreate(false);
      setNewName(""); setNewType("CUSTOMER"); setNewPhone("");
      toast.success(`Party "${p.name}" created`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create party");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedParty) return toast.error("Select a party");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast.error("Amount must be greater than 0");
    if (!description.trim()) return toast.error("Description is required");
    if (!date) return toast.error("Date is required");

    if (useVendorSource) {
      if (!selectedVendor) return toast.error("Select a vendor account");
      if (amt > selectedVendor.prepaidBalance) {
        return toast.error(
          `Amount (Rs. ${amt.toLocaleString()}) exceeds ${selectedVendor.name}'s prepaid balance (Rs. ${selectedVendor.prepaidBalance.toLocaleString()})`,
        );
      }
    }

    setIsSubmitting(true);
    try {
      await createReceivableEntry({
        partyId: selectedParty.id,
        amount: amt,
        description: description.trim(),
        date,
        dueDate: dueDate || undefined,
        vendorId: useVendorSource && selectedVendor ? selectedVendor.id : undefined,
      });
      toast.success(
        useVendorSource && selectedVendor
          ? `Receivable added — Rs. ${amt.toLocaleString()} deducted from ${selectedVendor.name}'s prepaid balance`
          : "Receivable added successfully",
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add receivable");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const amountNum = parseFloat(amount) || 0;
  const exceedsBalance = useVendorSource && selectedVendor && amountNum > selectedVendor.prepaidBalance;

  return (
    <ActionModal onClose={onClose} title="Add Receivable" className="flex flex-col max-h-[90vh]">
      <p className="text-sm mb-4 shrink-0" style={{ color: theme.text.secondary }}>
        Record money owed to the business by a party.
      </p>

      <div className="space-y-4 overflow-y-auto flex-1 pr-1">

        {/* ── Party selector ── */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
            Party <span className="text-red-500">*</span>
          </label>
          {selectedParty ? (
            <div className="flex items-center justify-between px-3 py-2 rounded border"
              style={{ backgroundColor: theme.backgrounds.tertiary, borderColor: theme.borders.medium }}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{selectedParty.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${theme.accents.primary}15`, color: theme.accents.primary }}>
                  {RECEIVABLE_PARTY_TYPE_LABELS[selectedParty.partyType]}
                </span>
              </div>
              <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600 text-lg leading-none ml-2">×</button>
            </div>
          ) : (
            <div className="relative">
              <input ref={inputRef} type="text" placeholder="Search party by name or type..."
                value={partySearch}
                onChange={(e) => { setPartySearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              />
              {showDropdown && (
                <div className="absolute z-50 w-full mt-1 rounded-lg border shadow-lg overflow-hidden"
                  style={{ backgroundColor: theme.backgrounds.primary, borderColor: theme.borders.light, maxHeight: "200px", overflowY: "auto" }}>
                  {filtered.length === 0 && !partySearch && (
                    <div className="px-3 py-2 text-sm" style={{ color: theme.text.muted }}>No parties yet — type to create one</div>
                  )}
                  {filtered.map((p) => (
                    <button key={p.id} type="button" onMouseDown={() => handleSelect(p)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between">
                      <span className="text-sm" style={{ color: theme.text.primary }}>{p.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${theme.accents.primary}15`, color: theme.accents.primary }}>
                        {RECEIVABLE_PARTY_TYPE_LABELS[p.partyType]}
                      </span>
                    </button>
                  ))}
                  {partySearch && filtered.length === 0 ? (
                    <button type="button" onMouseDown={() => { setNewName(partySearch); setShowCreate(true); setShowDropdown(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50">
                      <span className="text-sm font-medium" style={{ color: theme.accents.primary }}>+ Create "{partySearch}"</span>
                    </button>
                  ) : (
                    <button type="button" onMouseDown={() => { setShowCreate(true); setShowDropdown(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 border-t"
                      style={{ borderColor: theme.borders.light }}>
                      <span className="text-sm font-medium" style={{ color: theme.accents.primary }}>+ Add New Party</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Inline create party ── */}
        {showCreate && (
          <div className="rounded-lg p-4 space-y-3"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
            <div className="text-sm font-semibold" style={{ color: theme.text.primary }}>New Party</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>Name *</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. ABC Properties" className="w-full px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>Type</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value as ReceivablePartyType)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}>
                  {(Object.keys(RECEIVABLE_PARTY_TYPE_LABELS) as ReceivablePartyType[]).map((t) => (
                    <option key={t} value={t}>{RECEIVABLE_PARTY_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>Phone (optional)</label>
                <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="03xx-xxxxxxx" className="w-full px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }} />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <AsyncButton type="button" loading={isCreating} onClick={handleCreateParty}
                className="px-4 py-1.5 text-sm font-semibold rounded text-white"
                style={{ backgroundColor: theme.accents.primary }}>
                Create & Select
              </AsyncButton>
              <button type="button" onClick={() => { setShowCreate(false); setNewName(""); }}
                className="px-3 py-1.5 text-sm rounded border"
                style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Amount ── */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Amount (PKR) *</label>
          <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00" className="w-full px-3 py-2 rounded text-sm"
            style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }} />
        </div>

        {/* ── Description ── */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Description *</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Loan advance, Security deposit, Consulting fee"
            className="w-full px-3 py-2 rounded text-sm"
            style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }} />
        </div>

        {/* ── Date + Due Date ── */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Due Date (optional)</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }} />
          </div>
        </div>

        {/* ── Vendor Source Toggle ── */}
        <div className="rounded-lg p-3"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={useVendorSource}
                onChange={(e) => {
                  setUseVendorSource(e.target.checked);
                  if (!e.target.checked) {
                    setSelectedVendor(null);
                    setVendorSearch("");
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 rounded-full transition-colors duration-200 peer-checked:bg-emerald-500"
                style={{ backgroundColor: useVendorSource ? undefined : theme.borders.medium }}>
              </div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm"
                style={{ transform: useVendorSource ? "translateX(16px)" : "translateX(0)" }}>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
                Deduct from Vendor Prepaid Balance
              </span>
              <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                Source this receivable amount from a vendor&apos;s prepaid account
              </p>
            </div>
          </label>

          {/* ── Vendor Selector ── */}
          {useVendorSource && (
            <div className="mt-3">
              <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>
                Vendor Account <span className="text-red-500">*</span>
              </label>
              {selectedVendor ? (
                <div className="flex items-center justify-between px-3 py-2 rounded border"
                  style={{ backgroundColor: theme.backgrounds.tertiary, borderColor: theme.borders.medium }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{selectedVendor.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: `#10B98115`, color: "#10B981" }}>
                      Balance: Rs. {selectedVendor.prepaidBalance.toLocaleString()}
                    </span>
                  </div>
                  <button type="button" onClick={handleClearVendor} className="text-gray-400 hover:text-gray-600 text-lg leading-none ml-2">×</button>
                </div>
              ) : (
                <div className="relative">
                  <input ref={vendorInputRef} type="text" placeholder="Search vendor..."
                    value={vendorSearch}
                    onChange={(e) => { setVendorSearch(e.target.value); setShowVendorDropdown(true); }}
                    onFocus={() => setShowVendorDropdown(true)}
                    onBlur={() => setTimeout(() => setShowVendorDropdown(false), 150)}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                  />
                  {showVendorDropdown && (
                    <div className="absolute z-50 w-full mt-1 rounded-lg border shadow-lg overflow-hidden"
                      style={{ backgroundColor: theme.backgrounds.primary, borderColor: theme.borders.light, maxHeight: "180px", overflowY: "auto" }}>
                      {filteredVendors.length === 0 && (
                        <div className="px-3 py-2 text-sm" style={{ color: theme.text.muted }}>
                          {vendors.length === 0 ? "No vendors with prepaid balance" : "No matching vendors"}
                        </div>
                      )}
                      {filteredVendors.map((v) => (
                        <button key={v.id} type="button" onMouseDown={() => handleSelectVendor(v)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between">
                          <span className="text-sm" style={{ color: theme.text.primary }}>{v.name}</span>
                          <span className="text-xs font-medium px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: `#10B98115`, color: "#10B981" }}>
                            Rs. {v.prepaidBalance.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Balance warning */}
              {exceedsBalance && (
                <div className="mt-2 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded"
                  style={{ backgroundColor: `#EF444410`, color: "#EF4444" }}>
                  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Amount exceeds vendor&apos;s prepaid balance of Rs. {selectedVendor!.prepaidBalance.toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded border"
            style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}>
            Cancel
          </button>
          <AsyncButton loading={isSubmitting} onClick={handleSubmit}
            className="px-4 py-2 text-sm font-semibold rounded text-white"
            style={{ backgroundColor: theme.accents.primary }}>
            {useVendorSource ? "Add & Deduct from Vendor" : "Add Receivable"}
          </AsyncButton>
        </div>
      </div>
    </ActionModal>
  );
}
