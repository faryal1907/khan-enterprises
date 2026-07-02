"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";

export default function BikesPage() {
  const [bikes, setBikes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    modelId: "",
    priceMin: "",
    priceMax: "",
    branchId: "",
    availability: "AVAILABLE",
  });

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const params: any = {};
        if (filters.modelId) params.modelId = filters.modelId;
        if (filters.priceMin) params.priceMin = parseFloat(filters.priceMin);
        if (filters.priceMax) params.priceMax = parseFloat(filters.priceMax);
        if (filters.branchId) params.branchId = filters.branchId;
        if (filters.availability) params.availability = filters.availability;

        const response = await api.get("/catalog/bikes", { params });
        setBikes(response.data);
      } catch (error) {
        console.error("Failed to fetch bikes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, [filters]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get("/catalog/models");
        setModels(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch models:", error);
        setModels([]);
      }
    };
    fetchModels();
  }, []);

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-12">
          <h1
            className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-4"
            style={{ color: theme.text.primary }}
          >
            Bikes Inventory
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Browse bikes, their specs, and order from your nearest branch!
          </p><p style={{ color: theme.text.secondary }}>
            For onsite pickup, browse branch-wise inventory and visit our showroom!
          </p>
        </div>

        {/* Mobile Filter Dropdown */}
        <div className="mb-4 sm:hidden">
          <details className="rounded-xl" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
            <summary className="p-4 cursor-pointer text-sm font-medium" style={{ color: theme.text.primary }}>
              Show Filters
            </summary>
            <div className="p-4 border-t" style={{ borderColor: theme.borders.light }}>
              <div className="space-y-4">
                {/* Model */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>
                    Model
                  </label>
                  <select
                    value={filters.modelId}
                    onChange={(e) => setFilters({ ...filters, modelId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">All Models</option>
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.modelName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>
                    Price Range (PKR)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                      style={{
                        backgroundColor: theme.backgrounds.tertiary,
                        border: `1px solid ${theme.borders.medium}`,
                        color: theme.text.primary,
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                      style={{
                        backgroundColor: theme.backgrounds.tertiary,
                        border: `1px solid ${theme.borders.medium}`,
                        color: theme.text.primary,
                      }}
                    />
                  </div>
                </div>

                {/* Branch */}
                <div style={{
                  backgroundColor: theme.accents.primary + '10',
                  borderRadius: '10px',
                  padding: '12px',
                  border: `1.5px solid ${theme.accents.primary}30`,
                }}>
                  <label className="block text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: theme.accents.primary }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    Branch
                  </label>
                  <select
                    value={filters.branchId}
                    onChange={(e) => setFilters({ ...filters, branchId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
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
                  onClick={() => setFilters({ modelId: "", priceMin: "", priceMax: "", branchId: "", availability: "AVAILABLE" })}
                  className="w-full px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
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

        <div className="flex flex-col sm:flex-row sm:gap-8">
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

              {/* Model */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.text.secondary }}
                >
                  Model
                </label>
                <select
                  value={filters.modelId}
                  onChange={(e) =>
                    setFilters({ ...filters, modelId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                >
                  <option value="">All Models</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.modelName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.text.secondary }}
                >
                  Price Range (PKR)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) =>
                      setFilters({ ...filters, priceMin: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) =>
                      setFilters({ ...filters, priceMax: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  />
                </div>
              </div>

              {/* Branch - More Prominent */}
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
                onClick={() =>
                  setFilters({ modelId: "", priceMin: "", priceMax: "", branchId: "", availability: "AVAILABLE" })
                }
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

          {/* Bike Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12 sm:py-20" style={{ backgroundColor: theme.backgrounds.primary }}>
                <div
                  className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2"
                  style={{ borderColor: theme.accents.primary }}
                />
              </div>
            ) : bikes.length === 0 ? (
              <div
                className="rounded-xl p-8 sm:p-12 text-center"
                style={{
                  backgroundColor: theme.backgrounds.secondary,
                  border: `1px solid ${theme.borders.light}`,
                }}
              >
                <p style={{ color: theme.text.secondary }}>
                  No motorcycles found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {bikes.map((bike) => (
                  <Link
                    key={bike.id}
                    href={`/bikes/${bike.id}`}
                    className="rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: theme.backgrounds.secondary,
                      border: `1px solid ${theme.borders.light}`,
                    }}
                  >
                    <div
                      className="aspect-video w-full overflow-hidden"
                      style={{ backgroundColor: theme.backgrounds.tertiary }}
                    >
                      {bike.media && bike.media.length > 0 && (
                        bike.media[0].match(/\.(mp4|webm|ogg)$/i) ? (
                          <video src={bike.media[0]} className="w-full h-full object-cover" />
                        ) : (
                          <img src={bike.media[0]} alt={bike.model?.modelName || "Bike"} className="w-full h-full object-cover" />
                        )
                      )}
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm" style={{ color: theme.text.muted }}>
                          {bike.model?.year}
                        </span>
                      </div>
                      <h3
                        className="text-base sm:text-lg font-semibold mb-2"
                        style={{ color: theme.text.primary }}
                      >
                        {bike.model?.modelName}
                      </h3>
                      <p className="text-xs sm:text-sm mb-2" style={{ color: theme.text.secondary }}>
                        {bike.model?.brand}
                      </p>
                      <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: theme.text.muted }}>
                        {bike.model?.engineCapacity || "N/A"}
                      </p>
                      <div style={{ backgroundColor: theme.accents.primary + '15', borderRadius: '8px', padding: '6px 10px', marginBottom: '8px' }}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <svg width="12" height="12" className="sm:w-[14px] sm:h-[14px]" viewBox="0 0 24 24" fill="none" stroke={theme.accents.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          <span className="text-xs font-medium" style={{ color: theme.text.primary }}>
                            {bike.branch?.name}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-xs" style={{ color: theme.text.secondary }}>
                          {bike.branch?.city}{bike.branch?.city && bike.branch?.address ? ', ' : ''}{bike.branch?.address || ''}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        {(() => {
                          const base = bike.price || bike.model?.basePrice;
                          const individualDiscount = bike.onlineDiscountPercent ? Number(bike.onlineDiscountPercent) : 0;
                          const globalDiscount = bike.globalDiscountPercent ? Number(bike.globalDiscountPercent) : 0;
                          const effectiveDiscountPercent = individualDiscount + globalDiscount;
                          const onlinePrice = base * (1 - effectiveDiscountPercent / 100);
                          
                          return (
                            <>
                              {effectiveDiscountPercent > 0 && (
                                <span className="text-xs sm:text-sm line-through mb-1" style={{ color: theme.text.muted }}>
                                  PKR {base?.toLocaleString()}
                                </span>
                              )}
                              <span
                                className="text-xl sm:text-2xl font-bold"
                                style={{ color: theme.text.primary }}
                              >
                                PKR {effectiveDiscountPercent > 0 ? onlinePrice.toLocaleString() : base?.toLocaleString()}
                              </span>
                              {effectiveDiscountPercent > 0 && (
                                <span className="text-[10px] sm:text-xs font-medium mt-1" style={{ color: theme.accents.primary }}>
                                  {effectiveDiscountPercent}% OFF Online
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}