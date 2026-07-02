"use client";

import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { getExpensePaymentHistory } from "@/lib/api/expenses";
import { toast } from "sonner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(amount);

const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const paymentStateBadge = (state: string) => {
  switch (state) {
    case "PAID":
      return "bg-green-100 text-green-800";
    case "PARTIAL":
      return "bg-orange-100 text-orange-800";
    case "OVERDUE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

interface ExpenseLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string;
}

export function ExpenseLedgerModal({ isOpen, onClose, expenseId }: ExpenseLedgerModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && expenseId) {
      fetchHistory();
    }
  }, [isOpen, expenseId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const result = await getExpensePaymentHistory(expenseId);
      setData(result);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load expense history");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const expense = data?.expense;
  const payable = data?.payable;
  const payments: any[] = data?.payments ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col"
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
          maxHeight: "85vh",
        }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-6 pb-4 border-b"
          style={{ borderColor: theme.borders.light }}
        >
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>
              Expense Payment History
            </h2>
            {expense && (
              <p className="text-sm mt-0.5" style={{ color: theme.text.secondary }}>
                {expense.category} · {formatDate(expense.date)}
                {expense.description ? ` · ${expense.description}` : ""}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div
            className="flex-1 flex items-center justify-center p-8 text-sm"
            style={{ color: theme.text.secondary }}
          >
            Loading...
          </div>
        ) : data ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Summary */}
            {payable && (
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="rounded-lg p-3 text-center"
                  style={{ backgroundColor: theme.backgrounds.secondary }}
                >
                  <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>
                    Total Amount
                  </div>
                  <div className="text-sm font-bold" style={{ color: theme.text.primary }}>
                    {formatCurrency(payable.total)}
                  </div>
                </div>
                <div
                  className="rounded-lg p-3 text-center"
                  style={{ backgroundColor: theme.backgrounds.secondary }}
                >
                  <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>
                    Paid
                  </div>
                  <div className="text-sm font-bold text-emerald-600">
                    {formatCurrency(payable.paid)}
                  </div>
                </div>
                <div
                  className="rounded-lg p-3 text-center"
                  style={{ backgroundColor: theme.backgrounds.secondary }}
                >
                  <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>
                    Remaining
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: payable.remaining > 0 ? "#ef4444" : "#22c55e" }}
                  >
                    {formatCurrency(payable.remaining)}
                  </div>
                </div>
              </div>
            )}

            {/* Status badge */}
            {payable && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: theme.text.secondary }}>
                  Payment Status:
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${paymentStateBadge(payable.status)}`}
                >
                  {payable.status}
                </span>
              </div>
            )}

            {/* Payment history table */}
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: theme.text.primary }}>
                Payments
              </h3>
              {payments.length === 0 ? (
                <div
                  className="rounded-lg border p-4 text-sm text-center"
                  style={{ borderColor: theme.borders.light, color: theme.text.muted }}
                >
                  No payments recorded yet.
                </div>
              ) : (
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{ borderColor: theme.borders.light }}
                >
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                        <th
                          className="p-3 text-xs font-medium uppercase tracking-wider"
                          style={{ color: theme.text.secondary }}
                        >
                          Date
                        </th>
                        <th
                          className="p-3 text-xs font-medium uppercase tracking-wider"
                          style={{ color: theme.text.secondary }}
                        >
                          Method
                        </th>
                        <th
                          className="p-3 text-xs font-medium uppercase tracking-wider"
                          style={{ color: theme.text.secondary }}
                        >
                          Account
                        </th>
                        <th
                          className="p-3 text-xs font-medium uppercase tracking-wider text-right"
                          style={{ color: theme.text.secondary }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((pmt: any, idx: number) => (
                        <tr
                          key={idx}
                          className="border-b last:border-0"
                          style={{ borderColor: theme.borders.light }}
                        >
                          <td className="p-3 whitespace-nowrap" style={{ color: theme.text.secondary }}>
                            {formatDate(pmt.date)}
                          </td>
                          <td className="p-3">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
                            >
                              {pmt.method === "ONLINE_TRANSFER" ? "Bank Transfer" : "Cash"}
                            </span>
                          </td>
                          <td className="p-3 text-xs" style={{ color: theme.text.secondary }}>
                            {pmt.account}
                          </td>
                          <td
                            className="p-3 text-right font-semibold text-emerald-600"
                          >
                            {formatCurrency(pmt.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
