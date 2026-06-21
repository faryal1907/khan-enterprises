"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { SummaryCard } from "@/components/summary-card";
import { getBranches } from "@/lib/api/inventory";
import {
  downloadReceipt,
  getTransactions,
  type TransactionRecord,
} from "@/lib/api/transactions";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { Branch, PaymentMethod, PaymentStatus, UserRole } from "@/lib/types";

type TransactionFilters = {
  status: string;
  method: string;
  branch: string;
  dateFrom: string;
  dateTo: string;
};

function getStatusColor(status: string) {
  if (status === PaymentStatus.SUCCESS) return "#22c55e";
  if (status === PaymentStatus.FAILED) return "#ef4444";
  if (status === PaymentStatus.CANCELLED) return theme.text.secondary;
  return theme.text.secondary;
}

function getOrderHref(transaction: TransactionRecord) {
  if (!transaction.order?.id) return null;
  return transaction.type === "PART"
    ? `/part-orders/${transaction.order.id}`
    : `/orders/${transaction.order.id}`;
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

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const summary = useMemo(() => {
    const successful = transactions.filter((transaction) => transaction.status === PaymentStatus.SUCCESS);
    return {
      revenue: successful.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0),
      successful: successful.length,
      pending: transactions.filter((transaction) => transaction.status === PaymentStatus.PENDING).length,
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
    const headers = ["Transaction ID", "Order", "Type", "Customer", "Branch", "Amount", "Method", "Status", "Date"];
    const rows = transactions.map((transaction) => [
      transaction.id,
      transaction.order?.orderNumber || "",
      transaction.type,
      transaction.order?.customerName || "",
      transaction.order?.branch?.name || "",
      Number(transaction.amount || 0),
      transaction.method,
      transaction.status,
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
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
              Transactions
            </h1>
            <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
              View payment transactions across bike and part orders.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard label="Total Revenue" value={`PKR ${summary.revenue.toLocaleString()}`} />
          <SummaryCard label="Successful" value={summary.successful} color="#22c55e" />
          <SummaryCard label="Pending" value={summary.pending} color="#f59e0b" />
        </div>

        <div
          className="rounded-lg p-4 mb-6"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                {["Transaction ID", "Order", "Customer", "Branch", "Amount", "Method", "Status", "Date", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    Loading transactions...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    <div className="flex flex-col items-center gap-3">
                      <span>{error}</span>
                      <AsyncButton onClick={fetchTransactions}>Retry</AsyncButton>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    No transactions found
                  </td>
                </tr>
              ) : transactions.map((transaction) => {
                const href = getOrderHref(transaction);
                const statusColor = getStatusColor(transaction.status);

                return (
                  <tr key={`${transaction.type}-${transaction.id}`} style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: theme.text.primary }}>
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {href ? (
                        <Link href={href} className="font-medium hover:opacity-70" style={{ color: theme.accents.primary }}>
                          {transaction.order?.orderNumber}
                        </Link>
                      ) : "-"}
                      <span className="ml-2 text-xs" style={{ color: theme.text.muted }}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {transaction.order?.customerName || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {transaction.order?.branch?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      PKR {Number(transaction.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {transaction.method.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4 text-sm">
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
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3 whitespace-nowrap">
                        <AsyncButton
                          onClick={() => handleDownloadReceipt(transaction)}
                          loading={receiptLoadingId === transaction.id}
                          loadingLabel="Downloading..."
                          style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
                        >
                          Receipt
                        </AsyncButton>
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
