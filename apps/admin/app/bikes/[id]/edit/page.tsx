"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";
import {
  getBranches,
  getVendors,
  getBikeModels,
  getBikeById,
  updateBike,
  deleteBike,
  attachDocument,
  uploadFile,
} from "@/lib/api/inventory";
import { UserRole, type Branch, type Vendor, type BikeModel } from "@/lib/types";

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

export default function EditBikePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const id = params.id as string;

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

  // New fields
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Upload states
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) router.replace("/bikes");
  }, [router, user]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch reference data and bike on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesRes, vendorsRes, modelsRes, bike] = await Promise.all([
          getBranches(),
          getVendors(),
          getBikeModels(),
          getBikeById(id),
        ]);
        setBranches(branchesRes.branches);
        setVendors(vendorsRes.vendors);
        setBikeModels(modelsRes.bikeModels);

        // Populate bike state
        setChassisNumber(bike.chassisNumber);
        setEngineNumber(bike.engineNumber);
        setSerialNumber(bike.serialNumber || "");
        setBranchId(bike.branch?.id || "");
        setModelId(bike.model?.id || "");
        setVendorId(bike.vendor?.id || "");
        setStatus(bike.status || "AVAILABLE");
        setPrice(bike.price ? bike.price.toString() : "");
        setColor(bike.color || "");
        setMedia(bike.media || []);

        // Populate documents if any exist
        if (bike.documents) {
          bike.documents.forEach((doc: any) => {
            const uploadedDoc = {
              fileName: doc.fileName,
              fileUrl: doc.fileUrl,
              mimeType: doc.mimeType,
              fileSize: doc.fileSize,
              fileType: doc.fileType,
            };
            if (doc.fileType === "SUPPLIER_INVOICE") setSupplierInvoice(uploadedDoc);
            if (doc.fileType === "WARRANTY_DOCUMENT") setWarrantyDocument(uploadedDoc);
            if (doc.fileType === "REGISTRATION_DOCUMENT") setRegistrationPapers(uploadedDoc);
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    if (id) fetchData();
  }, [id]);

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
      toast.error("Failed to upload file");
    } finally {
      setUploading(null);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingMedia(true);
    try {
      const newMediaUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadFile(files[i]);
        newMediaUrls.push(result.fileUrl);
      }
      setMedia((prev) => [...prev, ...newMediaUrls]);
    } catch (error: any) {
      console.error("Media upload failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to upload media files";
      const formattedMessage = Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage;
      toast.error(`Upload failed: ${formattedMessage}`);
    } finally {
      setUploadingMedia(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!chassisNumber || !engineNumber || !branchId || !modelId || !vendorId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      // Update bike
      await updateBike(id, {
        vendorId,
        price: price ? parseFloat(price) : undefined,
        color: color || undefined,
        media,
      });

      // Attach documents
      const documents = [supplierInvoice, warrantyDocument, registrationPapers].filter(
        (doc): doc is UploadedFile => doc !== null,
      );

      for (const doc of documents) {
        // Only attach if it's a new upload (doesn't have an ID from DB yet)
        if (!(doc as any).id) {
          await attachDocument(id, doc);
        }
      }

      toast.success("Bike updated successfully");
      // Redirect to bikes page
      router.push("/bikes");
    } catch (error: any) {
      console.error("Failed to create bike:", error);
      
      // Extract the specific validation error message from the NestJS response
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to update bike";
        
      const formattedMessage = Array.isArray(errorMessage) 
        ? errorMessage.join(", ") 
        : errorMessage;
        
      toast.error(`Validation Error: ${formattedMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBike(id);
      toast.success("Bike deleted successfully");
      router.push("/bikes");
    } catch (error: any) {
      console.error("Failed to delete bike:", error);
      toast.error(error.response?.data?.message || "Failed to delete bike");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const selectedModel = bikeModels.find(m => m.id === modelId);
  const availableColors = selectedModel?.color ? selectedModel.color.split('/').map(c => c.trim()) : [];

  if (user && user.role !== UserRole.ADMIN) return null;

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text.primary }}
          >
            Edit Bike
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Update the details for this bike unit
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
                  disabled
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
                  disabled
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
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  value={branchId}
                  disabled
                  className="w-full px-3 py-2 rounded text-sm opacity-60 cursor-not-allowed"
                >
                  <option value="">Select branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  Use the transfer action on the Bikes Inventory page to change branch.
                </p>
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
                  onChange={(e) => {
                    setModelId(e.target.value);
                    const selectedModel = bikeModels.find(m => m.id === e.target.value);
                    if (selectedModel && !price) {
                      setPrice(selectedModel.basePrice.toString());
                    }
                  }}
                  disabled
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Unit Price (PKR)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded text-sm disabled:opacity-50"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder={!modelId ? "Select a model first" : "Leave empty to use model default"}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={!modelId}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Color
                </label>
                <select
                  className="w-full px-3 py-2 rounded text-sm disabled:opacity-50"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  disabled={!modelId || availableColors.length === 0}
                >
                  <option value="">
                    {!modelId ? "Select a model first" : availableColors.length === 0 ? "No colors defined for this model" : "Select a color"}
                  </option>
                  {availableColors.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
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
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
                value={status}
                disabled
                className="w-full px-3 py-2 rounded text-sm opacity-60 cursor-not-allowed"
              >
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
                <option value="RESERVED">Reserved</option>
                <option value="IN_DELIVERY">In Delivery</option>
              </select>
              <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                Status is managed by offer, order, and delivery workflows.
              </p>
            </div>

            <div className="border-t pt-6" style={{ borderColor: theme.borders.light }}>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Media (Images / Videos)
              </h3>
              
              <div className="mb-4">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold"
                  style={{
                    color: theme.text.secondary,
                    backgroundColor: theme.backgrounds.tertiary,
                  }}
                  disabled={uploadingMedia}
                />
                {uploadingMedia && (
                  <p className="text-sm mt-2" style={{ color: theme.accents.primary }}>Uploading media...</p>
                )}
              </div>
              
              {media.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {media.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded border overflow-hidden" style={{ borderColor: theme.borders.medium }}>
                      {url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video src={url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={url} alt="Media" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => setMedia(prev => prev.filter((_, index) => index !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setMedia(prev => {
                              const newMedia = [...prev];
                              const item = newMedia.splice(i, 1)[0];
                              newMedia.unshift(item);
                              return newMedia;
                            });
                          }}
                          className="absolute bottom-1 right-1 bg-blue-500 text-white px-2 py-1 rounded text-[10px] shadow"
                        >
                          Set Thumbnail
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                  fileType="REGISTRATION_DOCUMENT"
                  uploadedFile={registrationPapers}
                  uploading={uploading === "REGISTRATION_DOCUMENT"}
                  onFileUpload={(file) => handleFileUpload(file, "REGISTRATION_DOCUMENT", setRegistrationPapers)}
                  onClear={() => setRegistrationPapers(null)}
                />
              </div>
            </div>

            <div className="flex justify-between space-x-4 pt-6">
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Delete Bike
              </button>
              <div className="flex space-x-4">
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
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
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
                Delete Bike Unit
              </h3>
              <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
                Are you sure you want to delete this bike unit (Chassis: <strong>{chassisNumber}</strong>)? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
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
      </div>
    </div>
  );
}
