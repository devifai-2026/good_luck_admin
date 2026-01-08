import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance.ts";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { uploadImageToCloudinary } from "../../hooks/uploadImagesToCloudinary.tsx";
import { MoonLoader } from "react-spinners";
import toast from "react-hot-toast";

const Rashifal = () => {
  const [rashifalList, setRashifalList] = useState<
  { _id: string; god_name: string; day: string; date: string; month: string; image: string }[]
>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false)
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [month, setMonth] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // Fetch Rashifal List
  const fetchRashifal = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/rasifal/getAll");
      if (Array.isArray(response.data.data)) {
        setRashifalList(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRashifal();
  }, [isModalOpen]);

  // Handle Add Rashifal
  const handleAddRashifal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!month || !day || !date || !image) {
        alert("Please enter all details!");
        return;
    }

    setButtonLoading(true);

    try {
        // Upload image to Cloudinary
        const imageURL = await uploadImageToCloudinary(image);
        console.log("Cloudinary Image URL:", imageURL);

        if (!imageURL) {
            alert("Image upload failed.");
            return; // Prevents further execution
        }

        // Create JSON payload
        const payload = {
        
            day,
            date: new Date(date).toISOString().split('T')[0],
            month: new Date(date).toLocaleString("en-US", { month: "long" }), // Extract month name
            image: imageURL, // Store Cloudinary URL in JSON
        };

        // Send JSON data to backend
        await axiosInstance.post("rasifal/create", payload, {
            headers: { "Content-Type": "application/json" }, 
        });

        // Reset state on successful submission
        setIsModalOpen(false);
        setDay("");
        setDate("");
        setImage(null);
        toast.success("Rashifal Added Successfully", {
            duration: 2000,
        });

        // Refresh list after adding new Rashifal
        fetchRashifal();
    } catch (error: any) {
        console.error("Error adding Rashifal:", error);
        alert(error.response?.data?.message || "Failed to add Rashifal");
    } finally {
        setButtonLoading(false); // Ensure button loader stops in all cases
    }
};

    // Handle Delete Rashifal
  const handleDeleteRashifal = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You wan't to Delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/rasifal/delete/${id}`);
          setRashifalList(rashifalList.filter((rashifal) => rashifal._id !== id));

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        } catch (error: any) {
          console.error("Error deleting Rashifal:", error);
          Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "Failed to delete Rashifal",
            icon: "error",
          });
        }
      }
    });
  };


  // Handle Update Rashifal
  const handleUpdateRashifal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!month || !day || !date) {
      toast.error("Please enter all details!");
      return;
    }

    setButtonLoading(true);
    try {
      let imageURL = image ? await uploadImageToCloudinary(image) : null;
      if (image && !imageURL) {
        toast.error("Image upload failed.");
        return;
      }

      const payload = {
        day,
        date: new Date(date).toISOString().split('T')[0],
        month: new Date(date).toLocaleString("en-US", { month: "long" }),
        image: image ? imageURL : rashifalList.find((r) => r._id === editingId)?.image,
      };
      
      await axiosInstance.patch(`/rasifal/update/${editingId}`, payload);

      toast.success("Rashifal Updated Successfully");
      closeModal();
      fetchRashifal();
    } catch (error: any) {
      console.error("Error updating Rashifal:", error);
      toast.error("Failed to update Rashifal");
    } finally {
      setButtonLoading(false);
    }
  };

  // Handle Edit Click
  const handleEditClick = (rashifal: any) => {
    setMonth(rashifal.month);
    setDay(rashifal.day);
    setDate(rashifal.date);
    setEditingId(rashifal._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setMonth("");
    setDay("");
    setDate("");
    setImage(null);
    setEditingId(null);
  };

   // Fetch by month
   const fetchRashifalByMonth = async (selectedMonth: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/rasifal/getByMonth/${selectedMonth}`,
      );
      if (
        response.data &&
        response.data.success &&
        response.data.data.length > 0
      ) {
        setRashifalList(response.data.data); // Store all matching records
      } else {
        setRashifalList([]);
        toast.error('No Panchang data found for the selected month.');
      }
    } catch (error: any) {
      console.error('Error fetching Panchang by month:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };


   // Fetch by Day
   const fetchRashifalByDay = async (selectedDay: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/rasifal/getByDay/${selectedDay}`,
      );
      if (
        response.data &&
        response.data.success &&
        response.data.data.length > 0
      ) {
        setRashifalList(response.data.data); // Store all matching records
      } else {
        setRashifalList([]);
        toast.error('No Panchang data found for the selected day.');
      }
    } catch (error: any) {
      console.error('Error fetching Panchang by day:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };


    //   Fetch by date
    const fetchRashifalByDate = async (selectedDate: string) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/rasifal/getByDate/${selectedDate}`,
        );
        if (response.data && response.data.success && response.data.data) {
          setRashifalList([response.data.data]); // Store as an array
        } else {
          setRashifalList([]);
          toast.error('No Panchang data found for the selected date.');
        }
      } catch (error: any) {
        console.error('Error fetching Panchang by date:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };


  return (
    <>
  <Breadcrumb pageName="Rashifal" />
  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
      <h2 onClick={fetchRashifal} className="text-xl font-bold hover:cursor-pointer">Rashifal List</h2>
     <div className="flex items-center gap-4">

       {/* Day Dropdown */}
       <select
              className="rounded-md border px-4 py-2 text-gray-700 focus:outline-none cursor-pointer dark:bg-gray-700 dark:text-gray-300"
              onChange={(e) => fetchRashifalByDay(e.target.value)}
            >
              <option value="">Select a Day</option>
              {[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

              {/* Calendar Button */}
              <input
              type="date"
              className="rounded-md border px-4 py-2 text-gray-700 focus:outline-none cursor-pointer dark:bg-gray-700 dark:text-gray-300"
              onChange={(e) => fetchRashifalByDate(e.target.value)}
            />

      {/* Month Dropdown */}
      <select
              className="rounded-md border px-4 py-2 text-gray-700 focus:outline-none cursor-pointer dark:bg-gray-700 dark:text-gray-300"
              onChange={(e) => fetchRashifalByMonth(e.target.value)}
            >
              <option value="">Select a Month</option>
              {[
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>

            
     <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        Add Rashifal
      </button>
     </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse dark:border-strokedark">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Day</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Month</th>
            <th className="px-4 py-2">Update</th>
            <th className="px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {rashifalList.map((rashifal) => (
            <tr key={rashifal._id} className="text-center">
              <td className="px-4 py-2">
                <img
                  src={rashifal.image}
                  alt="Rashifal"
                  className="w-12 h-12 rounded-full mx-auto"
                />
              </td>
              <td className="px-4 py-2">{rashifal.day}</td>
              <td className="px-4 py-2">{rashifal.date.split('T')[0]}</td>
              <td className="px-4 py-2">{rashifal.month}</td>
              <td className="px-4 py-2 text-center">
                <button
                  className="text-blue-500"
                  onClick={() => handleEditClick(rashifal)}
                >
                  <FaEdit />
                </button>
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => handleDeleteRashifal(rashifal._id)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Add Rashifal Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-700 dark:text-gray-300 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Rashifal" : "Add Rashifal"}
        </h2>
        <form onSubmit={isEditing ? handleUpdateRashifal : handleAddRashifal}>
          <input
            type="text"
            
            placeholder="Enter Month"
            className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-gray-300"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
          <select
            className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-gray-300"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
          >
            <option value="">Select a Day</option>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-gray-300"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="file"
            className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-gray-300"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setIsModalOpen(false);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center transition"
              disabled={buttonLoading}
            >
              {buttonLoading ? <MoonLoader size={18} color="#fff" /> : isEditing ? "Update Rashifal" : "Add Rashifal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</>

  );
};

export default Rashifal;