"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

export default function PartDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const response = await api.get(`/catalog/parts/${id}`);
        setPart(response.data);
      } catch (error) {
        console.error("Failed to fetch part:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPart();
  }, [id]);

  const handleOrderClick = (inventory: any) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    router.push(`/part-orders/new?partId=${id}&inventoryId=${inventory.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.accents.primary }} />
      </div>
    );
  }

  if (!part) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <p style={{ color: theme.text.secondary }}>Part not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/parts" className="text-sm hover:opacity-70" style={{ color: theme.text.secondary }}>
            ← Back to Parts
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Part Information */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl p-8"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h1 className="text-4xl font-bold mb-4" style={{ color: theme.text.primary }}>
                {part.name}
              </h1>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.text.muted }}>SKU</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{part.sku}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Category</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{part.category}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Description</p>
                <p className="leading-relaxed" style={{ color: theme.text.secondary }}>
                  {part.description || "No description available."}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Selling Price</p>
                <p className="text-3xl font-bold" style={{ color: theme.text.primary }}>
                  PKR {part.sellingPrice?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Stock Information */}
          <div>
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h2 className="text-xl font-semibold mb-6" style={{ color: theme.text.primary }}>
                Stock by Branch
              </h2>

              {part.inventories && part.inventories.length > 0 ? (
                <div className="space-y-4">
                  {part.inventories.map((inventory: any) => {
                    const availableQuantity = inventory.quantity - inventory.reservedQuantity;
                    return (
                      <div
                        key={inventory.id}
                        className="rounded-lg p-4"
                        style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.light}` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium" style={{ color: theme.text.primary }}>
                            {inventory.branch?.name}
                          </p>
                          <span
                            className="text-xs font-medium px-2 py-1 rounded"
                            style={{
                              backgroundColor: availableQuantity > 0
                                ? `${theme.accents.tertiary}30`
                                : `${theme.colors.gray300}30`,
                              color: availableQuantity > 0
                                ? theme.accents.primary
                                : theme.colors.gray600,
                            }}
                          >
                            {availableQuantity > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                        <p className="text-sm mb-3" style={{ color: theme.text.secondary }}>
                          Available: {availableQuantity}
                        </p>
                        {availableQuantity > 0 && (
                          <button
                            onClick={() => handleOrderClick(inventory)}
                            className="w-full px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                            style={{
                              backgroundColor: theme.accents.primary,
                              color: theme.text.inverse,
                            }}
                          >
                            Order Now
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm" style={{ color: theme.text.muted }}>
                  No stock information available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
