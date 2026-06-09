"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";

export default function PartsPage() {
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
  });

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const params: any = {};
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1
            className="text-5xl font-bold mb-4"
            style={{ color: theme.text.primary }}
          >
            Parts & Accessories
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Genuine spare parts, accessories, and consumables for all motorcycle models
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

              <button
                onClick={() => setFilters({ category: "", search: "" })}
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
              <div className="flex items-center justify-center py-20">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2"
                  style={{ borderColor: theme.accents.primary }}
                />
              </div>
            ) : parts.length === 0 ? (
              <div
                className="rounded-xl p-12 text-center"
                style={{
                  backgroundColor: theme.backgrounds.secondary,
                  border: `1px solid ${theme.borders.light}`,
                }}
              >
                <p style={{ color: theme.text.secondary }}>
                  No parts found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parts.map((part) => (
                  <div
                    key={part.id}
                    className="rounded-xl p-6"
                    style={{
                      backgroundColor: theme.backgrounds.secondary,
                      border: `1px solid ${theme.borders.light}`,
                    }}
                  >
                    <div
                      className="aspect-square mb-4 rounded-lg"
                      style={{ backgroundColor: theme.backgrounds.tertiary }}
                    />
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: theme.text.primary }}
                    >
                      {part.name}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>
                      SKU: {part.sku}
                    </p>
                    <p className="text-sm mb-4" style={{ color: theme.text.muted }}>
                      {part.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xl font-bold"
                        style={{ color: theme.text.primary }}
                      >
                        PKR {part.sellingPrice?.toLocaleString()}
                      </span>
                      <Link
                        href={`/parts/${part.id}`}
                        className="inline-block px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                        style={{
                          backgroundColor: theme.accents.secondary,
                          color: theme.text.inverse,
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
