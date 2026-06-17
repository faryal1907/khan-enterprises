"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AsyncButton } from "@/components/async-button";
import { OfferStatusBadge } from "@/components/offer-status-badge";
import { getBranches } from "@/lib/api/inventory";
import { getOffers } from "@/lib/api/offers";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import { Branch, UserRole } from "@/lib/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface Offer {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  offerAmount: number;
  counterAmount: number | null;
  status: string;
  createdAt: string;
  bike: {
    id: string;
    chassisNumber: string;
    model: {
      brand: string;
      modelName: string;
    };
    branch?: {
      id: string;
      name: string;
      city: string;
    };
  };
}

const statusTabs = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "COUNTERED", label: "Countered" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "EXPIRED", label: "Expired" },
  { value: "PAID", label: "Paid" },
];

function formatCurrency(value: number | string | null | undefined) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

function getReservationExpiryLabel(status: string, expiresAt: string | null) {
  if (status !== "ACCEPTED" || !expiresAt) return "-";

  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }

  return `${hours}h ${minutes}m`;
}

function isExpiringSoon(status: string, expiresAt: string | null) {
  if (status !== "ACCEPTED" || !expiresAt) return false;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return diff > 0 && diff < 2 * 60 * 60 * 1000;
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function OffersListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isBranchScoped = !isAdmin && Boolean(user?.branchId);

  const statusTabs = [
    { value: "", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "COUNTERED", label: "Countered" },
    { value: "CONVERTED", label: "Converted" },
    { value: "REJECTED", label: "Rejected" },
  ];

  const [branches, setBranches] = useState<Branch[]>([]);
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    branchId: "",
    search: "",
  });
  const debouncedSearch = useDebouncedValue(filters.search, 500);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [exporting, setExporting] = useState(false);
  const activeTab = filters.status;

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await getOffers({
        status: activeTab === "CONVERTED" ? "ACCEPTED" : activeTab || undefined,
        includeConverted: activeTab === "CONVERTED" ? true : undefined,
        branchId: filters.branchId || undefined,
        search: filters.search || undefined,
        limit: 1000,
      } as any);

      const csvData = response.offers?.map((offer: any) => ({
        Customer: offer.customerName,
        Phone: offer.customerPhone,
        Bike: `${offer.bike.model.brand} ${offer.bike.model.modelName}`,
        Branch: offer.bike.branch ? `${offer.bike.branch.name}, ${offer.bike.branch.city}` : "-",
        Offer: offer.offerAmount,
        Counter: offer.counterAmount || "-",
        Status: offer.status,
      })) || [];

      if (csvData.length === 0) return;

      const headers = Object.keys(csvData[0]).join(",");
      const rows = csvData.map((row: any) => Object.values(row).map(escapeCsv).join(",")).join("\n");
      const csv = `${headers}\n${rows}`;

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "offers.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    getBranches()
      .then((data) => setBranches(data.branches || []))
      .catch(() => setBranches([]));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (isBranchScoped) {
      setFilters((prev) => ({ ...prev, branchId: user.branchId || "" }));
    }
  }, [isBranchScoped, user]);

  const requestFilters = useMemo(() => ({
    status: filters.status || undefined,
    branchId: filters.branchId || undefined,
    search: debouncedSearch || undefined,
    page,
    limit: 20,
  }), [debouncedSearch, filters.branchId, filters.status, page]);

  const fetchOffers = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      setLoading(true);
      const response = await getOffers({
        status: activeTab === "CONVERTED" ? "ACCEPTED" : activeTab || undefined,
        includeConverted: activeTab === "CONVERTED" ? true : undefined,
        page,
        limit: 20,
      });
      setOffers(response.offers || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (fetchError: any) {
      setError(fetchError.response?.data?.message || "Failed to load offers");
      setOffers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [requestFilters, user]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    if (key === "branchId" && isBranchScoped) return;
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          border: "1px solid #F59E0B",
        };
      case "ACCEPTED":
        return {
          backgroundColor: "#D1FAE5",
          color: "#065F46",
          border: "1px solid #10B981",
        };
      case "REJECTED":
        return {
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #EF4444",
        };
      case "COUNTERED":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
          border: "1px solid #3B82F6",
        };
      default:
        return {
          backgroundColor: theme.backgrounds.tertiary,
          color: theme.text.secondary,
          border: `1px solid ${theme.borders.medium}`,
        };
    }
  };


  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
              Offers Inbox
            </h1>
            <p style={{ color: theme.text.secondary }}>
              Manage customer offers and negotiations.
            </p>
          </div>
          <AsyncButton
            onClick={handleExportCSV}
            loading={exporting}
            loadingLabel="Exporting..."
            disabled={loading || offers.length === 0}
          >
            Export CSV
          </AsyncButton>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleFilterChange("status", tab.value)}
              className="px-4 py-2 text-sm font-medium rounded transition-colors"
              style={{
                backgroundColor: filters.status === tab.value ? theme.accents.primary : theme.backgrounds.primary,
                color: filters.status === tab.value ? theme.text.inverse : theme.text.secondary,
                border: filters.status === tab.value ? "none" : `1px solid ${theme.borders.medium}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Branch
              </label>
              <select
                value={filters.branchId}
                onChange={(event) => handleFilterChange("branchId", event.target.value)}
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
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Search
              </label>
              <input
                value={filters.search}
                onChange={(event) => handleFilterChange("search", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                placeholder="Customer, phone, bike, chassis"
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          {loading ? (
            <div className="p-8 text-center" style={{ color: theme.text.secondary }}>
              Loading offers...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="mb-4" style={{ color: theme.accents.secondary }}>{error}</p>
              <AsyncButton onClick={fetchOffers}>Retry</AsyncButton>
            </div>
          ) : offers.length === 0 ? (
            <div className="p-8 text-center" style={{ color: theme.text.secondary }}>
              No offers found
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Customer
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Bike Model
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Offer Amount
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Counter Amount
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr
                    key={offer.id}
                    style={{ borderBottom: `1px solid ${theme.borders.light}`, cursor: "pointer" }}
                    onClick={() => router.push(`/offers/${offer.id}`)}
                    className="hover:opacity-80"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      <div className="font-medium">{offer.customerName}</div>
                      <div className="text-xs" style={{ color: theme.text.secondary }}>{offer.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      <div className="font-medium">{offer.bike.model.brand}</div>
                      <div className="text-xs" style={{ color: theme.text.secondary }}>
                        {offer.bike.model.modelName} - {offer.bike.chassisNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {offer.bike.branch ? `${offer.bike.branch.name}, ${offer.bike.branch.city}` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: theme.text.primary }}>
                      {formatCurrency(offer.offerAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {offer.counterAmount ? formatCurrency(offer.counterAmount) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <OfferStatusBadge status={offer.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.secondary }}>
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && !error && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm rounded disabled:opacity-50"
              style={{ backgroundColor: theme.backgrounds.primary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
            >
              Previous
            </button>
            <span className="text-sm" style={{ color: theme.text.secondary }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 text-sm rounded disabled:opacity-50"
              style={{ backgroundColor: theme.backgrounds.primary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
