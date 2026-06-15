"use client";
import { theme } from "@/lib/colors";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPart, getBranches } from "@/lib/api/inventory";
import type { Branch } from "@/lib/types";
import { numberToWords } from "@repo/utils";

export default function AddPartPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "ELECTRICAL",
    description: "",
    sellingPrice: "",
    branchId: "",
    quantity: "",
    reorderLevel: "5",
  });

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getBranches();
        setBranches(data.branches || []);
        if (data.branches && data.branches.length > 0) {
          setFormData((prev) => ({ ...prev, branchId: data.branches[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        toast.error("Failed to load branches");
      }
    };
    fetchBranches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.sku || !formData.category || !formData.sellingPrice || !formData.branchId) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      await createPart({
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        description: formData.description,
        sellingPrice: Number(formData.sellingPrice.replace(/,/g, "")),
        branchId: formData.branchId,
        quantity: Number(formData.quantity) || 0,
        reorderLevel: Number(formData.reorderLevel) || 0,
      });

      toast.success("Part added successfully");
      router.push("/parts");
    } catch (error: any) {
      console.error("Failed to add part:", error);
      toast.error(error.response?.data?.message || "Failed to add part");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: theme.text.primary }}
            >
              Add New Part
            </h1>
            <p style={{ color: theme.text.secondary }}>
              Enter the details for the new part
            </p>
          </div>
          <Link
            href="/parts"
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              color: theme.text.primary,
              border: `1px solid ${theme.borders.medium}`
            }}
          >
            &larr; Back to Parts
          </Link>
        </div>

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Basic Info
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Part Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter part name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.text.secondary }}
                    >
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      required
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: theme.backgrounds.tertiary,
                        border: `1px solid ${theme.borders.medium}`,
                        color: theme.text.primary,
                      }}
                      placeholder="Enter SKU (e.g., P-1234)"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.text.secondary }}
                    >
                      Category *
                    </label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: theme.backgrounds.tertiary,
                        border: `1px solid ${theme.borders.medium}`,
                        color: theme.text.primary,
                      }}
                    >
                      <option value="ELECTRICAL">Electrical</option>
                      <option value="MECHANICAL">Mechanical</option>
                      <option value="ACCESSORIES">Accessories</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Selling Price (Rs) *
                  </label>
                  <input
                    type="text"
                    name="sellingPrice"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val) {
                        setFormData((prev) => ({ ...prev, sellingPrice: Number(val).toLocaleString() }));
                      } else {
                        setFormData((prev) => ({ ...prev, sellingPrice: "" }));
                      }
                    }}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="e.g. 2,500"
                  />
                  {formData.sellingPrice && (
                    <p className="text-sm mt-2 font-medium" style={{ color: "#059669" }}>
                      {numberToWords(parseFloat(formData.sellingPrice.replace(/,/g, "")))}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Description
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Initial Inventory
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Branch *
                  </label>
                  <select
                    name="branchId"
                    required
                    value={formData.branchId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.text.secondary }}
                    >
                      Initial Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: theme.backgrounds.tertiary,
                        border: `1px solid ${theme.borders.medium}`,
                        color: theme.text.primary,
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.text.secondary }}
                    >
                      Reorder Level *
                    </label>
                    <input
                      type="number"
                      name="reorderLevel"
                      min="0"
                      required
                      value={formData.reorderLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: theme.backgrounds.tertiary,
                        border: `1px solid ${theme.borders.medium}`,
                        color: theme.text.primary,
                      }}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Link
                href="/parts"
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                {loading ? "Adding..." : "Add Part"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
