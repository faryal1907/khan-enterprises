"use client";

import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { getCustomerStatement } from "@/lib/api/accounting";
import { toast } from "sonner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(amount);

const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });

export function CustomerStatementModal({
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
  const [statement, setStatement] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customerPhone) {
      fetchStatement();
    }
  }, [isOpen, customerPhone]);

  const fetchStatement = async () => {
    setLoading(true);
    try {
      const data = await getCustomerStatement(customerPhone);
      setStatement(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load statement");
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
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col"
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b" style={{ borderColor: theme.borders.light }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>
              Customer Statement
            </h2>
            <p className="text-sm mt-0.5" style={{ color: theme.text.secondary }}>
              {customerName} · {customerPhone}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-8 text-sm" style={{ color: theme.text.secondary }}>
            Loading statement...
          </div>
        ) : statement ? (
          <>
            {/* Meta */}
            <div className="px-6 pt-4 pb-2 flex items-center justify-between">
              <div className="text-xs" style={{ color: theme.text.muted }}>
                Generated: {new Date(statement.generatedAt).toLocaleString("en-PK")}
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 px-6 pb-4">
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: theme.backgrounds.secondary }}>
                <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Total Invoiced</div>
                <div className="text-sm font-bold" style={{ color: theme.text.primary }}>
                  {formatCurrency(statement.summary.totalBilled)}
                </div>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: theme.backgrounds.secondary }}>
                <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Total Paid</div>
                <div className="text-sm font-bold text-emerald-600">
                  {formatCurrency(statement.summary.totalPaid)}
                </div>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: theme.backgrounds.secondary }}>
                <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>Outstanding</div>
                <div
                  className="text-sm font-bold"
                  style={{ color: statement.summary.totalOutstanding > 0 ? "#ef4444" : "#22c55e" }}
                >
                  {formatCurrency(statement.summary.totalOutstanding)}
                </div>
              </div>
            </div>

            {/* Invoices */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              {statement.invoices.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>
                    Invoices
                  </h3>
                  <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.borders.light }}>
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                          <th className="p-3 text-xs font-medium" style={{ color: theme.text.secondary }}>Date</th>
                          <th className="p-3 text-xs font-medium" style={{ color: theme.text.secondary }}>Invoice</th>
                          <th className="p-3 text-xs font-medium text-right" style={{ color: theme.text.secondary }}>Amount</th>
                          <th className="p-3 text-xs font-medium text-right" style={{ color: theme.text.secondary }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statement.invoices.map((inv: any) => (
                          <tr key={inv.ref} className="border-b last:border-0" style={{ borderColor: theme.borders.light }}>
                            <td className="p-3 text-xs whitespace-nowrap" style={{ color: theme.text.secondary }}>
                              {formatDate(inv.date)}
                            </td>
                            <td className="p-3 text-xs font-medium" style={{ color: theme.text.primary }}>
                              {inv.ref}
                            </td>
                            <td className="p-3 text-xs text-right" style={{ color: theme.text.primary }}>
                              {formatCurrency(inv.debit)}
                            </td>
                            <td className="p-3 text-xs text-right">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  inv.paymentState === "PAID"
                                    ? "bg-green-100 text-green-800"
                                    : inv.paymentState === "PARTIAL"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {inv.paymentState}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Payments */}
              {statement.payments.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>
                    Payments
                  </h3>
                  <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.borders.light }}>
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                          <th className="p-3 text-xs font-medium" style={{ color: theme.text.secondary }}>Date</th>
                          <th className="p-3 text-xs font-medium" style={{ color: theme.text.secondary }}>Reference</th>
                          <th className="p-3 text-xs font-medium text-right" style={{ color: theme.text.secondary }}>Amount</th>
                          <th className="p-3 text-xs font-medium" style={{ color: theme.text.secondary }}>Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statement.payments.map((pay: any) => (
                          <tr key={pay.ref} className="border-b last:border-0" style={{ borderColor: theme.borders.light }}>
                            <td className="p-3 text-xs whitespace-nowrap" style={{ color: theme.text.secondary }}>
                              {formatDate(pay.date)}
                            </td>
                            <td className="p-3 text-xs font-medium" style={{ color: theme.text.primary }}>
                              {pay.ref}
                            </td>
                            <td className="p-3 text-xs text-right text-emerald-600">
                              {formatCurrency(pay.credit)}
                            </td>
                            <td className="p-3 text-xs" style={{ color: theme.text.secondary }}>
                              {pay.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
