import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import axiosInstance from "../../../utils/axiosInstance";
import toast from "react-hot-toast";

interface AdData {
  _id: string;
  userId: string;
  title: string;
  city: string;
  state: string;
  pincode: string;
  price: string;
  phone: string;
  text_ad_description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const TextAd = () => {
  const [modal, setModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    price: "",
    text_ad_description: "",
    category: "Land"
  });
  const [adData, setAdData] = useState<AdData[] | null>(null);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedUserId , SetSelectedUserId] =  useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/homeLandText/getAll")
      .then((response) => setAdData(response.data.data))
      .catch((error) => console.error("Error fetching ad data:", error));
  }, []);

  const handlePost = async () => {
    try {
      const postData = {
        userId: "679b71609eca9bc58940e8c0",
        ...formData,
        total_character: formData.text_ad_description.length,
      };
const adId = selectedId
      const postData2 = {
         adId,
        ...formData,
        total_character: formData.text_ad_description.length,
      };

      if (selectedId) {
        // Update existing post (PATCH)
        await axiosInstance.patch(`/homeLandText/update/${selectedUserId}`, postData2);
        toast.success("Post updated successfully!");

        // Update the adData state
        setAdData((prevAdData) =>
          prevAdData
            ? prevAdData.map((ad) => (ad._id === selectedId ? { ...ad, ...postData } : ad))
            : null
        );
      } else {
        // Create new post (POST)
        const response = await axiosInstance.post("/homeLandText/create", postData);
        setAdData((prevAdData) => (prevAdData ? [response.data, ...prevAdData] : [response.data]));
        toast.success("Post created successfully!");
      }

      toggleModal();
      setSelectedId(null); // Reset selected ID
      setFormData({ title: "", city: "", state: "", pincode: "", phone: "", price: "", text_ad_description: "", category: "Land" });
    } catch (error: any) {
      console.error("Error creating/updating post:", error);
      toast.error(error.response?.data?.message || "Failed to create/update post");
    }
  };
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (id: string, userId: string) => {
    const adToEdit = adData?.find((ad) => ad._id === id);
    if (adToEdit) {
      setFormData(adToEdit);
      setSelectedId(id);
      SetSelectedUserId(userId);
      toggleModal();
    }
  };
  


  const handleDelete = async (id: string , userId: string) => {
    try {
      await axiosInstance.delete(`/homeLandText/delete/${userId}/${id}`);
      setAdData((prevAdData) => prevAdData?.filter((ad) => ad._id !== id) || null);
      toast.success("Post deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };
  
  const toggleModal = () => {
    setModal(!modal);
    
    if (!modal) {
      // Reset form data when modal opens
      setFormData({
        title: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        price: "",
        text_ad_description: "",
        category: "Land"
      });
    }
  };
  



  const filteredAds = categoryFilter === "All" ? adData : adData?.filter((ad) => ad.category === categoryFilter);

  return (
    <div>
      <Breadcrumb pageName="TextAd" />

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

        {/* <button
          onClick={toggleModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create Post
        </button> */}
       
      </div>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold mb-4">Create Post</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white" />
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white" />
              <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white" />
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white" />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white" />
              <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white" />
            </div>
            <textarea name="text_ad_description" value={formData.text_ad_description} onChange={handleChange} placeholder="Description" className="w-full border rounded-md px-3 py-2 mt-4 dark:bg-gray-800 dark:text-white" />
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-md px-3 py-2 mt-4 dark:bg-gray-800 dark:text-white">
              <option value="Land">Land</option>
              <option value="Home">Home</option>
            </select>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={toggleModal} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Cancel</button>
              <button onClick={handlePost} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredAds?.map((ad) => (
          <div
            key={ad._id}
            className="border rounded-xl shadow-lg p-5 bg-white dark:bg-boxdark relative"
            onMouseEnter={() => setIsHovered(ad._id)}
            onMouseLeave={() => setIsHovered(null)}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{ad.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {ad.city}, {ad.state} - {ad.pincode}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              {ad.text_ad_description || "No description provided"}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">₹{ad.price}</span>
              <a
                href={`tel:${ad.phone}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Contact: {ad.phone}
              </a>
            </div>
            {isHovered === ad._id && (
              <div className="absolute top-3 right-3 flex space-x-2">
                {/* <button onClick={() =>handleEdit(ad._id, ad.userId)}>
                  <FaEdit className="text-yellow-500 hover:text-yellow-600 text-lg" />
                </button> */}
                <button 
                 className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all"
                onClick={() => handleDelete(ad._id , ad.userId)}>
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

export default TextAd;
