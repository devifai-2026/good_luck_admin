import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance.ts';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { uploadImageToCloudinary } from '../../hooks/uploadImagesToCloudinary.tsx';
import { MoonLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const Panchang = () => {
  const [panchangList, setPanchangList] = useState<
    { _id: string; day: string; date: string; month: string; image: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPanchang = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/panchang/getAll');
      if (Array.isArray(response.data.data)) {
        setPanchangList(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanchang();
  }, [isModalOpen]);

  //   Post Method
  const handleAddPanchang = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!day || !date || !month || !image) {
      alert('Please enter all details!');
      return;
    }

    setButtonLoading(true);

    try {
      // Upload image to Cloudinary
      const imageURL = await uploadImageToCloudinary(image);
      console.log('Cloudinary Image URL:', imageURL);

      if (!imageURL) {
        toast.error('Image upload failed.');
        return; // Prevents further execution
      }

      // Create JSON payload
      const payload = {
        day,
        date: new Date(date).toISOString().split('T')[0],
        month,
        image: imageURL, // Store Cloudinary URL in JSON
      };

      // Send JSON data to backend
      await axiosInstance.post('panchang/create', payload, {
        headers: { 'Content-Type': 'application/json' }, // Ensure JSON format
      });

      // Reset state on successful submission
      setIsModalOpen(false);
      setDay('');
      setDate('');
      setMonth('');
      setImage(null);
      toast.success('Panchang Added Successfully', {
        duration: 2000,
      });
      // Refresh list after adding new Panchang
      fetchPanchang();
    } catch (error: any) {
      console.error('Error adding Panchang:', error);
      alert(error.response?.data?.message || 'Failed to add Panchang');
    } finally {
      setButtonLoading(false); // Ensure button loader stops in all cases
    }
  };

  // Handle Delete Panchang
  const handleDeletePanchang = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Delete this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/panchang/delete/${id}`);
          setPanchangList(
            panchangList.filter((panchang) => panchang._id !== id),
          );

          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          });
        } catch (error: any) {
          console.error('Error deleting Panchang:', error);
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to delete Panchang',
            icon: 'error',
          });
        }
      }
    });
  };

  // Handle Update Panchang
  const handleUpdatePanchang = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!month || !day || !date) {
      toast.error('Please enter all details!');
      return;
    }

    setButtonLoading(true);
    try {
      let imageURL = image ? await uploadImageToCloudinary(image) : null;
      if (image && !imageURL) {
        toast.error('Image upload failed.');
        return;
      }

      const payload = {
        day,
        date: new Date(date).toISOString().split('T')[0],
        month: new Date(date).toLocaleString('en-US', { month: 'long' }),
        image: image
          ? imageURL
          : panchangList.find((r) => r._id === editingId)?.image,
      };

      await axiosInstance.patch(`/panchang/update/${editingId}`, payload);

      toast.success('Panchang Updated Successfully');
      closeModal();
      fetchPanchang();
    } catch (error: any) {
      console.error('Error updating Panchang:', error);
      toast.error('Failed to update Panchang');
    } finally {
      setButtonLoading(false);
    }
  };

  // Handle Edit Click
  const handleEditClick = (panchang: any) => {
    setMonth(panchang.month);
    setDay(panchang.day);
    setDate(panchang.date);
    setEditingId(panchang._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setMonth('');
    setDay('');
    setDate('');
    setImage(null);
    setEditingId(null);
  };

  //   Fetch by date
  const fetchPanchangByDate = async (selectedDate: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/panchang/getByDate/${selectedDate}`,
      );
      if (response.data && response.data.success && response.data.data) {
        setPanchangList([response.data.data]); // Store as an array
      } else {
        setPanchangList([]);
        toast.error('No Panchang data found for the selected date.');
      }
    } catch (error: any) {
      console.error('Error fetching Panchang by date:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch by Day
  const fetchPanchangByDay = async (selectedDay: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/panchang/getByDay/${selectedDay}`,
      );
      if (
        response.data &&
        response.data.success &&
        response.data.data.length > 0
      ) {
        setPanchangList(response.data.data); // Store all matching records
      } else {
        setPanchangList([]);
        toast.error('No Panchang data found for the selected day.');
      }
    } catch (error: any) {
      console.error('Error fetching Panchang by day:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch by month
  const fetchPanchangByMonth = async (selectedMonth: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/panchang/getByMonth/${selectedMonth}`,
      );
      if (
        response.data &&
        response.data.success &&
        response.data.data.length > 0
      ) {
        setPanchangList(response.data.data); // Store all matching records
      } else {
        setPanchangList([]);
        toast.error('No Panchang data found for the selected month.');
      }
    } catch (error: any) {
      console.error('Error fetching Panchang by month:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Panchang" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <h2
            onClick={fetchPanchang}
            className="text-xl font-bold cursor-pointer hover:text-gray-700"
          >
            Panchang List
          </h2>
          <div className="flex items-center gap-4">
            {/* Day Dropdown */}
            <select
              className="rounded-md border px-4 py-2 text-gray-700 focus:outline-none cursor-pointer dark:bg-gray-700 dark:text-gray-300"
              onChange={(e) => fetchPanchangByDay(e.target.value)}
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
              onChange={(e) => fetchPanchangByDate(e.target.value)}
            />

            {/* Month Dropdown */}
            <select
              className="rounded-md border px-4 py-2 text-gray-700 focus:outline-none cursor-pointer dark:bg-gray-700 dark:text-gray-300"
              onChange={(e) => fetchPanchangByMonth(e.target.value)}
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

            {/* Add Panchang Button */}
            <button
              className="rounded-md bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600"
              onClick={() => setIsModalOpen(true)}
            >
              Add Panchang
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse dark:border-strokedark">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className=" px-4 py-2">Image</th>
                <th className=" px-4 py-2">Day</th>
                <th className=" px-4 py-2">Date</th>
                <th className=" px-4 py-2">Month</th>
                <th className=" px-4 py-2">Update</th>
                <th className=" px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {panchangList.map((panchang) => (
                <tr key={panchang._id} className=" text-center">
                  <td className="px-4 py-2">
                    <img
                      src={panchang.image}
                      alt="Panchang"
                      className="w-12 h-12 rounded-full mx-auto"
                    />
                  </td>
                  <td className=" px-4 py-2">{panchang.day}</td>
                  <td className=" px-4 py-2">{panchang.date.split('T')[0]}</td>
                  <td className=" px-4 py-2">{panchang.month}</td>
                  <td className="  px-4 py-2 text-center">
                    <button
                      onClick={() => handleEditClick(panchang)}
                      className="text-blue-500"
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td className=" px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeletePanchang(panchang._id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-700 dark:text-gray-300 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Update Panchang' : 'Add Panchang'}
            </h2>
            <form
              onSubmit={isEditing ? handleUpdatePanchang : handleAddPanchang}
            >
              <select
                className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-gray-300"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
              >
                <option value="">Select Month</option>
                {[
                  'January', 'February', 'March', 'April',
                  'May', 'June', 'July', 'August',
                  'September', 'October', 'November', 'December',
                ].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-gray-300"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                required
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
                ].map((d) => (
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
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded "
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
                  {buttonLoading ? (
                    <MoonLoader size={18} color="#fff" />
                  ) : isEditing ? (
                    'Update Panchang'
                  ) : (
                    'Add Panchang'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Panchang;
