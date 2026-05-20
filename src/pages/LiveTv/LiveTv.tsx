import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';

interface LiveTvChannel {
  _id: string;
  channelName: string;
  youtubeLink: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const LiveTv = () => {
  const [channels, setChannels] = useState<LiveTvChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<LiveTvChannel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<LiveTvChannel, '_id' | 'createdAt' | 'updatedAt' | '__v'>>({
    channelName: '',
    youtubeLink: '',
    category: '',
    isActive: true,
  });

  useEffect(() => {
    fetchChannels();
  }, []);

  // Fetch all channels
  const fetchChannels = async () => {
    try {
      const response = await axiosInstance.get('/liveTv/getAll');
      setChannels(response.data.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  // Open modal for editing
  const handleEdit = (channel: LiveTvChannel) => {
    setSelectedChannel(channel);
    setFormData({
      channelName: channel.channelName,
      youtubeLink: channel.youtubeLink,
      category: channel.category,
      isActive: channel.isActive,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Open modal for creating new channel
  const handleCreate = () => {
    setSelectedChannel(null);
    setFormData({
      channelName: '',
      youtubeLink: '',
      category: '',
      isActive: true,
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Handle form submission for create and update
 // Handle form submission for create and update
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    let response;
    if (isEditMode && selectedChannel) {
      response = await axiosInstance.patch(`/liveTv/update/${selectedChannel._id}`, formData);
    } else {
      response = await axiosInstance.post('/liveTv/create', formData);
    }

    // Success alert
    Swal.fire({
      title: isEditMode ? 'Channel Updated!' : 'Channel Created!',
      text: isEditMode ? 'The channel has been successfully updated.' : 'The new channel has been successfully created.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
    
    fetchChannels();
    setIsModalOpen(false);
  } catch (error) {
    console.error('Error saving channel:', error);
    
    // Error alert
    Swal.fire({
      title: 'Error!',
      text: 'An error occurred while saving the channel. Please try again later.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  } finally {
    setLoading(false);
  }
};


  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? isCheckbox : value,
    }));
  };

  // Handle delete
  const handleDelete = async (channel: LiveTvChannel) => {
    const result = await Swal.fire({
      title: 'Delete Channel?',
      text: `Are you sure you want to delete "${channel.channelName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/liveTv/delete/${channel._id}`);
      Swal.fire('Deleted!', 'The channel has been deleted.', 'success');
      fetchChannels();
    } catch (error) {
      console.error('Error deleting channel:', error);
      Swal.fire('Error!', 'Failed to delete the channel. Please try again.', 'error');
    }
  };

  // Extract YouTube video ID
  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:watch\?.*?v=|embed\/|v\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  return (
    <div>
      <Breadcrumb pageName="Live Tv" />
      <div className="flex justify-between items-center w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6 mb-6">
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Channel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {channels.map((channel) => (
          <div
            key={channel._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${extractVideoId(channel.youtubeLink)}?autoplay=0&mute=1`}
                title={channel.channelName}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{channel.channelName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{channel.category}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => handleEdit(channel)}
                  className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(channel)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {isEditMode ? 'Edit Channel' : 'Create Channel'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Channel Name
                    </label>
                    <input
                      type="text"
                      name="channelName"
                      value={formData.channelName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      YouTube Link
                    </label>
                    <input
                      type="url"
                      name="youtubeLink"
                      value={formData.youtubeLink}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  {/* <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Active Channel</label>
                  </div> */}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
