"use client";

import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { payPayablesByPayee, getPaymentAccounts } from "@/lib/api/accounting";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";
import { numberToWords } from "@/lib/number-to-words";

export function PayPayableModal({
  isOpen,
  onClose,
  onSuccess,
  payee,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payee: {
    payeeAccountId: string;
    payeeName: string;
    payeeType: string;
    totalOutstanding: number;
  } | null;
}) {
  const [displayAmount, setDisplayAmount] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && payee) {
      setAmount(payee.totalOutstanding);
      setDisplayAmount(payee.totalOutstanding.toLocaleString());
      setSelectedAccountId("");
      getPaymentAccounts().then(setPaymentAccounts).catch(() => setPaymentAccounts([]));
    }
  }, [isOpen, payee]);

  if (!isOpen || !payee) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) {
      setDisplayAmount("");
      setAmount(0);
      return;
    }
    const num = Math.min(Number(val), payee.totalOutstanding);
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
      const result = await payPayablesByPayee(payee.payeeAccountId, {
        amount,
        paymentMethod,
        accountId: selectedAccountId,
      });
      toast.success(result.message || "Payment recorded successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeLabel = payee.payeeType.replace(/_/g, " ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
        style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>
            Pay Payable
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            ×
          </button>
        </div>

        {/* Payee info */}
        <div className="rounded-lg p-3 mb-5" style={{ backgroundColor: theme.backgrounds.secondary }}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: theme.text.primary }}>
              {payee.payeeName}
            </span>
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${theme.accents.primary}15`, color: theme.accents.primary }}
            >
              {typeLabel}
            </span>
          </div>
          <div className="text-xs mt-1 font-semibold text-red-600">
            Outstanding: Rs. {payee.totalOutstanding.toLocaleString()}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Amount to Pay (Rs.)
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 outline-none bg-transparent"
              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#e5e7eb" }}
              value={displayAmount}
              onChange={handleAmountChange}
            />
            {amount > 0 && (
              <p className="text-xs mt-1 font-medium text-emerald-600">{numberToWords(amount)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Pay From Account
            </label>
            <select
              className="w-full border rounded-md p-2 outline-none bg-transparent"
              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#e5e7eb" }}
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              <option value="">Select account</option>
              {paymentAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.subtype === "CASH" ? "💵" : acc.subtype === "BANK" ? "🏦" : "💳"}{" "}
                  {acc.name}
                  {acc.accountNumber ? ` (${acc.accountNumber})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="flex justify-end gap-3 pt-5 border-t"
          style={{ borderColor: theme.borders?.light || "#e5e7eb" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md font-medium text-sm"
            style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#d1d5db" }}
          >
            Cancel
          </button>
          <AsyncButton
            loading={isSubmitting}
            onClick={handleSubmit}
            disabled={!selectedAccountId || amount <= 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md font-medium text-sm hover:bg-emerald-700 shadow-sm disabled:opacity-50"
          >
            Confirm Payment
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}
