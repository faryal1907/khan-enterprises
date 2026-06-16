"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { theme } from "@/lib/colors";
import { getOffers } from "@/lib/api/offers";

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
    };
    chassisNumber: string;
  };
}

export default function OffersListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get("status") || "PENDING");
  const [page, setPage] = useState(1);

  const statusTabs = [
    { value: "", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "COUNTERED", label: "Countered" },
    { value: "CONVERTED", label: "Converted" },
    { value: "REJECTED", label: "Rejected" },
  ];

  useEffect(() => {
    fetchOffers();
  }, [activeTab, page]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await getOffers({
        status: activeTab === "CONVERTED" ? "ACCEPTED" : activeTab || undefined,
        includeConverted: activeTab === "CONVERTED" ? true : undefined,
        page,
        limit: 20,
      });
      setOffers(response.offers || []);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
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


  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.text.primary }}
          >
            Offers Inbox
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Manage customer offers and negotiations
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
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          {loading ? (
            <div className="p-8 text-center" style={{ color: theme.text.secondary }}>
              Loading offers...
            </div>
          ) : offers.length === 0 ? (
            <div className="p-8 text-center" style={{ color: theme.text.secondary }}>
              No offers found
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Customer
                  </th>
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
                    Offer Amount
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    Counter Amount
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
                        <div className="font-medium">{offer.customerName}</div>
                        <div className="text-xs" style={{ color: theme.text.secondary }}>
                          {offer.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      <div>
                        <div className="font-medium">{offer.bike.model.brand}</div>
                        <div className="text-xs" style={{ color: theme.text.secondary }}>
                          {offer.bike.model.modelName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: theme.text.primary }}>
                      Rs. {Number(offer.offerAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {offer.counterAmount
                        ? `Rs. ${Number(offer.counterAmount).toLocaleString()}`
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
