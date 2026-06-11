"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { createOffer } from "@/lib/api/offers";

export default function BikeDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCNIC, setCustomerCNIC] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

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

    if (!offerAmount || !customerName || !customerPhone) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const result = await createOffer({
        bikeId: id as string,
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        customerCNIC: customerCNIC || undefined,
        customerAddress: customerAddress || undefined,
        offerAmount: parseFloat(offerAmount),
        message: message || undefined,
        paymentMethod: paymentMethod as any,
      }, user?.id);

      // Redirect to offer status page
      window.location.href = `/offers/${result.id}`;
    } catch (error: any) {
      console.error("Failed to submit offer:", error);
      setErrorMessage(error.response?.data?.message || "Failed to submit offer. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
                PKR {(bike.price || bike.model?.basePrice)?.toLocaleString()}
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

              {successMessage && (
                <div
                  className="mb-4 p-4 rounded-lg"
                  style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}
                >
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div
                  className="mb-4 p-4 rounded-lg"
                  style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}
                >
                  {errorMessage}
                </div>
              )}

              {!showOfferForm ? (
                <button
                  onClick={() => {
                    if (!user) {
                      window.location.href = "/login";
                      return;
                    }
                    setShowOfferForm(true);
                  }}
                  className="w-full px-6 py-3 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  Start Offer Process
                </button>
              ) : (
                <form onSubmit={handleMakeOffer}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                        Your Offer (PKR) *
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
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none"
                        style={{
                          backgroundColor: theme.backgrounds.tertiary,
                          border: `1px solid ${theme.borders.medium}`,
                          color: theme.text.primary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none"
                        style={{
                          backgroundColor: theme.backgrounds.tertiary,
                          border: `1px solid ${theme.borders.medium}`,
                          color: theme.text.primary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none"
                        style={{
                          backgroundColor: theme.backgrounds.tertiary,
                          border: `1px solid ${theme.borders.medium}`,
                          color: theme.text.primary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                        CNIC (Optional)
                      </label>
                      <input
                        type="text"
                        value={customerCNIC}
                        onChange={(e) => setCustomerCNIC(e.target.value)}
                        placeholder="Enter your CNIC number"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none"
                        style={{
                          backgroundColor: theme.backgrounds.tertiary,
                          border: `1px solid ${theme.borders.medium}`,
                          color: theme.text.primary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                        Address (Optional)
                      </label>
                      <textarea
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        rows={2}
                        placeholder="Enter your address"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none"
                        style={{
                          backgroundColor: theme.backgrounds.tertiary,
                          border: `1px solid ${theme.borders.medium}`,
                          color: theme.text.primary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                        Message (Optional)
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={2}
                        placeholder="Add any additional notes"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none"
                        style={{
                          backgroundColor: theme.backgrounds.tertiary,
                          border: `1px solid ${theme.borders.medium}`,
                          color: theme.text.primary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                        Payment Method *
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 rounded-lg cursor-pointer" style={{ backgroundColor: theme.backgrounds.tertiary, border: paymentMethod === "CASH" ? `2px solid ${theme.accents.primary}` : `1px solid ${theme.borders.medium}` }}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="CASH"
                            checked={paymentMethod === "CASH"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <p className="font-medium" style={{ color: theme.text.primary }}>Cash</p>
                            <p className="text-xs" style={{ color: theme.text.secondary }}>Pay at your nearest branch</p>
                          </div>
                        </label>

                        <label className="flex items-center p-4 rounded-lg cursor-pointer" style={{ backgroundColor: theme.backgrounds.tertiary, border: paymentMethod === "BANK_TRANSFER" ? `2px solid ${theme.accents.primary}` : `1px solid ${theme.borders.medium}` }}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="BANK_TRANSFER"
                            checked={paymentMethod === "BANK_TRANSFER"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <p className="font-medium" style={{ color: theme.text.primary }}>Bank Transfer</p>
                            <p className="text-xs" style={{ color: theme.text.secondary }}>Transfer via online banking</p>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowOfferForm(false)}
                        className="flex-1 px-6 py-3 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity"
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
                        disabled={submitting}
                        className="flex-1 px-6 py-3 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        style={{
                          backgroundColor: theme.accents.primary,
                          color: theme.text.inverse,
                        }}
                      >
                        {submitting ? "Submitting..." : "Submit Offer"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
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
