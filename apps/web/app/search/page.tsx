"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any>({ bikes: [], parts: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const response = await api.get("/catalog/search", {
            params: { q: query },
          });
          setResults(response.data);
        } catch (error) {
          console.error("Failed to fetch search results:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: theme.text.primary }}>
            Search Results
          </h1>
          <p style={{ color: theme.text.secondary }}>
            {query ? `Results for "${query}"` : "Enter a search term to find motorcycles and parts"}
          </p>
        </div>

        {!query ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{
              backgroundColor: theme.backgrounds.secondary,
              border: `1px solid ${theme.borders.light}`,
            }}
          >
            <p style={{ color: theme.text.secondary }}>
              Please enter a search term to find motorcycles and parts.
            </p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: theme.accents.primary }}
            />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Motorcycles Section */}
            {results.bikes.length > 0 && (
              <section>
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: theme.text.primary }}
                >
                  Motorcycles ({results.bikes.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.bikes.map((bike: any) => (
                    <div
                      key={bike.id}
                      className="rounded-xl overflow-hidden"
                      style={{
                        backgroundColor: theme.backgrounds.secondary,
                        border: `1px solid ${theme.borders.light}`,
                      }}
                    >
                      <div
                        className="aspect-video"
                        style={{ backgroundColor: theme.backgrounds.tertiary }}
                      />
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-medium px-2 py-1 rounded"
                            style={{
                              backgroundColor: `${theme.accents.tertiary}30`,
                              color: theme.accents.primary,
                            }}
                          >
                            Available
                          </span>
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
                        <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
                          {bike.model?.brand}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-2xl font-bold"
                            style={{ color: theme.text.primary }}
                          >
                            PKR {bike.model?.basePrice?.toLocaleString()}
                          </span>
                          <Link
                            href={`/bikes/${bike.id}`}
                            className="inline-block px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                            style={{
                              backgroundColor: theme.accents.primary,
                              color: theme.text.inverse,
                            }}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Parts Section */}
            {results.parts.length > 0 && (
              <section>
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: theme.text.primary }}
                >
                  Parts & Accessories ({results.parts.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.parts.map((part: any) => (
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
              </section>
            )}

            {/* No Results */}
            {results.bikes.length === 0 && results.parts.length === 0 && (
              <div
                className="rounded-xl p-12 text-center"
                style={{
                  backgroundColor: theme.backgrounds.secondary,
                  border: `1px solid ${theme.borders.light}`,
                }}
              >
                <p style={{ color: theme.text.secondary }}>
                  No results found for "{query}".
                </p>
                <Link
                  href="/bikes"
                  className="inline-block mt-4 px-6 py-3 text-base font-medium rounded-lg hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  Browse All Motorcycles
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
