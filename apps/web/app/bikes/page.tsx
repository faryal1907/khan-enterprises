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
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1
            className="text-5xl font-bold mb-4"
            style={{ color: theme.text.primary }}
          >
            Motorcycle Inventory
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Browse bikes, their specs and start negotitation process!
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className="w-64 flex-shrink-0">
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

              {/* Branch */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.text.secondary }}
                >
                  Branch
                </label>
                <select
                  value={filters.branchId}
                  onChange={(e) =>
                    setFilters({ ...filters, branchId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.text.secondary }}
                >
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) =>
                    setFilters({ ...filters, availability: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                >
                  <option value="">All</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="SOLD">Sold</option>
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
              <div className="flex items-center justify-center py-20" style={{ backgroundColor: theme.backgrounds.primary }}>
                <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2"
                  style={{ borderColor: theme.accents.primary }}
                />
              </div>
            ) : bikes.length === 0 ? (
              <div
                className="rounded-xl p-12 text-center"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm" style={{ color: theme.text.muted }}>
                          {bike.model?.year}
                        </span>
                      </div>
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: theme.text.primary }}
                      >
                        {bike.model?.modelName}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>
                        {bike.model?.brand}
                      </p>
                      <p className="text-sm mb-4" style={{ color: theme.text.muted }}>
                        {bike.model?.engineCapacity || "N/A"}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm" style={{ color: theme.text.muted }}>
                          {bike.branch?.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: theme.text.primary }}
                        >
                          PKR {(bike.price || bike.model?.basePrice)?.toLocaleString()}
                        </span>
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
