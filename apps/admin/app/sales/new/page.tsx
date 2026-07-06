"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import { getBikes, getParts } from "@/lib/api/inventory";
import { createManualOrder, createManualPartOrder } from "@/lib/api/orders";
import { getPaymentAccounts } from "@/lib/api/accounting";
import { numberToWords } from "@/lib/number-to-words";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { AsyncButton } from "@/components/async-button";

interface PaymentAccount {
  id: string;
  name: string;
  subtype: string;
  accountNumber: string | null;
  code: string;
}

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
  });

  // Payment state
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [initialPaymentDisplay, setInitialPaymentDisplay] = useState<string>("");
  const [isPartial, setIsPartial] = useState(false);

  interface BikeDetail {
    id: string;
    model: string;
    price: string;
  }
  const [bikeDetails, setBikeDetails] = useState<BikeDetail | null>(null);

  interface PartInventory {
    id: string;
    quantity?: number;
    reservedQuantity?: number;
    part?: {
      id: string;
      name: string;
      sku: string;
      sellingPrice?: number | string;
    };
  }
  const [allParts, setAllParts] = useState<PartInventory[]>([]);
  const [partSearchTerm, setPartSearchTerm] = useState("");
  const [isFetchingParts, setIsFetchingParts] = useState(false);
  const [showPartDropdown, setShowPartDropdown] = useState(false);

  interface BikeInventory {
    id: string;
    chassisNumber: string;
    status: string;
    model?: {
      brand: string;
      modelName: string;
      basePrice?: number | null;
    };
    price?: number | null;
  }
  const [allBikes, setAllBikes] = useState<BikeInventory[]>([]);
  const [bikeSearchTerm, setBikeSearchTerm] = useState("");
  const [isFetchingBikes, setIsFetchingBikes] = useState(false);
  const [showBikeDropdown, setShowBikeDropdown] = useState(false);

  useEffect(() => {
    getPaymentAccounts().then(setPaymentAccounts).catch(() => {});
  }, []);

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
    if (allParts.length === 0) fetchAllParts();
  }, [allParts.length, isBranchScoped, saleType, user?.branchId]);

  useEffect(() => {
    if (saleType !== "BIKE") return;
    const fetchAllBikes = async () => {
      setIsFetchingBikes(true);
      try {
        const res = await getBikes({
          status: "AVAILABLE",
          ...(isBranchScoped && user?.branchId ? { branchId: user.branchId } : {}),
          limit: 100,
        });
        setAllBikes(res.bikes || []);
      } catch (error) {
        console.error("Failed to fetch bikes:", error);
      } finally {
        setIsFetchingBikes(false);
      }
    };
    if (allBikes.length === 0) fetchAllBikes();
  }, [allBikes.length, isBranchScoped, saleType, user?.branchId]);

  const partSearchResults =
    partSearchTerm.trim() && (!formData.partName || !partSearchTerm.includes(formData.partName))
      ? allParts.filter(
          (p: PartInventory) =>
            p.part?.name?.toLowerCase().includes(partSearchTerm.toLowerCase()) ||
            p.part?.sku?.toLowerCase().includes(partSearchTerm.toLowerCase())
        )
      : allParts;

  const bikeSearchResults =
    bikeSearchTerm.trim() && (!formData.chassisNumber || !bikeSearchTerm.includes(formData.chassisNumber))
      ? allBikes.filter(
          (b: BikeInventory) =>
            b.chassisNumber?.toLowerCase().includes(bikeSearchTerm.toLowerCase()) ||
            `${b.model?.brand} ${b.model?.modelName}`.toLowerCase().includes(bikeSearchTerm.toLowerCase())
        )
      : allBikes;

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      if (saleType === "PART" && (key === "partQuantity" || key === "partPrice")) {
        const q = Number(next.partQuantity);
        const p = Number(next.partPrice);
        if (!isNaN(q) && !isNaN(p) && q > 0 && p >= 0) {
          next.salePrice = (q * p).toLocaleString();
        }
      }
      return next;
    });
    // When sale price changes, reset partial payment to full
    if (key === "salePrice" && !isPartial) {
      setInitialPaymentDisplay(value);
    }
  };

  // When sale price is updated and not partial mode, keep initial payment in sync
  useEffect(() => {
    if (!isPartial) setInitialPaymentDisplay(formData.salePrice);
  }, [formData.salePrice, isPartial]);

  const salePriceNum = Number(formData.salePrice.replace(/,/g, "")) || 0;
  const initialPaymentNum = isPartial
    ? Number(initialPaymentDisplay.replace(/,/g, "")) || 0
    : salePriceNum;
  const balanceDue = Math.max(0, salePriceNum - initialPaymentNum);

  const selectAccount = (acc: PaymentAccount) => {
    setSelectedAccountId(acc.id);
    setSelectedMethod(acc.subtype === "CASH" ? "CASH" : "ONLINE_TRANSFER");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSale = async () => {
    try {
      if (!formData.customerName || !formData.customerPhone || !formData.customerAddress) {
        toast.error("Please fill in all required customer fields");
        return;
      }
      if (!selectedAccountId || !selectedMethod) {
        toast.error("Please select a payment account");
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
        if (!salePriceNum || salePriceNum <= 0) {
          toast.error("Please enter a valid sale price");
          return;
        }
        if (isPartial && initialPaymentNum <= 0) {
          toast.error("Initial payment must be greater than zero");
          return;
        }
        if (isPartial && initialPaymentNum < salePriceNum * 0.5) {
          toast.error("Initial payment must be at least 50% of the sale price");
          return;
        }

        const payload = {
          chassisNumber: formData.chassisNumber,
          customerName: formData.customerName,
          customerCNIC: formData.customerCNIC,
          customerPhone: formData.customerPhone,
          customerAddress: formData.customerAddress,
          salePrice: salePriceNum,
          paymentMethod: selectedMethod,
          accountId: selectedAccountId,
          isInstallmentPlan: isPartial && balanceDue > 0,
          initialPaymentAmount: initialPaymentNum,
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
        const maxClean = Number(formData.partMaxQuantity || 0);
        if (quantityClean <= 0) {
          toast.error("Please enter valid quantity");
          return;
        }
        if (quantityClean > maxClean) {
          toast.error(`Quantity cannot exceed available stock (${maxClean})`);
          return;
        }
        if (!salePriceNum || salePriceNum <= 0) {
          toast.error("Please enter a valid sale price");
          return;
        }
        if (isPartial && initialPaymentNum <= 0) {
          toast.error("Initial payment must be greater than zero");
          return;
        }

        const payload = {
          partId: formData.partId,
          partInventoryId: formData.partInventoryId,
          quantity: quantityClean,
          amount: salePriceNum,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerAddress: formData.customerAddress,
          paymentMethod: selectedMethod,
          accountId: selectedAccountId,
          isInstallmentPlan: isPartial && balanceDue > 0,
          initialPaymentAmount: initialPaymentNum,
        };

        const res = await createManualPartOrder(payload);
        toast.success("Part sale registered successfully!");
        router.push(`/part-orders/${res.id}`);
      }
    } catch (error: unknown) {
      console.error("Sale registration failed:", error);
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Failed to register sale"
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  // ── Shared input style
  const inputStyle = {
    backgroundColor: theme.backgrounds.tertiary,
    border: `1px solid ${theme.borders.medium}`,
    color: theme.text.primary,
  };

  return (
    <div className="px-4 py-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.text.primary }}>Register Sale</h1>
          <p className="text-sm md:text-base" style={{ color: theme.text.secondary }}>Manual sale entry with auto-generated documents</p>
        </div>

        {/* Sale Type */}
        <div className="rounded-lg p-4 md:p-6 mb-4 md:mb-6" style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}>
          <h3 className="text-lg font-semibold mb-3 md:mb-4" style={{ color: theme.text.primary }}>Sale Type</h3>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
             {(["BIKE", "PART"] as const).map((t) => (
               <button
                 key={t}
                 onClick={() => setSaleType(t)}
                 disabled={isSubmitting}
                 className="px-4 py-2.5 text-sm font-medium rounded transition-colors w-full sm:w-auto"
                 style={{
                   backgroundColor: saleType === t ? theme.accents.primary : theme.backgrounds.tertiary,
                   color: saleType === t ? theme.text.inverse : theme.text.primary,
                   border: `1px solid ${saleType === t ? theme.accents.primary : theme.borders.medium}`,
                   opacity: isSubmitting ? 0.6 : 1,
                 }}
               >
                 {t === "BIKE" ? "Bike" : "Part"}
               </button>
             ))}
          </div>
        </div>

        {/* Bike Information */}
        {saleType === "BIKE" && (
          <div className="rounded-lg p-4 md:p-6 mb-4 md:mb-6" style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}>
            <h3 className="text-lg font-semibold mb-3 md:mb-4" style={{ color: theme.text.primary }}>Bike Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Chassis Number *</label>
                <input 
                  type="text" 
                  value={bikeSearchTerm} 
                  onChange={(e) => { 
                    setBikeSearchTerm(e.target.value); 
                    if (formData.chassisNumber) { 
                      handleInputChange("chassisNumber", "");
                      setBikeDetails(null);
                    } 
                    setShowBikeDropdown(true); 
                  }} 
                  onFocus={() => setShowBikeDropdown(true)} 
                  onBlur={() => setTimeout(() => setShowBikeDropdown(false), 200)} 
                  disabled={isSubmitting} 
                  className="w-full px-3 py-2 rounded text-sm" 
                  style={inputStyle} 
                  placeholder="Search chassis number..." 
                />
                {showBikeDropdown && (
                  <div className="absolute z-10 w-full mt-1 rounded shadow-lg max-h-60 overflow-y-auto" style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}` }}>
                    {isFetchingBikes ? (
                      <div className="px-3 py-2 text-sm" style={{ color: theme.text.secondary }}>Loading bikes...</div>
                    ) : bikeSearchResults.length > 0 ? (
                      bikeSearchResults.map((b: BikeInventory) => (
                        <div 
                          key={b.id} 
                          className="px-3 py-2 text-sm cursor-pointer hover:opacity-80" 
                          style={{ color: theme.text.primary, backgroundColor: theme.backgrounds.tertiary, borderBottom: `1px solid ${theme.borders.light}` }} 
                          onClick={() => { 
                            const modelName = `${b.model?.brand} ${b.model?.modelName}`;
                            const price = b.price || b.model?.basePrice || 0;
                            setBikeSearchTerm(b.chassisNumber);
                            handleInputChange("chassisNumber", b.chassisNumber);
                            setBikeDetails({ id: b.id, model: modelName, price: price.toString() });
                            setFormData((prev) => ({
                              ...prev,
                              bikeModel: modelName,
                              bikePrice: Number(price).toLocaleString(),
                              salePrice: Number(price).toLocaleString(),
                            }));
                            setShowBikeDropdown(false);
                          }}
                        >
                          <div className="font-medium">{b.chassisNumber}</div>
                          <div className="text-xs" style={{ color: theme.text.secondary }}>{b.model?.brand} {b.model?.modelName} | Rs. {Number(b.price || b.model?.basePrice || 0).toLocaleString()}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm" style={{ color: theme.text.secondary }}>No bike found</div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Model</label>
                <input type="text" value={formData.bikeModel} readOnly className="w-full px-3 py-2 rounded text-sm" style={{ ...inputStyle, opacity: 0.7 }} placeholder="Auto-filled from chassis" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Base Price</label>
                <input type="text" value={formData.bikePrice} readOnly className="w-full px-3 py-2 rounded text-sm" style={{ ...inputStyle, opacity: 0.7 }} placeholder="Auto-filled from chassis" />
              </div>
            </div>
          </div>
        )}

        {/* Part Information */}
        {saleType === "PART" && (
          <div className="rounded-lg p-4 md:p-6 mb-4 md:mb-6" style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}>
            <h3 className="text-lg font-semibold mb-3 md:mb-4" style={{ color: theme.text.primary }}>Part Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Part *</label>
                <input type="text" value={partSearchTerm} onChange={(e) => { setPartSearchTerm(e.target.value); if (formData.partId) { ["partInventoryId","partId","partName","partPrice","partMaxQuantity"].forEach(k => handleInputChange(k, "")); } setShowPartDropdown(true); }} onFocus={() => setShowPartDropdown(true)} onBlur={() => setTimeout(() => setShowPartDropdown(false), 200)} disabled={isSubmitting} className="w-full px-3 py-2 rounded text-sm" style={inputStyle} placeholder="Search for a part..." />
                {showPartDropdown && (
                  <div className="absolute z-10 w-full mt-1 rounded shadow-lg max-h-60 overflow-y-auto" style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}` }}>
                    {isFetchingParts ? (
                      <div className="px-3 py-2 text-sm" style={{ color: theme.text.secondary }}>Loading parts...</div>
                    ) : partSearchResults.length > 0 ? (
                      partSearchResults.map((p: PartInventory) => (
                        <div key={p.id} className="px-3 py-2 text-sm cursor-pointer hover:opacity-80" style={{ color: theme.text.primary, backgroundColor: theme.backgrounds.tertiary, borderBottom: `1px solid ${theme.borders.light}` }} onClick={() => { const avail = Math.max(0, (p.quantity || 0) - (p.reservedQuantity || 0)); setPartSearchTerm(`${p.part?.name} (${p.part?.sku})`); handleInputChange("partInventoryId", p.id); handleInputChange("partId", p.part?.id || ""); handleInputChange("partName", p.part?.name || ""); handleInputChange("partPrice", p.part?.sellingPrice?.toString() || "0"); handleInputChange("partMaxQuantity", avail.toString()); setShowPartDropdown(false); }}>
                          <div className="font-medium">{p.part?.name}</div>
                          <div className="text-xs" style={{ color: theme.text.secondary }}>SKU: {p.part?.sku} | Rs. {Number(p.part?.sellingPrice || 0).toLocaleString()} | Available: {Math.max(0, (p.quantity || 0) - (p.reservedQuantity || 0))}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm" style={{ color: theme.text.secondary }}>No part found</div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Quantity *</label>
                <input type="number" min="1" max={formData.partMaxQuantity || undefined} value={formData.partQuantity} onChange={(e) => { let val = e.target.value; if (formData.partMaxQuantity && val) { const mx = parseInt(formData.partMaxQuantity, 10); const nv = parseInt(val, 10); if (!isNaN(nv) && nv > mx) { val = formData.partMaxQuantity; toast.error(`Only ${mx} units available`); } } handleInputChange("partQuantity", val); }} disabled={!formData.partInventoryId || isSubmitting} className="w-full px-3 py-2 rounded text-sm" style={inputStyle} placeholder="Quantity" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Unit Price *</label>
                <input type="number" min="0" step="0.01" value={formData.partPrice} onChange={(e) => handleInputChange("partPrice", e.target.value)} disabled={!formData.partInventoryId || isSubmitting} className="w-full px-3 py-2 rounded text-sm" style={inputStyle} placeholder="Price per unit" />
              </div>
            </div>
          </div>
        )}

        {/* Customer Information */}
        <div className="rounded-lg p-4 md:p-6 mb-4 md:mb-6" style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}>
          <h3 className="text-lg font-semibold mb-3 md:mb-4" style={{ color: theme.text.primary }}>Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Customer Name *</label>
              <input type="text" value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value)} disabled={isSubmitting} className="w-full px-3 py-2 rounded text-sm" style={inputStyle} placeholder="Customer name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>CNIC {saleType === "BIKE" ? "*" : ""}</label>
              <input type="text" value={formData.customerCNIC} onChange={(e) => handleInputChange("customerCNIC", e.target.value)} disabled={isSubmitting} className="w-full px-3 py-2 rounded text-sm" style={inputStyle} placeholder="CNIC number" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Phone *</label>
              <input type="text" value={formData.customerPhone} onChange={(e) => handleInputChange("customerPhone", e.target.value)} disabled={isSubmitting} className="w-full px-3 py-2 rounded text-sm" style={inputStyle} placeholder="Phone number" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Address *</label>
              <input type="text" value={formData.customerAddress} onChange={(e) => handleInputChange("customerAddress", e.target.value)} disabled={isSubmitting} className="w-full px-3 py-2 rounded text-sm" style={inputStyle} placeholder="Customer address" />
            </div>
          </div>
        </div>

        {/* Sale Details */}
        <div className="rounded-lg p-4 md:p-6 mb-4 md:mb-6" style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}>
          <h3 className="text-lg font-semibold mb-3 md:mb-4" style={{ color: theme.text.primary }}>Sale Details</h3>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Sale Price *</label>
            <input
              type="text"
              value={formData.salePrice}
              onChange={(e) => { const val = e.target.value.replace(/\D/g, ""); handleInputChange("salePrice", val ? Number(val).toLocaleString() : ""); }}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded text-sm"
              style={inputStyle}
              placeholder="Final sale price"
            />
            {salePriceNum > 0 && (
              <p className="text-sm mt-1 font-medium" style={{ color: "#059669" }}>{numberToWords(salePriceNum)}</p>
            )}
          </div>

          {/* Partial payment toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 md:mb-4">
            <button
              type="button"
              onClick={() => { setIsPartial(!isPartial); if (!isPartial) setInitialPaymentDisplay(""); }}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0"
              style={{ backgroundColor: isPartial ? theme.accents.primary : theme.borders.medium }}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPartial ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className="text-sm font-medium" style={{ color: theme.text.primary }}>Partial Payment</span>
            {isPartial && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">Balance will be recorded as receivable</span>}
          </div>

          {isPartial && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 rounded-lg mb-3 md:mb-4" style={{ backgroundColor: theme.backgrounds.secondary }}>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Amount Paid Now *</label>
                <input
                  type="text"
                  value={initialPaymentDisplay}
                  onChange={(e) => { const val = e.target.value.replace(/\D/g, ""); setInitialPaymentDisplay(val ? Number(val).toLocaleString() : ""); }}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={inputStyle}
                  placeholder="Amount received now"
                />
                {initialPaymentNum > 0 && (
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{numberToWords(initialPaymentNum)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Balance Due</label>
                <div className="px-3 py-2 rounded text-sm font-semibold" style={{ ...inputStyle, opacity: 0.7, color: balanceDue > 0 ? "#EF4444" : "#10B981" }}>
                  Rs. {balanceDue.toLocaleString()}
                </div>
                {balanceDue > 0 && <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{numberToWords(balanceDue)}</p>}
              </div>
              <div className="flex items-end">
                {saleType === "BIKE" && salePriceNum > 0 && (
                  <p className="text-xs" style={{ color: theme.text.muted }}>
                    Min. advance: Rs. {Math.ceil(salePriceNum * 0.5).toLocaleString()} (50%)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Account Selection */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: theme.text.secondary }}>
              Payment Account * <span className="font-normal" style={{ color: theme.text.muted }}>— where is the money going?</span>
            </label>
            {paymentAccounts.length === 0 ? (
              <p className="text-sm" style={{ color: theme.text.muted }}>Loading accounts...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {paymentAccounts.map((acc) => {
                  const isSelected = selectedAccountId === acc.id;
                  const isCash = acc.subtype === "CASH";
                  const isBank = acc.subtype === "BANK";
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => selectAccount(acc)}
                      disabled={isSubmitting}
                      className="flex flex-col items-start p-3 rounded-lg text-left transition-all"
                      style={{
                        border: `2px solid ${isSelected ? theme.accents.primary : theme.borders.medium}`,
                        backgroundColor: isSelected ? theme.accents.primary + "12" : theme.backgrounds.tertiary,
                      }}
                    >
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold mb-1.5" style={{ backgroundColor: isCash ? "#FEF9C3" : isBank ? "#DBEAFE" : "#F0FDF4", color: isCash ? "#713F12" : isBank ? "#1D4ED8" : "#15803D" }}>
                        {acc.subtype}
                      </span>
                      <span className="text-sm font-semibold leading-tight" style={{ color: theme.text.primary }}>{acc.name}</span>
                      {acc.accountNumber && <span className="text-xs font-mono mt-0.5" style={{ color: theme.text.secondary }}>{acc.accountNumber}</span>}
                      {isSelected && (
                        <svg className="w-4 h-4 mt-1.5" fill="none" stroke={theme.accents.primary} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-4 md:mt-6">
          <a href="/sales" className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70 text-center" style={{ backgroundColor: theme.backgrounds.primary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}>
            Cancel
          </a>
          <AsyncButton onClick={handleRegisterSale} loading={isSubmitting} loadingLabel="Registering..." className="px-4 md:px-6 w-full sm:w-auto">
            Register Sale
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}
