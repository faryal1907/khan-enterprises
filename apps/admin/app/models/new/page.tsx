"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { theme } from "@/lib/colors";
import { createBikeModel } from "@/lib/api/inventory";
import Link from "next/link";
import { numberToWords } from "@repo/utils";

export default function NewBikeModelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    brand: "",
    modelName: "",
    year: new Date().getFullYear(),
    engineCapacity: "",
    color: "",
    description: "",
    basePrice: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.brand || !formData.modelName || !formData.basePrice) {
        toast.error("Please fill all required fields");
        return;
      }

      await createBikeModel({
        ...formData,
        year: Number(formData.year),
        basePrice: Number(formData.basePrice.replace(/,/g, "")),
      });

      toast.success("Bike model created successfully");
      router.push("/models");
    } catch (error: any) {
      console.error("Failed to create model:", error);
      toast.error(error.response?.data?.message || "Failed to create bike model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.text.primary }}
          >
            Add New Bike Model
          </h1>
          <Link
            href="/models"
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: theme.text.secondary }}
          >
            &larr; Back to Models
          </Link>
        </div>

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="e.g. Honda"
                />
              </div>

              {/* Model Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Model Name *
                </label>
                <input
                  type="text"
                  name="modelName"
                  required
                  value={formData.modelName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="e.g. CG 125"
                />
              </div>

              {/* Year */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                />
              </div>

              {/* Engine Capacity */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Engine Capacity
                </label>
                <input
                  type="text"
                  name="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="e.g. 125cc"
                />
              </div>

              {/* Color */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Color(s)
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="e.g. Red / Black"
                />
              </div>

              {/* Base Price */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Base Price (Rs) *
                </label>
                <input
                  type="text"
                  name="basePrice"
                  required
                  value={formData.basePrice}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val) {
                      setFormData((prev) => ({ ...prev, basePrice: Number(val).toLocaleString() }));
                    } else {
                      setFormData((prev) => ({ ...prev, basePrice: "" }));
                    }
                  }}
                  className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="e.g. 235,000"
                />
                {formData.basePrice && (
                  <p className="text-sm mt-2 font-medium" style={{ color: "#059669" }}>
                    {numberToWords(parseFloat(formData.basePrice.replace(/,/g, "")))}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                {loading ? "Saving..." : "Save Model"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
