"use client";

import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { collectFromParty, getPaymentAccounts, RECEIVABLE_PARTY_TYPE_LABELS, ReceivablePartyType } from "@/lib/api/accounting";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";
import { numberToWords } from "@/lib/number-to-words";

type ReceivableParty = {
  partyId: string;
  partyName: string;
  partyType: string;
  totalOutstanding: number;
};

export function CollectReceivableModal({
  isOpen, onClose, onSuccess, party,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  party: ReceivableParty | null;
}) {
  const [displayAmount, setDisplayAmount] = useState("");
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && party) {
      setAmount(party.totalOutstanding);
      setDisplayAmount(party.totalOutstanding.toLocaleString());
      setNotes("");
      setSelectedAccountId("");
      getPaymentAccounts().then(setPaymentAccounts).catch(() => setPaymentAccounts([]));
    }
  }, [isOpen, party]);

  if (!isOpen || !party) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) { setDisplayAmount(""); setAmount(0); return; }
    const num = Number(val);
    setDisplayAmount(num.toLocaleString());
    setAmount(num);
  };

  const handleSubmit = async () => {
    if (amount <= 0) return toast.error("Amount must be greater than 0");
    if (!selectedAccountId) return toast.error("Please select a payment account");
    const selectedAccount = paymentAccounts.find((a) => a.id === selectedAccountId);
    const paymentMethod = selectedAccount?.subtype === "CASH" ? "CASH" : "ONLINE_TRANSFER";
    setIsSubmitting(true);
    try {
      const result = await collectFromParty(party.partyId, { amount, paymentMethod, notes: notes || undefined, accountId: selectedAccountId });
      toast.success(result.message || "Payment collected successfully!");
      if (result.isAdvance) toast.info(`Advance credit: Rs. ${result.advanceAmount.toLocaleString()} held.`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to collect payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOverpayment = amount > party.totalOutstanding;
  const typeLabel = RECEIVABLE_PARTY_TYPE_LABELS[party.partyType as ReceivablePartyType] ?? party.partyType;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => { if (e.currentTarget === e.target) onClose(); }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
        style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>Collect Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {/* Party info */}
        <div className="rounded-lg p-3 mb-5" style={{ backgroundColor: theme.backgrounds.secondary }}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: theme.text.primary }}>{party.partyName}</span>
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${theme.accents.primary}15`, color: theme.accents.primary }}>
              {typeLabel}
            </span>
          </div>
          <div className="text-xs mt-1 font-semibold text-red-600">
            Outstanding: Rs. {party.totalOutstanding.toLocaleString()}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Amount to Collect (Rs.)</label>
            <input type="text" className="w-full border rounded-md p-2 outline-none bg-transparent"
              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#e5e7eb" }}
              value={displayAmount} onChange={handleAmountChange} />
            {amount > 0 && <p className="text-xs mt-1 font-medium text-emerald-600">{numberToWords(amount)}</p>}
            {isOverpayment && (
              <p className="text-xs mt-1 font-medium text-amber-600">
                Exceeds outstanding — Rs. {(amount - party.totalOutstanding).toLocaleString()} held as advance.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Collect Into Account</label>
            <select className="w-full border rounded-md p-2 outline-none bg-transparent"
              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#e5e7eb" }}
              value={selectedAccountId} onChange={(e) => setSelectedAccountId(e.target.value)}>
              <option value="">Select account</option>
              {paymentAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.subtype === "CASH" ? "💵" : acc.subtype === "BANK" ? "🏦" : "💳"}{" "}
                  {acc.name}{acc.accountNumber ? ` (${acc.accountNumber})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Notes (optional)</label>
            <input type="text" className="w-full border rounded-md p-2 outline-none bg-transparent text-sm"
              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#e5e7eb" }}
              placeholder="e.g. Installment #2, Reference #123"
              value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t" style={{ borderColor: theme.borders?.light || "#e5e7eb" }}>
          <button onClick={onClose} className="px-4 py-2 border rounded-md font-medium text-sm"
            style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#d1d5db" }}>
            Cancel
          </button>
          <AsyncButton loading={isSubmitting} onClick={handleSubmit} disabled={!selectedAccountId}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md font-medium text-sm hover:bg-emerald-700 shadow-sm disabled:opacity-50">
            Confirm Collection
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}
