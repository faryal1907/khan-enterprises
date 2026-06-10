"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";

type Transaction = {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  createdAt: string;
  order: {
    id: string;
    customer: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
    };
  };
};

export default function TransactionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [filters, setFilters] = useState({
    status: "",
    gateway: "",
    branch: "",
    dateFrom: "",
    dateTo: "",
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Role check: Admin only
  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      router.push("/");
    }
  }, [user, router]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");
        setTransactions(res.data.transactions || []);
      } catch (err) {
        setError("Failed to load transactions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleRefund = async (transactionId: string) => {
    if (!confirm("Are you sure you want to initiate a refund for this transaction?")) {
      return;
    }

    try {
      await api.post(`/transactions/${transactionId}/refund`);
      toast.success("Refund initiated successfully");
      setTransactions(transactions.map((t) => t.id === transactionId ? { ...t, status: "REFUNDED" } : t));
    } catch (err) {
      console.error("Failed to initiate refund:", err);
      toast.error("Failed to initiate refund");
    }
  };

  const handleDownloadReceipt = async (transactionId: string) => {
    try {
      const res = await api.get(`/transactions/${transactionId}/receipt`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Receipt downloaded successfully");
    } catch (err) {
      console.error("Failed to download receipt:", err);
      toast.error("Failed to download receipt");
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: theme.text.primary }}
            >
              Transactions
            </h1>

            <p
              className="mt-1 text-sm"
              style={{ color: theme.text.secondary }}
            >
              View and manage all payment transactions.
            </p>
          </div>

        
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Revenue", value: `PKR ${transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}` },
            { label: "Successful", value: transactions.filter((t) => t.status === "SUCCESS").length.toString() },
            { label: "Pending", value: transactions.filter((t) => t.status === "PENDING").length.toString() },
            { label: "Refunded", value: transactions.filter((t) => t.status === "REFUNDED").length.toString() },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-lg p-4"
              style={{
                backgroundColor: theme.backgrounds.primary,
                border: `1px solid ${theme.borders.light}`,
              }}
            >
              <p
                className="text-sm"
                style={{ color: theme.text.secondary }}
              >
                {card.label}
              </p>

              <p
                className="text-2xl font-bold mt-2"
                style={{ color: theme.text.primary }}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div
          className="rounded-lg p-4 mb-6"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Status
              </label>

              <select
                value={filters.status}
                onChange={(e) =>
                  handleFilterChange("status", e.target.value)
                }
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Gateway
              </label>

              <select
                value={filters.gateway}
                onChange={(e) =>
                  handleFilterChange("gateway", e.target.value)
                }
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Gateways</option>
                <option value="SAFEPAY">Safepay (Visa/Mastercard)</option>
                <option value="JAZZCASH">JazzCash (Mobile Wallet)</option>
                <option value="RAAST">Raast (Instant Bank Transfer)</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CASH">Cash</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Branch
              </label>

              <select
                value={filters.branch}
                onChange={(e) =>
                  handleFilterChange("branch", e.target.value)
                }
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Branches</option>
                <option value="ISB">Islamabad HQ</option>
                <option value="TRD">Tordher Branch</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                From
              </label>

              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  handleFilterChange("dateFrom", e.target.value)
                }
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                To
              </label>

              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  handleFilterChange("dateTo", e.target.value)
                }
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

        {/* Transactions Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <table className="w-full">
            <thead>
              <tr
                style={{ backgroundColor: theme.backgrounds.secondary }}
              >
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Gateway
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    {error}
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    style={{
                      borderBottom: `1px solid ${theme.borders.light}`,
                    }}
                  >
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: theme.text.primary }}>
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {transaction.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {transaction.order?.customer?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      PKR {transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {transaction.gateway}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded"
                        style={{
                          backgroundColor:
                            transaction.status === "SUCCESS"
                              ? theme.accents.tertiary + "20"
                              : transaction.status === "FAILED"
                              ? theme.accents.secondary + "20"
                              : theme.backgrounds.tertiary,
                          color:
                            transaction.status === "SUCCESS"
                              ? theme.accents.tertiary
                              : transaction.status === "FAILED"
                              ? theme.accents.secondary
                              : theme.text.secondary,
                        }}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadReceipt(transaction.id)}
                          className="font-medium hover:opacity-70"
                          style={{ color: theme.accents.primary }}
                        >
                          Download Receipt
                        </button>
                        {transaction.status === "SUCCESS" && (
                          <button
                            onClick={() => handleRefund(transaction.id)}
                            className="font-medium hover:opacity-70 ml-4"
                            style={{ color: theme.accents.secondary }}
                          >
                            Initiate Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}