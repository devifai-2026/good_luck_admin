import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.ts";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { uploadImageToCloudinary } from "../hooks/uploadImagesToCloudinary.tsx";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MoonLoader } from "react-spinners";

const Calendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calendarList, setCalendarList] = useState<{ _id: string; month: string; image: string }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchMonth, setSearchMonth] = useState("");

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/calender/getAll");
      if (Array.isArray(response.data.data)) {
        setCalendarList(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching calendar:", error);
      toast.error(error.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const handleSaveCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMonth) return toast.error("Please select a month!");
    if (!isEditing && !image) return toast.error("Please select an image!");

    setButtonLoading(true);
    try {
      let imageURL = isEditing && !image 
        ? calendarList.find((r) => r._id === editingId)?.image
        : await uploadImageToCloudinary(image!);

      if (!imageURL) {
        toast.error("Image upload failed.");
        return;
      }

      const payload = { month: selectedMonth, image: imageURL };

      if (isEditing) {
        await axiosInstance.patch(`/calender/update/${editingId}`, payload);
        toast.success("Calendar updated successfully!");
      } else {
        await axiosInstance.post("/calender/create", payload);
        toast.success("Calendar added successfully!");
      }

      fetchCalendar();
      closeModal();
    } catch (error: any) {
      console.error("Error saving calendar:", error);
      toast.error(error.response?.data?.message || "Failed to save calendar.");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDeleteCalendar = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#fff"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/calender/delete/${id}`);
          setCalendarList(calendarList.filter((calendar) => calendar._id !== id));
          toast.success("Calendar deleted successfully!");
        } catch (error: any) {
          console.error("Error deleting calendar:", error);
          toast.error(error.response?.data?.message || "Failed to delete.");
        }
      }
    });
  };

  const handleEditClick = (calendar: any) => {
    setSelectedMonth(calendar.month);
    setEditingId(calendar._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedMonth("");
    setImage(null);
    setEditingId(null);
  };

  const fetchCalenderByMonth = async (month: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/calender/getByMonth/${month}`);
      if (response.data?.data?.length > 0) {
        setCalendarList(response.data.data);
      } else {
        setCalendarList([]);
        toast.error('No calendar data found for the selected month.');
      }
    } catch (error: any) {
      console.error('Error fetching calendar by month:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <>
      <Breadcrumb pageName="Calendar Management" />

      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
        {/* Header Section with Search and Add Button */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Calendar Entries
          </h2>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-64">
              <select
                value={searchMonth}
                onChange={(e) => {
                  setSearchMonth(e.target.value);
                  fetchCalenderByMonth(e.target.value);
                }}
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Months</option>
                {months.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <FaSearch className="absolute right-3 top-3 text-gray-400 text-lg" />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg shadow-md transition-all duration-200"
            >
              <FaPlus className="text-lg" />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Calendar Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <MoonLoader size={40} color="#3B82F6" />
            </div>
          ) : calendarList.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {calendarList.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.month}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={item.image} 
                        alt={item.month} 
                        className="h-14 w-14 object-cover rounded-md shadow-sm border border-gray-200 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDeleteCalendar(item._id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-gray-600 transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchMonth ? `No calendar found for ${searchMonth}` : "No calendar entries found"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isEditing ? "Update Calendar" : "Add New Calendar"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSaveCalendar}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isEditing ? "New Image (Leave empty to keep current)" : "Image"}
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors p-6">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-10 h-10 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          {image ? image.name : "Click to upload"}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setImage(e.target.files?.[0] || null)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={buttonLoading}
                    className="px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center min-w-24"
                  >
                    {buttonLoading ? (
                      <MoonLoader size={18} color="#fff" />
                    ) : isEditing ? (
                      "Update"
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Calendar;