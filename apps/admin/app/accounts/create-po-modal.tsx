import { useState, useEffect } from "react";
import { theme } from "@/lib/colors";
import { getVendors, getBikeModels, getParts, getBranches } from "@/lib/api/inventory";
import { createPurchaseOrder } from "@/lib/api/accounting";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";

export function CreatePOModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [vendors, setVendors] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [vendorId, setVendorId] = useState("");
  const [type, setType] = useState("RESTOCK");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        getVendors(),
        getBikeModels(),
        getParts(),
        getBranches()
      ]).then(([v, m, p, b]) => {
        setVendors(v.vendors || []);
        setModels(m.bikeModels || []);
        setParts(p?.parts || []);
        setBranches(b.branches || []);
      }).catch(err => {
        console.error(err);
        toast.error("Failed to load reference data");
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddItem = (itemType: "BIKE" | "PART") => {
    setItems([
      ...items,
      {
        itemType,
        modelId: "",
        partId: "",
        branchId: "",
        quantity: 1,
        purchasePrice: 0,
        salePrice: 0
      }
    ]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!vendorId) return toast.error("Please select a vendor");
    if (items.length === 0) return toast.error("Please add at least one item");

    for (const item of items) {
      if (!item.branchId) return toast.error("Please select a branch for all items");
      if (item.itemType === "BIKE" && !item.modelId) return toast.error("Please select a bike model");
      if (item.itemType === "PART" && !item.partId) return toast.error("Please select a part");
      if (item.quantity <= 0) return toast.error("Quantity must be greater than 0");
    }

    const totalCost = items.reduce((sum, item) => sum + (Number(item.purchasePrice) * Number(item.quantity)), 0);

    const payload = {
      vendorId,
      type,
      totalCost,
      items: items.map(item => ({
        modelId: item.itemType === "BIKE" ? item.modelId : undefined,
        partId: item.itemType === "PART" ? item.partId : undefined,
        branchId: item.branchId,
        quantity: Number(item.quantity),
        purchasePrice: Number(item.purchasePrice),
        salePrice: Number(item.salePrice)
      }))
    };

    try {
      await createPurchaseOrder(payload);
      toast.success("Purchase Order created successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create PO");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p style={{ color: theme.text.secondary }}>Loading reference data...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text.primary }}>Create Purchase Order</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Vendor</label>
            <select
              className="w-full border rounded-md p-2 outline-none bg-transparent"
              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#e5e7eb' }}
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
            >
              <option value="">Select Vendor...</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>PO Type</label>
            <select
              className="w-full border rounded-md p-2 outline-none bg-transparent"
              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#e5e7eb' }}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="RESTOCK">Restock</option>
              <option value="NEW_INVENTORY">New Inventory</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Line Items</h3>
            <div className="space-x-2">
              <button 
                onClick={() => handleAddItem("BIKE")}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                + Add Bike
              </button>
              <button 
                onClick={() => handleAddItem("PART")}
                className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              >
                + Add Part
              </button>
            </div>
          </div>
          
          {items.length === 0 ? (
            <div className="text-sm text-center py-6 border rounded-lg" style={{ color: theme.text.secondary, borderColor: theme.borders?.light || '#f3f4f6', backgroundColor: 'rgba(0,0,0,0.02)' }}>
              No items added yet.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-center border p-4 rounded-lg" style={{ borderColor: theme.borders?.light || '#e5e7eb', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div className="col-span-3">
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>
                      {item.itemType === 'BIKE' ? 'Bike Model' : 'Part'}
                    </label>
                    <select
                      className="w-full border rounded p-2 text-sm outline-none bg-transparent"
                      style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#e5e7eb' }}
                      value={item.itemType === 'BIKE' ? item.modelId : item.partId}
                      onChange={(e) => updateItem(index, item.itemType === 'BIKE' ? 'modelId' : 'partId', e.target.value)}
                    >
                      <option value="">Select...</option>
                      {item.itemType === 'BIKE' 
                        ? models.map(m => <option key={m.id} value={m.id}>{m.brand} {m.modelName}</option>)
                        : parts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                      }
                    </select>
                  </div>
                  
                  <div className="col-span-3">
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>Destination Branch</label>
                    <select
                      className="w-full border rounded p-2 text-sm outline-none bg-transparent"
                      style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#e5e7eb' }}
                      value={item.branchId}
                      onChange={(e) => updateItem(index, 'branchId', e.target.value)}
                    >
                      <option value="">Select Branch...</option>
                      {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full border rounded p-2 text-sm outline-none bg-transparent"
                      style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#e5e7eb' }}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    />
                  </div>

                  <div className="col-span-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>Cost</label>
                        <input
                          type="number"
                          className="w-full border rounded p-2 text-sm outline-none bg-transparent"
                          style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#e5e7eb' }}
                          value={item.purchasePrice}
                          onChange={(e) => updateItem(index, 'purchasePrice', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>Sale Price</label>
                        <input
                          type="number"
                          className="w-full border rounded p-2 text-sm outline-none bg-transparent"
                          style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#e5e7eb' }}
                          value={item.salePrice}
                          onChange={(e) => updateItem(index, 'salePrice', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2 text-lg">
                      &times;
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="text-right text-sm font-bold p-3 mt-2" style={{ color: theme.text.primary }}>
                Total PO Cost: Rs. {items.reduce((sum, item) => sum + (Number(item.purchasePrice) * Number(item.quantity)), 0).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-5 border-t" style={{ borderColor: theme.borders?.light || '#e5e7eb' }}>
          <button 
            onClick={onClose}
            className="px-5 py-2 border rounded-md font-medium transition-colors"
            style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#d1d5db' }}
          >
            Cancel
          </button>
          <AsyncButton onClick={handleSubmit} className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 shadow-sm">
            Submit Purchase Order
          </AsyncButton>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
