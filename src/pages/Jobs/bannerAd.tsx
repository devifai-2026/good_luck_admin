import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { FaTrash } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

interface JobBannerAdType {
  _id: string;
  userId: string;
  title: string;
  company_name: string;
  work_location: string;
  website: string;
  salary: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  phone: string;
  banner_url: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const JobBannerAd = () => {
  const [modal, setModal] = useState(false);
  const [landText, setLandText] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [banners, setBanners] = useState<JobBannerAdType[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axiosInstance.get<{ data: JobBannerAdType[] }>("/jobBanner/getAll");
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

  const handleDelete = async (id: string, userId: string) => {
    try {
      await axiosInstance.delete(`/jobBanner/delete/${userId}/${id}`);
  
      // Remove the deleted banner from the UI
      setBanners((prev) => prev.filter((banner) => banner._id !== id));
  
      toast.success("Banner deleted successfully!"); // Success toast
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner"); // Error toast
    }
  };
  

  // Filter banners based on category selection
  const filteredBanners = categoryFilter === "All" ? banners : banners.filter((ad) => ad.category === categoryFilter);

  return (
    <div>
      <Breadcrumb pageName="Job Banners Ads" />

      {/* Category Filter Dropdown */}
      <div className="flex justify-between items-center w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        <div className="px-2 border rounded-md focus-within:ring-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 dark:bg-boxdark border-0 focus:ring-0 focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Private">Private</option>
            <option value="Government">Government</option>
          </select>
        </div>
      </div>

      {/* Displaying the fetched banners */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBanners.length > 0 ? (
          filteredBanners.map((item) => (
            <div
  key={item._id}
  className="relative bg-white/80 dark:bg-boxdark/80 backdrop-blur-lg p-6 rounded-xl shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl border border-gray-200 dark:border-gray-700"
  onMouseEnter={() => setHoveredId(item._id)}
  onMouseLeave={() => setHoveredId(null)}
>
  {/* Delete Button (Shown on Hover) */}
  {hoveredId === item._id && (
    <button
    onClick={() => handleDelete(item._id, item.userId)}
      className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition-all"
    >
      <FaTrash className="text-lg" />
    </button>
  )}

  {/* Banner Image */}
  <div className="w-full h-44 rounded-lg overflow-hidden mb-4">
    <img
      src={item.banner_url}
      alt={item.title}
      className="w-full h-full object-cover transition-all duration-300 "
    />
  </div>

  {/* Card Content */}
  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
  <p className="text-md text-gray-600 dark:text-gray-400 mt-1 font-medium">🏢 {item.company_name}</p>
  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
    📍 {item.work_location}, {item.city}, {item.state}
  </p>
  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">📞 {item.phone}</p>
  <p className="text-md text-blue-600 dark:text-blue-400 mt-2 font-semibold">💰 {item.salary}</p>

  {/* Website Link */}
  <a
    href={item.website}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-3 inline-block text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all"
  >
    Visit Website
  </a>
</div>

          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No banners available.</p>
        )}
      </div>
    </div>
  );
};

export default JobBannerAd;
