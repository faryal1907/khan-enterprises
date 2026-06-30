"use client";

import { theme } from "@/lib/colors";

type OwnerEquityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  accounts: any[];
  onCapitalContribution: () => void;
  onOwnerWithdrawal: () => void;
  onInternalTransfer: () => void;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount);

export function OwnerEquityModal({
  isOpen,
  onClose,
  accounts,
  onCapitalContribution,
  onOwnerWithdrawal,
  onInternalTransfer,
}: OwnerEquityModalProps) {
  if (!isOpen) return null;

  const ownerCapital = accounts.find((a) => a.code === '3001')?.balance || 0;
  const ownerDrawings = accounts.find((a) => a.code === '3002')?.balance || 0;
  const netEquity = ownerCapital - ownerDrawings;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onMouseDown={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <div
        className="rounded-lg p-6 w-full max-w-md mx-4"
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
        }}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
            Owner Equity
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div
            className="p-3 rounded text-center"
            style={{ backgroundColor: theme.backgrounds.secondary }}
          >
            <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Owner Capital</div>
            <div className="text-sm font-semibold" style={{ color: theme.text.primary }}>
              {formatCurrency(ownerCapital)}
            </div>
          </div>
          <div
            className="p-3 rounded text-center"
            style={{ backgroundColor: theme.backgrounds.secondary }}
          >
            <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Owner Drawings</div>
            <div className="text-sm font-semibold" style={{ color: theme.text.primary }}>
              {formatCurrency(ownerDrawings)}
            </div>
          </div>
          <div
            className="p-3 rounded text-center"
            style={{ backgroundColor: theme.backgrounds.secondary }}
          >
            <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Net Equity</div>
            <div
              className="text-sm font-semibold"
              style={{ color: netEquity >= 0 ? '#22c55e' : '#ef4444' }}
            >
              {formatCurrency(netEquity)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => { onClose(); onCapitalContribution(); }}
            className="w-full px-4 py-2.5 rounded-md text-sm font-semibold text-left transition-colors bg-gray-800 hover:bg-gray-700 text-white"
          >
            Capital Contribution
          </button>
          <button
            onClick={() => { onClose(); onOwnerWithdrawal(); }}
            className="w-full px-4 py-2.5 rounded-md text-sm font-semibold text-left transition-colors bg-gray-800 hover:bg-gray-700 text-white"
          >
            Owner Withdrawal
          </button>
          <button
            onClick={() => { onClose(); onInternalTransfer(); }}
            className="w-full px-4 py-2.5 rounded-md text-sm font-semibold text-left transition-colors bg-gray-800 hover:bg-gray-700 text-white"
          >
            Internal Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
