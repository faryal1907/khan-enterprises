"use client";

import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { getPartyLedger, RECEIVABLE_PARTY_TYPE_LABELS, ReceivablePartyType } from "@/lib/api/accounting";
import { toast } from "sonner";

const fmt = (n: number) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(n);
const fmtDate = (d: string | Date) => new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
const stateBadge = (s: string) => s === "PAID" ? "bg-green-100 text-green-800"
  : s === "PARTIAL" ? "bg-orange-100 text-orange-800"
  : s === "OVERDUE" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800";

export function PartyLedgerModal({ isOpen, onClose, partyId, partyName, partyType }: {
  isOpen: boolean; onClose: () => void;
  partyId: string; partyName: string; partyType?: string;
}) {
  const [ledger, setLedger] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && partyId) {
      setLoading(true);
      getPartyLedger(partyId)
        .then(setLedger)
        .catch((err: any) => { toast.error(err.response?.data?.message || "Failed to load ledger"); onClose(); })
        .finally(() => setLoading(false));
    }
  }, [isOpen, partyId]);

  if (!isOpen) return null;

  const typeLabel = partyType ? (RECEIVABLE_PARTY_TYPE_LABELS[partyType as ReceivablePartyType] ?? partyType) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => { if (e.currentTarget === e.target) onClose(); }}>
      <div className="rounded-xl shadow-xl w-full max-w-7xl flex flex-col"
        style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}`, maxHeight: "90vh" }}>

        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b" style={{ borderColor: theme.borders.light }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>Party Ledger</h2>
            <p className="text-sm mt-0.5 flex items-center gap-2" style={{ color: theme.text.secondary }}>
              {partyName}
              {typeLabel && (
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${theme.accents.primary}15`, color: theme.accents.primary }}>
                  {typeLabel}
                </span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-8 text-sm" style={{ color: theme.text.secondary }}>Loading ledger...</div>
        ) : ledger ? (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 p-6 pb-4">
              {[
                { label: "Total Billed", value: ledger.summary.totalBilled, color: theme.text.primary },
                { label: "Total Collected", value: ledger.summary.totalPaid, color: "#22c55e" },
                { label: "Outstanding", value: ledger.summary.totalOutstanding, color: ledger.summary.totalOutstanding > 0 ? "#ef4444" : "#22c55e" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-lg p-3 text-center" style={{ backgroundColor: theme.backgrounds.secondary }}>
                  <div className="text-xs mb-1" style={{ color: theme.text.secondary }}>{label}</div>
                  <div className="text-sm font-bold" style={{ color }}>{fmt(value)}</div>
                </div>
              ))}
            </div>

            {/* Ledger table */}
            <div className="flex-1 overflow-y-auto overflow-x-auto px-6 pb-6">
              <div className="rounded-xl border overflow-hidden min-w-max" style={{ borderColor: theme.borders.light }}>
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                      {["Date", "Type", "Reference", "Description", "Debit", "Credit", "Balance", "Actions"].map((h) => (
                        <th key={h} className="p-3 text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary, minWidth: h === "Description" ? "260px" : "130px" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.entries.length === 0 && (
                      <tr><td colSpan={8} className="p-6 text-center" style={{ color: theme.text.muted }}>No transactions found.</td></tr>
                    )}
                    {ledger.entries.map((entry: any, idx: number) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: theme.borders.light }}>
                        <td className="p-3 whitespace-nowrap text-xs" style={{ color: theme.text.secondary }}>{fmtDate(entry.date)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${entry.type === "INVOICE" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}>
                            {entry.type === "INVOICE" ? "Receivable" : "Collection"}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-xs whitespace-nowrap" style={{ color: theme.text.primary }}>
                          {entry.ref}
                          {entry.paymentState && (
                            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-semibold ${stateBadge(entry.paymentState)}`}>
                              {entry.paymentState}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-xs" style={{ color: theme.text.secondary }}>{entry.description}</td>
                        <td className="p-3 text-right" style={{ color: entry.debit > 0 ? theme.text.primary : theme.text.muted }}>
                          {entry.debit > 0 ? fmt(entry.debit) : "—"}
                        </td>
                        <td className="p-3 text-right text-emerald-600">
                          {entry.credit > 0 ? fmt(entry.credit) : "—"}
                        </td>
                        <td className="p-3 text-right font-semibold" style={{ color: entry.balance > 0 ? "#ef4444" : "#22c55e" }}>
                          {fmt(Math.max(0, entry.balance))}
                        </td>
                        <td className="p-3 text-right">
                          {entry.type === "INVOICE" && entry.orderId && (
                            <a href={entry.description?.startsWith("Part Sale") ? `/part-orders/${entry.orderId}` : `/orders/${entry.orderId}`}
                              target="_blank" rel="noreferrer"
                              className="text-xs px-2 py-1 rounded border"
                              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || "#d1d5db" }}>
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
