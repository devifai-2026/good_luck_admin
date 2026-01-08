import { useState, useEffect } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { ScaleLoader } from "react-spinners";
import axiosInstance from "../../../utils/axiosInstance";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import Swal from "sweetalert2";

interface Specialization {
  _id: string;
  name: string;
}

interface UpdateRequest {
  _id: string;
  Fname: string;
  Lname: string;
  phone: string;
  profile_picture?: string;
  specialisation: string[];
  chat_price: number;
  video_price: number;
  call_price: number;
  years_of_experience: number;
  description: string;
  language: string[];
  certifications: any[];
  createdAt: string;
}

const UpdateRequest = () => {
  const [updateRequests, setUpdateRequests] = useState<UpdateRequest[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<UpdateRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specsRes, requestsRes] = await Promise.all([
          axiosInstance.get('/astrologer/category/getAll'),
          axiosInstance.get('/astrologer/update-requests/getAll')
        ]);
        
        setSpecializations(specsRes.data.data);
        setUpdateRequests(requestsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSpecializationNames = (ids: string[]) => {
    return ids
      .map(id => specializations.find(spec => spec._id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const openModal = (request: UpdateRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('en-IN').format(price);

  // Approve update request
  const approveUpdate = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You are about to approve these changes",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approve it!'
      });

      if (result.isConfirmed) {
        setProcessing(true);
        await axiosInstance.patch(`/astrologer/approveUpdate/${id}`);
        
        // Update UI by removing the approved request
        setUpdateRequests(prev => prev.filter(req => req._id !== id));
        
        Swal.fire(
          'Approved!',
          'The changes have been approved.',
          'success'
        );
        
        // Close modal if open
        if (isModalOpen) closeModal();
      }
    } catch (error) {
      console.error("Error approving update:", error);
      Swal.fire(
        'Error!',
        'There was an error approving the changes.',
        'error'
      );
    } finally {
      setProcessing(false);
    }
  };

  // Reject update request
  const rejectUpdate = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You are about to reject these changes",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reject it!'
      });

      if (result.isConfirmed) {
        setProcessing(true);
        // Replace with your reject endpoint if available
        // await axiosInstance.patch(`/astrologer/rejectUpdate/${id}`);
        
        // Update UI by removing the rejected request
        setUpdateRequests(prev => prev.filter(req => req._id !== id));
        
        Swal.fire(
          'Rejected!',
          'The changes have been rejected.',
          'success'
        );
        
        // Close modal if open
        if (isModalOpen) closeModal();
      }
    } catch (error) {
      console.error("Error rejecting update:", error);
      Swal.fire(
        'Error!',
        'There was an error rejecting the changes.',
        'error'
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumb pageName="Update Requests" />
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Pending Update Requests
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {updateRequests.length} requests
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ScaleLoader color="#3B82F6" />
          </div>
        ) : updateRequests.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No update requests
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              All astrologer updates have been processed
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Astrologer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Specializations
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {updateRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    {/* Astrologer Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                            src={request.profile_picture || "https://ui-avatars.com/api/?name="+encodeURIComponent(request.Fname+" "+request.Lname)}
                            alt={`${request.Fname} ${request.Lname}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.Fname} {request.Lname}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {request.phone}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {request.years_of_experience} yrs experience
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Specializations */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {request.specialisation.length > 0 ? (
                          getSpecializationNames(request.specialisation)
                            .split(', ')
                            .map((spec, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {spec}
                              </span>
                            ))
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">None</span>
                        )}
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="grid gap-1">
                        <div className="flex items-center">
                          <span className="w-20 text-sm text-gray-500 dark:text-gray-400">Chat:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ₹{formatPrice(request.chat_price)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-20 text-sm text-gray-500 dark:text-gray-400">Call:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ₹{formatPrice(request.call_price)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-20 text-sm text-gray-500 dark:text-gray-400">Video:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ₹{formatPrice(request.video_price)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal(request)}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="View details"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => approveUpdate(request._id)}
                          disabled={processing}
                          className="text-green-600 hover:text-green-900 dark:hover:text-green-400 p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <AiOutlineCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => rejectUpdate(request._id)}
                          disabled={processing}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <AiOutlineClose className="h-4 w-4" />
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
      {isModalOpen && selectedRequest && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75" onClick={closeModal}></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Astrologer Details
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Review all details before approving
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="bg-white dark:bg-gray-700 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <AiOutlineClose className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  {/* Profile Section */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center space-x-4">
                      <img
                        className="h-16 w-16 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                        src={selectedRequest.profile_picture || "https://ui-avatars.com/api/?name="+encodeURIComponent(selectedRequest.Fname+" "+selectedRequest.Lname)}
                        alt={`${selectedRequest.Fname} ${selectedRequest.Lname}`}
                      />
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {selectedRequest.Fname} {selectedRequest.Lname}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedRequest.phone}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {selectedRequest.years_of_experience} years of experience
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Specializations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Specializations
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getSpecializationNames(selectedRequest.specialisation)
                        .split(', ')
                        .map((spec, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {spec}
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Languages
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.language.map((lang, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pricing
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Chat:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{formatPrice(selectedRequest.chat_price)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Call:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{formatPrice(selectedRequest.call_price)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Video:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{formatPrice(selectedRequest.video_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedRequest.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Certifications */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Certifications
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedRequest.certifications.length > 0 
                          ? selectedRequest.certifications.join(", ") 
                          : "No certifications provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={() => approveUpdate(selectedRequest._id)}
                  disabled={processing}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Approve Changes'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateRequest;