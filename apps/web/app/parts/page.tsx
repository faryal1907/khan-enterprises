"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";

export default function PartsPage() {
  const [parts, setParts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    branchId: "",
  });

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;
        if (filters.branchId) params.branchId = filters.branchId;

        const response = await api.get("/catalog/parts", { params });
        setParts(response.data);
      } catch (error) {
        console.error("Failed to fetch parts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, [filters]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get("/catalog/branches");
        setBranches(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        setBranches([]);
      }
    };
    fetchBranches();
  }, []);

  // Get best branch info for a part (first in-stock inventory)
  const getBranchInfo = (part: any) => {
    if (!part.inventories || part.inventories.length === 0) return null;
    const sorted = [...part.inventories].sort((a: any, b: any) => b.quantity - a.quantity);
    return sorted[0];
  };

  // Get total stock across all branches
  const getTotalStock = (part: any) => {
    if (!part.inventories || part.inventories.length === 0) return 0;
    return part.inventories.reduce((sum: number, inv: any) => sum + (inv.quantity || 0), 0);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-12">
          <h1
            className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-4"
            style={{ color: theme.text.primary }}
          >
            Parts & Accessories
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: theme.text.secondary }}>
            Browse parts, their specs, and order from your nearest branch!
          </p><p className="text-xs sm:text-sm" style={{ color: theme.text.secondary }}>
            For onsite pickup, browse branch-wise inventory and visit our showroom!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-8">
          {/* Mobile Filter Dropdown */}
          <div className="mb-4 sm:hidden">
            <details className="rounded-xl" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
              <summary className="p-4 cursor-pointer text-sm font-medium" style={{ color: theme.text.primary }}>
                Show Filters
              </summary>
              <div className="p-4 border-t" style={{ borderColor: theme.borders.light }}>
                <div className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>
                      Search
                    </label>
                    <input
                      type="text"
                      placeholder="Search parts..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                      style={{
                        backgroundColor: theme.backgrounds.tertiary,
                        border: `1px solid ${theme.borders.medium}`,
                        color: theme.text.primary,
                      }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                      style={{
                        backgroundColor: theme.backgrounds.tertiary,
                        border: `1px solid ${theme.borders.medium}`,
                        color: theme.text.primary,
                      }}
                    >
                      <option value="">All Categories</option>
                      <option value="Engine">Engine</option>
                      <option value="Brakes">Brakes</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Body">Body</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  {/* Branch Filter */}
                  <div style={{
                    backgroundColor: theme.accents.primary + '10',
                    borderRadius: '10px',
                    padding: '10px',
                    border: `1.5px solid ${theme.accents.primary}30`,
                  }}>
                    <label className="block text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: theme.accents.primary }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Branch
                    </label>
                    <select
                      value={filters.branchId}
                      onChange={(e) => setFilters({ ...filters, branchId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                      style={{
                        backgroundColor: theme.backgrounds.tertiary,
                        border: `1px solid ${theme.borders.medium}`,
                        color: theme.text.primary,
                      }}
                    >
                      <option value="">All Branches</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} — {branch.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setFilters({ category: "", search: "", branchId: "" })}
                    className="w-full px-4 py-2 text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: theme.accents.secondary,
                      color: theme.text.inverse,
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </details>
          </div>

          {/* Filter Sidebar */}
          <aside className="hidden sm:block w-64 flex-shrink-0">
            <div
              className="rounded-xl p-6 sticky top-24"
              style={{
                backgroundColor: theme.backgrounds.secondary,
                border: `1px solid ${theme.borders.light}`,
              }}
            >
              <h2
                className="text-lg font-semibold mb-6"
                style={{ color: theme.text.primary }}
              >
                Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.text.secondary }}
                >
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search parts..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.text.secondary }}
                >
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="Engine">Engine</option>
                  <option value="Brakes">Brakes</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Body">Body</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              {/* Branch Filter */}
              <div className="mb-6" style={{
                backgroundColor: theme.accents.primary + '10',
                borderRadius: '10px',
                padding: '14px',
                border: `1.5px solid ${theme.accents.primary}30`,
              }}>
                <label
                  className="block text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: theme.accents.primary }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Branch 
                </label>
                <select
                  value={filters.branchId}
                  onChange={(e) =>
                    setFilters({ ...filters, branchId: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                    fontWeight: 500,
                  }}
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} — {branch.city}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setFilters({ category: "", search: "", branchId: "" })}
                className="w-full px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: theme.text.inverse,
                }}
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Parts Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12 sm:py-20">
                <div
                  className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2"
                  style={{ borderColor: theme.accents.primary }}
                />
              </div>
            ) : parts.length === 0 ? (
              <div
                className="rounded-xl p-6 sm:p-12 text-center"
                style={{
                  backgroundColor: theme.backgrounds.secondary,
                  border: `1px solid ${theme.borders.light}`,
                }}
              >
                <p className="text-xs sm:text-sm" style={{ color: theme.text.secondary }}>
                  No parts found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {parts.map((part) => {
                  const topBranch = getBranchInfo(part);
                  const totalStock = getTotalStock(part);
                  return (
                    <Link
                      key={part.id}
                      href={`/parts/${part.id}`}
                      className="rounded-xl p-4 sm:p-6 block hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: theme.backgrounds.secondary,
                        border: `1px solid ${theme.borders.light}`,
                      }}
                    >
                      <h3
                        className="text-base sm:text-lg font-semibold mb-1 sm:mb-2"
                        style={{ color: theme.text.primary }}
                      >
                        {part.name}
                      </h3>
                      <p className="text-xs sm:text-sm mb-1 sm:mb-2" style={{ color: theme.text.secondary }}>
                        SKU: {part.sku}
                      </p>
                      <p className="text-xs mb-2 sm:mb-4" style={{ color: theme.text.muted }}>
                        {part.category}
                      </p>

                      {/* Branch Info */}
                      {part.inventories && part.inventories.length > 0 && (
                        <div className="mb-2 sm:mb-4 space-y-1">
                          {part.inventories.slice(0, 2).map((inv: any) => {
                            const availableQuantity = inv.quantity - inv.reservedQuantity;
                            return (
                              <div
                                key={inv.id}
                                className="flex items-center justify-between text-[10px] sm:text-xs rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5"
                                style={{
                                  backgroundColor: theme.backgrounds.tertiary,
                                  color: theme.text.secondary,
                                }}
                              >
                                <span className="flex items-center gap-1">
                                  <svg width="10" height="10" className="sm:w-[12px] sm:h-[12px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                  </svg>
                                  {inv.branch?.name} 
                                </span>
                                <span style={{
                                  color: availableQuantity > 10 ? '#22c55e' : availableQuantity > 0 ? '#f59e0b' : '#ef4444',
                                  fontWeight: 600,
                                }}>
                                  {availableQuantity} pcs
                                </span>
                              </div>
                            );
                          })}
                          {part.inventories.length > 2 && (
                            <p className="text-[10px] sm:text-xs text-center" style={{ color: theme.text.muted }}>
                              +{part.inventories.length - 2} more branches
                            </p>
                          )}
                        </div>
                      )}

                      {!part.inventories || part.inventories.length === 0 ? (
                        <div className="text-[10px] sm:text-xs mb-2 sm:mb-4 p-1.5 sm:p-2 rounded-lg text-center" style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.muted }}>
                          No branch inventory data available
                        </div>
                      ) : null}

                      <div className="flex flex-col">
                        {(() => {
                          const base = part.sellingPrice;
                          const globalDiscount = part.globalDiscountPercent ? Number(part.globalDiscountPercent) : 0;
                          const maxIndividualDiscount = part.inventories?.reduce((max: number, inv: any) => {
                            const d = inv.onlineDiscountPercent ? Number(inv.onlineDiscountPercent) : 0;
                            return d > max ? d : max;
                          }, 0) || 0;
                          const effectiveDiscountPercent = globalDiscount + maxIndividualDiscount;
                          const onlinePrice = base * (1 - effectiveDiscountPercent / 100);

                          return (
                            <>
                              {effectiveDiscountPercent > 0 && (
                                <span className="text-xs sm:text-sm line-through mb-0.5 sm:mb-1" style={{ color: theme.text.muted }}>
                                  PKR {base?.toLocaleString()}
                                </span>
                              )}
                              <span
                                className="text-lg sm:text-xl font-bold"
                                style={{ color: theme.text.primary }}
                              >
                                PKR {effectiveDiscountPercent > 0 ? onlinePrice.toLocaleString() : base?.toLocaleString()}
                              </span>
                              {effectiveDiscountPercent > 0 && (
                                <span className="text-[10px] sm:text-xs font-medium mt-0.5 sm:mt-1" style={{ color: theme.accents.primary }}>
                                  Up to {effectiveDiscountPercent}% OFF Online
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}