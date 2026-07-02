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
  const individualDiscount = bike?.onlineDiscountPercent ? Number(bike.onlineDiscountPercent) : 0;
  const globalDiscount = bike?.globalDiscountPercent ? Number(bike.globalDiscountPercent) : 0;
  const effectiveDiscountPercent = individualDiscount + globalDiscount;
  
  const onlinePrice = price * (1 - effectiveDiscountPercent / 100);
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
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2" style={{ borderColor: theme.accents.primary }}></div>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="rounded-xl p-8 sm:p-12 text-center" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <p style={{ color: theme.text.secondary }}>Motorcycle not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-8">
          <Link href="/bikes" className="text-xs sm:text-sm hover:opacity-70" style={{ color: theme.text.secondary }}>
            ← Back to Inventory
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Left: Image Gallery */}
          <div>
            {bike.media && bike.media.length > 0 ? (
              <>
                <div
                  className="rounded-xl overflow-hidden mb-3 sm:mb-4 border aspect-video"
                  style={{ borderColor: theme.borders.light, backgroundColor: theme.backgrounds.tertiary }}
                >
                  {bike.media[activeMediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
                    <video src={bike.media[activeMediaIndex]} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={bike.media[activeMediaIndex]} alt="Main Image" className="w-full h-full object-cover" />
                  )}
                </div>
                {bike.media.length > 1 && (
                  <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-4 gap-2 sm:gap-4">
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
                  className="rounded-xl overflow-hidden mb-3 sm:mb-4 aspect-video"
                  style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.light}` }}
                />
                {/* Thumbnail gallery */}
                <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-4 gap-2 sm:gap-4">
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

            {/* Title & Pricing below image - Mobile Only */}
            <div className="mt-4 sm:hidden">
              <p className="text-xs font-medium mb-1" style={{ color: theme.text.muted }}>
                {bike.model?.brand} • {bike.model?.year}
              </p>
              <div className="mb-2">
                <span className="text-xs" style={{ color: theme.text.muted }}>
                  Store Price
                </span>
                <span className="text-2xl font-bold ml-2" style={{ color: theme.text.primary }}>
                  PKR {price.toLocaleString()}
                </span>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${theme.accents.tertiary}20`, border: `1px solid ${theme.accents.tertiary}40` }}
              >
                <p className="text-xs font-medium mb-1" style={{ color: theme.accents.primary }}>
                  Online Special Price
                </p>
                <p className="text-lg font-bold" style={{ color: theme.accents.primary }}>
                  PKR {onlinePrice.toLocaleString()}
                </p>
                <p className="text-xs mt-1" style={{ color: theme.text.secondary }}>
                  {effectiveDiscountPercent > 0 && `${effectiveDiscountPercent}% discount applied! `}You save PKR {discountAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Bike Information */}
          <div>
            {/* Availability Badge */}
            <div className="mb-3 sm:mb-4">
              <span
                className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${theme.accents.tertiary}30`,
                  color: theme.accents.primary,
                }}
              >
                Available
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2" style={{ color: theme.text.primary }}>
              {bike.model?.modelName}
            </h1>

            {/* Branch */}
            <div className="mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm" style={{ color: theme.text.muted }}>
                Available at: <span style={{ color: theme.text.primary }}>{bike.branch?.name}</span>
              </p>
            </div>

            {/* Purchase Options */}
            <div
              className="rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: theme.text.primary }}>
                Purchase Options
              </h2>

              {/* Buy Online */}
              <button
                onClick={handleBuyOnline}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg hover:opacity-90 transition-opacity mb-2 sm:mb-3"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                Order Now 
              </button>
              <p className="text-[10px] sm:text-xs mb-3 sm:mb-4 text-center" style={{ color: theme.text.muted }}>
                Online Price: PKR {onlinePrice.toLocaleString()} ({effectiveDiscountPercent > 0 ? `${effectiveDiscountPercent}% discount applied` : 'No discount'})
              </p>

              {/* Visit Branch */}
              <div className="border-t pt-3 sm:pt-4" style={{ borderColor: theme.borders.light }}>
                <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: theme.text.primary }}>
                  Or Visit a Branch
                </p>
                <p className="text-[10px] sm:text-xs" style={{ color: theme.text.secondary }}>
                  Or reserve now by ordering with cash payment option and pick up from <span style={{ color: theme.text.primary }}>{bike.branch?.name}</span> to purchase this motorcycle at discounted price.
                </p>
              </div>
            </div>

            {/* Specifications */}
            <div
              className="rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: theme.text.primary }}>
                Specifications
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm mb-1" style={{ color: theme.text.muted }}>Motor Power</p>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: theme.text.primary }}>{bike.model?.engineCapacity || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm mb-1" style={{ color: theme.text.muted }}>Color</p>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: theme.text.primary }}>{bike.color || bike.model?.color || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm mb-1" style={{ color: theme.text.muted }}>Chassis Number</p>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: theme.text.primary }}>{bike.chassisNumber}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm mb-1" style={{ color: theme.text.muted }}>Motor Number</p>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: theme.text.primary }}>{bike.engineNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 sm:mt-12">
          <div
            className="rounded-xl p-6 sm:p-8"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4" style={{ color: theme.text.primary }}>
              About This Motorcycle
            </h2>
            <p className="leading-relaxed text-xs sm:text-sm" style={{ color: theme.text.secondary }}>
              {bike.model?.description || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}