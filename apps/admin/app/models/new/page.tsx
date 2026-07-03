"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { theme } from "@/lib/colors";
import { createBikeModel } from "@/lib/api/inventory";
import Link from "next/link";
import { numberToWords } from "@/lib/number-to-words";
import { AsyncButton } from "@/components/async-button";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";

export default function NewBikeModelPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    brand: "",
    modelName: "",
    year: new Date().getFullYear(),
    engineCapacity: "",
    colors: [] as string[],
    description: "",
    basePrice: "",
  });
  const [colorInput, setColorInput] = useState("");

  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) router.replace("/models");
  }, [router, user]);

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
    } catch (error) {
      console.error("Failed to create model:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create bike model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: theme.text.primary }}
          >
            Add New Bike Model
          </h1>
          <Link
            href="/models"
            className="text-sm font-medium transition-colors hover:opacity-70 w-full sm:w-auto text-center"
            style={{ color: theme.text.secondary }}
          >
            &larr; Back to Models
          </Link>
        </div>

        <div
          className="rounded-lg p-4 md:p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                  min={1900}
                  max={2100}
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
                  Motor Power
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

              {/* Colors */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Color(s)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.colors.map((color, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full flex items-center space-x-1"
                      style={{ backgroundColor: theme.accents.tertiary, color: theme.text.inverse }}
                    >
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }))}
                        className="hover:opacity-70 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const val = colorInput.trim();
                      if (val && !formData.colors.includes(val)) {
                        setFormData(prev => ({ ...prev, colors: [...prev.colors, val] }));
                        setColorInput("");
                      }
                    }
                  }}
                  className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Type a color and press Enter"
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
                  inputMode="numeric"
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

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4">
              <AsyncButton
                type="submit"
                loading={loading}
                loadingLabel="Saving..."
                className="px-6"
              >
                Save Model
              </AsyncButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
