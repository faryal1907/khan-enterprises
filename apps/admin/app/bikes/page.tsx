"use client";
import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";

export default function BikesListPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;
  const isStaff = user?.role === UserRole.SALES_STAFF;

  const [filters, setFilters] = useState({
    branch: "",
    status: "",
    model: "",
    vendor: "",
    search: "",
  });
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Set branch filter to user's branch if not admin
  useEffect(() => {
    if (!isAdmin && user?.branchId) {
      setFilters((prev) => ({ ...prev, branch: user.branchId || "" }));
    }
  }, [isAdmin, user?.branchId]);

  const handleFilterChange = (key: string, value: string) => {
    // Prevent non-admins from changing branch filter
    if (key === "branch" && !isAdmin) {
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.text.primary }}
          >
            Bikes Inventory
          </h1>
          <a
            href="/bikes/new"
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Add New Bike
          </a>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Total Bikes
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>
              —
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Low Stock Bikes
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.accents.secondary }}>
              —
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Out of Stock Bikes
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.accents.primary }}>
              —
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Total Bike Inventory Value
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>
              —
            </p>
          </div>
        </div>

        {/* Filters */}
        <div
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                  opacity: !isAdmin ? 0.6 : 1,
                }}
              >
                <option value="">All Branches</option>
                <option value="1">Islamabad HQ</option>
                <option value="2">Tordher Branch</option>
              </select>
              {!isAdmin && (
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  Filtered to your branch
                </p>
              )}
            </div>
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
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
                <option value="RESERVED">Reserved</option>
                <option value="IN_DELIVERY">In Delivery</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Model
              </label>
              <select
                value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Models</option>
                <option value="EVEE_SCOOTER_X">Evee Scooter X</option>
                <option value="EVEE_SCOOTER_Y">Evee Scooter Y</option>
                <option value="EVEE_ELECTRIC_500W">Evee Electric 500W</option>
                <option value="ROADKING_70CC">RoadKing 70cc</option>
                <option value="ROADKING_100CC">RoadKing 100cc</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Vendor
              </label>
              <select
                value={filters.vendor}
                onChange={(e) => handleFilterChange("vendor", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">All Vendors</option>
                <option value="EVEE">Evee</option>
                <option value="ROADKING">RoadKing</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                placeholder="Chassis, engine, or model"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <table className="w-full">
            <thead>
              <tr
                style={{ backgroundColor: theme.backgrounds.secondary }}
              >
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Chassis No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Engine No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  —
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <a
                      href="/bikes/1"
                      className="text-sm font-medium transition-colors hover:opacity-70"
                      style={{ color: theme.accents.primary }}
                    >
                      View
                    </a>
                    <a
                      href="/bikes/1/edit"
                      className="text-sm font-medium transition-colors hover:opacity-70"
                      style={{ color: theme.text.secondary }}
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => setShowTransferModal(true)}
                      className="text-sm font-medium transition-colors hover:opacity-70"
                      style={{ color: theme.text.secondary }}
                    >
                      Transfer
                    </button>
                    <button
                      onClick={() => setShowStatusModal(true)}
                      className="text-sm font-medium transition-colors hover:opacity-70"
                      style={{ color: theme.accents.secondary }}
                    >
                      Status
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Transfer Branch Modal */}
        {showTransferModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="rounded-lg p-6 max-w-md w-full mx-4"
              style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Transfer Branch
              </h3>
              <form className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    To Branch
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">Select branch</option>
                    <option value="1">Islamabad HQ</option>
                    <option value="2">Tordher Branch</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
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
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: theme.accents.primary,
                      color: theme.text.inverse,
                    }}
                  >
                    Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Status Modal */}
        {showStatusModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="rounded-lg p-6 max-w-md w-full mx-4"
              style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Change Status
              </h3>
              <form className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    New Status
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">Select status</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="SOLD">Sold</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="IN_DELIVERY">In Delivery</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
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
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: theme.accents.primary,
                      color: theme.text.inverse,
                    }}
                  >
                    Change Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
