"use client";

import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { getCustomerLedger } from "@/lib/api/accounting";
import { toast } from "sonner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(amount);

const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });

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

export function CustomerLedgerModal({
  isOpen,
  onClose,
  customerPhone,
  customerName,
}: {
  isOpen: boolean;
  onClose: () => void;
  customerPhone: string;
  customerName: string;
}) {
  const [ledger, setLedger] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customerPhone) {
      fetchLedger();
    }
  }, [isOpen, customerPhone]);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const data = await getCustomerLedger(customerPhone);
      setLedger(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load ledger");
      onClose();
    } finally {
      setLoading(false);
    }
  };

if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-7xl flex flex-col"
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
              Customer Ledger
            </h2>
            <p className="text-sm mt-0.5" style={{ color: theme.text.secondary }}>
              {customerName} · {customerPhone}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-8 text-sm" style={{ color: theme.text.secondary }}>
            Loading ledger...
          </div>
        ) : ledger ? (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 p-6 pb-4">
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: theme.backgrounds.secondary }}>
                <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Total Billed</div>
                <div className="text-sm font-bold" style={{ color: theme.text.primary }}>
                  {formatCurrency(ledger.summary.totalBilled)}
                </div>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: theme.backgrounds.secondary }}>
                <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Total Paid</div>
                <div className="text-sm font-bold text-emerald-600">
                  {formatCurrency(ledger.summary.totalPaid)}
                </div>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: theme.backgrounds.secondary }}>
                <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Outstanding</div>
                <div
                  className="text-sm font-bold"
                  style={{ color: ledger.summary.totalOutstanding > 0 ? "#ef4444" : "#22c55e" }}
                >
                  {formatCurrency(ledger.summary.totalOutstanding)}
                </div>
              </div>
            </div>

            {/* Ledger table */}
            <div className="flex-1 overflow-y-auto overflow-x-auto px-6 pb-6">
              <div className="rounded-xl border overflow-hidden min-w-max" style={{ borderColor: theme.borders.light }}>
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary, minWidth: "130px" }}>Date</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary, minWidth: "110px" }}>Type</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary, minWidth: "180px" }}>Reference</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary, minWidth: "280px" }}>Description</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider text-right" style={{ color: theme.text.secondary, minWidth: "150px" }}>Debit</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider text-right" style={{ color: theme.text.secondary, minWidth: "150px" }}>Credit</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider text-right" style={{ color: theme.text.secondary, minWidth: "150px" }}>Balance</th>
                      <th className="p-3 text-xs font-medium uppercase tracking-wider text-right" style={{ color: theme.text.secondary, minWidth: "120px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.entries.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-6 text-center" style={{ color: theme.text.muted }}>
                          No transactions found.
                        </td>
                      </tr>
                    )}
                    {ledger.entries.map((entry: any, idx: number) => (
                      <tr
                        key={idx}
                        className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                        style={{ borderColor: theme.borders.light }}
                      >
                        <td className="p-3 whitespace-nowrap" style={{ color: theme.text.secondary, minWidth: "110px" }}>
                          {formatDate(entry.date)}
                        </td>
                        <td className="p-3" style={{ minWidth: "90px" }}>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              entry.type === "INVOICE"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {entry.type}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-xs whitespace-nowrap" style={{ color: theme.text.primary, minWidth: "140px" }}>
                          {entry.ref}
                          {entry.paymentState && (
                            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-semibold ${paymentStateBadge(entry.paymentState)}`}>
                              {entry.paymentState}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-xs" style={{ color: theme.text.secondary, minWidth: "200px" }}>
                          {entry.description}
                        </td>
                        <td className="p-3 text-right" style={{ color: entry.debit > 0 ? theme.text.primary : theme.text.muted, minWidth: "110px" }}>
                          {entry.debit > 0 ? formatCurrency(entry.debit) : "—"}
                        </td>
                        <td className="p-3 text-right text-emerald-600" style={{ minWidth: "110px" }}>
                          {entry.credit > 0 ? formatCurrency(entry.credit) : "—"}
                        </td>
                        <td
                          className="p-3 text-right font-semibold"
                          style={{ color: entry.balance > 0 ? "#ef4444" : "#22c55e", minWidth: "110px" }}
                        >
                          {formatCurrency(entry.balance)}
                        </td>
                        <td className="p-3 text-right" style={{ minWidth: "90px" }}>
                          {entry.type === "INVOICE" && entry.orderId && (
                            <a
                              href={entry.description?.startsWith("Part Sale") ? `/part-orders/${entry.orderId}` : `/orders/${entry.orderId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs px-2 py-1 rounded border"
                              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#d1d5db' }}
                            >
                              View Order
                            </a>
                          )}
                          {entry.type === "PAYMENT" && entry.orderId && (
                            <a
                              href={entry.description?.startsWith("Part Sale") ? `/part-orders/${entry.orderId}` : `/orders/${entry.orderId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs px-2 py-1 rounded border"
                              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#d1d5db' }}
                            >
                              View Order
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
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