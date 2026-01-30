import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

interface Person {
  name: string;
  dob: string;
  timeOfBirth: string;
  birthplace: string;
}

interface MarriageData {
  _id: string;
  boy: Person;
  girl: Person;
  userId: string;
  authId: string;
  language: string;
  isPaymentDone: boolean;
  seen: boolean;
  wp_no: string;
  createdAt: string;
}

const MarriageMaking = () => {
  const [marriageList, setMarriageList] = useState<MarriageData[]>([]);
  const [selectedMarriage, setSelectedMarriage] = useState<MarriageData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMarriageData();
  }, []);

  const fetchMarriageData = async () => {
    try {
      const response = await axiosInstance.get('/mariageMaking/getAll');
      setMarriageList(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/mariageMaking/delete/${id}`);
      setMarriageList((prevList) => prevList.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleView = (marriage: MarriageData) => {
    setSelectedMarriage(marriage);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMarriage(null);
  };

  return (
    <>
      <Breadcrumb pageName="Marriage Making" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <h2 className="text-xl font-bold">Marriage List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse dark:border-strokedark">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-4 py-2 text-center">Boy's Name</th>
                <th className="px-4 py-2 text-center">Boy's DOB</th>
                <th className="px-4 py-2 text-center">Girl's Name</th>
                <th className="px-4 py-2 text-center">Girl's DOB</th>
                {/* <th className="px-4 py-2 text-center">Language</th> */}
                <th className="px-4 py-2 text-center">Payment Done</th>
                <th className="px-4 py-2 text-center">WhatsApp No</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {marriageList.map((item) => (
                <tr key={item._id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3 text-center">{item.boy.name}</td>
                  <td className="px-4 py-3 text-center">{item.boy.dob}</td>
                  <td className="px-4 py-3 text-center">{item.girl.name}</td>
                  <td className="px-4 py-3 text-center">{item.girl.dob}</td>
                  {/* <td className="px-4 py-3 text-center">{item.language}</td> */}
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.isPaymentDone ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.isPaymentDone ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{item.wp_no}</td>
                  <td className="px-4 py-3 text-center space-x-2 flex items-center justify-center">
                    <button 
                      onClick={() => handleView(item)} 
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Modal */}
      {isModalOpen && selectedMarriage && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-end p-4 z-50 mt-16">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 text-white">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Marriage Compatibility Details</h3>
          <button 
            onClick={closeModal}
            className="text-white/80 hover:text-white text-2xl transition-all"
          >
            &times;
          </button>
        </div>
        <div className="flex items-center mt-2 space-x-4 text-sm">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-300 rounded-full mr-2"></span>
            <span>Created: {new Date(selectedMarriage.createdAt).toLocaleDateString()}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs ${selectedMarriage.isPaymentDone ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {selectedMarriage.isPaymentDone ? 'Payment Completed' : 'Payment Pending'}
          </div>
        </div>
      </div>

      {/* Modal Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Boy's Card */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 shadow-inner border border-gray-100 dark:border-gray-600">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mr-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Groom's Details</h4>
            </div>
            <div className="space-y-3">
              <DetailItem label="Full Name" value={selectedMarriage.boy.name} />
              <DetailItem label="Date of Birth" value={selectedMarriage.boy.dob} />
              <DetailItem label="Time of Birth" value={selectedMarriage.boy.timeOfBirth || 'Not specified'} />
              <DetailItem label="Birth Place" value={selectedMarriage.boy.birthplace} />
            </div>
          </div>

          {/* Girl's Card */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 shadow-inner border border-gray-100 dark:border-gray-600">
            <div className="flex items-center mb-4">
              <div className="bg-pink-100 dark:bg-pink-900/50 p-3 rounded-full mr-3">
                <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Bride's Details</h4>
            </div>
            <div className="space-y-3">
              <DetailItem label="Full Name" value={selectedMarriage.girl.name} />
              <DetailItem label="Date of Birth" value={selectedMarriage.girl.dob} />
              <DetailItem label="Time of Birth" value={selectedMarriage.girl.timeOfBirth || 'Not specified'} />
              <DetailItem label="Birth Place" value={selectedMarriage.girl.birthplace} />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
          <DetailItem label="Language" value={selectedMarriage.language} icon="translate" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">WhatsApp</p>
            {selectedMarriage.wp_no ? (
              <a
                href={`https://wa.me/${selectedMarriage.wp_no.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-800 dark:text-white flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {selectedMarriage.wp_no}
                {/* <svg className="w-4 h-4 ml-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg> */}
              </a>
            ) : (
              <p className="font-medium text-gray-800 dark:text-white">Not specified</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100 dark:border-gray-600">
        <button
          onClick={closeModal}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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

// Reusable DetailItem component
const DetailItem = ({ label, value, icon }: { label: string; value: string; icon?: string }) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="font-medium text-gray-800 dark:text-white flex items-center">
      {icon && (
        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon === 'translate' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />}
          {icon === 'chat' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
          {icon === 'document-text' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
        </svg>
      )}
      {value || 'Not specified'}
    </p>
  </div>
);

export default MarriageMaking;