"use client";

import { useEffect, useState } from "react";
import { theme } from "@/lib/colors";
import { getAccountLedger } from "@/lib/api/accounting";
import { AsyncButton } from "@/components/async-button";
import { toast } from "sonner";

type AccountLedgerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  accountCode: string;
  accountName: string;
};

const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount);

export function AccountLedgerModal({ isOpen, onClose, accountId, accountCode, accountName }: AccountLedgerModalProps) {
  const [ledgerData, setLedgerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchLedger = async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const data = await getAccountLedger(accountId, pageNum, 50);
      setLedgerData(data);
      setPage(pageNum);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load ledger data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && accountId) {
      fetchLedger(1);
    }
  }, [isOpen, accountId]);

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
        className="rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
              Account Ledger
            </h3>
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              {accountCode} - {accountName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm" style={{ color: theme.text.secondary }}>Loading...</div>
          </div>
        ) : ledgerData ? (
          <div className="flex-1 overflow-auto">
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: theme.backgrounds.secondary }}>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="block" style={{ color: theme.text.secondary }}>Opening Balance</span>
                  <span className="font-semibold" style={{ color: theme.text.primary }}>
                    {formatCurrency(ledgerData.account.openingBalance)}
                  </span>
                </div>
                <div>
                  <span className="block" style={{ color: theme.text.secondary }}>Category</span>
                  <span className="font-semibold" style={{ color: theme.text.primary }}>
                    {ledgerData.account.category}
                  </span>
                </div>
                <div>
                  <span className="block" style={{ color: theme.text.secondary }}>Subtype</span>
                  <span className="font-semibold" style={{ color: theme.text.primary }}>
                    {ledgerData.account.subtype}
                  </span>
                </div>
              </div>
            </div>

            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b sticky top-0" style={{ backgroundColor: theme.backgrounds.secondary }}>
                <tr>
                  <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Date</th>
                  <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Entry No</th>
                  <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Description</th>
                  <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Debit</th>
                  <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Credit</th>
                  <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {ledgerData.ledger.map((entry: any) => (
                  <tr key={entry.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-3" style={{ color: theme.text.primary }}>
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-medium" style={{ color: theme.text.primary }}>
                      {entry.entryNo}
                    </td>
                    <td className="p-3" style={{ color: theme.text.primary }}>
                      {entry.description}
                    </td>
                    <td className="p-3 text-right" style={{ color: theme.text.primary }}>
                      {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                    </td>
                    <td className="p-3 text-right" style={{ color: theme.text.primary }}>
                      {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                    </td>
                    <td className="p-3 text-right font-semibold" style={{ color: theme.text.primary }}>
                      {formatCurrency(entry.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {ledgerData.pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm" style={{ color: theme.text.secondary }}>
                  Page {ledgerData.pagination.page} of {ledgerData.pagination.totalPages}
                </div>
                <div className="flex space-x-2">
                  <AsyncButton
                    onClick={() => fetchLedger(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-md text-sm border"
                    style={{
                      borderColor: theme.borders.light,
                      color: theme.text.primary,
                    }}
                  >
                    Previous
                  </AsyncButton>
                  <AsyncButton
                    onClick={() => fetchLedger(page + 1)}
                    disabled={page === ledgerData.pagination.totalPages}
                    className="px-3 py-1 rounded-md text-sm border"
                    style={{
                      borderColor: theme.borders.light,
                      color: theme.text.primary,
                    }}
                  >
                    Next
                  </AsyncButton>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8" style={{ color: theme.text.secondary }}>
            No ledger data available
          </div>
        )}
      </div>
    </div>
  );
}
