"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import {
  getBranches,
  getVendors,
  getBikeModels,
  createBike,
  attachDocument,
  uploadFile,
} from "@/lib/api/inventory";
import type { Branch, Vendor, BikeModel } from "@/lib/types";

interface UploadedFile {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  fileType: string;
}

function FileUploadZone({
  label,
  fileType,
  uploadedFile,
  uploading,
  onFileUpload,
  onClear,
}: {
  label: string;
  fileType: string;
  uploadedFile: UploadedFile | null;
  uploading: boolean;
  onFileUpload: (file: File) => void;
  onClear: () => void;
}) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div>
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: theme.text.secondary }}
      >
        {label}
      </label>
      {uploadedFile ? (
        <div
          className="border rounded-lg p-4 flex items-center justify-between"
          style={{ borderColor: theme.borders.medium }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: theme.accents.tertiary }}
            >
              <svg
                className="w-4 h-4"
                style={{ color: theme.text.inverse }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {uploadedFile.fileName}
              </p>
              <p className="text-xs" style={{ color: theme.text.secondary }}>
                {formatFileSize(uploadedFile.fileSize)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="text-sm hover:opacity-70"
            style={{ color: theme.accents.secondary }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-opacity-70 transition-opacity"
          style={{ borderColor: theme.borders.medium }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            id={`file-${fileType}`}
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,image/*"
          />
          <label htmlFor={`file-${fileType}`} className="cursor-pointer">
            {uploading ? (
              <p className="text-sm" style={{ color: theme.text.secondary }}>
                Uploading...
              </p>
            ) : (
              <p className="text-sm" style={{ color: theme.text.secondary }}>
                Drag and drop file here, or click to select
              </p>
            )}
          </label>
        </div>
      )}
    </div>
  );
}

export default function AddBikePage() {
  const router = useRouter();

  // Form fields
  const [chassisNumber, setChassisNumber] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [branchId, setBranchId] = useState("");
  const [modelId, setModelId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [status, setStatus] = useState("AVAILABLE");

  // Reference data
  const [branches, setBranches] = useState<Branch[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [bikeModels, setBikeModels] = useState<BikeModel[]>([]);

  // File uploads
  const [supplierInvoice, setSupplierInvoice] = useState<UploadedFile | null>(null);
  const [warrantyDocument, setWarrantyDocument] = useState<UploadedFile | null>(null);
  const [registrationPapers, setRegistrationPapers] = useState<UploadedFile | null>(null);

  // Upload states
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch reference data on mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [branchesRes, vendorsRes, modelsRes] = await Promise.all([
          getBranches(),
          getVendors(),
          getBikeModels(),
        ]);
        setBranches(branchesRes.branches);
        setVendors(vendorsRes.vendors);
        setBikeModels(modelsRes.bikeModels);
      } catch (error) {
        console.error("Failed to fetch reference data:", error);
      }
    };
    fetchReferenceData();
  }, []);

  // Handle file upload
  const handleFileUpload = async (
    file: File,
    fileType: string,
    setter: (file: UploadedFile | null) => void,
  ) => {
    setUploading(fileType);
    try {
      const result = await uploadFile(file);
      setter({
        fileName: result.fileName,
        fileUrl: result.fileUrl,
        mimeType: result.mimeType,
        fileSize: result.fileSize,
        fileType,
      });
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(null);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!chassisNumber || !engineNumber || !branchId || !modelId || !vendorId) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      // Create bike
      const bike = await createBike({
        chassisNumber,
        engineNumber,
        serialNumber: serialNumber || chassisNumber,
        modelId,
        vendorId,
        branchId,
      });

      // Attach documents
      const documents = [supplierInvoice, warrantyDocument, registrationPapers].filter(
        (doc): doc is UploadedFile => doc !== null,
      );

      for (const doc of documents) {
        await attachDocument(bike.id, doc);
      }

      // Redirect to bikes page
      router.push("/bikes");
    } catch (error) {
      console.error("Failed to create bike:", error);
      alert("Failed to create bike");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text.primary }}
          >
            Add New Bike
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Enter the details for the new bike unit
          </p>
        </div>

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Chassis Number *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Enter chassis number"
                  value={chassisNumber}
                  onChange={(e) => setChassisNumber(e.target.value)}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Engine Number *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Enter engine number"
                  value={engineNumber}
                  onChange={(e) => setEngineNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Branch *
                </label>
                <select
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                >
                  <option value="">Select branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Model *
                </label>
                <select
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                >
                  <option value="">Select model</option>
                  {bikeModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.brand} {model.modelName} ({model.year})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Vendor *
              </label>
              <select
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
              >
                <option value="">Select vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Status
              </label>
              <select
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
                <option value="RESERVED">Reserved</option>
                <option value="IN_DELIVERY">In Delivery</option>
              </select>
            </div>

            <div className="border-t pt-6" style={{ borderColor: theme.borders.light }}>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Documents
              </h3>

              <div className="space-y-4">
                <FileUploadZone
                  label="Supplier Invoice"
                  fileType="SUPPLIER_INVOICE"
                  uploadedFile={supplierInvoice}
                  uploading={uploading === "SUPPLIER_INVOICE"}
                  onFileUpload={(file) => handleFileUpload(file, "SUPPLIER_INVOICE", setSupplierInvoice)}
                  onClear={() => setSupplierInvoice(null)}
                />
                <FileUploadZone
                  label="Warranty Document"
                  fileType="WARRANTY_DOCUMENT"
                  uploadedFile={warrantyDocument}
                  uploading={uploading === "WARRANTY_DOCUMENT"}
                  onFileUpload={(file) => handleFileUpload(file, "WARRANTY_DOCUMENT", setWarrantyDocument)}
                  onClear={() => setWarrantyDocument(null)}
                />
                <FileUploadZone
                  label="Registration Papers"
                  fileType="REGISTRATION_PAPERS"
                  uploadedFile={registrationPapers}
                  uploading={uploading === "REGISTRATION_PAPERS"}
                  onFileUpload={(file) => handleFileUpload(file, "REGISTRATION_PAPERS", setRegistrationPapers)}
                  onClear={() => setRegistrationPapers(null)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push("/bikes")}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
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
                disabled={submitting}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                {submitting ? "Adding..." : "Add Bike"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
