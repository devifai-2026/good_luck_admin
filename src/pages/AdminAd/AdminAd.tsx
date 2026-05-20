import { useState, useEffect } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Dialog } from "@headlessui/react";
import { useDropzone } from "react-dropzone";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbFilterEdit } from "react-icons/tb";

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "goodluck_admin");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dd5tqor5g/image/upload",
    { method: "POST", body: formData }
  );

  const data = await res.json();
  if (data.secure_url) return data.secure_url;
  throw new Error("Image upload failed");
};

interface AdminAd {
  _id: string;
  image: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

interface ImageType {
  file: File | null;
  preview: string;
  url?: string;
  id: string;
}

const AdminAd = () => {
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [images, setImages] = useState<ImageType[]>([]);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [editIsActive, setEditIsActive] = useState(true);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const previews = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: `${Date.now()}-${Math.random()}`,
      }));
      setImages((prev) => [...prev, ...previews]);
      setUploaded(false);
    },
    onDropRejected: () => {
      toast.error("Only PNG and JPEG images are allowed!");
    },
  });

  // Phone validation function
  const validatePhone = (phoneNumber: string): boolean => {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, "");
    
    // Check if it's exactly 10 digits
    if (cleaned.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return false;
    }
    
    // Check if it starts with a valid digit (usually 6-9 in India)
    if (!/^[6-9]/.test(cleaned)) {
      setPhoneError("Phone number must start with 6, 7, 8, or 9");
      return false;
    }
    
    // Check if all digits are the same (like 9999999999)
    if (/^(\d)\1{9}$/.test(cleaned)) {
      setPhoneError("Invalid phone number");
      return false;
    }
    
    setPhoneError("");
    return true;
  };

  const handlePhoneChange = (value: string) => {
    // Allow only digits and limit to 10 characters
    const digitsOnly = value.replace(/\D/g, "");
    const truncated = digitsOnly.slice(0, 10);
    setPhone(truncated);
    
    // Validate when user has entered 10 digits or on blur
    if (truncated.length === 10) {
      validatePhone(truncated);
    } else if (truncated.length > 0 && truncated.length < 10) {
      setPhoneError("Phone number must be 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const revokePreviews = (imgs: ImageType[]) => {
    imgs.forEach((img) => {
      if (img.preview.startsWith("blob:")) URL.revokeObjectURL(img.preview);
    });
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const fetchAds = async () => {
    try {
      const res = await axiosInstance.get("/admin-ads/");
      setAds(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch Admin Ads");
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const openAddModal = () => setIsAddOpen(true);
  const closeAddModal = () => {
    setIsAddOpen(false);
    setPhone("");
    setPhoneError("");
    revokePreviews(images);
    setImages([]);
    setUploaded(false);
  };

  const openEditModal = (ad: AdminAd) => {
    setEditingAdId(ad._id);
    setPhone(ad.phone);
    setPhoneError("");
    setEditIsActive(ad.isActive);
    setImages([
      { file: null, preview: ad.image, url: ad.image, id: `${Date.now()}-0` },
    ]);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingAdId(null);
    setPhone("");
    setPhoneError("");
    setEditIsActive(true);
    revokePreviews(images);
    setImages([]);
  };

  // Step 1: Upload images
  const handleUploadImages = async () => {
    if (images.length === 0) return toast.error("Please select images first");

    setUploading(true);
    try {
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (!img.file) return img; // already uploaded (edit case)
          const url = await uploadImageToCloudinary(img.file);
          return { ...img, url };
        })
      );
      setImages(uploadedImages);
      setUploaded(true);
      toast.success("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Step 2: Create Ad with validation
  const handleCreateAd = async () => {
    if (!uploaded) return toast.error("Please upload images first");
    
    // Validate phone
    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      return;
    }
    
    if (!validatePhone(phone)) {
      return; // Error already set by validatePhone
    }

    setUploading(true);
    try {
      const imageUrls = images.map((img) => img.url!);
      const res = await axiosInstance.post("/admin-ads/", {
        image: imageUrls[0],
        phone,
        isActive: true,
      });

      setAds((prev) => [res.data.data, ...prev]);
      toast.success("Admin Ad created successfully");
      closeAddModal();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create Admin Ad");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateAd = async () => {
    if (!editingAdId) return;
    if (images.length === 0) return toast.error("Please upload at least one image");

    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      return;
    }

    if (!validatePhone(phone)) {
      return;
    }

    setUploading(true);
    try {
      // Upload any new files that don't have a URL yet
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (!img.file) return img; // already has a URL (existing image)
          const url = await uploadImageToCloudinary(img.file);
          return { ...img, url };
        })
      );

      const imageUrl = uploadedImages[0]?.url;
      if (!imageUrl) {
        toast.error("Image upload failed. Please try again.");
        return;
      }

      const res = await axiosInstance.put(`/admin-ads/${editingAdId}`, {
        image: imageUrl,
        phone,
        isActive: editIsActive,
      });

      setAds((prev) =>
        prev.map((ad) => (ad._id === editingAdId ? res.data.data : ad))
      );

      toast.success("Admin Ad updated successfully");
      closeEditModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Admin Ad");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAd = async (id: string) => {
    try {
      await axiosInstance.delete(`/admin-ads/${id}`);
      setAds((prev) => prev.filter((ad) => ad._id !== id));
      toast.success("Admin Ad deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete Admin Ad");
    }
  };

  return (
    <div className="p-6">
      <Breadcrumb pageName="Admin Ads" />

      <div className="rounded-xl border bg-white shadow-default p-6">
        <div className="flex justify-end mb-6">
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Admin Ad
          </button>
        </div>

        {ads.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No Admin Ads available.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <li
                key={ad._id}
                className="border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow relative group bg-white"
              >
                <img
                  src={ad.image}
                  alt="Ad Image"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <div className="space-y-2">
                  <p className="font-medium text-gray-800">
                    <span className="font-semibold">Phone:</span> {ad.phone}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>{" "}
                    <span className={`font-semibold ${ad.isActive ? "text-green-600" : "text-red-600"}`}>
                      {ad.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(ad.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <button
                    onClick={() => openEditModal(ad)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 shadow-md transition-colors"
                    title="Edit"
                  >
                    <TbFilterEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteAd(ad._id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md transition-colors"
                    title="Delete"
                  >
                    <RiDeleteBin6Line size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={isAddOpen} onClose={closeAddModal} className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-md w-full p-6 z-50 relative shadow-2xl">
            <Dialog.Title className="text-xl font-bold mb-4 text-gray-800">
              Create Admin Ad
            </Dialog.Title>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={() => validatePhone(phone)}
                className={`w-full border ${phoneError ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 ${phoneError ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
              />
              {phoneError && (
                <p className="mt-1 text-sm text-red-600">{phoneError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be exactly 10 digits (e.g., 9876543210)
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Image *
              </label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
              >
                <input {...getInputProps()} />
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium">Drag & drop images here</p>
                  <p className="text-sm mt-1">or click to select files</p>
                  <p className="text-xs mt-2 text-gray-400">Supports: PNG, JPEG</p>
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Images ({images.length})
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.url || img.preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => handleRemoveImage(img.id)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeAddModal}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>

              {!uploaded ? (
                <button
                  onClick={handleUploadImages}
                  disabled={uploading || images.length === 0}
                  className={`px-5 py-2.5 text-white rounded-lg font-medium transition-colors ${
                    uploading || images.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Uploading...
                    </span>
                  ) : (
                    "Upload Images"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleCreateAd}
                  disabled={uploading || !phone || phoneError !== ""}
                  className={`px-5 py-2.5 text-white rounded-lg font-medium transition-colors ${
                    uploading || !phone || phoneError !== ""
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {uploading ? "Creating..." : "Create Ad"}
                </button>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Modal - Updated with validation */}
      <Dialog open={isEditOpen} onClose={closeEditModal} className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-md w-full p-6 z-50 relative shadow-2xl">
            <Dialog.Title className="text-xl font-bold mb-4 text-gray-800">
              Edit Admin Ad
            </Dialog.Title>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={() => validatePhone(phone)}
                className={`w-full border ${phoneError ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 ${phoneError ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
              />
              {phoneError && (
                <p className="mt-1 text-sm text-red-600">{phoneError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be exactly 10 digits (e.g., 9876543210)
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Image *
              </label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
              >
                <input {...getInputProps()} />
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium">Drag & drop new image</p>
                  <p className="text-sm mt-1">or click to select files</p>
                  <p className="text-xs mt-2 text-gray-400">Supports: PNG, JPEG</p>
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Image
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.url || img.preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => handleRemoveImage(img.id)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <button
                type="button"
                onClick={() => setEditIsActive((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  editIsActive ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    editIsActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm font-semibold ${editIsActive ? "text-green-600" : "text-red-500"}`}>
                {editIsActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeEditModal}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAd}
                disabled={uploading || phoneError !== ""}
                className={`px-5 py-2.5 text-white rounded-lg font-medium transition-colors ${
                  uploading || phoneError !== ""
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Updating...
                  </span>
                ) : (
                  "Update Ad"
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminAd;