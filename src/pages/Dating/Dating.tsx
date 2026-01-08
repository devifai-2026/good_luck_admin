import  { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import toast from 'react-hot-toast';

interface DatingProfile {
  _id: string;
  userId: string;
  Fname: string;
  Lname: string;
  photos: string[];
  age: number;
  phone: string;
  city: string;
  state: string;
  bio: string;
  smoker: boolean;
  alcoholic: boolean;
  education: string;
  orientation: string;
  interests: string[];
  looking_for: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const Dating = () => {
  const [datingProfiles, setDatingProfiles] = useState<DatingProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<DatingProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDatingProfiles();
  }, []);

  const fetchDatingProfiles = async () => {
    try {
      const response = await axiosInstance.get('/dating');
      setDatingProfiles(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/dating/delete/${id}`);
      setDatingProfiles((prevList) => prevList.filter((item) => item._id !== id));
      toast.success("Profile deleted successfully!");
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const openModal = (profile: DatingProfile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  return (
    <>
      <Breadcrumb pageName="Dating Profiles" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <h2 className="text-xl font-bold">Dating Profiles</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse dark:border-strokedark">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Age</th>
                <th className="px-4 py-2 text-center">Location</th>
                <th className="px-4 py-2 text-center">Orientation</th>
                <th className="px-4 py-2 text-center">Looking For</th>
                <th className="px-4 py-2 text-center">Verified</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {datingProfiles.map((profile) => (
                <tr key={profile._id} className="dark:border-strokedark">
                  <td className="px-4 py-2 text-center">{`${profile.Fname} ${profile.Lname}`}</td>
                  <td className="px-4 py-2 text-center">{profile.age}</td>
                  <td className="px-4 py-2 text-center">{`${profile.city}, ${profile.state}`}</td>
                  <td className="px-4 py-2 text-center">{profile.orientation}</td>
                  <td className="px-4 py-2 text-center">{profile.looking_for}</td>
                  <td className="px-4 py-2 text-center">
                    {profile.isVerified ? 'Yes' : 'No'}
                  </td>
                  <td className="px-4 py-2 text-center flex justify-center space-x-2">
                    <button 
                      onClick={() => openModal(profile)} 
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDelete(profile.userId)} 
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedProfile && (
       <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 mt-16">
       <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
         {/* Header */}
         <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
           <div>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
               {`${selectedProfile.Fname} ${selectedProfile.Lname}`}
             </h3>
             <p className="text-gray-500 dark:text-gray-400 mt-1">
               {selectedProfile.age} • {selectedProfile.city}, {selectedProfile.state}
             </p>
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
             {selectedProfile.photos.map((photo, index) => (
               <div key={index} className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                 <img
                   src={photo}
                   alt={`Profile ${index + 1}`}
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                 />
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
                     <span className="text-sm text-gray-500 dark:text-gray-400">Orientation</span>
                     <p className="font-medium">{selectedProfile.orientation}</p>
                   </div>
                   <div>
                     <span className="text-sm text-gray-500 dark:text-gray-400">Looking For</span>
                     <p className="font-medium">{selectedProfile.looking_for}</p>
                   </div>
                   <div>
                     <span className="text-sm text-gray-500 dark:text-gray-400">Education</span>
                     <p className="font-medium">{selectedProfile.education}</p>
                   </div>
                 </div>
               </div>
     
               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                 <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">Lifestyle</h4>
                 <div className="flex gap-4">
                   <div>
                     <span className="text-sm text-gray-500 dark:text-gray-400">Smoker</span>
                     <p className={`font-medium ${selectedProfile.smoker ? 'text-red-500' : 'text-green-500'}`}>
                       {selectedProfile.smoker ? 'Yes' : 'No'}
                     </p>
                   </div>
                   <div>
                     <span className="text-sm text-gray-500 dark:text-gray-400">Alcoholic</span>
                     <p className={`font-medium ${selectedProfile.alcoholic ? 'text-red-500' : 'text-green-500'}`}>
                       {selectedProfile.alcoholic ? 'Yes' : 'No'}
                     </p>
                   </div>
                 </div>
               </div>
             </div>
     
             {/* Right Column */}
             <div className="space-y-4">
               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                 <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">Contact</h4>
                 <div className="space-y-3">
                   <div>
                     <span className="text-sm text-gray-500 dark:text-gray-400">Phone</span>
                     <p className="font-medium">{selectedProfile.phone}</p>
                   </div>
                   <div>
                     <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                     <div className="flex items-center gap-2">
                       <span className={`inline-block w-2 h-2 rounded-full ${selectedProfile.isVerified ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                       <p className="font-medium">
                         {selectedProfile.isVerified ? 'Verified' : 'Not Verified'}
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
     
               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                 <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">Interests</h4>
                 <div className="flex flex-wrap gap-2">
                   {selectedProfile.interests.map((interest, index) => (
                     <span 
                       key={index} 
                       className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
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
             <p className="text-gray-700 dark:text-gray-300">{selectedProfile.bio || 'No bio provided'}</p>
           </div>
     
           {/* Dates */}
           <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
             <div>
               <span className="font-medium">Created: </span>
               {new Date(selectedProfile.createdAt).toLocaleDateString('en-US', {
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric',
               })}
             </div>
             {/* <div>
               <span className="font-medium">Updated: </span>
               {new Date(selectedProfile.updatedAt).toLocaleDateString('en-US', {
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric',
               })}
             </div> */}
           </div>
         </div>
     
         {/* Footer */}
         <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 flex justify-end">
           <button
             onClick={closeModal}
             className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
           >
             Close
           </button>
         </div>
       </div>
     </div>
      )}
    </>
  );
};

export default Dating;