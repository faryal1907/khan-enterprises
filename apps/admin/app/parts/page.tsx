"use client";
import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import {
  getParts,
  getBranches,
  adjustStock,
} from "@/lib/api/inventory";
import type { Branch, PartInventory } from "@/lib/types";

export default function PartsListPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [filters, setFilters] = useState({
    branch: "",
    category: "",
    search: "",
  });
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Data state
  const [parts, setParts] = useState<PartInventory[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedPart, setSelectedPart] = useState<PartInventory | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [transferFromBranch, setTransferFromBranch] = useState("");
  const [transferToBranch, setTransferToBranch] = useState("");
  const [transferQuantity, setTransferQuantity] = useState("");

  // Set branch filter to user's branch if not admin
  useEffect(() => {
    if (!isAdmin && user?.branchId) {
      setFilters((prev) => ({ ...prev, branch: user.branchId || "" }));
    }
  }, [isAdmin, user?.branchId]);

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
    const fetchParts = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (filters.branch) params.branchId = filters.branch;
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;

        const response = await getParts(params);
        setParts(response.parts);
      } catch (error) {
        console.error("Failed to fetch parts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    // Prevent non-admins from changing branch filter
    if (key === "branch" && !isAdmin) {
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle adjust stock
  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPart || !adjustQuantity || !adjustReason) return;

    try {
      await adjustStock(selectedPart.id, {
        quantity: parseInt(adjustQuantity),
        movementType: adjustReason.toUpperCase(),
        reason: adjustReason,
      });
      alert("Stock adjusted successfully");
      setShowAdjustModal(false);
      setAdjustQuantity("");
      setAdjustReason("");
      setSelectedPart(null);
      // Refetch parts
      const params: any = {};
      if (filters.branch) params.branchId = filters.branch;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      const response = await getParts(params);
      setParts(response.parts);
    } catch (error) {
      console.error("Failed to adjust stock:", error);
      alert("Failed to adjust stock");
    }
  };

  // Handle transfer stock
  const handleTransferStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferFromBranch || !transferToBranch || !transferQuantity) return;

    try {
      // Find source inventory
      const sourceInventory = parts.find(
        (p) => p.branch.id === transferFromBranch && p.part.id === selectedPart?.part.id
      );
      const destInventory = parts.find(
        (p) => p.branch.id === transferToBranch && p.part.id === selectedPart?.part.id
      );

      if (!sourceInventory) {
        alert("Source inventory not found");
        return;
      }

      // Stock out from source
      await adjustStock(sourceInventory.id, {
        quantity: -parseInt(transferQuantity),
        movementType: "STOCK_OUT",
        reason: "Transfer",
      });

      // Stock in to destination
      if (destInventory) {
        await adjustStock(destInventory.id, {
          quantity: parseInt(transferQuantity),
          movementType: "STOCK_IN",
          reason: "Transfer",
        });
      }

      alert("Stock transferred successfully");
      setShowTransferModal(false);
      setTransferFromBranch("");
      setTransferToBranch("");
      setTransferQuantity("");
      setSelectedPart(null);
      // Refetch parts
      const params: any = {};
      if (filters.branch) params.branchId = filters.branch;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      const response = await getParts(params);
      setParts(response.parts);
    } catch (error) {
      console.error("Failed to transfer stock:", error);
      alert("Failed to transfer stock");
    }
  };

  // Open adjust modal
  const openAdjustModal = (part: PartInventory) => {
    setSelectedPart(part);
    setAdjustQuantity("");
    setAdjustReason("");
    setShowAdjustModal(true);
  };

  // Compute summary stats
  const totalParts = parts.length;
  const lowStockItems = parts.filter((p) => p.quantity < p.reorderLevel).length;
  const outOfStockItems = parts.filter((p) => p.quantity === 0).length;
  const totalValue = parts.reduce((sum, p) => sum + (p.part.sellingPrice * p.quantity), 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.text.primary }}
          >
            Parts Inventory
          </h1>
          <a
            href="/parts/new"
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Add New Part
          </a>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Total Parts
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>
              {totalParts}
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Low Stock Items
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.accents.secondary }}>
              {lowStockItems}
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Out of Stock Items
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.accents.primary }}>
              {outOfStockItems}
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Total Inventory Value
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>
              ${totalValue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Branch
              </label>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange("branch", e.target.value)}
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                  opacity: !isAdmin ? 0.6 : 1,
                }}
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {!isAdmin && (
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  Filtered to your branch
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
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
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
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

        {/* Bulk Actions */}
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Transfer Stock
          </button>
          <button
            onClick={() => setShowAdjustModal(true)}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Restock
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Export CSV
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Archive Parts
          </button>
        </div>

        {/* Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <table className="w-full">
            <thead>
              <tr
                style={{ backgroundColor: theme.backgrounds.secondary }}
              >
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Part
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Quantity
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
                      backgroundColor: part.quantity < part.reorderLevel ? "rgba(245, 158, 11, 0.1)" : undefined,
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      <div>
                        <p className="font-medium">{part.part.name}</p>
                        <p className="text-xs" style={{ color: theme.text.secondary }}>
                          SKU: {part.part.sku}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {part.branch.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <span style={{ color: theme.text.primary }}>{part.quantity}</span>
                        {part.quantity < part.reorderLevel && (
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
                        <a
                          href={`/parts/${part.id}`}
                          className="text-sm font-medium transition-colors hover:opacity-70"
                          style={{ color: theme.text.secondary }}
                        >
                          History
                        </a>
                        <button
                          onClick={() => openAdjustModal(part)}
                          className="text-sm font-medium transition-colors hover:opacity-70"
                          style={{ color: theme.accents.primary }}
                        >
                          Adjust
                        </button>
                        <a
                          href={`/parts/${part.id}/edit`}
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

        {/* Adjust Stock Modal */}
        {showAdjustModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="rounded-lg p-6 max-w-md w-full mx-4"
              style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Adjust Stock
              </h3>
              <form onSubmit={handleAdjustStock} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Part
                  </label>
                  <p className="text-sm" style={{ color: theme.text.primary }}>
                    {selectedPart?.part.name} ({selectedPart?.part.sku})
                  </p>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Quantity Change (+/-)
                  </label>
                  <input
                    type="number"
                    value={adjustQuantity}
                    onChange={(e) => setAdjustQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter change"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Reason
                  </label>
                  <select
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">Select reason</option>
                    <option value="restock">Restock</option>
                    <option value="sale">Sale</option>
                    <option value="damage">Damage</option>
                    <option value="adjustment">Adjustment</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdjustModal(false);
                      setAdjustQuantity("");
                      setAdjustReason("");
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
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: theme.accents.primary,
                      color: theme.text.inverse,
                    }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Transfer Stock
              </h3>
              <form onSubmit={handleTransferStock} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Part
                  </label>
                  <p className="text-sm" style={{ color: theme.text.primary }}>
                    {selectedPart?.part.name} ({selectedPart?.part.sku})
                  </p>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    From Branch
                  </label>
                  <select
                    value={transferFromBranch}
                    onChange={(e) => setTransferFromBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">Select branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
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
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
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
                <div className="flex justify-end space-x-3 pt-4">
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
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: theme.accents.primary,
                      color: theme.text.inverse,
                    }}
                  >
                    Transfer
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
