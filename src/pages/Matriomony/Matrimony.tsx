import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FaWhatsapp } from "react-icons/fa";
import toast from 'react-hot-toast';

interface MatrimonyProfile {
  _id: string;
  userId:string;
  Fname: string;
  Lname: string;
  photo: string[];
  age: number;
  city: string;
  state: string;
  salary: string;
  bio: string;
  isDivorce: boolean;
  gender: string;
  cast: string;
  searching_for: string;
  interests: string[];
  whatsappNumber: string;
  facebookLink: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const Matrimony = () => {
  const [matrimonyProfiles, setMatrimonyProfiles] = useState<MatrimonyProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<MatrimonyProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMatrimonyProfiles();
  }, []);

  const fetchMatrimonyProfiles = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/matrimony');
      setMatrimonyProfiles(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/matrimony/delete/${id}`);
      fetchMatrimonyProfiles();
      toast.success("Profile deleted successfully!"); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const openModal = (profile: MatrimonyProfile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  return (
    <>
      <Breadcrumb pageName="Matrimony" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <h2 className="text-xl font-bold">Matrimony Profiles</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse dark:border-strokedark">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Age</th>
                <th className="px-4 py-2 text-center">Gender</th>
                <th className="px-4 py-2 text-center">Location</th>
                <th className="px-4 py-2 text-center">Looking For</th>
                <th className="px-4 py-2 text-center">Verified</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                matrimonyProfiles.map((profile) => (
                  <tr key={profile._id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-center">{`${profile.Fname} ${profile.Lname}`}</td>
                    <td className="px-4 py-3 text-center">{profile.age}</td>
                    <td className="px-4 py-3 text-center">{profile.gender}</td>
                    <td className="px-4 py-3 text-center">{`${profile.city}, ${profile.state}`}</td>
                    <td className="px-4 py-3 text-center capitalize">{profile.searching_for}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        profile.isVerified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {profile.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => openModal(profile)} 
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDelete(profile.userId)} 
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedProfile && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-end  z-50 p-4 mt-16">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {`${selectedProfile.Fname} ${selectedProfile.Lname}`}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {selectedProfile.gender}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {selectedProfile.age} years
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {selectedProfile.city}, {selectedProfile.state}
                  </span>
                  {selectedProfile.isDivorce && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Divorced
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
        
            {/* Main Content */}
            <div className="p-6 space-y-6">
              {/* Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedProfile.photo.map((photo, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 relative group">
                    <img
                      src={photo}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
        
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">Basic Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Looking For</span>
                        <p className="font-medium capitalize">{selectedProfile.searching_for}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Cast</span>
                        <p className="font-medium capitalize">{selectedProfile.cast}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Salary</span>
                        <p className="font-medium">₹{selectedProfile.salary}</p>
                      </div>
                    </div>
                  </div>
        
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">Social Links</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">WhatsApp</span>
                        <p className="font-medium">{selectedProfile.whatsappNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Facebook</span>
                        <a 
                          href={selectedProfile.facebookLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {selectedProfile.facebookLink}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
        
                {/* Right Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Verification</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedProfile.isVerified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {selectedProfile.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Marital Status</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedProfile.isDivorce ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {selectedProfile.isDivorce ? 'Divorced' : 'Never Married'}
                        </span>
                      </div>
                    </div>
                  </div>
        
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.interests.map((interest, index) => (
                        <span 
                          key={index} 
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm capitalize"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
        
              {/* Bio */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">About</h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedProfile.bio || 'No bio provided'}
                </p>
              </div>
        
              {/* Dates */}
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-medium">Profile Created: </span>
                  {new Date(selectedProfile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
        
            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
              <a 
                href={`https://wa.me/${selectedProfile.whatsappNumber}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaWhatsapp />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Matrimony;