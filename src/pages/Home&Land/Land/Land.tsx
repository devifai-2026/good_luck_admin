import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import {  FaTrash } from "react-icons/fa";

interface BannerAdType {
  _id: string;
  userId: string;
  title: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  price: string;
  banner_url: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const BannerAd = () => {
  const [modal, setModal] = useState(false);
  const [landText, setLandText] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [banners, setBanners] = useState<BannerAdType[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axiosInstance.get<{ data: BannerAdType[] }>("/homeLandBanner/getAll");
        setBanners(response.data.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBanner(file);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/homeLandBanner/delete/${id}`);
      setBanners((prev) => prev.filter((banner) => banner._id !== id));
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  // Filter banners based on category selection
  const filteredBanners = categoryFilter === "All" ? banners : banners.filter((ad) => ad.category === categoryFilter);

  return (
    <div>
      <Breadcrumb pageName="BannerAd" />

      {/* Category Filter Dropdown */}
      <div className="flex justify-between items-center w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        <div className="px-2 border rounded-md focus-within:ring-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 dark:bg-boxdark border-0 focus:ring-0 focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Home">Home</option>
            <option value="Land">Land</option>
          </select>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold mb-4">Add Land</h2>

            {/* Land Text Input */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Land Text:</label>
            <textarea
              value={landText}
              onChange={(e) => setLandText(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 mb-4"
              placeholder="Write about the land..."
            />

            {/* Banner Upload */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Banner:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button onClick={toggleModal} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Land Text:", landText);
                  console.log("Banner:", banner);
                  toggleModal();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Displaying the fetched banners */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBanners.length > 0 ? (
          filteredBanners.map((item) => (
            <div
            key={item._id}
            className="relative bg-white dark:bg-boxdark p-5 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl border border-gray-200 dark:border-gray-700"
            onMouseEnter={() => setHoveredId(item._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Delete Button (Shown on Hover) */}
            {hoveredId === item._id && (
              <button
                onClick={() => handleDelete(item._id)}
                className="absolute bottom-4 right-4 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all"
              >
                <FaTrash className="text-lg" />
              </button>
            )}

            {/* Banner Image */}
            <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
              <img
                src={item.banner_url}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-300 "
              />
            </div>

            {/* Card Content */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              📍 {item.city}, {item.state} - {item.pincode}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">📞 {item.phone}</p>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">💰 ₹{item.price}</p>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1">
              🏷 {item.category}
            </p>
          </div>
          ))
        ) : (
          <p className="text-gray-500">No banners available.</p>
        )}
      </div>
    </div>
  );
};

export default BannerAd;
