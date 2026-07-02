"use client";

import { useState, useEffect, useRef } from "react";
import { theme } from "@/lib/colors";
import {
  getReceivableParties, createReceivableParty, createReceivableEntry,
  RECEIVABLE_PARTY_TYPE_LABELS, ReceivablePartyType,
} from "@/lib/api/accounting";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";
import { ActionModal } from "@/components/action-modal";

type Party = { id: string; name: string; partyType: ReceivablePartyType; phone?: string | null };

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

  // Receivable entry fields
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today());
  const [dueDate, setDueDate] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getReceivableParties().then(setParties).catch(() => setParties([]));
      setSelectedParty(null);
      setPartySearch("");
      setShowCreate(false);
      setNewName(""); setNewType("CUSTOMER"); setNewPhone("");
      setAmount(""); setDescription(""); setDate(today()); setDueDate("");
    }
  }, [isOpen]);

  const filtered = parties.filter((p) =>
    p.name.toLowerCase().includes(partySearch.toLowerCase()) ||
    RECEIVABLE_PARTY_TYPE_LABELS[p.partyType].toLowerCase().includes(partySearch.toLowerCase())
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

    setIsSubmitting(true);
    try {
      await createReceivableEntry({
        partyId: selectedParty.id,
        amount: amt,
        description: description.trim(),
        date,
        dueDate: dueDate || undefined,
      });
      toast.success("Receivable added successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add receivable");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded border"
            style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}>
            Cancel
          </button>
          <AsyncButton loading={isSubmitting} onClick={handleSubmit}
            className="px-4 py-2 text-sm font-semibold rounded text-white"
            style={{ backgroundColor: theme.accents.primary }}>
            Add Receivable
          </AsyncButton>
        </div>
      </div>
    </ActionModal>
  );
}
