import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

interface JobTextAdData {
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
  text_ad_description: string;
  total_character: number;
  category: "Private" | "Government";
  createdAt: string;
  updatedAt: string;
}

const JobTextAd = () => {
  const [adData, setAdData] = useState<JobTextAdData[] | null>(null);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  useEffect(() => {
    axiosInstance
      .get("/jobText")
      .then((response) => setAdData(response.data.data))
      .catch((error) => console.error("Error fetching ad data:", error));
  }, []);

  const handleDelete = async (id: string, userId: string) => {
    try {
      await axiosInstance.delete(`/homeLandText/delete/${userId}/${id}`);
      setAdData((prevAdData) => prevAdData?.filter((ad) => ad._id !== id) || null);
      toast.success("Post deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const filteredAds = categoryFilter === "All" ? adData : adData?.filter((ad) => ad.category === categoryFilter);

  return (
    <div>
      <Breadcrumb pageName="Job Text Ads" />

      <div className="flex justify-between items-center w-full max-w-full rounded-sm border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark p-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredAds?.map((ad) => (
          <div
            key={ad._id}
            className="border rounded-xl shadow-lg p-5 bg-white dark:bg-boxdark relative transition-all hover:shadow-xl"
            onMouseEnter={() => setIsHovered(ad._id)}
            onMouseLeave={() => setIsHovered(null)}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{ad.title}</h3>
            <p className="text-md text-gray-700 dark:text-gray-300 mt-1">{ad.company_name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {ad.city}, {ad.state} - {ad.pincode}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <strong>Location:</strong> {ad.work_location}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <strong>Salary:</strong> {ad.salary}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <strong>Website:</strong>{" "}
              <a href={ad.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {ad.website}
              </a>
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-4">{ad.text_ad_description || "No description provided"}</p>
            
            <div className="mt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {ad.category}
              </span>
              <a
                href={`tel:${ad.phone}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Call: {ad.phone}
              </a>
            </div>

            {isHovered === ad._id && (
              <div className="absolute top-3 right-3 flex space-x-2">
                <button 
                  className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all"
                  onClick={() => handleDelete(ad._id, ad.userId)}
                >
                  <FaTrash className="text-lg" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobTextAd;
