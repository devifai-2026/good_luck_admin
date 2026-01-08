import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance.ts';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { uploadImageToCloudinary } from '../../hooks/uploadImagesToCloudinary.tsx';
import { MoonLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
// import uploadImagesToCloudinary from "../../hooks/

const Dakshina = () => {
  const [dakshinaList, setDakshinaList] = useState<
    { _id: string; god_name: string; day: string; image: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const [godName, setGodName] = useState('');
  const [day, setDay] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [month, setMonth] = useState('');

  // Fetch Dakshinba List
  const fetchDakshina = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/dakshina/getAll');
      if (Array.isArray(response.data.data)) {
        setDakshinaList(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDakshina();
  }, [isModalOpen]);

  // Handle Add Dakshinba (POST request)
  const handleAddDakshina = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!godName || !day || !image) return alert("Please enter all details!");
    setButtonLoading(true)
    try {
      // Upload image to Cloudinary
      const imageURL = await uploadImageToCloudinary(image);
      console.log("Cloudinary Image URL:", imageURL);
  
      if (!imageURL) {
        return alert("Image upload failed.");
      }
  
      // Create JSON payload
      const payload = {
        god_name: godName,
        day: day,
        image: imageURL, // Store Cloudinary URL in JSON
      };
  
      // Send JSON data to backend
      await axiosInstance.post("dakshina/create", payload, {
        headers: { "Content-Type": "application/json" }, // Ensure JSON format
      });
  
      // Reset state on successful submission
      setButtonLoading(false)
      setIsModalOpen(false);
      fetchDakshina(); // Refresh list
      setGodName("");
      setDay("");
      setImage(null);
    } catch (error: any) {
      console.error("Error adding Dakshina:", error);
      alert(error.response?.data?.message || "Failed to add Dakshina");
    }
  };
  
   
  // Handle Delete Dakshina
  const handleDeleteDakshina = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`dakshina/delete/${id}`);
          setDakshinaList(dakshinaList.filter((dakshina) => dakshina._id !== id));

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
    const handleUpdateDakshina = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!godName || !day || !image) {
        toast.error("Please enter all details!");
        return;
      }
  
      setButtonLoading(true);
      try {
        let imageURL = image ? await uploadImageToCloudinary(image) : dakshinaList.find((r) => r._id === editingId)?.image;

        if (image && !imageURL) {
          toast.error("Image upload failed.");
          return;
        }
  
        const payload = {
          day,
          god_name:godName,
          image: image ? imageURL : dakshinaList.find((r) => r._id === editingId)?.image,
        };
        
        await axiosInstance.patch(`/dakshina/update/${editingId}`, payload);
  
        toast.success("Rashifal Updated Successfully");
        closeModal();
        fetchDakshina();
      } catch (error: any) {
        console.error("Error updating Dakshina:", error);
        toast.error("Failed to update Dakshina");
      } finally {
        setButtonLoading(false);
      }
    };
  
    // Handle Edit Click
    const handleEditClick = (dakshina: any) => {
      setGodName(dakshina.god_name);
      setDay(dakshina.day);
      
      setEditingId(dakshina._id);
      setIsEditing(true);
      setIsModalOpen(true);
    };
  
    // Close Modal
    const closeModal = () => {
      setIsModalOpen(false);
      setIsEditing(false);
      setGodName("");
      setDay("");

      setImage(null);
      setEditingId(null);
    };


   // Fetch by Day
   const fetchDakshinaByDay = async (selectedDay: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/dakshina/get/${selectedDay}`,
      );
      if (
        response.data &&
        response.data.success &&
        response.data.data.length > 0
      ) {
        setDakshinaList(response.data.data); // Store all matching records
      } else {
        setDakshinaList([]);
        toast.error('No Panchang data found for the selected day.');
      }
    } catch (error: any) {
      console.error('Error fetching Panchang by day:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };






  return (
    <>
    <Breadcrumb pageName="Dakshina" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <h2 onClick={fetchDakshina} className="text-xl font-bold hover:cursor-pointer">Dakshina List</h2>
          <div className='flex items-center gap-4'>

            {/* Day Dropdown */}
            <select
              className="rounded-md border px-4 py-2 text-gray-700 focus:outline-none cursor-pointer dark:bg-gray-700 dark:text-gray-300"
              onChange={(e) => fetchDakshinaByDay(e.target.value)}
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

            
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setIsModalOpen(true)}
          >
            Add Dakshina
          </button>
          </div>
        </div>

        {/* Table Headers */}
      <div className="overflow-x-auto">
          <table className="w-full border-collapse dark:border-strokedark">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className=" px-4 py-2 text-center">Image</th>
                <th className=" px-4 py-2 text-center">God Name</th>
                <th className=" px-4 py-2 text-center">Day</th>
                <th className=" px-4 py-2 text-center">Update</th>
                <th className=" px-4 py-2 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {dakshinaList.map((dakshina) => (
                <tr key={dakshina._id} className="dark:border-strokedark">
                  <td className=" px-4 py-2 text-center">
                    <img
                      src={dakshina.image}
                      alt={dakshina.god_name}
                      className="w-12 h-12 object-cover rounded-full mx-auto"
                    />
                  </td>
                  <td className="  px-4 py-2 text-center">{dakshina.god_name}</td>
                  <td className=" px-4 py-2 text-center">{dakshina.day}</td>
                  <td className="  px-4 py-2 text-center">
                    <button  onClick={() => handleEditClick(dakshina)} className="text-blue-500">
                      <FaEdit />
                    </button>
                  </td>
                  <td className=" px-4 py-2 text-center">
                    <button onClick={()=>handleDeleteDakshina(dakshina._id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Inside the Same Component */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-700 dark:text-gray-300 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Update Dakshina" : "Add Dakshina"}
            </h2>
            <form onSubmit={isEditing?handleUpdateDakshina: handleAddDakshina}>
              <input
                type="text"
                placeholder="Enter God Name"
                className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-gray-300"
                value={godName}
                onChange={(e) => setGodName(e.target.value)}
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
                type="file"
                className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-gray-300"
                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              />
              <div className="flex justify-between">
                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" disabled={buttonLoading}>
                  {buttonLoading ? <MoonLoader size={18} color="#fff" /> :isEditing?"Update Dakshina" : "Add Dakshina"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dakshina;

