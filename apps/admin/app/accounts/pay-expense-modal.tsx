"use client";

import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { payPayable, getPaymentAccounts } from "@/lib/api/accounting";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";
import { numberToWords } from "@/lib/number-to-words";

interface PayExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payableId: string;
  remainingAmount: number;
  expenseDescription: string;
}

export function PayExpenseModal({
  isOpen,
  onClose,
  onSuccess,
  payableId,
  remainingAmount,
  expenseDescription,
}: PayExpenseModalProps) {
  const [displayAmount, setDisplayAmount] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount(remainingAmount);
      setDisplayAmount(remainingAmount.toLocaleString());
      setPaymentMethod("CASH");
      setSelectedAccountId("");
      getPaymentAccounts().then(setPaymentAccounts).catch(() => setPaymentAccounts([]));
    }
  }, [isOpen, remainingAmount]);

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) {
      setDisplayAmount("");
      setAmount(0);
      return;
    }
    const num = Number(val);
    if (num > remainingAmount) {
      setDisplayAmount(remainingAmount.toLocaleString());
      setAmount(remainingAmount);
    } else {
      setDisplayAmount(num.toLocaleString());
      setAmount(num);
    }
  };

  const handleSubmit = async () => {
    if (amount <= 0) return toast.error("Amount must be greater than 0");
    if (amount > remainingAmount) return toast.error("Amount cannot exceed remaining balance");
    if (paymentMethod === "ONLINE_TRANSFER" && !selectedAccountId)
      return toast.error("Please select a bank/e-wallet account");

    setIsSubmitting(true);
    try {
      await payPayable(payableId, {
        amount,
        paymentMethod,
        accountId: paymentMethod === "ONLINE_TRANSFER" ? selectedAccountId : undefined,
      });
      toast.success("Payment recorded successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>
            Pay Expense
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            ×
          </button>
        </div>

        {/* Expense info */}
        <div
          className="rounded-lg p-3 mb-5"
          style={{ backgroundColor: theme.backgrounds.secondary }}
        >
          <div className="text-sm font-semibold" style={{ color: theme.text.primary }}>
            {expenseDescription}
          </div>
          <div className="text-xs mt-1 font-semibold text-red-600">
            Remaining: Rs. {remainingAmount.toLocaleString()}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Amount to Pay (Rs.)
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 outline-none bg-transparent"
              style={{
                color: theme.text.primary,
                borderColor: theme.borders?.medium || "#e5e7eb",
              }}
              value={displayAmount}
              onChange={handleAmountChange}
            />
            {amount > 0 && (
              <p className="text-xs mt-1 font-medium text-emerald-600">
                {numberToWords(amount)}
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: theme.text.secondary }}>
              Remaining balance: Rs. {remainingAmount.toLocaleString()}
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Payment Method
            </label>
            <select
              className="w-full border rounded-md p-2 outline-none bg-transparent"
              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#e5e7eb" }}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="CASH">Cash</option>
              <option value="ONLINE_TRANSFER">Bank Transfer</option>
            </select>
          </div>

          {/* Bank/e-wallet account selector */}
          {paymentMethod === "ONLINE_TRANSFER" && (
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Bank / E-Wallet Account
              </label>
              <select
                className="w-full border rounded-md p-2 outline-none bg-transparent"
                style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#e5e7eb" }}
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
              >
                <option value="">Select an account</option>
                {paymentAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.subtype === "BANK" ? "🏦" : "💳"} {acc.name}{" "}
                    {acc.accountNumber ? `(${acc.accountNumber})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div
          className="flex justify-end gap-3 pt-5 border-t"
          style={{ borderColor: theme.borders?.light || "#e5e7eb" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md font-medium text-sm transition-colors"
            style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#d1d5db" }}
          >
            Cancel
          </button>
          <AsyncButton
            loading={isSubmitting}
            onClick={handleSubmit}
            disabled={paymentMethod === "ONLINE_TRANSFER" && !selectedAccountId}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md font-medium text-sm hover:bg-emerald-700 shadow-sm"
          >
            Confirm Payment
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}
