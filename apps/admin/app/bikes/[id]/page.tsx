"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { getBikeById, updateBikeStatus, updateBike } from "@/lib/api/inventory";
import { getSettings } from "@/lib/api/settings";
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
  
  const [globalBikeDiscount, setGlobalBikeDiscount] = useState<number>(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [newDiscount, setNewDiscount] = useState("");
  const [newDiscountAmount, setNewDiscountAmount] = useState("");
  const [savingDiscount, setSavingDiscount] = useState(false);

  const [errorModalMsg, setErrorModalMsg] = useState("");

  // Fetch bike data on mount
  useEffect(() => {
    const fetchBike = async () => {
      try {
        const [bikeResponse, settingsResponse] = await Promise.all([
          getBikeById(bikeId),
          getSettings()
        ]);
        if (bikeResponse && bikeResponse.id) {
          setBike(bikeResponse);
          setStatusValue(bikeResponse.status);
        }
        if (settingsResponse && settingsResponse["GLOBAL_BIKE_DISCOUNT"]) {
          setGlobalBikeDiscount(parseFloat(settingsResponse["GLOBAL_BIKE_DISCOUNT"]));
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
      if (response && response.id) {
        setBike(response);
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

  const handleOpenDiscountModal = () => {
    if (bike) {
      const currentPercent = bike.onlineDiscountPercent || 0;
      setNewDiscount(currentPercent.toString());
      const currentPrice = bike.price ?? bike.model.basePrice;
      if (currentPrice) {
        setNewDiscountAmount(((currentPercent / 100) * currentPrice).toString());
      } else {
        setNewDiscountAmount("0");
      }
      setShowDiscountModal(true);
    }
  };

  const handleSaveDiscount = async () => {
    if (!bike) return;

    const discountVal = parseFloat(newDiscount || "0");
    if (discountVal < 0) {
      setErrorModalMsg("Discount cannot be negative.");
      return;
    }
    if (globalBikeDiscount + discountVal > 100) {
      setErrorModalMsg(`Total discount cannot exceed 100%. (Global discount is ${globalBikeDiscount}%)`);
      return;
    }

    setSavingDiscount(true);
    try {
      await updateBike(bike.id, { onlineDiscountPercent: discountVal });
      setShowDiscountModal(false);
      const response = await getBikeById(bikeId);
      if (response && response.id) {
        setBike(response);
      }
    } catch (error) {
      console.error("Failed to update discount:", error);
      toast.error("Failed to update discount.");
    } finally {
      setSavingDiscount(false);
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
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Price
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                Rs {(bike.price ?? bike.model.basePrice)?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Individual Discount
              </label>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {bike.onlineDiscountPercent !== undefined && bike.onlineDiscountPercent !== null ? `${bike.onlineDiscountPercent}%` : "0%"}
                </p>
                <button
                  onClick={handleOpenDiscountModal}
                  className="text-xs hover:underline"
                  style={{ color: theme.accents.primary }}
                >
                  Edit Discount
                </button>
              </div>
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

        {/* Custom Discount Modal */}
        {showDiscountModal && bike && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
            <div
              className="rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
              style={{ backgroundColor: theme.backgrounds.primary }}
            >
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: theme.text.primary }}
              >
                Update Discount
              </h3>
              
              <div className="mb-4">
                <p className="text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                  Global Discount Implemented: {globalBikeDiscount}%
                </p>
                <p className="text-xs" style={{ color: theme.text.muted }}>
                  * Note: The individual discount you apply here will be in addition to the global discount.
                </p>
              </div>
              
              {(() => {
                const currentPrice = bike.price ?? bike.model.basePrice ?? 0;
                return (
                  <>
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    Discount Amount (Rs)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={currentPrice ? (currentPrice * (100 - globalBikeDiscount) / 100) : 0}
                    value={newDiscountAmount}
                    onChange={(e) => {
                      setNewDiscountAmount(e.target.value);
                      const amount = parseFloat(e.target.value);
                      if (!isNaN(amount) && currentPrice > 0) {
                        const percent = (amount / currentPrice) * 100;
                        setNewDiscount(percent.toString());
                      } else if (e.target.value === "") {
                        setNewDiscount("0");
                      }
                    }}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={100 - globalBikeDiscount}
                    value={newDiscount}
                    onChange={(e) => {
                      setNewDiscount(e.target.value);
                      const percent = parseFloat(e.target.value);
                      if (!isNaN(percent) && currentPrice > 0) {
                        const amount = (percent / 100) * currentPrice;
                        setNewDiscountAmount(amount.toString());
                      } else if (e.target.value === "") {
                        setNewDiscountAmount("0");
                      }
                    }}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  />
                </div>
              </div>
              
              <div className="mb-6 p-4 rounded bg-gray-50 border border-gray-200">
                 <p className="text-sm font-medium text-gray-700">Price Breakdown</p>
                 <div className="mt-2 space-y-1 text-sm text-gray-600">
                   <div className="flex justify-between">
                     <span>Original Price:</span>
                     <span>Rs {currentPrice.toLocaleString() || "N/A"}</span>
                   </div>
                   <div className="flex justify-between text-red-600">
                     <span>Global Discount ({globalBikeDiscount}%):</span>
                     <span>- Rs {(currentPrice * (globalBikeDiscount / 100)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                   </div>
                   <div className="flex justify-between text-red-600">
                     <span>Individual Discount ({parseFloat(newDiscount || "0")}%):</span>
                     <span>- Rs {(currentPrice * (parseFloat(newDiscount || "0") / 100)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                   </div>
                   <div className="flex justify-between font-bold pt-2 border-t border-gray-200 text-gray-900">
                     <span>Final Price:</span>
                     <span>Rs {(currentPrice * (1 - (globalBikeDiscount + parseFloat(newDiscount || "0")) / 100)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                   </div>
                 </div>
              </div>
                  </>
                );
              })()}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDiscountModal(false)}
                  disabled={savingDiscount}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70 disabled:opacity-50"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    color: theme.text.secondary,
                    border: `1px solid ${theme.borders.medium}`,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDiscount}
                  disabled={savingDiscount}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  {savingDiscount ? "Saving..." : "Save Discount"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Validation Error Modal */}
        {errorModalMsg && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
            <div
              className="rounded-lg shadow-lg p-6 max-w-sm w-full mx-4"
              style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
            >
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: theme.accents.primary }}
              >
                Validation Error
              </h3>
              <p className="mb-6 text-sm" style={{ color: theme.text.primary }}>
                {errorModalMsg}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setErrorModalMsg("")}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
