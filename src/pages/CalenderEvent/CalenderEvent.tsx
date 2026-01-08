import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Dialog } from '@headlessui/react';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { MdOutlineNoteAdd } from 'react-icons/md';
import { TbFilterEdit } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'goodluck_admin');

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/dd5tqor5g/image/upload',
    { method: 'POST', body: formData }
  );

  const data = await res.json();
  if (data.secure_url) return data.secure_url;
  throw new Error('Image upload failed');
};

interface CalendarEvent {
  _id: string;
  eventType: string;
  images: string[];
  createdAt: string;
}

interface ImageType {
  file: File | null;
  preview: string;
  url?: string;
  id: string;
}

const CalenderEvent = () => {
  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddImageOpen, setIsAddImageOpen] = useState(false);

  // Event data
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [eventType, setEventType] = useState('');
  const [images, setImages] = useState<ImageType[]>([]);
  const [uploading, setUploading] = useState(false);

  // Editing
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null); // for adding images

  // Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [], 
    },
    multiple: true,
    onDrop: async acceptedFiles => {
      setUploading(true);
      try {
        const newImages = await Promise.all(
          acceptedFiles.map(async file => {
            const url = await uploadImageToCloudinary(file);
            return {
              file,
              preview: URL.createObjectURL(file),
              url,
              id: `${Date.now()}-${Math.random()}`,
            };
          })
        );
        setImages(prev => [...prev, ...newImages]);
        toast.success('Images uploaded successfully!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to upload some images');
      } finally {
        setUploading(false);
      }
    },
  });

  const revokePreviews = (imgs: ImageType[]) => {
    imgs.forEach(img => {
      if (img.preview.startsWith('blob:')) URL.revokeObjectURL(img.preview);
    });
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      prev.forEach(img => {
        if (img.id === id && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
      return filtered;
    });
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get('/calender-event/');
      setEvents(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch events');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- Add Event ---
  const openAddModal = () => setIsAddOpen(true);
  const closeAddModal = () => {
    setIsAddOpen(false);
    setEventType('');
    revokePreviews(images);
    setImages([]);
  };

  const handleSaveEvent = async () => {
    if (!eventType) return toast.error('Please select event type');
    if (images.length === 0) return toast.error('Please upload at least one image');

    setUploading(true);
    try {
      const uploadedUrls = images.map(img => img.url!);
      const res = await axiosInstance.post('/calender-event/', {
        eventType,
        images: uploadedUrls,
      });
      setEvents(prev => [res.data.data, ...prev]);
      toast.success('Event saved successfully!');
      closeAddModal();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to save event');
    } finally {
      setUploading(false);
    }
  };

  // --- Edit Event ---
  const openEditModal = (event: CalendarEvent) => {
    setEditingEventId(event._id);
    setEventType(event.eventType);
    setImages(
      event.images.map((img, idx) => ({
        file: null,
        preview: img,
        url: img,
        id: `${Date.now()}-${idx}`,
      }))
    );
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingEventId(null);
    setEventType('');
    revokePreviews(images);
    setImages([]);
  };

  const handleUpdateEvent = async () => {
    if (!editingEventId) return;
    if (!eventType) return toast.error('Please select event type');

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        images.map(async img => {
          if (img.file && !img.url) {
            img.url = await uploadImageToCloudinary(img.file);
          }
          return img.url!;
        })
      );

      const res = await axiosInstance.put(`/calender-event/${editingEventId}`, {
        eventType,
        images: uploadedUrls,
      });

      setEvents(prev =>
        prev.map(ev => (ev._id === editingEventId ? res.data.data : ev))
      );

      toast.success('Event updated successfully!');
      closeEditModal();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update event');
    } finally {
      setUploading(false);
    }
  };

  // --- Add Images to Existing Event ---
  const openAddImageModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsAddImageOpen(true);
    setImages([]);
  };
  const closeAddImageModal = () => {
    setIsAddImageOpen(false);
    setSelectedEventId(null);
    revokePreviews(images);
    setImages([]);
  };

  const handleAddImagesToExistingEvent = async () => {
    if (!selectedEventId || images.length === 0) return toast.error('No images to add');
    setUploading(true);
    try {
      for (const img of images) {
        await axiosInstance.patch(`/calender-event/${selectedEventId}/add-image`, {
          imageUrl: img.url,
        });
      }

      setEvents(prev =>
        prev.map(event =>
          event._id === selectedEventId
            ? { ...event, images: [...event.images, ...images.map(i => i.url!)] }
            : event
        )
      );

      toast.success('Images added successfully');
      closeAddImageModal();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add images');
    } finally {
      setUploading(false);
    }
  };

  // --- Delete Event ---
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axiosInstance.delete(`/calender-event/${eventId}`);
      setEvents(prev => prev.filter(e => e._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete event');
    }
  };

  // --- Remove Image from Event ---
  const handleRemovePersistedImage = async (eventId: string, imageUrl: string) => {
    try {
      await axiosInstance.patch(`/calender-event/${eventId}/remove-image`, { imageUrl });
      setEvents(prev =>
        prev.map(event =>
          event._id === eventId
            ? { ...event, images: event.images.filter(img => img !== imageUrl) }
            : event
        )
      );
      toast.success('Image removed successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove image');
    }
  };

  return (
    <div className="p-6">
      <Breadcrumb pageName="Calendar Event" />

      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
  <div className="flex flex-col sm:flex-row justify-end mb-6 gap-2">
    <button
      onClick={openAddModal}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
    >
      Add Event
    </button>
  </div>

  {events.length === 0 ? (
    <p className="text-gray-500">No events found.</p>
  ) : (
    <ul className="space-y-4">
      {events.map(event => (
      <li key={event._id} className="border p-4 rounded-lg">
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
    <p className="font-semibold">{event.eventType}</p>

    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={() => openAddImageModal(event._id)}
        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 flex gap-1 items-center text-sm sm:text-base justify-center md:justify-start"
      >
        Add Images <MdOutlineNoteAdd />
      </button>
      <button
        onClick={() => openEditModal(event)}
        className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex gap-1 items-center text-sm sm:text-base justify-center md:justify-start"
      >
        Edit <TbFilterEdit />
      </button>
      <button
        onClick={() => handleDeleteEvent(event._id)}
        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 flex gap-1 items-center text-sm sm:text-base justify-center md:justify-start"
      >
        Delete Event <RiDeleteBin6Line />
      </button>
    </div>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {event.images.map((img, idx) => (
      <div key={idx} className="relative group">
        <img
          src={img}
          alt={`Event ${idx}`}
          className="w-full h-32 sm:h-36 object-cover rounded-lg shadow-md border border-black"
          loading="lazy"
        />
        <button
          onClick={() => handleRemovePersistedImage(event._id, img)}
          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
          title="Remove Image"
        >
          ×
        </button>
      </div>
    ))}
  </div>

  <p className="text-gray-400 text-sm mt-2">
    {new Date(event.createdAt).toLocaleString()}
  </p>
</li>

      ))}
    </ul>
  )}
</div>

      {/* Add / Edit Event Modal */}
      {(isAddOpen || isEditOpen) && (
        <Dialog open={isAddOpen || isEditOpen} onClose={isAddOpen ? closeAddModal : closeEditModal} className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Panel className="bg-white rounded-xl max-w-lg w-full p-6 z-50 relative">
              <Dialog.Title className="text-xl font-bold mb-4">
                {isAddOpen ? 'Add Event' : 'Edit Event'}
              </Dialog.Title>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Event Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                >
                  <option value="">Select Event Type</option>
                  <option value="pujodate">pujodate</option>
                  <option value="bibahodate">bibahodate</option>
                  <option value="omabossya">omabossya</option>
                  <option value="purnima">purnima</option>
                  <option value="ekadosi">ekadosi</option>
                  <option value="suvodin">suvodin</option>
                  <option value="sastrokotha">sastrokotha</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Upload Images</label>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
                >
                  <input {...getInputProps()} />
                  <p>Drag & drop images here, or click to select files</p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.url || img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-md border border-black"
                      />
                      <span className="absolute top-1 left-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveImage(img.id)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={isAddOpen ? closeAddModal : closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={isAddOpen ? handleSaveEvent : handleUpdateEvent}
                  disabled={uploading}
                  className={`px-4 py-2 rounded-lg text-white ${
                    uploading ? 'bg-gray-400 cursor-not-allowed' : (isAddOpen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-600')
                  }`}
                >
                  {uploading ? 'Uploading...' : (isAddOpen ? 'Save' : 'Update')}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      {/* Add Image to Existing Event Modal */}
      <Dialog open={isAddImageOpen} onClose={closeAddImageModal} className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-lg w-full p-6 z-50 relative">
            <Dialog.Title className="text-xl font-bold mb-4">Add Images to Event</Dialog.Title>

            <div className="mb-4">
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
              >
                <input {...getInputProps()} />
                <p>Drag & drop images here, or click to select files</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.url || img.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow-md border border-black"
                    />
                    <span className="absolute top-1 left-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={closeAddImageModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddImagesToExistingEvent}
                disabled={uploading}
                className={`px-4 py-2 rounded-lg text-white ${
                  uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {uploading ? 'Uploading...' : 'Add Images'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default CalenderEvent;
