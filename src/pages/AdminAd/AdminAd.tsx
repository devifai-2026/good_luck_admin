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
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);

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
    revokePreviews(images);
    setImages([]);
    setUploaded(false);
  };

  const openEditModal = (ad: AdminAd) => {
    setEditingAdId(ad._id);
    setPhone(ad.phone);
    setImages([
      { file: null, preview: ad.image, url: ad.image, id: `${Date.now()}-0` },
    ]);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingAdId(null);
    setPhone("");
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

  // Step 2: Create Ad
  const handleCreateAd = async () => {
    if (!uploaded) return toast.error("Please upload images first");
    if (!phone.trim()) return toast.error("Please provide phone number");

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

    setUploading(true);
    try {
      const imageUrls = images.map((img) => img.url!);
      const res = await axiosInstance.put(`/admin-ads/${editingAdId}`, {
        image: imageUrls[0],
        phone,
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Admin Ad
          </button>
        </div>

        {ads.length === 0 ? (
          <p className="text-gray-500">No Admin Ads available.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ads.map((ad) => (
              <li
                key={ad._id}
                className="border p-4 rounded-lg shadow relative group"
              >
                <img
                  src={ad.image}
                  alt="Ad Image"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <p className="mt-2 font-semibold">Phone: {ad.phone}</p>
                <p className="text-sm text-gray-500">
                  Active: {ad.isActive ? "Yes" : "No"}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(ad.createdAt).toLocaleString()}
                </p>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-2">
                  <button
                    onClick={() => openEditModal(ad)}
                    className="bg-yellow-500 text-white rounded p-1"
                  >
                    <TbFilterEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteAd(ad._id)}
                    className="bg-red-500 text-white rounded p-1"
                  >
                    <RiDeleteBin6Line />
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
          <Dialog.Panel className="bg-white rounded-xl max-w-md w-full p-6 z-50 relative">
            <Dialog.Title className="text-xl font-bold mb-4">
              Create Admin Ad
            </Dialog.Title>

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              placeholder="Phone number"
            />

            <div
              {...getRootProps()}
              className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <p>Drag & drop images here, or click to select files</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {images.map((img, idx) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.url || img.preview}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeAddModal} className="px-4 py-2 border rounded">
                Cancel
              </button>

              {!uploaded ? (
                <button
                  onClick={handleUploadImages}
                  disabled={uploading}
                  className={`px-4 py-2 text-white rounded ${
                    uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              ) : (
                <button
                  onClick={handleCreateAd}
                  disabled={uploading}
                  className="px-4 py-2 text-white rounded bg-green-600 hover:bg-green-700"
                >
                  {uploading ? "Creating..." : "Create"}
                </button>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onClose={closeEditModal} className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-md w-full p-6 z-50 relative">
            <Dialog.Title className="text-xl font-bold mb-4">
              Edit Admin Ad
            </Dialog.Title>

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              placeholder="Phone number"
            />

            <div
              {...getRootProps()}
              className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <p>Drag & drop images here, or click to select files</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {images.map((img, idx) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.url || img.preview}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeEditModal} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={handleUpdateAd}
                disabled={uploading}
                className={`px-4 py-2 text-white rounded ${
                  uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {uploading ? "Updating..." : "Update"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminAd;
