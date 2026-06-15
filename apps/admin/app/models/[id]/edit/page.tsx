"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { theme } from "@/lib/colors";
import { getBikeModelById, updateBikeModel } from "@/lib/api/inventory";
import Link from "next/link";
import { numberToWords } from "@repo/utils";
import { AsyncButton } from "@/components/async-button";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";

export default function EditBikeModelPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    brand: "",
    modelName: "",
    year: new Date().getFullYear(),
    engineCapacity: "",
    color: "",
    description: "",
    basePrice: "",
  });

  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) router.replace("/models");
  }, [router, user]);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await getBikeModelById(id);
        const model = response.bikeModel;
        setFormData({
          brand: model.brand || "",
          modelName: model.modelName || "",
          year: model.year || new Date().getFullYear(),
          engineCapacity: model.engineCapacity || "",
          color: model.color || "",
          description: model.description || "",
          basePrice: model.basePrice ? Number(model.basePrice).toLocaleString() : "",
        });
      } catch (error) {
        console.error("Failed to fetch model:", error);
        toast.error("Failed to load bike model");
        router.push("/models");
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!formData.brand || !formData.modelName || !formData.basePrice) {
        toast.error("Please fill all required fields");
        return;
      }

      await updateBikeModel(id, {
        ...formData,
        year: Number(formData.year),
        basePrice: Number(formData.basePrice.replace(/,/g, "")),
      });

      toast.success("Bike model updated successfully");
      router.push("/models");
    } catch (error) {
      console.error("Failed to update model:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update bike model");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.accents.primary }}></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.text.primary }}
          >
            Edit Bike Model
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

            <div className="flex justify-end pt-4">
              <AsyncButton
                type="submit"
                loading={saving}
                loadingLabel="Saving..."
                className="px-6"
              >
                Update Model
              </AsyncButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
