"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { getBikeById, updateBikeStatus } from "@/lib/api/inventory";
import type { BikeUnit } from "@/lib/types";
import { toast } from "sonner";

export default function BikeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bikeId = params.id as string;

  const [bike, setBike] = useState<BikeUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusValue, setStatusValue] = useState("");

  // Fetch bike data on mount
  useEffect(() => {
    const fetchBike = async () => {
      try {
        const response = await getBikeById(bikeId);
        if (response.bike) {
          setBike(response.bike);
          setStatusValue(response.bike.status);
        }
      } catch (error) {
        console.error("Failed to fetch bike:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [bikeId]);

  // Handle status change
  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bike || !statusValue) return;

    try {
      await updateBikeStatus(bike.id, statusValue);
      toast.success("Status updated successfully");
      setShowStatusModal(false);
      // Refetch bike data
      const response = await getBikeById(bikeId);
      if (response.bike) {
        setBike(response.bike);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  // Open status modal
  const openStatusModal = () => {
    if (bike) {
      setStatusValue(bike.status);
      setShowStatusModal(true);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.accents.primary }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-center" style={{ color: theme.text.secondary }}>
            Bike not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text.primary }}
          >
            Bike Details
          </h1>
          <p style={{ color: theme.text.secondary }}>
            View bike information and documents
          </p>
        </div>

        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Chassis Number
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {bike.chassisNumber}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Engine Number
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {bike.engineNumber}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Model
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {bike.model.brand} {bike.model.modelName} ({bike.model.year})
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Vendor
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {bike.vendor.name}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Branch
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {bike.branch.name}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Current Status
              </label>
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
            </div>
          </div>
        </div>

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Documents
          </h3>

          {bike.documents.length === 0 ? (
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              No documents attached
            </p>
          ) : (
            <div className="space-y-3">
              {bike.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded"
                  style={{ backgroundColor: theme.backgrounds.tertiary }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                      {doc.fileType.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs" style={{ color: theme.text.muted }}>
                      {doc.fileName} • {(doc.fileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium transition-colors hover:opacity-70"
                    style={{ color: theme.accents.primary }}
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <a
            href="/bikes"
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back to Bikes
          </a>
          <button
            onClick={openStatusModal}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.secondary,
              color: theme.text.inverse,
            }}
          >
            Change Status
          </button>
          <a
            href={`/bikes/${bike.id}/edit`}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Edit Bike
          </a>
        </div>

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
