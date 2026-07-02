"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { theme } from "@/lib/colors";
import { AsyncButton } from "@/components/async-button";
import { recordVendorPayment } from "@/lib/api/vendors";
import { getAccounts } from "@/lib/api/accounting";
import { numberToWords } from "@repo/utils";

type Account = { id: string; code: string; name: string; subtype: string; balance: number };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendorId: string;
  vendorName: string;
  currentBalance: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n);

const today = () => new Date().toISOString().split("T")[0];

export function VendorPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  vendorId,
  vendorName,
  currentBalance,
}: Props) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccountId, setFromAccountId] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Load funding accounts when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setFromAccountId("");
    setDisplayAmount("");
    setAmount(0);
    setDate(today());
    setNotes("");
    getAccounts()
      .then((all: Account[]) => {
        // Only liquid asset accounts (Cash, Bank, E-Wallet) can fund a vendor payment.
        // Equity accounts (Owner Capital) are not real cash — they represent ownership stake.
        const fundable = all.filter(
          (a) =>
            a.balance > 0 &&
            ["CASH", "BANK", "EWALLET"].includes(a.subtype),
        );
        setAccounts(fundable);
      })
      .catch(() => toast.error("Failed to load accounts"));
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedAccount = accounts.find((a) => a.id === fromAccountId);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) { setDisplayAmount(""); setAmount(0); return; }
    const n = Number(raw);
    setDisplayAmount(n.toLocaleString());
    setAmount(n);
  };

  const handleSubmit = async () => {
    if (!fromAccountId) return toast.error("Select a funding account");
    if (amount <= 0) return toast.error("Amount must be greater than 0");
    if (!date) return toast.error("Date is required");

    if (selectedAccount && amount > selectedAccount.balance) {
      return toast.error(
        `Insufficient balance in ${selectedAccount.name}. Available: ${fmt(selectedAccount.balance)}`,
      );
    }

    setSaving(true);
    try {
      const res = await recordVendorPayment(vendorId, { fromAccountId, amount, date, notes: notes.trim() || undefined });
      toast.success(
        `Payment of ${fmt(amount)} recorded. New vendor balance: ${fmt(res.newPrepaidBalance)}`,
      );
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to record payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
        style={{ border: `1px solid ${theme.borders.light}` }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>
              Pay Vendor
            </h2>
            <p className="text-sm mt-0.5" style={{ color: theme.text.secondary }}>
              {vendorName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: theme.text.muted }}>Current balance</p>
            <p className="text-sm font-bold" style={{ color: currentBalance > 0 ? "#d97706" : theme.text.secondary }}>
              {fmt(currentBalance)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Funding account */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Funding Account *
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm outline-none bg-white"
              style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
            >
              <option value="">Select account...</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} — {a.name} ({fmt(a.balance)})
                </option>
              ))}
            </select>
            {selectedAccount && (
              <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
                Available: {fmt(selectedAccount.balance)}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Amount (Rs.) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
              style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
              placeholder="e.g. 1,000,000"
              value={displayAmount}
              onChange={handleAmountChange}
            />
            {amount > 0 && (
              <p className="text-xs mt-1 font-medium text-emerald-600">
                {numberToWords(amount)}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Payment Date *
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
              placeholder="e.g. Advance for June delivery"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Journal preview */}
        {amount > 0 && fromAccountId && selectedAccount && (
          <div
            className="mt-4 p-3 rounded-lg text-xs space-y-1"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="font-semibold mb-1" style={{ color: theme.text.secondary }}>Journal Entry Preview</p>
            <div className="flex justify-between">
              <span style={{ color: theme.text.primary }}>DR — Vendor Advance / Prepaid (1500)</span>
              <span className="font-medium" style={{ color: theme.text.primary }}>{fmt(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: theme.text.primary }}>CR — {selectedAccount.name}</span>
              <span className="font-medium" style={{ color: theme.text.primary }}>{fmt(amount)}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-5 border-t" style={{ borderColor: theme.borders.light }}>
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm font-medium"
            style={{ color: theme.text.primary, borderColor: theme.borders.medium }}
          >
            Cancel
          </button>
          <AsyncButton
            loading={saving}
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-semibold text-white rounded-md"
            style={{ backgroundColor: theme.accents.primary }}
          >
            Record Payment
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}
