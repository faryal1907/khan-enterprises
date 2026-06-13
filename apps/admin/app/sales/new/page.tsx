"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import { getBikes } from "@/lib/api/inventory";
import { createManualOrder, createManualPartOrder } from "@/lib/api/orders";
import { numberToWords } from "@repo/utils";

export default function ManualOrderPage() {
  const router = useRouter();
  const [saleType, setSaleType] = useState<"BIKE" | "PART">("BIKE");
  const [formData, setFormData] = useState({
    chassisNumber: "",
    bikeModel: "",
    bikePrice: "",
    partId: "",
    partName: "",
    partQuantity: "",
    partPrice: "",
    customerName: "",
    customerCNIC: "",
    customerPhone: "",
    customerAddress: "",
    salePrice: "",
    paymentMethod: "",
  });

  const [bikeDetails, setBikeDetails] = useState<any>(null);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const [lookupLoading, setLookupLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSale = async () => {
    try {
      if (!formData.customerName || !formData.customerPhone || !formData.customerAddress || !formData.paymentMethod) {
        toast.error("Please fill in all required fields");
        return;
      }

      setIsSubmitting(true);

      if (saleType === "BIKE") {
        if (!formData.chassisNumber || !bikeDetails) {
          toast.error("Please lookup and select an available bike");
          return;
        }
        if (!formData.customerCNIC) {
          toast.error("CNIC is required for bike sales");
          return;
        }

        const salePriceClean = Number(formData.salePrice.replace(/,/g, ""));
        if (!salePriceClean || salePriceClean <= 0) {
          toast.error("Please enter a valid sale price");
          return;
        }

        const payload = {
          chassisNumber: formData.chassisNumber,
          customerName: formData.customerName,
          customerCNIC: formData.customerCNIC,
          customerPhone: formData.customerPhone,
          customerAddress: formData.customerAddress,
          salePrice: salePriceClean,
          paymentMethod: formData.paymentMethod,
        };

        const res = await createManualOrder(payload);
        toast.success("Bike sale registered successfully!");
        router.push(`/orders/${res.id}`);
      } else {
        if (!formData.partId || !formData.partQuantity || !formData.partPrice) {
          toast.error("Please fill in all part details");
          return;
        }

        const quantityClean = Number(formData.partQuantity);
        const priceClean = Number(formData.partPrice);

        if (quantityClean <= 0 || priceClean < 0) {
          toast.error("Please enter valid quantity and price");
          return;
        }

        const payload = {
          partId: formData.partId,
          quantity: quantityClean,
          amount: quantityClean * priceClean,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerAddress: formData.customerAddress,
          paymentMethod: formData.paymentMethod,
        };

        const res = await createManualPartOrder(payload);
        toast.success("Part sale registered successfully!");
        router.push(`/orders`); // Part orders don't have dedicated details page yet, go to list
      }
    } catch (error: any) {
      console.error("Sale registration failed:", error);
      toast.error(error.response?.data?.message || "Failed to register sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChassisLookup = async () => {
    if (!formData.chassisNumber.trim()) {
      toast.error("Please enter a chassis number");
      return;
    }

    try {
      setLookupLoading(true);
      const res = await getBikes({ search: formData.chassisNumber.trim() });
      const bikes = res.bikes || [];
      const exactBike = bikes.find(
        (b: any) => b.chassisNumber.toUpperCase() === formData.chassisNumber.trim().toUpperCase()
      );

      if (!exactBike) {
        toast.error("No bike found with this chassis number");
        return;
      }

      if (exactBike.status !== "AVAILABLE") {
        toast.error(`Bike cannot be sold. Current status is ${exactBike.status}`);
        return;
      }

      const modelName = `${exactBike.model.brand} ${exactBike.model.modelName}`;
      const price = exactBike.price || exactBike.model.basePrice || 0;

      setBikeDetails({
        id: exactBike.id,
        model: modelName,
        price: price.toString(),
      });

      setFormData((prev) => ({
        ...prev,
        bikeModel: modelName,
        bikePrice: Number(price).toLocaleString(),
        salePrice: Number(price).toLocaleString(),
      }));

      toast.success("Bike found and available");
    } catch (error) {
      console.error("Lookup failed:", error);
      toast.error("Failed to lookup chassis number");
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.text.primary }}
          >
            Register Sale
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Manual sale entry with auto-generated documents
          </p>
        </div>

        {/* Sale Type Selection */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Sale Type
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => setSaleType("BIKE")}
              className={`px-6 py-3 text-sm font-medium rounded transition-colors ${
                saleType === "BIKE" ? "opacity-100" : "opacity-60 hover:opacity-80"
              }`}
              style={{
                backgroundColor: saleType === "BIKE" ? theme.accents.primary : theme.backgrounds.tertiary,
                color: saleType === "BIKE" ? theme.text.inverse : theme.text.primary,
                border: `1px solid ${saleType === "BIKE" ? theme.accents.primary : theme.borders.medium}`,
              }}
            >
              Bike
            </button>
            <button
              onClick={() => setSaleType("PART")}
              className={`px-6 py-3 text-sm font-medium rounded transition-colors ${
                saleType === "PART" ? "opacity-100" : "opacity-60 hover:opacity-80"
              }`}
              style={{
                backgroundColor: saleType === "PART" ? theme.accents.primary : theme.backgrounds.tertiary,
                color: saleType === "PART" ? theme.text.inverse : theme.text.primary,
                border: `1px solid ${saleType === "PART" ? theme.accents.primary : theme.borders.medium}`,
              }}
            >
              Part
            </button>
          </div>
        </div>

        {/* Bike Information */}
        {saleType === "BIKE" && (
          <div
            className="rounded-lg p-6 mb-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text.primary }}
            >
              Bike Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Chassis Number *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.chassisNumber}
                    onChange={(e) => handleInputChange("chassisNumber", e.target.value)}
                    className="flex-1 px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter chassis number"
                  />
                  <button
                    onClick={handleChassisLookup}
                    disabled={lookupLoading}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{
                      backgroundColor: theme.accents.primary,
                      color: theme.text.inverse,
                    }}
                  >
                    {lookupLoading ? "Looking up..." : "Lookup"}
                  </button>
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Model
                </label>
                <input
                  type="text"
                  value={formData.bikeModel}
                  readOnly
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                    opacity: 0.7,
                  }}
                  placeholder="Auto-filled from chassis"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Base Price
                </label>
                <input
                  type="text"
                  value={formData.bikePrice}
                  readOnly
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                    opacity: 0.7,
                  }}
                  placeholder="Auto-filled from chassis"
                />
              </div>
            </div>
          </div>
        )}

        {/* Part Information */}
        {saleType === "PART" && (
          <div
            className="rounded-lg p-6 mb-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text.primary }}
            >
              Part Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Part *
                </label>
                <select
                  value={formData.partId}
                  onChange={(e) => handleInputChange("partId", e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                >
                  <option value="">Select part</option>
                  <option value="1">Brake Pad</option>
                  <option value="2">Chain Kit</option>
                  <option value="3">Oil Filter</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.partQuantity}
                  onChange={(e) => handleInputChange("partQuantity", e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Quantity"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Unit Price *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.partPrice}
                  onChange={(e) => handleInputChange("partPrice", e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Price per unit"
                />
              </div>
            </div>
          </div>
        )}

        {/* Customer Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                placeholder="Customer name"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                CNIC *
              </label>
              <input
                type="text"
                value={formData.customerCNIC}
                onChange={(e) => handleInputChange("customerCNIC", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                placeholder="CNIC number"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Phone *
              </label>
              <input
                type="text"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                placeholder="Phone number"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Address
              </label>
              <input
                type="text"
                value={formData.customerAddress}
                onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                placeholder="Customer address"
              />
            </div>
          </div>
        </div>

        {/* Sale Details */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Sale Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Sale Price *
              </label>
              <input
                type="text"
                value={formData.salePrice}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val) {
                    handleInputChange("salePrice", Number(val).toLocaleString());
                  } else {
                    handleInputChange("salePrice", "");
                  }
                }}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                placeholder="Final sale price"
              />
              {formData.salePrice && (
                <p className="text-sm mt-2 font-medium" style={{ color: "#059669" }}>
                  {numberToWords(parseFloat(formData.salePrice.replace(/,/g, "")))}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Payment Method *
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">Select payment method</option>
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="SAFEPAY">Safepay (Visa/Mastercard)</option>
                <option value="JAZZCASH">JazzCash (Mobile Wallet)</option>
                <option value="RAAST">Raast (Instant Bank Transfer)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Document Generation Notice */}
        <div
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.accents.secondary}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Upon submission, the following documents will be auto-generated:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm" style={{ color: theme.text.secondary }}>
            <li>Sale Agreement PDF</li>
            <li>Invoice PDF</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <a
            href="/sales"
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Cancel
          </a>
          <button
            onClick={handleRegisterSale}
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            {isSubmitting ? "Registering..." : "Register Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
