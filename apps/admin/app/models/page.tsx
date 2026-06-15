"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import {
  getBikeModels,
  deleteBikeModel,
} from "@/lib/api/inventory";
import type { BikeModel } from "@/lib/types";

export default function ModelsListPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;

  // Data state
  const [models, setModels] = useState<BikeModel[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<BikeModel | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorModalInfo, setErrorModalInfo] = useState<{ show: boolean; message: string; modelId?: string }>({ show: false, message: "" });

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await getBikeModels();
      setModels(response.bikeModels);
    } catch (error) {
      console.error("Failed to fetch models:", error);
      toast.error("Failed to load bike models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleDelete = async () => {
    if (!selectedModel) return;

    setDeleting(true);
    try {
      await deleteBikeModel(selectedModel.id);
      toast.success("Model deleted successfully");
      setShowDeleteModal(false);
      setSelectedModel(null);
      fetchModels();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete model";
      if (error.response?.status === 400) {
        setErrorModalInfo({ show: true, message, modelId: selectedModel.id });
        setShowDeleteModal(false);
      } else {
        toast.error(message);
        setShowDeleteModal(false);
      }
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (model: BikeModel) => {
    setSelectedModel(model);
    setShowDeleteModal(true);
  };

  if (!isAdmin && !isManager) {
    return (
      <div className="p-8 text-center text-red-500">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.text.primary }}
          >
            Bike Models
          </h1>
          <Link
            href="/models/new"
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Add New Model
          </Link>
        </div>

        {/* Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <table className="w-full">
            <thead>
              <tr
                style={{ backgroundColor: theme.backgrounds.secondary }}
              >
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Model Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Engine Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Base Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.accents.primary }}></div>
                    </div>
                  </td>
                </tr>
              ) : models.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-sm" style={{ color: theme.text.secondary }}>
                      No models found
                    </p>
                  </td>
                </tr>
              ) : (
                models.map((model) => (
                  <tr key={model.id} style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {model.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {model.modelName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {model.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.text.primary }}>
                      {model.engineCapacity || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold" style={{ color: theme.accents.primary }}>
                      Rs {Number(model.basePrice).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <Link
                          href={`/models/${model.id}/edit`}
                          className="text-sm font-medium transition-colors hover:opacity-70"
                          style={{ color: theme.accents.secondary }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => openDeleteModal(model)}
                          className="text-sm font-medium transition-colors hover:opacity-70"
                          style={{ color: "red" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
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
                Delete Bike Model
              </h3>
              <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
                Are you sure you want to delete the model <strong>{selectedModel?.brand} {selectedModel?.modelName}</strong>? This action cannot be undone. 
                If this model is associated with any bikes, the deletion will be rejected.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
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
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: "red",
                    color: "white",
                  }}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {errorModalInfo.show && (
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
                style={{ color: "red" }}
              >
                Cannot Delete Model
              </h3>
              <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
                {errorModalInfo.message}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setErrorModalInfo({ show: false, message: "" })}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    color: theme.text.secondary,
                    border: `1px solid ${theme.borders.medium}`,
                  }}
                >
                  Close
                </button>
                <Link
                  href={`/bikes${errorModalInfo.modelId ? `?model=${errorModalInfo.modelId}` : ""}`}
                  onClick={() => setErrorModalInfo({ show: false, message: "" })}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  View Assigned Bikes
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
