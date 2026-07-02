"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { BikeStatusBadge } from "@/components/bike-status-badge";
import { SummaryCard } from "@/components/summary-card";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  getBikeModels,
  getBikes,
  getBranches,
  getVendors,
  transferBike,
  updateBikeStatus,
} from "@/lib/api/inventory";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import {
  BikeStatus,
  UserRole,
  type BikeInventoryResponse,
  type BikeModel,
  type BikeUnit,
  type Branch,
  type Vendor,
} from "@/lib/types";

const PAGE_SIZE = 20;

type BikeFilters = {
  branch: string;
  status: string;
  model: string;
  vendor: string;
};

const EMPTY_RESULT: BikeInventoryResponse = {
  bikes: [],
  pagination: { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 },
  summary: { total: 0, available: 0, reserved: 0, sold: 0, inDelivery: 0 },
};

function buildBikeParams(filters: BikeFilters, search: string, page: number) {
  return {
    ...(filters.branch && { branchId: filters.branch }),
    ...(filters.status && { status: filters.status }),
    ...(filters.model && { modelId: filters.model }),
    ...(filters.vendor && { vendorId: filters.vendor }),
    ...(search && { search }),
    page,
    limit: PAGE_SIZE,
  };
}

export default function BikesListPage() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isGlobal = isAdmin || !user?.branchId;

  const [filters, setFilters] = useState<BikeFilters>({
    branch: "",
    status: searchParams.get("status") || "",
    model: searchParams.get("model") || "",
    vendor: "",
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim());
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [result, setResult] = useState<BikeInventoryResponse>(EMPTY_RESULT);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [bikeModels, setBikeModels] = useState<BikeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBike, setSelectedBike] = useState<BikeUnit | null>(null);
  const [transferBranchId, setTransferBranchId] = useState("");
  const [modal, setModal] = useState<"transfer" | "release" | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    let active = true;
    Promise.all([getBranches(), getVendors(), getBikeModels()])
      .then(([branchResponse, vendorResponse, modelResponse]) => {
        if (!active) return;
        setBranches(branchResponse.branches);
        setVendors(vendorResponse.vendors);
        setBikeModels(modelResponse.bikeModels);
      })
      .catch((referenceError: Error) => {
        if (active) toast.error(referenceError.message || "Failed to load filter options");
      });
    return () => {
      active = false;
    };
  }, []);

  const effectiveFilters = useMemo(
    () => ({
      ...filters,
      branch: !isGlobal && user?.branchId ? user.branchId : filters.branch,
    }),
    [filters, isGlobal, user?.branchId],
  );
  const requestParams = useMemo(
    () => buildBikeParams(effectiveFilters, debouncedSearch, page),
    [debouncedSearch, effectiveFilters, page],
  );

  const loadBikes = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const response = await getBikes(requestParams);
      if (currentRequest === requestId.current) setResult(response);
    } catch (fetchError) {
      if (currentRequest === requestId.current) {
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load bikes");
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [requestParams]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadBikes(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadBikes, refreshKey]);

  const updateFilter = (key: keyof BikeFilters, value: string) => {
    if (key === "branch" && !isGlobal) return;
    setPage(1);
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const closeModal = useCallback(() => {
    if (isTransferring || isReleasing) return;
    setModal(null);
    setSelectedBike(null);
    setTransferBranchId("");
  }, [isReleasing, isTransferring]);

  const refetch = () => setRefreshKey((key) => key + 1);

  const submitTransfer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedBike || !transferBranchId) return;
    setIsTransferring(true);
    try {
      await transferBike(selectedBike.id, transferBranchId);
      toast.success("Bike transferred successfully");
      setModal(null);
      setSelectedBike(null);
      setTransferBranchId("");
      refetch();
    } catch (transferError) {
      toast.error(transferError instanceof Error ? transferError.message : "Failed to transfer bike");
    } finally {
      setIsTransferring(false);
    }
  };

  const submitRelease = async () => {
    if (!selectedBike) return;
    setIsReleasing(true);
    try {
      await updateBikeStatus(selectedBike.id, BikeStatus.AVAILABLE);
      toast.success("Bike released to available inventory");
      setModal(null);
      setSelectedBike(null);
      refetch();
    } catch (releaseError) {
      toast.error(releaseError instanceof Error ? releaseError.message : "Failed to release bike");
    } finally {
      setIsReleasing(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
              Bikes Inventory
            </h1>
            <p className="text-sm mt-1" style={{ color: theme.text.secondary }}>
              {isGlobal ? "Global inventory access" : "Inventory for your assigned branch"}
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Link
                href="/bikes/new"
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
              >
                Add New Bike
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <SummaryCard label="Total Bikes" value={result.summary.total} />
          <SummaryCard label="Available" value={result.summary.available} color={theme.accents.tertiary} />
          <SummaryCard label="Reserved" value={result.summary.reserved} color={theme.accents.secondary} />
          <SummaryCard label="Sold" value={result.summary.sold} />
          <SummaryCard label="In Delivery" value={result.summary.inDelivery} color={theme.accents.primary} />
        </div>

        {/* Pending Setup alert banner */}
        {(() => {
          const pendingCount = result.bikes.filter(
            (b) => b.status === BikeStatus.PENDING_SETUP,
          ).length;
          if (pendingCount === 0) return null;
          return (
            <div
              className="rounded-lg p-4 mb-6 flex items-center justify-between"
              style={{ backgroundColor: "#fffbeb", border: "1px solid #fcd34d" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <p className="text-sm font-medium text-amber-800">
                  {pendingCount} bike unit{pendingCount !== 1 ? "s" : ""} require setup — enter chassis and engine numbers to make them available for sale.
                </p>
              </div>
              <button
                onClick={() => updateFilter("status", BikeStatus.PENDING_SETUP)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900"
              >
                Show only
              </button>
            </div>
          );
        })()}

        <div
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <FilterSelect
              label="Branch"
              value={effectiveFilters.branch}
              disabled={!isGlobal}
              onChange={(value) => updateFilter("branch", value)}
              options={branches.map((branch) => ({ value: branch.id, label: branch.name }))}
              emptyLabel="All Branches"
              helper={!isGlobal ? "Filtered to your assigned branch" : undefined}
            />
            <FilterSelect
              label="Status"
              value={filters.status}
              onChange={(value) => updateFilter("status", value)}
              options={Object.values(BikeStatus).map((status) => ({
                value: status,
                label: status.replaceAll("_", " "),
              }))}
              emptyLabel="All Statuses"
            />
            <FilterSelect
              label="Model"
              value={filters.model}
              onChange={(value) => updateFilter("model", value)}
              options={bikeModels.map((model) => ({
                value: model.id,
                label: `${model.brand} ${model.modelName}`,
              }))}
              emptyLabel="All Models"
            />
            <FilterSelect
              label="Vendor"
              value={filters.vendor}
              onChange={(value) => updateFilter("vendor", value)}
              options={vendors.map((vendor) => ({ value: vendor.id, label: vendor.name }))}
              emptyLabel="All Vendors"
            />
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Search
              </label>
              <input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
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

        {error ? (
          <div
            className="rounded-lg p-8 text-center"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <p className="mb-4 text-sm" style={{ color: theme.accents.primary }}>
              {error}
            </p>
            <AsyncButton onClick={refetch}>Retry</AsyncButton>
          </div>
        ) : (
          <BikeTable
            bikes={result.bikes}
            loading={loading}
            isAdmin={isAdmin}
            onTransfer={(bike) => {
              setSelectedBike(bike);
              setTransferBranchId("");
              setModal("transfer");
            }}
            onRelease={(bike) => {
              setSelectedBike(bike);
              setModal("release");
            }}
          />
        )}

        {!error && result.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Showing {(result.pagination.page - 1) * result.pagination.limit + 1}-
              {Math.min(result.pagination.page * result.pagination.limit, result.pagination.total)} of{" "}
              {result.pagination.total}
            </p>
            <div className="flex gap-2">
              <AsyncButton
                disabled={loading || page <= 1}
                onClick={() => setPage((current) => current - 1)}
                style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary }}
              >
                Previous
              </AsyncButton>
              <AsyncButton
                disabled={loading || page >= result.pagination.totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </AsyncButton>
            </div>
          </div>
        )}
      </div>

      {modal === "transfer" && selectedBike && (
        <ActionModal title="Transfer Bike" onClose={closeModal}>
          <form onSubmit={submitTransfer} className="space-y-4">
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Transfer {selectedBike.chassisNumber} from {selectedBike.branch.name}.
            </p>
            <FilterSelect
              label="Destination Branch"
              value={transferBranchId}
              onChange={setTransferBranchId}
              options={branches
                .filter((branch) => branch.id !== selectedBike.branch.id)
                .map((branch) => ({ value: branch.id, label: branch.name }))}
              emptyLabel="Select branch"
            />
            <ModalActions onCancel={closeModal}>
              <AsyncButton
                type="submit"
                loading={isTransferring}
                loadingLabel="Transferring..."
                disabled={!transferBranchId}
              >
                Transfer
              </AsyncButton>
            </ModalActions>
          </form>
        </ActionModal>
      )}

      {modal === "release" && selectedBike && (
        <ActionModal title="Release Bike Reservation" onClose={closeModal}>
          <p className="text-sm mb-5" style={{ color: theme.text.secondary }}>
            Release {selectedBike.chassisNumber} back to available inventory? This will fail if an active offer or
            order still owns the reservation.
          </p>
          <ModalActions onCancel={closeModal}>
            <AsyncButton loading={isReleasing} loadingLabel="Releasing..." onClick={submitRelease}>
              Release Bike
            </AsyncButton>
          </ModalActions>
        </ActionModal>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  emptyLabel,
  disabled = false,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  emptyLabel: string;
  disabled?: boolean;
  helper?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 rounded text-sm disabled:opacity-60"
        style={{
          backgroundColor: theme.backgrounds.tertiary,
          border: `1px solid ${theme.borders.medium}`,
          color: theme.text.primary,
        }}
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper && (
        <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
          {helper}
        </p>
      )}
    </div>
  );
}

function BikeTable({
  bikes,
  loading,
  isAdmin,
  onTransfer,
  onRelease,
}: {
  bikes: BikeUnit[];
  loading: boolean;
  isAdmin: boolean;
  onTransfer: (bike: BikeUnit) => void;
  onRelease: (bike: BikeUnit) => void;
}) {
  return (
    <div
      className="rounded-lg overflow-hidden overflow-x-auto"
      style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
            {["Chassis No.", "Motor No.", "Model", "Branch", "Vendor", "Status", "Actions"].map((heading) => (
              <th
                key={heading}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: theme.text.secondary }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center">
                <div className="flex justify-center">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{ borderColor: theme.accents.primary }}
                  />
                </div>
              </td>
            </tr>
          ) : bikes.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-sm" style={{ color: theme.text.secondary }}>
                No bikes found
              </td>
            </tr>
          ) : (
            bikes.map((bike) => (
              <tr
                key={bike.id}
                style={{
                  borderBottom: `1px solid ${theme.borders.light}`,
                  backgroundColor: bike.status === BikeStatus.PENDING_SETUP ? "#fffbeb" : undefined,
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  {bike.status === BikeStatus.PENDING_SETUP && bike.chassisNumber.startsWith("PENDING-") ? (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">
                      Not entered yet
                    </span>
                  ) : (
                    bike.chassisNumber
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                  {bike.status === BikeStatus.PENDING_SETUP && bike.engineNumber.startsWith("PENDING-") ? (
                    <span className="text-xs" style={{ color: theme.text.muted }}>—</span>
                  ) : (
                    bike.engineNumber
                  )}
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
                  <BikeStatusBadge status={bike.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-3">
                    <Link href={`bikes/${bike.id}`} style={{ color: theme.text.secondary }}>
                      View
                    </Link>
                    {isAdmin && (
                      <Link href={`bikes/${bike.id}/edit`} style={{ color: theme.accents.primary }}>
                        Edit
                      </Link>
                    )}
                    {isAdmin && bike.status === BikeStatus.AVAILABLE && (
                      <button onClick={() => onTransfer(bike)} style={{ color: theme.text.secondary }}>
                        Transfer
                      </button>
                    )}
                    {isAdmin && bike.status === BikeStatus.RESERVED && (
                      <button onClick={() => onRelease(bike)} style={{ color: theme.accents.secondary }}>
                        Release
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ModalActions({ onCancel, children }: { onCancel: () => void; children: React.ReactNode }) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
        style={{
          backgroundColor: theme.backgrounds.tertiary,
          color: theme.text.secondary,
          border: `1px solid ${theme.borders.medium}`,
        }}
      >
        Cancel
      </button>
      {children}
    </div>
  );
}
