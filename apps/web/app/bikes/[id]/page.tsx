"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

export default function BikeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const response = await api.get(`/catalog/bikes/${id}`);
        setBike(response.data);
      } catch (error) {
        console.error("Failed to fetch bike:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  const price = bike ? (bike.price || bike.model?.basePrice) : 0;
  const onlinePrice = price * 0.98;
  const discountAmount = price - onlinePrice;

  const handleBuyOnline = () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    // Redirect to order creation page with bike-id and online discount flag
    router.push(`/orders/new?bikeId=${id}&onlineDiscount=true`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.accents.primary }} />
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <p style={{ color: theme.text.secondary }}>Motorcycle not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/bikes" className="text-sm hover:opacity-70" style={{ color: theme.text.secondary }}>
            ← Back to Inventory
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div>
            {bike.media && bike.media.length > 0 ? (
              <>
                <div
                  className="rounded-xl overflow-hidden mb-4 border aspect-video"
                  style={{ borderColor: theme.borders.light, backgroundColor: theme.backgrounds.tertiary }}
                >
                  {bike.media[activeMediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
                    <video src={bike.media[activeMediaIndex]} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={bike.media[activeMediaIndex]} alt="Main Image" className="w-full h-full object-cover" />
                  )}
                </div>
                {bike.media.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {bike.media.map((url: string, i: number) => (
                      <div
                        key={i}
                        onClick={() => setActiveMediaIndex(i)}
                        className={`rounded-lg aspect-video cursor-pointer hover:opacity-80 transition-opacity overflow-hidden border ${activeMediaIndex === i ? 'ring-2' : ''}`}
                        style={{ 
                          borderColor: activeMediaIndex === i ? theme.accents.primary : theme.borders.light, 
                          backgroundColor: theme.backgrounds.tertiary 
                        }}
                      >
                        {url.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video src={url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={url} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div
                  className="rounded-xl overflow-hidden mb-4 aspect-video"
                  style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.light}` }}
                />
                {/* Thumbnail gallery */}
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg aspect-video cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.light}` }}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Title & Pricing below image */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-1" style={{ color: theme.text.muted }}>
                {bike.model?.brand} • {bike.model?.year}
              </p>
              <div className="mb-2">
                <span className="text-sm" style={{ color: theme.text.muted }}>
                  Store Price
                </span>
                <span className="text-3xl font-bold ml-2" style={{ color: theme.text.primary }}>
                  PKR {price.toLocaleString()}
                </span>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${theme.accents.tertiary}20`, border: `1px solid ${theme.accents.tertiary}40` }}
              >
                <p className="text-sm font-medium mb-1" style={{ color: theme.accents.primary }}>
                  Online Special Price
                </p>
                <p className="text-2xl font-bold" style={{ color: theme.accents.primary }}>
                  PKR {onlinePrice.toLocaleString()}
                </p>
                <p className="text-sm mt-1" style={{ color: theme.text.secondary }}>
                  2% discount applied! You save PKR {discountAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Bike Information */}
          <div>
            {/* Availability Badge */}
            <div className="mb-4">
              <span
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${theme.accents.tertiary}30`,
                  color: theme.accents.primary,
                }}
              >
                Available
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-2" style={{ color: theme.text.primary }}>
              {bike.model?.modelName}
            </h1>

            {/* Branch */}
            <div className="mb-6">
              <p className="text-sm" style={{ color: theme.text.muted }}>
                Available at: <span style={{ color: theme.text.primary }}>{bike.branch?.name}</span>
              </p>
            </div>

            {/* Purchase Options */}
            <div
              className="rounded-xl p-6 mb-6"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
                Purchase Options
              </h2>

              {/* Buy Online */}
              <button
                onClick={handleBuyOnline}
                className="w-full px-6 py-4 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity mb-3"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                Order Now 
              </button>
              <p className="text-xs mb-4 text-center" style={{ color: theme.text.muted }}>
                Online Price: PKR {onlinePrice.toLocaleString()} (2% discount applied)
              </p>

              {/* Visit Branch */}
              <div className="border-t pt-4" style={{ borderColor: theme.borders.light }}>
                <p className="text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
                  Or Visit a Branch
                </p>
                <p className="text-xs" style={{ color: theme.text.secondary }}>
                  Or reserve now by ordering with cash payment option and pick up from <span style={{ color: theme.text.primary }}>{bike.branch?.name}</span> to purchase this motorcycle at discounted price.
                </p>
              </div>
            </div>

            {/* Specifications */}
            <div
              className="rounded-xl p-6 mb-6"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
                Specifications
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Engine Capacity</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.model?.engineCapacity || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Color</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.color || bike.model?.color || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Chassis Number</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.chassisNumber}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Engine Number</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.engineNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <div
            className="rounded-xl p-8"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <h2 className="text-2xl font-semibold mb-4" style={{ color: theme.text.primary }}>
              About This Motorcycle
            </h2>
            <p className="leading-relaxed" style={{ color: theme.text.secondary }}>
              {bike.model?.description || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}