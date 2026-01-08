import { useState, useEffect } from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { FaEye } from 'react-icons/fa';
import { ScaleLoader } from 'react-spinners';
import axiosInstance from '../../../utils/axiosInstance';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';

// Define Specialization Interface
interface Specialization {
  _id: string;
  name: string;
}

// Define Astrologer Interface
interface Astrologer {
  _id: string;
  Fname: string;
  Lname: string;
  profile_picture?: string;
  specialisation: string[];
  chat_price: number;
  call_price: number;
  userId?: string;
  authId?: string;
  phone?: string;
  video_price?: number;
  years_of_experience?: number;
  description?: string;
  language?: string[];
  certifications?: string[];
  adhar_card?: string[];
  pan_card?: string[];
  isApproved?: boolean;
  request_status?: string;
  request_status_message?: string;
  total_earning?: number;
  total_number_service_provide?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const PendingAstrologers = () => {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

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
      .map(id => specializations.find(spec => spec._id === id)?.name || id)
      .filter(name => name)
      .join(', ');
  };

  // ✅ Fetch Pending Astrologers (GET Request)
  const fetchPendingAstrologers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/astrologer/pending');
      if (Array.isArray(response.data.data)) {
        setAstrologers(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching pending astrologers:', error);
    } finally {
      setLoading(false);
    }
  };

// ✅ Fetch Astrologer Details (Now Fetching from Main List)
const fetchAstrologerDetails = async (id: string) => {
  setDetailsLoading(true);
  setIsDetailsModalOpen(true);
  try {
    const response = await axiosInstance.get(`/astrologer/pending/${id}`); 
    if (response.data.success) {
      setSelectedAstrologer(response.data.data);
    } else {
      console.error("Error: Astrologer data not found.");
    }
  } catch (error: any) {
    console.error("Error fetching astrologer details:", error);
    Swal.fire("Error", "Failed to fetch astrologer details.", "error");
  } finally {
    setDetailsLoading(false);
  }
};

// ✅ Handle Approve Astrologer
const handleApproveAstrologer = async (id: string) => {
  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mx-2",
      cancelButton: "bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mx-2"
    },
    buttonsStyling: false
  });
  
  swalWithTailwindButtons.fire({
    title: "Are you sure?",
    text: "You want to approve this astrologer!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, approve it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // Replace with your actual approval API endpoint
        await axiosInstance.post(`/astrologer/approve/${id}`);
        // Refresh the pending astrologers list
        fetchPendingAstrologers();
        swalWithTailwindButtons.fire({
          title: "Approved!",
          text: "The astrologer has been approved.",
          icon: "success"
        });
      } catch (error) {
        console.error("Error approving astrologer:", error);
        swalWithTailwindButtons.fire({
          title: "Error!",
          text: "Failed to approve astrologer.",
          icon: "error"
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithTailwindButtons.fire({
        title: "Cancelled",
        text: "Astrologer approval cancelled",
        icon: "error"
      });
    }
  });
};


// ✅ Reject Astrologer Without Removing It from UI
const handleRejectAstrologer = async (id: string) => {
  const { value: rejectionReason } = await Swal.fire({
    title: "Enter Rejection Reason",
    input: "textarea",
    inputPlaceholder: "Type the reason for rejection...",
    showCancelButton: true,
    confirmButtonText: "Next",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    customClass: {
      confirmButton: "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded",
      cancelButton: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    },
    preConfirm: (inputValue) => {
      if (!inputValue) {
        Swal.showValidationMessage("Rejection reason is required!");
        return false;
      }
      return inputValue;
    }
  });

  if (!rejectionReason) return;

  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: `You are rejecting this astrologer for: "${rejectionReason}"`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, reject it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
    customClass: {
      confirmButton: "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded",
      cancelButton: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    },
  });

  if (!confirmResult.isConfirmed) return;

  try {
    await axiosInstance.patch(`/astrologer/reject/${id}`, {
      request_status: "rejected",
      request_status_message: rejectionReason
    });

    // ✅ Update the astrologer's status **WITHOUT removing it from UI**
    setAstrologers((prevAstrologers) =>
      prevAstrologers.map((astro) =>
        astro._id === id
          ? { ...astro, request_status: "rejected", request_status_message: rejectionReason }
          : astro
      )
    );

    // ✅ ALSO update selectedAstrologer in modal if it's open
    setSelectedAstrologer((prevAstro) =>
      prevAstro && prevAstro._id === id
        ? { ...prevAstro, request_status: "rejected", request_status_message: rejectionReason }
        : prevAstro
    );

    Swal.fire({
      title: "Rejected!",
      text: "The astrologer has been rejected.",
      icon: "success",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      }
    });

  } catch (error: any) {
    console.error("Error rejecting astrologer:", error);
    Swal.fire({
      title: "Error!",
      text: error.response?.data?.message || "Failed to reject astrologer.",
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      }
    });
  }
};

  useEffect(() => {
    fetchPendingAstrologers();
    fetchSpecializations();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Pending Astrologers" />

      <div className="w-full max-w-full border-stroke bg-white shadow-default dark:bg-gray-700 p-6 rounded-sm">
        {/* Show loader while fetching data */}
        {loading ? (
          <div className="flex justify-center py-10">
            <ScaleLoader aria-setsize={50} color="#3498db" />
          </div>
        ) : astrologers.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-lg font-semibold">
            No pending astrologers
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className=" dark:bg-gray-600 text-center">
                  <th className="px-4 py-2">Profile</th>
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Specialization</th>
                  <th className="px-4 py-2">Chat Price</th>
                  <th className="px-4 py-2">Call Price</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {astrologers.map((astro) => (
                  <tr key={astro._id} className="text-center">
                    {/* Profile Picture */}
                    <td className="px-4 py-2">
                      <img
                        src={
                          astro.profile_picture ||
                          'https://via.placeholder.com/50'
                        }
                        alt={`${astro.Fname} ${astro.Lname}`}
                        className="h-12 w-12 rounded-full mx-auto border"
                      />
                    </td>
                   

                    {/* Full Name */}
                    <td className="px-4 py-2">
                      {astro.Fname} {astro.Lname}
                    </td>

                    {/* Specialization */}
                    <td className="px-4 py-2">
  {astro.specialisation.length > 0 ? (
    <div className="flex flex-wrap justify-center gap-1">
      {astro.specialisation.slice(0, 2).map((specId, index) => (
        <span
          key={index}
          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
        >
          {specializations.find(spec => spec._id === specId)?.name || specId}
        </span>
      ))}
      {astro.specialisation.length > 2 && (
        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
          +{astro.specialisation.length - 2}
        </span>
      )}
    </div>
  ) : (
    <span className="text-gray-500">N/A</span>
  )}
</td>

                    {/* Chat Price */}
                    <td className="px-4 py-2">₹{astro.chat_price}</td>

                    {/* Call Price */}
                    <td className="px-4 py-2">₹{astro.call_price}</td>
                   
                    {/* Status Column */}
<td className="px-4 py-2">
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      astro.request_status === 'pending'
        ? 'bg-yellow-100 text-yellow-800'
        : astro.request_status === 'approved'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
    }`}
  >
    {astro.request_status?.toUpperCase()}
  </span>
</td>

                    {/* Actions */}
                    <td className="px-4 py-2">
                      <div className="flex justify-center items-center gap-3 h-full">
                        <button 
                          className="text-green-500 hover:bg-green-500 hover:text-white p-1 rounded-md"
                          onClick={() => handleApproveAstrologer(astro._id)}
                          title="Approve"
                        >
                          <AiOutlineCheck size={18} />
                        </button>
                        <button 
                          className="text-red-500 hover:bg-red-500 hover:text-white p-1 rounded-md"
                          onClick={() => handleRejectAstrologer(astro._id)}
                          title="Reject"
                        >
                          <AiOutlineClose size={18} />
                        </button>
                        <button 
                          className="text-blue-500 hover:bg-blue-500 hover:text-white p-1 rounded-md"
                          onClick={() => fetchAstrologerDetails(astro._id)}
                          title="View Details"
                        >
                          <FaEye size={18} />
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

      {/* Details Modal */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Astrologer Details</h2>

            {detailsLoading ? (
              <div className="flex justify-center py-10">
                <ScaleLoader aria-setsize={50} color="#3498db" />
              </div>
            ) : selectedAstrologer ? (
              <div>
                {/* Profile Section */}
          
<div className="flex flex-col items-center mb-6">
  <img
    src={selectedAstrologer.profile_picture || "https://via.placeholder.com/100"}
    alt="Profile"
    className="w-24 h-24 rounded-full mb-3 border-2 border-gray-200"
  />
  <h3 className="text-xl font-medium">
    {selectedAstrologer.Fname} {selectedAstrologer.Lname}
  </h3>
  <p className="text-gray-600">{selectedAstrologer.phone}</p>

  {/* Status Badge */}
  <div className="mt-2 flex items-center">
    <span
      className={`px-3 py-1 rounded-full text-xs ${
        selectedAstrologer.request_status === 'pending'
          ? 'bg-yellow-100 text-yellow-800'
          : selectedAstrologer.request_status === 'approved'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {selectedAstrologer.request_status?.toUpperCase()}
    </span>
  </div>

  {/* Show Rejection Reason if Rejected */}
  {selectedAstrologer.request_status === 'rejected' && (
    <p className="mt-2 text-red-600 font-medium text-sm">
      <strong>Cause of Rejection:</strong> {selectedAstrologer.request_status_message}
    </p>
  )}
</div>


                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{selectedAstrologer.years_of_experience} years</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{selectedAstrologer.status || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Chat Price</p>
                    <p className="font-medium">₹{selectedAstrologer.chat_price}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Call Price</p>
                    <p className="font-medium">₹{selectedAstrologer.call_price}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Video Price</p>
                    <p className="font-medium">₹{selectedAstrologer.video_price || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Joined On</p>
                    <p className="font-medium">{new Date(selectedAstrologer.createdAt || '').toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Full Details Section */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 pb-1 border-b">Description</h4>
                  <p className="text-gray-700">{selectedAstrologer.description || 'No description provided.'}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2 pb-1 border-b">Specializations</h4>
                  {selectedAstrologer.specialisation && selectedAstrologer.specialisation.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedAstrologer.specialisation.map((spec, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                          {getSpecializationNames([spec])}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No specializations listed</p>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2 pb-1 border-b">Languages</h4>
                  {selectedAstrologer.language && selectedAstrologer.language.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedAstrologer.language.map((lang, index) => (
                        <span key={index} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No languages listed</p>
                  )}
                </div>

                {/* Documents Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium mb-2 pb-1 border-b">Aadhar Card</h4>
                    {selectedAstrologer.adhar_card && selectedAstrologer.adhar_card.length > 0 ? (
                      <img 
                        src={selectedAstrologer.adhar_card[0]} 
                        alt="Aadhar Card" 
                        className="w-full h-auto rounded border"
                        onClick={() => window.open(selectedAstrologer.adhar_card?.[0], '_blank')}
                        style={{cursor: 'pointer'}}
                      />
                    ) : (
                      <p className="text-gray-500">No Aadhar Card uploaded</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 pb-1 border-b">PAN Card</h4>
                    {selectedAstrologer.pan_card && selectedAstrologer.pan_card.length > 0 ? (
                      <img 
                        src={selectedAstrologer.pan_card[0]} 
                        alt="PAN Card" 
                        className="w-full h-auto rounded border"
                        onClick={() => window.open(selectedAstrologer.pan_card?.[0], '_blank')}
                        style={{cursor: 'pointer'}}
                      />
                    ) : (
                      <p className="text-gray-500">No PAN Card uploaded</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      handleApproveAstrologer(selectedAstrologer._id);
                      setIsDetailsModalOpen(false);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2"
                  >
                    <AiOutlineCheck /> Approve
                  </button>
                  <button
                    onClick={() => {
                      handleRejectAstrologer(selectedAstrologer._id);
                      setIsDetailsModalOpen(false);
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2"
                  >
                    <AiOutlineClose /> Reject
                  </button>
                </div>

                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-full mt-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                >
                  Close
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-600">No astrologer details available</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PendingAstrologers;