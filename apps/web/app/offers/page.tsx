"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { getOffersByCustomer } from "@/lib/api/offers";
import { useAuthStore } from "@/lib/auth-store";

interface Offer {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  offerAmount: number;
  counterAmount: number | null;
  status: string;
  createdAt: string;
  bike: {
    id: string;
    model: {
      brand: string;
      modelName: string;
      year: number;
    };
    chassisNumber: string;
  };
  order: {
    id: string;
    orderNumber: string;
  } | null;
}

export default function CustomerOffersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const statusTabs = [
    { value: "", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "COUNTERED", label: "Countered" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
  ];

  useEffect(() => {
    if (user?.id) {
      fetchOffers();
    } else {
      setLoading(false);
    }
  }, [user, activeTab, page]);

  const fetchOffers = async () => {
    if (!user?.id) {
      setError("Please login to view your offers");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getOffersByCustomer(user.id, {
        status: activeTab || undefined,
        page,
        limit: 20,
      });
      setOffers(response.offers || []);
    } catch (err: any) {
      console.error("Failed to fetch offers:", err);
      setError(err.response?.data?.message || "Failed to load your offers");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          border: "1px solid #F59E0B",
        };
      case "ACCEPTED":
        return {
          backgroundColor: "#D1FAE5",
          color: "#065F46",
          border: "1px solid #10B981",
        };
      case "REJECTED":
        return {
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #EF4444",
        };
      case "COUNTERED":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
          border: "1px solid #3B82F6",
        };
      default:
        return {
          backgroundColor: theme.backgrounds.tertiary,
          color: theme.text.secondary,
          border: `1px solid ${theme.borders.medium}`,
        };
    }
  };


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div
          className="rounded-xl p-12 text-center max-w-md"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
            Login Required
          </h2>
          <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
            Please login to view your negotiation history
          </p>
          <button
            onClick={() => {
              // Force full page navigation to avoid middleware redirect issues
              window.location.href = "/login";
            }}
            className="px-6 py-3 rounded-lg font-medium hover:opacity-90"
            style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text.primary }}>
            My Negotiations
          </h1>
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Track your bike offers and negotiation status
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex space-x-2 mb-6">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
              }}
              className="px-4 py-2 text-sm font-medium rounded transition-colors"
              style={{
                backgroundColor:
                  activeTab === tab.value
                    ? theme.accents.primary
                    : theme.backgrounds.primary,
                color:
                  activeTab === tab.value
                    ? theme.text.inverse
                    : theme.text.secondary,
                border:
                  activeTab === tab.value
                    ? "none"
                    : `1px solid ${theme.borders.medium}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: theme.backgrounds.secondary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          {loading ? (
            <div className="p-8 text-center" style={{ color: theme.text.secondary }}>
              Loading your offers...
            </div>
          ) : error ? (
            <div className="p-8 text-center" style={{ color: theme.text.secondary }}>
              {error}
            </div>
          ) : offers.length === 0 ? (
            <div className="p-8 text-center" style={{ color: theme.text.secondary }}>
              No offers found. Start negotiating on bikes you're interested in!
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Bike Model
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Your Offer
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Counter Offer
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr
                    key={offer.id}
                    style={{
                      borderBottom: `1px solid ${theme.borders.light}`,
                      cursor: "pointer",
                    }}
                    onClick={() => router.push(`/offers/${offer.id}`)}
                    className="hover:opacity-80"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      <div>
                        <div className="font-medium">
                          {offer.bike.model.brand} {offer.bike.model.modelName}
                        </div>
                        <div className="text-xs" style={{ color: theme.text.secondary }}>
                          {offer.bike.model.year}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: theme.text.primary }}>
                      PKR {Number(offer.offerAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {offer.counterAmount
                        ? `PKR ${Number(offer.counterAmount).toLocaleString()}`
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className="inline-block px-2 py-1 text-xs font-medium rounded"
                        style={getStatusBadgeStyle(offer.status)}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.secondary }}>
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
