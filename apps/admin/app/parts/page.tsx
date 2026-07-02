"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import {
  getParts,
  getBranches,
  getLowStockItems,
  transferPart,
} from "@/lib/api/inventory";
import type { Branch, PartInventory } from "@/lib/types";
import { SummaryCard } from "@/components/summary-card";

export default function PartsListPage() {
  const searchParams = useSearchParams();
  const lowStockOnly = searchParams.get("lowStock") === "true";
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;
  const canManage = isAdmin || isManager;
  const isGlobal = isAdmin || !user?.branchId;

  const [filters, setFilters] = useState({
    branch: "",
    category: "",
    search: "",
  });
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Data state
  const [parts, setParts] = useState<PartInventory[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedPart, setSelectedPart] = useState<PartInventory | null>(null);
  const [transferFromBranch, setTransferFromBranch] = useState("");
  const [transferToBranch, setTransferToBranch] = useState("");
  const [transferQuantity, setTransferQuantity] = useState("");

  const [isTransferring, setIsTransferring] = useState(false);

  const effectiveBranch = !isGlobal && user?.branchId ? user.branchId : filters.branch;

  // Fetch branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranches();
        setBranches(response.branches);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };
    fetchBranches();
  }, []);

  // Fetch parts on mount and filter change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (effectiveBranch) params.branchId = effectiveBranch;
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;

        const [partsResponse, lowStockResponse] = await Promise.all([
          getParts(params),
          getLowStockItems(effectiveBranch),
        ]);

        setParts(lowStockOnly ? lowStockResponse.items : partsResponse.parts);
        setLowStockCount(lowStockResponse.count);
      } catch (error) {
        console.error("Failed to fetch parts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [effectiveBranch, filters.category, filters.search, lowStockOnly]);

  const handleFilterChange = (key: string, value: string) => {
    if (key === "branch" && !isGlobal) return;
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const refetchParts = async () => {
    const params: Record<string, string> = {};
    if (effectiveBranch) params.branchId = effectiveBranch;
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    const response = await getParts(params);
    setParts(response.parts);
  };

  // Handle transfer stock
  const handleTransferStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferFromBranch || !transferToBranch || !transferQuantity) return;
    if (!selectedPart) return;

    if (transferFromBranch === transferToBranch) {
      toast.error("Source and destination branches must be different");
      return;
    }

    setIsTransferring(true);
    try {
      await transferPart({
        partId: selectedPart.part.id,
        fromBranchId: transferFromBranch,
        toBranchId: transferToBranch,
        quantity: parseInt(transferQuantity),
      });

      toast.success("Stock transferred successfully");
      setShowTransferModal(false);
      setTransferFromBranch("");
      setTransferToBranch("");
      setTransferQuantity("");
      setSelectedPart(null);
      await refetchParts();
    } catch (error) {
      console.error("Failed to transfer stock:", error);
      toast.error(error instanceof Error ? error.message : "Failed to transfer stock");
    } finally {
      setIsTransferring(false);
    }
  };

  // Open transfer modal
  const openTransferModal = (part: PartInventory) => {
    setSelectedPart(part);
    setTransferFromBranch(part.branch.id);
    setTransferToBranch("");
    setTransferQuantity("");
    setShowTransferModal(true);
  };

  // Compute summary stats
  const totalParts = parts.length;
  const lowStockItems = lowStockCount;
  const outOfStockItems = parts.filter((p) => p.quantity - p.reservedQuantity === 0).length;

  return (
    <div className="px-4 py-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Low Stock Alert Banner */}
        {lowStockItems > 0 && (
          <div
            className="rounded-lg p-3 md:p-4 mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              border: `1px solid ${theme.accents.secondary}`,
            }}
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: theme.accents.secondary }}
              ></div>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {lowStockItems} item{lowStockItems !== 1 ? "s" : ""} below reorder level
              </p>
            </div>
            <a
              href="#parts-table"
              className="text-sm font-medium transition-colors hover:opacity-70 self-start sm:self-auto"
              style={{ color: theme.accents.secondary }}
            >
              View Details
            </a>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.text.primary }}>
            Parts Inventory
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <SummaryCard label="Total Parts" value={totalParts} />
          <SummaryCard label="Low Stock Items" value={lowStockItems} color={theme.accents.secondary} />
          <SummaryCard label="Out of Stock Items" value={outOfStockItems} color={theme.accents.primary} />
        </div>

        {/* Filters */}
        <div
          className="rounded-lg p-4 md:p-5 mb-4 md:mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Branch
              </label>
              <select
                value={effectiveBranch}
                onChange={(e) => handleFilterChange("branch", e.target.value)}
                disabled={!isGlobal}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                  opacity: !isGlobal ? 0.6 : 1,
                }}
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {!isGlobal && (
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  Filtered to your branch
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Categories</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="MECHANICAL">Mechanical</option>
                <option value="ACCESSORIES">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                placeholder="Search by part name or SKU"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          id="parts-table"
          className="rounded-lg overflow-x-auto"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <table className="w-full min-w-[640px]">
            <thead>
              <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Part
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Available Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Reorder Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.accents.primary }}></div>
                    </div>
                  </td>
                </tr>
              ) : parts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-sm" style={{ color: theme.text.secondary }}>
                      No parts found
                    </p>
                  </td>
                </tr>
              ) : (
                parts.map((part) => (
                  <tr
                    key={part.id}
                    style={{
                      borderBottom: `1px solid ${theme.borders.light}`,
                      backgroundColor:
                        part.quantity - part.reservedQuantity < part.reorderLevel
                          ? "rgba(245, 158, 11, 0.1)"
                          : undefined,
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/parts/${part.part.id}`} className="block group">
                        <p className="font-medium group-hover:underline transition-all" style={{ color: theme.accents.primary }}>
                          {part.part.name}
                        </p>
                        <p className="text-xs group-hover:underline transition-all" style={{ color: theme.text.secondary }}>
                          SKU: {part.part.sku}
                        </p>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {part.branch.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <span style={{ color: theme.text.primary }}>{part.quantity - part.reservedQuantity}</span>
                        {part.reservedQuantity > 0 && (
                          <span
                            className="px-2 py-1 text-xs font-medium rounded"
                            style={{
                              backgroundColor: theme.backgrounds.tertiary,
                              color: theme.text.secondary,
                              border: `1px solid ${theme.borders.medium}`,
                            }}
                            title={`${part.reservedQuantity} reserved`}
                          >
                            {part.reservedQuantity} reserved
                          </span>
                        )}
                        {part.quantity - part.reservedQuantity < part.reorderLevel && (
                          <span
                            className="px-2 py-1 text-xs font-medium rounded"
                            style={{
                              backgroundColor: theme.accents.secondary,
                              color: theme.text.inverse,
                            }}
                          >
                            Low Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {part.reorderLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {new Date(part.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {canManage && (
                          <button
                            onClick={() => openTransferModal(part)}
                            className="text-sm font-medium transition-colors hover:opacity-70"
                            style={{ color: theme.accents.secondary }}
                          >
                            Transfer
                          </button>
                        )}
                        <a
                          href={`/parts/${part.part.id}/edit`}
                          className="text-sm font-medium transition-colors hover:opacity-70"
                          style={{ color: theme.text.secondary }}
                        >
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Transfer Stock Modal */}
        {showTransferModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="rounded-lg p-6 max-w-md w-full mx-4"
              style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
                Transfer Stock
              </h3>
              <form onSubmit={handleTransferStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    Part
                  </label>
                  <p className="text-sm" style={{ color: theme.text.primary }}>
                    {selectedPart?.part.name} ({selectedPart?.part.sku})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    From Branch
                  </label>
                  <select
                    value={transferFromBranch}
                    disabled
                    className="w-full px-3 py-2 rounded text-sm opacity-70 cursor-not-allowed"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    To Branch
                  </label>
                  <select
                    value={transferToBranch}
                    onChange={(e) => setTransferToBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">Select branch</option>
                    {branches
                      .filter((b) => b.id !== transferFromBranch)
                      .map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={transferQuantity}
                    onChange={(e) => setTransferQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTransferModal(false);
                      setTransferFromBranch("");
                      setTransferToBranch("");
                      setTransferQuantity("");
                      setSelectedPart(null);
                    }}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      color: theme.text.secondary,
                      border: `1px solid ${theme.borders.medium}`,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTransferring}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: theme.accents.primary,
                      color: theme.text.inverse,
                    }}
                  >
                    {isTransferring ? "Transferring..." : "Transfer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
