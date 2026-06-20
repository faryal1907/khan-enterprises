"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import { getBikes, getParts } from "@/lib/api/inventory";
import { createManualOrder, createManualPartOrder } from "@/lib/api/orders";
import { numberToWords } from "@repo/utils";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { AsyncButton } from "@/components/async-button";

export default function ManualOrderPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isBranchScoped = user?.role !== UserRole.ADMIN && Boolean(user?.branchId);
  const [saleType, setSaleType] = useState<"BIKE" | "PART">("BIKE");
  const [formData, setFormData] = useState({
    chassisNumber: "",
    bikeModel: "",
    bikePrice: "",
    partInventoryId: "",
    partId: "",
    partName: "",
    partQuantity: "",
    partPrice: "",
    partMaxQuantity: "",
    customerName: "",
    customerCNIC: "",
    customerPhone: "",
    customerAddress: "",
    salePrice: "",
    paymentMethod: "",
  });

  const [bikeDetails, setBikeDetails] = useState<any>(null);

  const [allParts, setAllParts] = useState<any[]>([]);
  const [partSearchTerm, setPartSearchTerm] = useState("");
  const [isFetchingParts, setIsFetchingParts] = useState(false);
  const [showPartDropdown, setShowPartDropdown] = useState(false);

  useEffect(() => {
    if (saleType !== "PART") return;
    
    const fetchAllParts = async () => {
      setIsFetchingParts(true);
      try {
        const res = await getParts(isBranchScoped ? { branchId: user?.branchId || undefined } : undefined);
        setAllParts(res.parts || []);
      } catch (error) {
        console.error("Failed to fetch parts:", error);
      } finally {
        setIsFetchingParts(false);
      }
    };

    if (allParts.length === 0) {
      fetchAllParts();
    }
  }, [allParts.length, isBranchScoped, saleType, user?.branchId]);

  const partSearchResults = partSearchTerm.trim() && (!formData.partName || !partSearchTerm.includes(formData.partName))
    ? allParts.filter((p: any) => 
        p.part?.name?.toLowerCase().includes(partSearchTerm.toLowerCase()) || 
        p.part?.sku?.toLowerCase().includes(partSearchTerm.toLowerCase())
      )
    : allParts;

  // Auto-fill sale price for parts
  useEffect(() => {
    if (saleType === "PART") {
      const q = Number(formData.partQuantity);
      const p = Number(formData.partPrice);
      if (!isNaN(q) && !isNaN(p) && q > 0 && p >= 0) {
        setFormData((prev) => ({
          ...prev,
          salePrice: (q * p).toLocaleString(),
        }));
      }
    }
  }, [formData.partQuantity, formData.partPrice, saleType]);

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
        if (!formData.partInventoryId || !formData.partId || !formData.partQuantity || !formData.partPrice) {
          toast.error("Please fill in all part details");
          return;
        }

        const quantityClean = Number(formData.partQuantity);
        const priceClean = Number(formData.partPrice);
        const maxClean = Number(formData.partMaxQuantity || 0);

        if (quantityClean <= 0 || priceClean < 0) {
          toast.error("Please enter valid quantity and price");
          return;
        }

        if (quantityClean > maxClean) {
          toast.error(`Quantity cannot exceed available stock (${maxClean})`);
          return;
        }

        const salePriceClean = Number(formData.salePrice.replace(/,/g, ""));
        if (!salePriceClean || salePriceClean <= 0) {
          toast.error("Please enter a valid sale price");
          return;
        }

        const payload = {
          partId: formData.partId,
          partInventoryId: formData.partInventoryId,
          quantity: quantityClean,
          amount: salePriceClean,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerAddress: formData.customerAddress,
          paymentMethod: formData.paymentMethod,
        };

        const res = await createManualPartOrder(payload);
        toast.success("Part sale registered successfully!");
        router.push(`/part-orders/${res.id}`);
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
      const res = await getBikes({
        search: formData.chassisNumber.trim(),
        status: "AVAILABLE",
        limit: 50,
      });
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                    disabled={lookupLoading || isSubmitting}
                    className="flex-1 px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter chassis number"
                  />
                  <AsyncButton
                    onClick={handleChassisLookup}
                    loading={lookupLoading}
                    loadingLabel="Looking up..."
                    disabled={isSubmitting}
                  >
                    Lookup
                  </AsyncButton>
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
              <div className="relative">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Part *
                </label>
                <input
                  type="text"
                  value={partSearchTerm}
                  onChange={(e) => {
                    setPartSearchTerm(e.target.value);
                    if (formData.partId) {
                      handleInputChange("partInventoryId", "");
                      handleInputChange("partId", "");
                      handleInputChange("partName", "");
                      handleInputChange("partPrice", "");
                      handleInputChange("partMaxQuantity", "");
                    }
                    setShowPartDropdown(true);
                  }}
                  onFocus={() => setShowPartDropdown(true)}
                  onBlur={() => setTimeout(() => setShowPartDropdown(false), 200)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Search for a part..."
                />
                {showPartDropdown && (
                  <div
                    className="absolute z-10 w-full mt-1 rounded shadow-lg max-h-60 overflow-y-auto"
                    style={{
                      backgroundColor: theme.backgrounds.primary,
                      border: `1px solid ${theme.borders.medium}`,
                    }}
                  >
                    {isFetchingParts ? (
                      <div className="px-3 py-2 text-sm" style={{ color: theme.text.secondary }}>
                        Loading parts...
                      </div>
                    ) : partSearchResults.length > 0 ? (
                      partSearchResults.map((p: any) => (
                        <div
                          key={p.id}
                          className="px-3 py-2 text-sm cursor-pointer hover:opacity-80"
                          style={{
                            color: theme.text.primary,
                            backgroundColor: theme.backgrounds.tertiary,
                            borderBottom: `1px solid ${theme.borders.light}`,
                          }}
                          onClick={() => {
                            const availableQuantity = Math.max(0, (p.quantity || 0) - (p.reservedQuantity || 0));
                            setPartSearchTerm(`${p.part?.name} (${p.part?.sku})`);
                            handleInputChange("partInventoryId", p.id);
                            handleInputChange("partId", p.part?.id);
                            handleInputChange("partName", p.part?.name);
                            handleInputChange("partPrice", p.part?.sellingPrice?.toString() || "0");
                            handleInputChange("partMaxQuantity", availableQuantity.toString());
                            setShowPartDropdown(false);
                          }}
                        >
                          <div className="font-medium">{p.part?.name}</div>
                          <div className="text-xs" style={{ color: theme.text.secondary }}>
                            SKU: {p.part?.sku} | Rs. {Number(p.part?.sellingPrice || 0).toLocaleString()} | Available: {Math.max(0, (p.quantity || 0) - (p.reservedQuantity || 0))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm" style={{ color: theme.text.secondary }}>
                        No part found
                      </div>
                    )}
                  </div>
                )}
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
                  max={formData.partMaxQuantity || undefined}
                  value={formData.partQuantity}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (formData.partMaxQuantity && val) {
                      const maxVal = parseInt(formData.partMaxQuantity, 10);
                      const numVal = parseInt(val, 10);
                      if (!isNaN(numVal) && numVal > maxVal) {
                        val = formData.partMaxQuantity;
                        toast.error(`Only ${maxVal} units available in stock`);
                      }
                    }
                    handleInputChange("partQuantity", val);
                  }}
                  disabled={!formData.partInventoryId || isSubmitting}
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
                  disabled={!formData.partInventoryId || isSubmitting}
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
                disabled={isSubmitting}
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
                CNIC {saleType === "BIKE" ? "*" : ""}
              </label>
              <input
                type="text"
                value={formData.customerCNIC}
                onChange={(e) => handleInputChange("customerCNIC", e.target.value)}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                Address *
              </label>
              <input
                type="text"
                value={formData.customerAddress}
                onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">Select payment method</option>
                <option value="CASH">Cash</option>
                <option value="ONLINE_TRANSFER">Online Transfer</option>
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
          <AsyncButton
            onClick={handleRegisterSale}
            loading={isSubmitting}
            loadingLabel="Registering..."
            className="px-6"
          >
            Register Sale
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}
