"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { SummaryCard } from "@/components/summary-card";
import { getBranches } from "@/lib/api/inventory";
import { downloadReceipt, getTransactions, type TransactionRecord } from "@/lib/api/transactions";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { Branch, PaymentMethod, PaymentStatus, UserRole } from "@/lib/types";

type TransactionFilters = {
  status: string;
  method: string;
  type: string;
  branch: string;
  dateFrom: string;
  dateTo: string;
};

function getStatusColor(status: string) {
  if (status === PaymentStatus.SUCCESS) return "#22c55e";
  if (status === PaymentStatus.FAILED) return "#ef4444";
  if (status === PaymentStatus.CANCELLED) return theme.text.secondary;
  if (status === "REVERSED") return "#8b5cf6";
  return theme.text.secondary;
}

function getOrderHref(transaction: TransactionRecord) {
  if (!transaction.order?.id) return null;
  return transaction.type === "PART"
    ? `/part-orders/${transaction.order.id}`
    : `/orders/${transaction.order.id}`;
}

function getTypeLabel(type: string) {
  switch (type) {
    case "BIKE": return "Bike Sale";
    case "PART": return "Part Sale";
    case "PAYABLE": return "Payable Payment";
    case "RECEIVABLE": return "Receivable Collection";
    case "VENDOR_PAYMENT": return "Vendor Payment";
    default: return type;
  }
}

function getTypeBadgeStyle(type: string) {
  switch (type) {
    case "BIKE": return { backgroundColor: `${theme.accents.primary}20`, color: theme.accents.primary, border: `1px solid ${theme.accents.primary}40` };
    case "PART": return { backgroundColor: "#8b5cf620", color: "#8b5cf6", border: "1px solid #8b5cf640" };
    case "PAYABLE": return { backgroundColor: "#f59e0b20", color: "#f59e0b", border: "1px solid #f59e0b40" };
    case "RECEIVABLE": return { backgroundColor: "#22c55e20", color: "#22c55e", border: "1px solid #22c55e40" };
    case "VENDOR_PAYMENT": return { backgroundColor: "#ec489920", color: "#ec4899", border: "1px solid #ec489940" };
    default: return { backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary };
  }
}

/** The "party / counterpart" name for a transaction row */
function getCounterparty(transaction: TransactionRecord): string {
  if (transaction.order?.customerName) return transaction.order.customerName;
  if (transaction.party?.name) return transaction.party.name;
  return "—";
}

/** The reference / description shown in the "Order" column */
function getRef(transaction: TransactionRecord): string | null {
  if (transaction.order?.orderNumber) return transaction.order.orderNumber;
  if (transaction.party?.ref) return transaction.party.ref;
  if (transaction.party?.description) return transaction.party.description;
  return null;
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function TransactionsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isBranchScoped = !isAdmin && Boolean(user?.branchId);

  const [filters, setFilters] = useState<TransactionFilters>({
    status: "",
    method: "",
    type: "",
    branch: "",
    dateFrom: "",
    dateTo: "",
  });
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);
  const [receiptLoadingId, setReceiptLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    getBranches()
      .then((data) => setBranches(data.branches || []))
      .catch(() => setBranches([]));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (isBranchScoped) {
      setFilters((prev) => ({ ...prev, branch: user.branchId || "" }));
    }
  }, [isBranchScoped, user]);

  const requestFilters = useMemo(() => ({
    status: filters.status || undefined,
    method: filters.method || undefined,
    branchId: filters.branch || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  }), [filters]);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const response = await getTransactions(requestFilters);
      setTransactions(response.transactions || []);
    } catch (fetchError: any) {
      setError(fetchError.response?.data?.message || "Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [requestFilters, user]);

  // Apply client-side type filter
  const visibleTransactions = useMemo(() => {
    if (!filters.type) return transactions;
    return transactions.filter((t) => t.type === filters.type);
  }, [transactions, filters.type]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const summary = useMemo(() => {
    const successful = transactions.filter((transaction) =>
      transaction.status === PaymentStatus.SUCCESS || transaction.status === "SUCCESS"
    );
    const payablePayments = successful.filter((t) => t.type === "PAYABLE");
    const receivableCollections = successful.filter((t) => t.type === "RECEIVABLE");
    const vendorPayments = successful.filter((t) => t.type === "VENDOR_PAYMENT");
    const orderRevenue = successful
      .filter((t) => t.type === "BIKE" || t.type === "PART")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return {
      revenue: orderRevenue,
      successful: successful.length,
      pending: transactions.filter((t) => t.status === PaymentStatus.PENDING).length,
      payablePayments: payablePayments.length,
      receivableCollections: receivableCollections.length,
      vendorPayments: vendorPayments.length,
    };
  }, [transactions]);

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    if (key === "branch" && isBranchScoped) return;
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownloadReceipt = async (transaction: TransactionRecord) => {
    setReceiptLoadingId(transaction.id);
    try {
      await downloadReceipt(transaction.id);
      toast.success("Receipt downloaded successfully");
    } catch (downloadError: any) {
      toast.error(downloadError.response?.data?.message || "Failed to download receipt");
    } finally {
      setReceiptLoadingId(null);
    }
  };



  const handleExportCSV = () => {
    const headers = ["Transaction ID", "Ref / Description", "Type", "Counterparty", "Branch", "Amount", "Method", "Status", "Processed By", "Date"];
    const rows = transactions.map((transaction) => [
      transaction.id,
      transaction.order?.orderNumber || transaction.party?.ref || transaction.party?.description || "",
      getTypeLabel(transaction.type),
      getCounterparty(transaction),
      transaction.order?.branch?.name || "",
      Number(transaction.amount || 0),
      transaction.method,
      transaction.status,
      transaction.processedBy?.fullName || "",
      new Date(transaction.createdAt).toLocaleString(),
    ]);

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 py-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.text.primary }}>
              Transactions
            </h1>
            <p className="mt-1 text-sm md:text-base" style={{ color: theme.text.secondary }}>
              View payment transactions.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-center"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6">
          <SummaryCard label="Order Revenue" value={`PKR ${summary.revenue.toLocaleString()}`} />
          <SummaryCard label="Successful" value={summary.successful} color="#22c55e" />
          <SummaryCard label="Payable Payments" value={summary.payablePayments} color="#f59e0b" />
          <SummaryCard label="Receivable Collections" value={summary.receivableCollections} color="#3b82f6" />
          <SummaryCard label="Vendor Payments" value={summary.vendorPayments} color="#ec4899" />
        </div>

        <div
          className="rounded-lg p-4 md:p-5 mb-4 md:mb-6"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Type
              </label>
              <select
                value={filters.type}
                onChange={(event) => handleFilterChange("type", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Types</option>
                <option value="BIKE">Bike Sale</option>
                <option value="PART">Part Sale</option>
                <option value="PAYABLE">Payable Payment</option>
                <option value="RECEIVABLE">Receivable Collection</option>
                <option value="VENDOR_PAYMENT">Vendor Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(event) => handleFilterChange("status", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Statuses</option>
                <option value={PaymentStatus.SUCCESS}>Success</option>
                <option value={PaymentStatus.PENDING}>Pending</option>
                <option value={PaymentStatus.FAILED}>Failed</option>
                <option value={PaymentStatus.CANCELLED}>Cancelled</option>
                <option value="REVERSED">Reversed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Method
              </label>
              <select
                value={filters.method}
                onChange={(event) => handleFilterChange("method", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Methods</option>
                <option value={PaymentMethod.ONLINE_TRANSFER}>Online Transfer</option>
                <option value={PaymentMethod.CASH}>Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Branch
              </label>
              <select
                value={filters.branch}
                onChange={(event) => handleFilterChange("branch", event.target.value)}
                disabled={isBranchScoped}
                className="w-full px-3 py-2 rounded text-sm disabled:opacity-60"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
              {!isAdmin && (
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  {isBranchScoped ? "Filtered to your assigned branch" : "No branch assigned, global transactions view"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(event) => handleFilterChange("dateFrom", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(event) => handleFilterChange("dateTo", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-lg overflow-x-auto"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                {["Transaction ID", "Ref / Description", "Type", "Counterparty", "Branch", "Amount", "Method", "Status", "Processed By", "Date", "Actions"].map((header) => (
                  <th key={header} className="px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-3 md:px-6 py-6 md:py-12 text-center text-sm md:text-base" style={{ color: theme.text.secondary }}>
                    Loading transactions...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={11} className="px-3 md:px-6 py-6 md:py-12 text-center text-sm md:text-base" style={{ color: theme.text.secondary }}>
                    <div className="flex flex-col items-center gap-3">
                      <span>{error}</span>
                      <AsyncButton onClick={fetchTransactions}>Retry</AsyncButton>
                    </div>
                  </td>
                </tr>
              ) : visibleTransactions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-3 md:px-6 py-6 md:py-12 text-center text-sm md:text-base" style={{ color: theme.text.secondary }}>
                    No transactions found
                  </td>
                </tr>
              ) : visibleTransactions.map((transaction) => {
                const href = getOrderHref(transaction);
                const statusColor = getStatusColor(transaction.status);
                const ref = getRef(transaction);
                const counterparty = getCounterparty(transaction);
                const branchName = transaction.order?.branch?.name ?? "—";

                return (
                  <tr
                    key={`${transaction.type}-${transaction.id}`}
                    style={{
                      borderBottom: `1px solid ${theme.borders.light}`,
                      opacity: transaction.isReversed ? 0.6 : 1,
                    }}
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm font-medium" style={{ color: theme.text.primary }}>
                      <span className="font-mono text-xs">{transaction.id.substring(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>
                      {href ? (
                        <Link href={href} className="font-medium hover:opacity-70" style={{ color: theme.accents.primary }}>
                          {ref}
                        </Link>
                      ) : ref ? (
                        <span className="font-medium">{ref}</span>
                      ) : "—"}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded whitespace-nowrap"
                        style={getTypeBadgeStyle(transaction.type)}
                      >
                        {getTypeLabel(transaction.type)}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>
                      {counterparty}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>
                      {branchName}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>
                      PKR {Number(transaction.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>
                      {transaction.method.replace(/_/g, " ")}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded"
                        style={{
                          backgroundColor: `${statusColor}20`,
                          color: statusColor,
                          border: `1px solid ${statusColor}`,
                        }}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>
                      {transaction.processedBy?.fullName || "—"}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm">
                      <div className="flex gap-2 md:gap-3 whitespace-nowrap">
                        {(transaction.type === "BIKE" || transaction.type === "PART") && transaction.status === PaymentStatus.SUCCESS && (
                          <AsyncButton
                            onClick={() => handleDownloadReceipt(transaction)}
                            loading={receiptLoadingId === transaction.id}
                            loadingLabel="Downloading..."
                            style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
                          >
                            Receipt
                          </AsyncButton>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
