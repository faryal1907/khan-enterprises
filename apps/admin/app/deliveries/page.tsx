"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { getDeliveries, getDeliveryStats } from "@/lib/api/deliveries";

export default function DeliveryQueuePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isStaff = user?.role === UserRole.SALES_STAFF;

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    branch: "",
  });
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [branches, setBranches] = useState<any[]>([]);

  // A user is restricted to their branch if they are not an admin AND they have a branchId assigned
  const isBranchRestricted = !isAdmin && !!user?.branchId;

  // Fetch branches (only after user is available to ensure token is in cookie)
  useEffect(() => {
    if (!user) return;
    import("@/lib/api/inventory").then(({ getBranches }) => {
      getBranches().then((data: any) => setBranches(data.branches || [])).catch(console.warn);
    }).catch(console.warn);
  }, [user?.id]);

  // Set branch filter to user's branch if restricted
  useEffect(() => {
    if (isBranchRestricted && user?.branchId) {
      setFilters((prev) => ({ ...prev, branch: user.branchId || "" }));
    }
  }, [isBranchRestricted, user?.branchId]);

  useEffect(() => {
    if (!user) return;
    fetchDeliveries();
    // SALES_STAFF do not have access to the /deliveries/stats endpoint
    if (!isStaff) {
      fetchStats();
    }
  }, [filters, user?.id]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.status) params.status = filters.status;
      if (filters.branch) params.branchId = filters.branch;
      
      const data = await getDeliveries(params);
      setDeliveries(data.deliveries || []);
    } catch (err: any) {
      console.warn("Failed to fetch deliveries:", err?.message || err);
      setError(err.message || "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const branchId = !isBranchRestricted && filters.branch ? filters.branch : undefined;
      const data = await getDeliveryStats(branchId);
      setStats(data);
    } catch (err: any) {
      console.warn("Failed to fetch delivery stats:", err?.message || err);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    // Prevent branch-restricted users from changing branch filter
    if (key === "branch" && isBranchRestricted) {
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getDeliveryStatusStyle = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          border: "1px solid #F59E0B",
        };
      case "UNDER_REVIEW":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
          border: "1px solid #3B82F6",
        };
      case "APPROVED":
        return {
          backgroundColor: "#E0E7FF",
          color: "#3730A3",
          border: "1px solid #6366F1",
        };
      case "IN_TRANSIT":
        return {
          backgroundColor: "#F3E8FF",
          color: "#6B21A8",
          border: "1px solid #A855F7",
        };
      case "DELIVERED":
        return {
          backgroundColor: "#D1FAE5",
          color: "#065F46",
          border: "1px solid #10B981",
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
            Delivery Queue
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Manage delivery requests and track delivery status
          </p>
        </div>

        {/* Filters */}
        <div
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Status</option>
                <option value="REQUESTED">Requested</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Branch
              </label>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange("branch", e.target.value)}
                disabled={isBranchRestricted}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                  opacity: isBranchRestricted ? 0.6 : 1,
                }}
              >
                <option value="">All Branches</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              {isBranchRestricted && (
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  Filtered to your branch
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <p className="text-xs mb-1" style={{ color: theme.text.secondary }}>Total</p>
              <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{stats.total}</p>
            </div>
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: "#FEF3C7", border: "1px solid #F59E0B" }}
            >
              <p className="text-xs mb-1" style={{ color: "#92400E" }}>Requested</p>
              <p className="text-2xl font-bold" style={{ color: "#92400E" }}>{stats.requested}</p>
            </div>
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: "#DBEAFE", border: "1px solid #3B82F6" }}
            >
              <p className="text-xs mb-1" style={{ color: "#1E40AF" }}>Under Review</p>
              <p className="text-2xl font-bold" style={{ color: "#1E40AF" }}>{stats.underReview}</p>
            </div>
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: "#E0E7FF", border: "1px solid #6366F1" }}
            >
              <p className="text-xs mb-1" style={{ color: "#3730A3" }}>In Transit</p>
              <p className="text-2xl font-bold" style={{ color: "#3730A3" }}>{stats.inTransit}</p>
            </div>
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: "#D1FAE5", border: "1px solid #10B981" }}
            >
              <p className="text-xs mb-1" style={{ color: "#065F46" }}>Delivered</p>
              <p className="text-2xl font-bold" style={{ color: "#065F46" }}>{stats.delivered}</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: theme.accents.primary }} />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p style={{ color: theme.text.secondary }}>{error}</p>
            </div>
          ) : deliveries.length === 0 ? (
            <div className="p-8 text-center">
              <p style={{ color: theme.text.secondary }}>No delivery requests found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Delivery Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Requested Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => (
                  <tr 
                    key={delivery.id} 
                    onClick={() => router.push(`/deliveries/${delivery.id}`)}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: `1px solid ${theme.borders.light}` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.backgrounds.tertiary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: theme.text.primary }}>
                      <Link 
                        href={`/deliveries/${delivery.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline text-inherit block w-full"
                      >
                        {delivery.order?.orderNumber || delivery.partOrder?.orderNumber || "N/A"}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {delivery.order?.customerName || delivery.partOrder?.customerName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate" style={{ color: theme.text.primary }}>
                      {delivery.deliveryAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {delivery.order?.branch ? `${delivery.order.branch.name}, ${delivery.order.branch.city}` :
                       delivery.partOrder?.branch ? `${delivery.partOrder.branch.name}, ${delivery.partOrder.branch.city}` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {new Date(delivery.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className="inline-block px-2 py-1 text-xs font-medium rounded"
                        style={getDeliveryStatusStyle(delivery.status)}
                      >
                        {delivery.status.replace(/_/g, " ")}
                      </span>
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
