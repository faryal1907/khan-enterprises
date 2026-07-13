"use client";

import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { getPayeeLedger } from "@/lib/api/expenses";
import { payPayable, getPaymentAccounts, undoPayablePayment } from "@/lib/api/accounting";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";
import { numberToWords } from "@/lib/number-to-words";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(amount);

const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });

const statusBadge = (status: string) => {
  switch (status) {
    case "PAID":    return "bg-green-100 text-green-800";
    case "PARTIAL": return "bg-orange-100 text-orange-800";
    case "DUE":     return "bg-yellow-100 text-yellow-800";
    case "OVERDUE": return "bg-red-100 text-red-800";
    default:        return "bg-gray-100 text-gray-600";
  }
};

interface PayeeLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  payeeAccountId: string;
  payeeName: string;
}

export function PayeeLedgerModal({
  isOpen,
  onClose,
  onSuccess,
  payeeAccountId,
  payeeName,
}: PayeeLedgerModalProps) {
  const [ledgerData, setLedgerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Pay modal state (inline)
  const [payingExpenseId, setPayingExpenseId] = useState<string | null>(null);
  const [payingPayableId, setPayingPayableId] = useState<string | null>(null);
  const [payingRemaining, setPayingRemaining] = useState(0);
  const [payingLabel, setPayingLabel] = useState("");
  const [payAccounts, setPayAccounts] = useState<any[]>([]);
  const [payAmount, setPayAmount] = useState(0);
  const [payDisplayAmount, setPayDisplayAmount] = useState("");
  const [payAccountId, setPayAccountId] = useState("");
  const [isPaySubmitting, setIsPaySubmitting] = useState(false);
  const [undoingPaymentId, setUndoingPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && payeeAccountId) {
      fetchLedger();
    }
  }, [isOpen, payeeAccountId]);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const data = await getPayeeLedger(payeeAccountId);
      setLedgerData(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load payee ledger");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const openPayPanel = async (expense: any) => {
    setPayingExpenseId(expense.id);
    setPayingPayableId(expense.payableId);
    setPayingRemaining(expense.remaining);
    setPayingLabel(expense.description || expense.category?.replace(/_/g, ' ') || 'Expense');
    setPayAmount(expense.remaining);
    setPayDisplayAmount(expense.remaining.toLocaleString());
    setPayAccountId("");
    if (payAccounts.length === 0) {
      const accs = await getPaymentAccounts().catch(() => []);
      setPayAccounts(accs);
    }
  };

  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) { setPayDisplayAmount(""); setPayAmount(0); return; }
    const num = Math.min(Number(val), payingRemaining);
    setPayDisplayAmount(num.toLocaleString());
    setPayAmount(num);
  };

  const handlePaySubmit = async () => {
    if (!payingPayableId) return toast.error("No payable selected");
    if (payAmount <= 0) return toast.error("Amount must be greater than 0");
    if (!payAccountId) return toast.error("Please select a payment account");

    setIsPaySubmitting(true);
    try {
      const selectedAcc = payAccounts.find((a) => a.id === payAccountId);
      const method = selectedAcc?.subtype === "CASH" ? "CASH" : "ONLINE_TRANSFER";
      await payPayable(payingPayableId, { amount: payAmount, paymentMethod: method, accountId: payAccountId });
      toast.success("Payment recorded successfully");
      setPayingExpenseId(null);
      setPayingPayableId(null);
      await fetchLedger();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to record payment");
    } finally {
      setIsPaySubmitting(false);
    }
  };

  const handleUndoPayment = async (paymentId: string) => {
    setUndoingPaymentId(paymentId);
    try {
      await undoPayablePayment(paymentId);
      toast.success("Payment undone successfully");
      await fetchLedger();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to undo payment");
    } finally {
      setUndoingPaymentId(null);
    }
  };

  if (!isOpen) return null;

  const summary = ledgerData?.summary;
  const entries: any[] = ledgerData?.entries ?? [];
  // Build expense lookup from entries for pay button
  const expenseRows: any[] = ledgerData?.entries?.filter((e: any) => e.type === 'EXPENSE') ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col"
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-6 pb-4 border-b"
          style={{ borderColor: theme.borders.light }}
        >
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>
              Payable Ledger
            </h2>
            <p className="text-sm mt-0.5" style={{ color: theme.text.secondary }}>
              {payeeName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-8 text-sm" style={{ color: theme.text.secondary }}>
            Loading ledger...
          </div>
        ) : ledgerData ? (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 p-6 pb-4">
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: theme.backgrounds.secondary }}>
                <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Total Expenses</div>
                <div className="text-sm font-bold text-red-500">{formatCurrency(summary.totalExpenses)}</div>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: theme.backgrounds.secondary }}>
                <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Total Paid</div>
                <div className="text-sm font-bold text-emerald-600">{formatCurrency(summary.totalPaid)}</div>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: theme.backgrounds.secondary }}>
                <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Outstanding</div>
                <div
                  className="text-sm font-bold"
                  style={{ color: summary.totalOutstanding > 0 ? "#ef4444" : "#22c55e" }}
                >
                  {formatCurrency(summary.totalOutstanding)}
                </div>
              </div>
            </div>

            {/* Inline pay panel */}
            {payingExpenseId && (
              <div
                className="mx-6 mb-4 rounded-xl p-4 border"
                style={{ backgroundColor: theme.backgrounds.secondary, borderColor: theme.borders.light }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold" style={{ color: theme.text.primary }}>
                    Pay: {payingLabel}
                  </span>
                  <button onClick={() => setPayingExpenseId(null)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>
                      Amount (Rs.) — Remaining: {payingRemaining.toLocaleString()}
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 text-sm outline-none bg-transparent"
                      style={{ color: theme.text.primary, borderColor: theme.borders.medium }}
                      value={payDisplayAmount}
                      onChange={handlePayAmountChange}
                    />
                    {payAmount > 0 && (
                      <p className="text-xs mt-1 text-emerald-600 font-medium">{numberToWords(payAmount)}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>
                      Pay From Account
                    </label>
                    <select
                      className="w-full border rounded-md p-2 text-sm outline-none bg-transparent"
                      style={{ color: theme.text.primary, borderColor: theme.borders.medium }}
                      value={payAccountId}
                      onChange={(e) => setPayAccountId(e.target.value)}
                    >
                      <option value="">Select account</option>
                      {payAccounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.subtype === "CASH" ? "💵" : acc.subtype === "BANK" ? "🏦" : "💳"}{" "}
                          {acc.name}{acc.accountNumber ? ` (${acc.accountNumber})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setPayingExpenseId(null)}
                    className="px-3 py-1.5 text-sm rounded border"
                    style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}
                  >
                    Cancel
                  </button>
                  <AsyncButton
                    loading={isPaySubmitting}
                    onClick={handlePaySubmit}
                    disabled={!payAccountId || payAmount <= 0}
                    className="px-4 py-1.5 bg-emerald-600 text-white rounded text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Confirm Payment
                  </AsyncButton>
                </div>
              </div>
            )}

            {/* Ledger table */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.borders.light }}>
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>Date</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>Type</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>Description</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider text-right" style={{ color: theme.text.secondary }}>Expense</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider text-right" style={{ color: theme.text.secondary }}>Payment</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider text-right" style={{ color: theme.text.secondary }}>Outstanding</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-6 text-center" style={{ color: theme.text.muted }}>
                          No transactions yet.
                        </td>
                      </tr>
                    )}
                    {entries.map((entry: any, idx: number) => {
                      const isExpenseEntry = entry.type === 'EXPENSE';
                      // Find the expense detail for Pay button
                      const expDetail = isExpenseEntry
                        ? ledgerData?.expenses?.find?.((e: any) => e.id === entry.expenseId) ?? null
                        : null;
                      const canPay = isExpenseEntry && expDetail && expDetail.remaining > 0 && expDetail.payableId && expDetail.id !== payingExpenseId;

                      return (
                        <tr
                          key={idx}
                          className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${isExpenseEntry ? '' : 'bg-emerald-50/30'}`}
                          style={{ borderColor: theme.borders.light }}
                        >
                          <td className="p-3 whitespace-nowrap text-xs" style={{ color: theme.text.secondary }}>
                            {formatDate(entry.date)}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                isExpenseEntry
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isExpenseEntry ? entry.category?.replace(/_/g, ' ') || 'EXPENSE' : 'PAYMENT'}
                            </span>
                          </td>
                          <td className="p-3 text-xs max-w-xs" style={{ color: theme.text.secondary }}>
                            {entry.description}
                            {isExpenseEntry && entry.branch && (
                              <span className="ml-1 text-xs opacity-60">· {entry.branch}</span>
                            )}
                          </td>
                          <td className="p-3 text-right font-semibold text-red-500">
                            {isExpenseEntry && entry.amount > 0 ? formatCurrency(entry.amount) : '—'}
                          </td>
                          <td className="p-3 text-right font-semibold text-emerald-600">
                            {!isExpenseEntry && (entry.payment ?? 0) > 0 ? formatCurrency(entry.payment) : '—'}
                          </td>
                          <td
                            className="p-3 text-right font-semibold"
                            style={{ color: entry.balance > 0 ? '#ef4444' : '#22c55e' }}
                          >
                            {formatCurrency(Math.max(0, entry.balance))}
                          </td>
                          <td className="p-3">
                            {canPay && (
                              <button
                                onClick={() => openPayPanel(expDetail)}
                                className="text-white px-3 py-1 rounded text-xs font-semibold"
                                style={{ backgroundColor: theme.accents.primary }}
                              >
                                Pay
                              </button>
                            )}
                            {!isExpenseEntry && entry.paymentId && (
                              <button
                                onClick={() => handleUndoPayment(entry.paymentId)}
                                disabled={undoingPaymentId === entry.paymentId}
                                className="text-xs px-2 py-1 rounded border bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                                style={{ borderColor: "#fecaca" }}
                              >
                                {undoingPaymentId === entry.paymentId ? "Undoing..." : "Undo"}
                              </button>
                            )}
                            {isExpenseEntry && expDetail?.status && (
                              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(expDetail.status)}`}>
                                {expDetail.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
