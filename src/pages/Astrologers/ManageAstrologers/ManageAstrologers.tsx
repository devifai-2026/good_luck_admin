import { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { ScaleLoader } from 'react-spinners';
import axiosInstance from '../../../utils/axiosInstance';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

// Define Specialization Interface
interface Specialization {
  _id: string;
  name: string;
}

// Define Astrologer Interface
interface Astrologer {
  _id: string;
   authId: string;
  Fname: string;
  Lname: string;
  phone: string;
  years_of_experience: number;
  specialisation: string[];
  total_earning: number;
  wallet: {
    balance: number;
  };
  isActive: boolean;
  profile_picture?: string;
  language: string[];
  chat_price: number;
  video_price: number;
  call_price: number;
  description?: string;
  certifications?: string[];
  adhar_card?: string[];
  pan_card?: string[];
  promo_code?: string;
  total_number_service_provide?: number;
}

const ManageAstrologers = () => {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [updatedAstrologer, setUpdatedAstrologer] = useState<Astrologer | null>(null);
  const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // ✅ Fetch Specializations
  const fetchSpecializations = async () => {
    try {
      const response = await axiosInstance.get('/astrologer/category/getAll');
      if (Array.isArray(response.data.data)) {
        setSpecializations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  // ✅ Get Specialization Names from IDs
  const getSpecializationNames = (ids: string[]) => {
    return ids
      .map(id => specializations.find(spec => spec._id === id)?.name)
      .filter(name => name) // Remove undefined values
      .join(', ');
  };

  // ✅ Fetch Astrologers (GET Request)
  const fetchAstrologers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/astrologer');
      if (Array.isArray(response.data.data)) {
        setAstrologers(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching astrologers:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Astrologer Details (GET Request)
  const fetchAstrologerDetails = async (id: string) => {
    setDetailsLoading(true);
    // Don't close edit modal here - removed setIsEditModalOpen(false)
    setIsDetailsModalOpen(true);
    try {
      const response = await axiosInstance.get(`/astrologer/${id}`);
      if (response.data.success) {
        setSelectedAstrologer(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching astrologer details:", error);
      Swal.fire("Error!", "Failed to fetch astrologer details.", "error");
    } finally {
      setDetailsLoading(false);
    }
  };

  // ✅ Handle Delete Astrologer
  const handleDeleteAstrologer = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/astrologer/delete/${id}`);
          setAstrologers((prevAstrologers) => prevAstrologers.filter((astro) => astro._id !== id));
          Swal.fire('Deleted!', 'Astrologer has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting astrologer:', error);
          Swal.fire('Error!', 'Failed to delete astrologer.', 'error');
        }
      }
    });
  };

  // ✅ Open Edit Modal
  const handleEditClick = (astro: Astrologer) => {
    console.log("🔹 Edit Button Clicked for:", astro);
    // Close details modal if it's open
    setIsDetailsModalOpen(false);
    setSelectedAstrologer(null);
    setUpdatedAstrologer({ ...astro });
    setIsEditModalOpen(true);
  };

  // ✅ Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!updatedAstrologer) return;
    setUpdatedAstrologer({
      ...updatedAstrologer,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle Update Astrologer
  const handleUpdateAstrologer = async () => {
    if (!updatedAstrologer) return;
    try {
      const payload = {
        ...updatedAstrologer,
        years_of_experience: Number(updatedAstrologer.years_of_experience),
        chat_price: Number(updatedAstrologer.chat_price),
        call_price: Number(updatedAstrologer.call_price),
        video_price: Number(updatedAstrologer.video_price),
      };
      await axiosInstance.patch(`/astrologer/adminUpdate/${updatedAstrologer._id}`, payload);
      setIsEditModalOpen(false);
      await fetchAstrologers();
      Swal.fire("Success!", "Astrologer updated successfully!", "success");
    } catch (error) {
      console.error("Error updating astrologer:", error);
      Swal.fire("Error!", "Failed to update astrologer.", "error");
    }
  };

  useEffect(() => {
    fetchAstrologers();
    fetchSpecializations();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Manage Astrologers" />

      <div className="w-full max-w-full border-stroke bg-white dark:bg-gray-700 shadow-default p-6 rounded-sm">
        {/* Show loader while fetching data */}
        {loading ? (
          <div className="flex justify-center py-10">
            <ScaleLoader aria-setsize={50} color="#3498db" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse overflow-x-auto">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-center">
                  <th className="px-4 py-2">Profile</th>
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Experience</th>
                  <th className="px-4 py-2">Wallet Balance</th>
                  <th className="px-4 py-2">Verified</th>
                  <th className="px-4 py-2">Chat Price</th>
                  <th className="px-4 py-2">Call Price</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {astrologers.map((astro) => (
                  <tr key={astro._id} className="text-center">
                    <td className="px-4 py-2">
                      <img
                        src={astro.profile_picture || 'https://via.placeholder.com/50'}
                        alt={`${astro.Fname} ${astro.Lname}`}
                        className="h-12 w-12 rounded-full mx-auto border"
                      />
                    </td>
                    <td className="px-4 py-2">{astro.Fname} {astro.Lname}</td>
                    <td className="px-4 py-2">{astro.years_of_experience} years</td>
                    <td className="px-4 py-2">₹{astro.wallet.balance}</td>
                    <td className="px-4 py-2">
                      {astro.isActive ? (
                        <span className="text-green-500 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-500 font-medium">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2">₹{astro.chat_price}</td>
                    <td className="px-4 py-2">₹{astro.call_price}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => fetchAstrologerDetails(astro._id)}
                        >
                          <FaEye size={18} />
                        </button>
                        <button onClick={() => handleEditClick(astro)} className="text-green-500 hover:text-green-700">
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteAstrologer(astro._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Modal */}
     <div>
       {isDetailsModalOpen && selectedAstrologer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto dark:bg-gray-700 dark:text-gray-300">
            <h2 className="text-lg font-semibold mb-4 text-center">Astrologer Details</h2>

            {detailsLoading ? (
              <ScaleLoader aria-setsize={50} color="#3498db" />
            ) : (
              <div>
                {/* Profile Image & Name */}
                <div className="flex flex-col items-center">
                  <img
                    src={selectedAstrologer.profile_picture || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto mb-4 border"
                  />
                  <h3 className="text-xl font-medium">{selectedAstrologer.Fname} {selectedAstrologer.Lname}</h3>
                  <p className="text-gray-500">{selectedAstrologer.phone}</p>
                  {/* Promo Code */}
                  <div className="mt-4">
                    <h3 className="font-semibold">Promo Code: <span className='text-gray-400'>{selectedAstrologer.promo_code || "N/A"}</span></h3>
                  </div>
                </div>

                {/* Experience, Specialization & Languages */}
                <div className="mt-4 space-y-2">
                  <p><strong>Experience:</strong> {selectedAstrologer.years_of_experience} years</p>
                  <p><strong>Specialization:</strong> {getSpecializationNames(selectedAstrologer.specialisation)}</p>
                  <p><strong>Languages:</strong> {selectedAstrologer.language.join(', ')}</p>
                  <p><strong>Total Service Provided:</strong> {selectedAstrologer.total_number_service_provide || "N/A"}</p>
                  <p><strong>Description:</strong> {selectedAstrologer.description || "N/A"}</p>
                </div>

                {/* Pricing Details */}
                <div className="mt-4 space-y-2">
                  <p><strong>Total Earnings:</strong> ₹{selectedAstrologer.total_earning}</p>
                  <p><strong>Chat Price:</strong> ₹{selectedAstrologer.chat_price}</p>
                  <p><strong>Call Price:</strong> ₹{selectedAstrologer.call_price}</p>
                  <p><strong>Video Call Price:</strong> ₹{selectedAstrologer.video_price}</p>
                  <p><strong>Wallet Balance:</strong> ₹{selectedAstrologer.wallet.balance}</p>
                </div>

                {/* Certifications */}
                <div className="mt-4">
                  <h3 className="font-semibold">Certifications:</h3>
                  {selectedAstrologer.certifications && selectedAstrologer.certifications.length > 0 ? (
                    <ul className="list-disc ml-5">
                      {selectedAstrologer.certifications.map((cert, index) => (
                        <li key={index} className="text-gray-600">{cert}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No certifications available</p>
                  )}
                </div>

                {/* Aadhar Card */}
                <div className="mt-4">
                  <h3 className="font-semibold">Aadhar Card:</h3>
                  {selectedAstrologer.adhar_card && selectedAstrologer.adhar_card.length > 0 ? (
                    <img src={selectedAstrologer.adhar_card[0]} alt="Aadhar Card" className="w-32 h-20 rounded-md border mt-2" />
                  ) : (
                    <p className="text-gray-500">No Aadhar Card available</p>
                  )}
                </div>

                {/* PAN Card */}
                <div className="mt-4">
                  <h3 className="font-semibold">PAN Card:</h3>
                  {selectedAstrologer.pan_card && selectedAstrologer.pan_card.length > 0 ? (
                    <img src={selectedAstrologer.pan_card[0]} alt="PAN Card" className="w-32 h-20 rounded-md border mt-2" />
                  ) : (
                    <p className="text-gray-500">No PAN Card available</p>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="mt-4 bg-gray-500 font-bold text-xl text-white px-4 py-2 rounded w-full"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

     </div>
      {/* Edit Modal - Moved outside the details modal */}
      {isEditModalOpen && updatedAstrologer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg dark:bg-gray-700 dark:text-gray-300">
            <h2 className="text-lg font-semibold mb-4 text-center">Edit Astrologer</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input type="text" name="Fname" value={updatedAstrologer.Fname} onChange={handleInputChange} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input type="text" name="Lname" value={updatedAstrologer.Lname} onChange={handleInputChange} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="text" name="phone" value={updatedAstrologer.phone} onChange={handleInputChange} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Years of Experience</label>
              <input type="number" name="years_of_experience" value={updatedAstrologer.years_of_experience} onChange={handleInputChange} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Chat Price (₹)</label>
              <input type="number" name="chat_price" value={updatedAstrologer.chat_price} onChange={handleInputChange} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Call Price (₹)</label>
              <input type="number" name="call_price" value={updatedAstrologer.call_price} onChange={handleInputChange} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleUpdateAstrologer} className="bg-blue-500 text-white px-4 py-2 rounded flex-1 hover:bg-blue-600">
                Update
              </button>
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded flex-1 hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageAstrologers;