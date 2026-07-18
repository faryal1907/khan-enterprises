"use client";

import { useState } from "react";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";

interface UndoConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  details?: {
    amount?: number;
    account?: string;
    date?: string;
    reference?: string;
  };
}

export function UndoConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  details,
}: UndoConfirmationModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      toast.success("Undo completed successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to undo payment");
    } finally {
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
        style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            {title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
          {description}
        </p>

        {details && (
          <div className="space-y-2 mb-4">
            <div
              className="rounded-md p-3 space-y-1"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              {details.amount && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.text.secondary }}>Amount:</span>
                  <span className="font-medium" style={{ color: theme.text.primary }}>
                    Rs. {details.amount.toLocaleString()}
                  </span>
                </div>
              )}
              {details.account && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.text.secondary }}>Account:</span>
                  <span className="font-medium" style={{ color: theme.text.primary }}>
                    {details.account}
                  </span>
                </div>
              )}
              {details.date && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.text.secondary }}>Date:</span>
                  <span className="font-medium" style={{ color: theme.text.primary }}>
                    {new Date(details.date).toLocaleDateString()}
                  </span>
                </div>
              )}
              {details.reference && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.text.secondary }}>Reference:</span>
                  <span className="font-medium" style={{ color: theme.text.primary }}>
                    {details.reference}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className="mb-4 p-3 rounded-md bg-red-50 border border-red-200"
        >
          <p className="text-sm text-red-800">
            ⚠️ This action cannot be undone. The payment will be reversed and the payable/receivable entry will be permanently deleted — the amount will no longer appear as owed.
          </p>
        </div>

        <div
          className="flex justify-end gap-3 pt-4 border-t"
          style={{ borderColor: theme.borders?.light || "#e5e7eb" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md font-medium text-sm transition-colors"
            style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#d1d5db" }}
            disabled={isConfirming}
          >
            Cancel
          </button>
          <AsyncButton
            loading={isConfirming}
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md font-medium text-sm hover:bg-red-700 shadow-sm disabled:opacity-50"
          >
            Confirm Undo
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}
