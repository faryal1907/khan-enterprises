"use client";

import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { recordInternalTransfer, getAccounts } from "@/lib/api/accounting";
import { AsyncButton } from "@/components/async-button";
import { toast } from "sonner";

type InternalTransferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function InternalTransferModal({ isOpen, onClose, onSuccess }: InternalTransferModalProps) {
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  const fetchAccounts = async () => {
    try {
      const data = await getAccounts();
      const assetAccounts = data.filter((acc: any) =>
        acc.category === 'ASSET' &&
        ['CASH', 'BANK', 'EWALLET'].includes(acc.subtype) &&
        acc.isActive
      );
      setAccounts(assetAccounts);
    } catch (err: any) {
      toast.error(err.message || "Failed to load accounts");
    }
  };

  const handleSubmit = async () => {
    if (!fromAccountId) {
      toast.error("Please select a source account");
      return;
    }
    if (!toAccountId) {
      toast.error("Please select a destination account");
      return;
    }
    if (fromAccountId === toAccountId) {
      toast.error("Source and destination accounts cannot be the same");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    try {
      await recordInternalTransfer({
        fromAccountId,
        toAccountId,
        amount: parseFloat(amount),
        date,
        notes: reason || undefined,
      });
      toast.success("Internal transfer recorded successfully");
      onClose();
      onSuccess();
      setFromAccountId("");
      setToAccountId("");
      setAmount("");
      setReason("");
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err: any) {
      toast.error(err.message || "Failed to record internal transfer");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div
        className="rounded-lg p-6 max-w-lg w-full mx-4"
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
            Record Internal Transfer
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              From Account *
            </label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm text-black"
            >
              <option value="">Select account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.code} - {acc.name} (Balance: {acc.balance?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              To Account *
            </label>
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm text-black"
            >
              <option value="">Select account</option>
              {accounts
                .filter((acc) => acc.id !== fromAccountId)
                .map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.code} - {acc.name} (Balance: {acc.balance?.toLocaleString()})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Amount (PKR) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border rounded-md text-sm text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Reason (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Branch rebalancing, Cash top-up"
              className="w-full px-3 py-2 border rounded-md text-sm text-black"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <AsyncButton
            onClick={handleSubmit}
            loading={loading}
            className="px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            Record Transfer
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}
