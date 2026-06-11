"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import {
  getBikes,
  getBranches,
  getVendors,
  getBikeModels,
  transferBike,
  updateBikeStatus,
} from "@/lib/api/inventory";
import type { Branch, Vendor, BikeModel, BikeUnit } from "@/lib/types";

export default function BikesListPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;
  const isStaff = user?.role === "SALES_STAFF";

  const [filters, setFilters] = useState({
    branch: "",
    status: "",
    model: "",
    vendor: "",
    search: "",
  });
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Data state
  const [bikes, setBikes] = useState<BikeUnit[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [bikeModels, setBikeModels] = useState<BikeModel[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedBike, setSelectedBike] = useState<BikeUnit | null>(null);
  const [transferBranchId, setTransferBranchId] = useState("");
  const [statusValue, setStatusValue] = useState("");

  // Lock branch filter for non-admins and vendor filter for SALES_STAFF
  const [prevUserBranchId, setPrevUserBranchId] = useState(user?.branchId);
  if (user?.branchId !== prevUserBranchId) {
    setPrevUserBranchId(user?.branchId);
    if (!isAdmin && user?.branchId) {
      setFilters((prev) => ({ ...prev, branch: user.branchId || "" }));
    }
  }
  const [prevVendorId, setPrevVendorId] = useState(user?.vendorId);
  if (user?.vendorId !== prevVendorId) {
    setPrevVendorId(user?.vendorId ?? null);
    if (isStaff && user?.vendorId) {
      setFilters((prev) => ({ ...prev, vendor: user.vendorId || "" }));
    }
  }

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [branchesRes, vendorsRes, modelsRes] = await Promise.all([
          getBranches(),
          getVendors(),
          getBikeModels(),
        ]);
        setBranches(branchesRes.branches);
        setVendors(vendorsRes.vendors);
        setBikeModels(modelsRes.bikeModels);
      } catch (error) {
        console.error("Failed to fetch reference data:", error);
      }
    };
    fetchReferenceData();
  }, []);

  // Fetch bikes on mount and filter change
  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (filters.branch) params.branchId = filters.branch;
        if (filters.status) params.status = filters.status;
        if (filters.model) params.modelId = filters.model;
        if (filters.vendor) params.vendorId = filters.vendor;
        if (filters.search) params.search = filters.search;

        const response = await getBikes(params);
        setBikes(response.bikes);
      } catch (error) {
        console.error("Failed to fetch bikes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    // Prevent non-admins from changing branch filter
    if (key === "branch" && !isAdmin) {
      return;
    }
    // Prevent SALES_STAFF from changing vendor filter
    if (key === "vendor" && isStaff) {
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle transfer
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBike || !transferBranchId) return;

    try {
      await transferBike(selectedBike.id, transferBranchId);
      alert("Bike transferred successfully");
      setShowTransferModal(false);
      setTransferBranchId("");
      setSelectedBike(null);
      // Refetch bikes
      const params: Record<string, string> = {};
      if (filters.branch) params.branchId = filters.branch;
      if (filters.status) params.status = filters.status;
      if (filters.model) params.modelId = filters.model;
      if (filters.vendor) params.vendorId = filters.vendor;
      if (filters.search) params.search = filters.search;
      const response = await getBikes(params);
      setBikes(response.bikes);
    } catch (error) {
      console.error("Failed to transfer bike:", error);
      alert("Failed to transfer bike");
    }
  };

  // Handle status change
  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBike || !statusValue) return;

    try {
      await updateBikeStatus(selectedBike.id, statusValue);
      alert("Status updated successfully");
      setShowStatusModal(false);
      setStatusValue("");
      setSelectedBike(null);
      // Refetch bikes
      const params: Record<string, string> = {};
      if (filters.branch) params.branchId = filters.branch;
      if (filters.status) params.status = filters.status;
      if (filters.model) params.modelId = filters.model;
      if (filters.vendor) params.vendorId = filters.vendor;
      if (filters.search) params.search = filters.search;
      const response = await getBikes(params);
      setBikes(response.bikes);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  // Open transfer modal
  const openTransferModal = (bike: BikeUnit) => {
    setSelectedBike(bike);
    setTransferBranchId("");
    setShowTransferModal(true);
  };

  // Open status modal
  const openStatusModal = (bike: BikeUnit) => {
    setSelectedBike(bike);
    setStatusValue(bike.status);
    setShowStatusModal(true);
  };

  // Compute summary stats
  const totalBikes = bikes.length;
  const availableBikes = bikes.filter((b) => b.status === "AVAILABLE").length;
  const reservedBikes = bikes.filter((b) => b.status === "RESERVED").length;
  const soldBikes = bikes.filter((b) => b.status === "SOLD").length;

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
          <Link
            href="/bikes/new"
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Add New Bike
          </Link>
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
              {totalBikes}
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Available
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.accents.tertiary }}>
              {availableBikes}
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Reserved
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.accents.primary }}>
              {reservedBikes}
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Sold
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>
              {soldBikes}
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
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
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
                {bikeModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.brand} {model.modelName}
                  </option>
                ))}
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
                disabled={isStaff}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                  opacity: isStaff ? 0.6 : 1,
                }}
              >
                <option value="">All Vendors</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
              {isStaff && (
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  Filtered to your vendor
                </p>
              )}
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.accents.primary }}></div>
                    </div>
                  </td>
                </tr>
              ) : bikes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <p className="text-sm" style={{ color: theme.text.secondary }}>
                      No bikes found
                    </p>
                  </td>
                </tr>
              ) : (
                bikes.map((bike) => (
                  <tr key={bike.id} style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {bike.chassisNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {bike.engineNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {bike.model.brand} {bike.model.modelName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {bike.branch.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {bike.vendor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor:
                            bike.status === "AVAILABLE"
                              ? theme.accents.tertiary
                              : bike.status === "SOLD"
                              ? theme.accents.primary
                              : bike.status === "RESERVED"
                              ? theme.accents.secondary
                              : theme.backgrounds.secondary,
                          color: bike.status === "AVAILABLE" || bike.status === "SOLD" ? theme.text.inverse : theme.text.primary,
                        }}
                      >
                        {bike.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {/* <a
                          href={`/bikes/${bike.id}`}
                          className="text-sm font-medium transition-colors hover:opacity-70"
                          style={{ color: theme.accents.primary }}
                        >
                          View
                        </a> */}
                        {(isAdmin || isManager) && (
                          <>
                            <button
                              onClick={() => openTransferModal(bike)}
                              className="text-sm font-medium transition-colors hover:opacity-70"
                              style={{ color: theme.text.secondary }}
                            >
                              Transfer
                            </button>
                            <button
                              onClick={() => openStatusModal(bike)}
                              className="text-sm font-medium transition-colors hover:opacity-70"
                              style={{ color: theme.accents.secondary }}
                            >
                              Status
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    To Branch
                  </label>
                  <select
                    value={transferBranchId}
                    onChange={(e) => setTransferBranchId(e.target.value)}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">Select branch</option>
                    {branches
                      .filter((b) => b.id !== selectedBike?.branch.id)
                      .map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTransferModal(false);
                      setTransferBranchId("");
                      setSelectedBike(null);
                    }}
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
              <form onSubmit={handleStatusChange} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    New Status
                  </label>
                  <select
                    value={statusValue}
                    onChange={(e) => setStatusValue(e.target.value)}
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
                    onClick={() => {
                      setShowStatusModal(false);
                      setStatusValue("");
                      setSelectedBike(null);
                    }}
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
