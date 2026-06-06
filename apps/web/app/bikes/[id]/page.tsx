"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

export default function BikeDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offerAmount, setOfferAmount] = useState("");

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

  const handleMakeOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    // TODO: Implement offer submission
    console.log("Making offer:", offerAmount);
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
            <div
              className="rounded-xl overflow-hidden mb-4"
              style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.light}` }}
            >
              <div className="aspect-video" style={{ backgroundColor: theme.backgrounds.tertiary }} />
            </div>
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
            <p className="text-lg mb-4" style={{ color: theme.text.secondary }}>
              {bike.model?.brand} • {bike.model?.year}
            </p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: theme.text.primary }}>
                PKR {bike.model?.basePrice?.toLocaleString()}
              </span>
            </div>

            {/* Branch */}
            <div className="mb-6">
              <p className="text-sm" style={{ color: theme.text.muted }}>
                Available at: <span style={{ color: theme.text.primary }}>{bike.branch?.name}</span>
              </p>
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
                  <p className="font-medium" style={{ color: theme.text.primary }}>{bike.model?.color || "N/A"}</p>
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

            {/* Make Offer Section */}
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
                Make an Offer
              </h2>
              <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
                Submit your offer and we'll get back to you within 24 hours.
              </p>
              <form onSubmit={handleMakeOffer}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                    Your Offer (PKR)
                  </label>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Enter your offer amount"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  Submit Offer
                </button>
              </form>
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

        {/* Negotiation Process */}
        <div className="mt-12">
          <div
            className="rounded-xl p-8"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <h2 className="text-2xl font-semibold mb-4" style={{ color: theme.text.primary }}>
              How Negotiation Works
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
                >
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: theme.text.primary }}>Submit Your Offer</h3>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>
                    Enter your desired price and submit your offer through our secure platform.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
                >
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: theme.text.primary }}>Review & Response</h3>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>
                    Our team will review your offer and respond within 24 hours with acceptance or counter-offer.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
                >
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: theme.text.primary }}>Complete Purchase</h3>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>
                    Once agreed, proceed with payment and delivery scheduling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
