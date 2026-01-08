import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { ScaleLoader } from "react-spinners";
import axiosInstance from "../../utils/axiosInstance";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

interface Category {
  _id: string;
  name: string;
}

interface Service {
  _id: string;
  image: string;
  isAvailable: boolean;
  contact: string;
  category: Category;
  city: string;
  state: string;
  address: string;
  pinCode: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // For update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [updateData, setUpdateData] = useState({
    category: "",
    image: "",
    contact: "",
    city: "",
    state: "",
    address: "",
    pinCode: "",
    isAvailable: false,
  });

  // For view modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewService, setViewService] = useState<Service | null>(null);

  // Fetch all categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/category/"); // Adjust endpoint as needed
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  // Fetch all services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/localService/", {
        params: {
          city: "",
          state: "",
          category: "",
          page: 1,
          limit: 10,
        },
        headers: { "Cache-Control": "no-cache" },
      });
      const servicesArray = res.data?.data?.services || [];
      if (servicesArray.length === 0) toast("No services found.");
      setServices(servicesArray);
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error("Failed to fetch services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  // Delete service
  const deleteService = async (id: string) => {
    Swal.fire({
      title: "Delete Service?",
      text: "This will permanently delete the service.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded mr-2",
        cancelButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/localService/${id}`);
          setServices((prev) => prev.filter((s) => s._id !== id));
          toast.success("Service deleted.");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete service.");
        }
      }
    });
  };

  // Open update modal
  const openUpdateModal = (service: Service) => {
    setCurrentService(service);
    setUpdateData({
      category: service.category?._id || "",
      image: service.image,
      contact: service.contact,
      city: service.city,
      state: service.state,
      address: service.address,
      pinCode: service.pinCode,
      isAvailable: service.isAvailable,
    });
    setShowUpdateModal(true);
  };

  // Open view modal
  const openViewModal = (service: Service) => {
    setViewService(service);
    setShowViewModal(true);
  };

  // Handle update
  const handleUpdate = async () => {
    if (!currentService) return;
    
    // Validate required fields
    if (!updateData.category || !updateData.contact || !updateData.city || !updateData.state || !updateData.pinCode) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const res = await axiosInstance.patch(
        `/localService/${currentService._id}`,
        updateData
      );
      setServices((prev) =>
        prev.map((s) => (s._id === currentService._id ? res.data.data : s))
      );
      toast.success("Service updated successfully!");
      setShowUpdateModal(false);
      setCurrentService(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update service.");
    }
  };

  return (
    <div className="p-6">
      <Breadcrumb pageName="Local Services" />

      <div className="bg-white dark:bg-gray-700 shadow rounded">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">All Services</h2>
        </div>

        {/* Search & Add */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 w-full px-8 mb-4">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search category by name..."
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button className="btn bg-blue-500 text-white px-4 py-2 rounded-lg">
            Add Category
          </button>
        </div>

        {/* Table */}
        <div className="p-4 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <ScaleLoader color="#3498db" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-300">
              No services found.
            </p>
          ) : (
            <table className="table w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-center dark:text-gray-300">
                <tr>
                  <th>Sl No.</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Contact</th>
                  <th>City</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center dark:text-gray-300">
                {services.map((service,index) => (
                  <tr key={service._id}>
                    <td>{index+1}</td>
                    <td className="flex justify-center items-center">
                      <img
                        src={service.image}
                        alt="Service"
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                    </td>
                    <td>{service.category?.name || "N/A"}</td>
                    <td>{service.contact}</td>
                    <td>{service.city}</td>
                    <td>{service.isAvailable ? "Yes" : "No"}</td>
                    <td className="text-center">
  <div className="flex items-center justify-center gap-2">
    <button
      onClick={() => openViewModal(service)}
      className="btn btn-sm text-green-500 rounded hover:text-green-600"
      title="View Details"
    >
      <FaEye />
    </button>
    <button
      onClick={() => openUpdateModal(service)}
      className="btn btn-sm text-blue-500 rounded hover:text-blue-600"
      title="Edit Service"
    >
      <FaEdit />
    </button>
    <button
      onClick={() => deleteService(service._id)}
      className="btn btn-sm text-red-500 rounded hover:text-red-600"
      title="Delete Service"
    >
      <FaTrash />
    </button>
  </div>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && currentService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Update Service
              </h3>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={updateData.category}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, category: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={updateData.image}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, image: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-600 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact *
                  </label>
                  <input
                    type="tel"
                    value={updateData.contact}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, contact: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-600 dark:text-white"
                    placeholder="+1234567890"
                    required
                  />
                </div>

                {/* City and State Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={updateData.city}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, city: e.target.value })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-600 dark:text-white"
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={updateData.state}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, state: e.target.value })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-600 dark:text-white"
                      placeholder="Enter state"
                      required
                    />
                  </div>
                </div>

                {/* Pin Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pin Code *
                  </label>
                  <input
                    type="text"
                    value={updateData.pinCode}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, pinCode: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-600 dark:text-white"
                    placeholder="700001"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    value={updateData.address}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, address: e.target.value })
                    }
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-600 dark:text-white resize-none"
                    placeholder="Enter full address"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available *
                  </label>
                  <select
                    value={updateData.isAvailable ? "true" : "false"}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        isAvailable: e.target.value === "true",
                      })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-600 dark:text-white"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Update Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Service Details
              </h3>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Service Image */}
                {viewService.image && (
                  <div className="text-center">
                    <img
                      src={viewService.image}
                      alt="Service"
                      className="w-32 h-32 rounded-lg object-cover mx-auto border-2 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                )}

                {/* Service Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Category
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {viewService.category?.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Contact
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {viewService.contact}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        City
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {viewService.city}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        State
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {viewService.state}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Pin Code
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {viewService.pinCode}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Availability
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          viewService.isAvailable
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {viewService.isAvailable ? "Available" : "Not Available"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Service ID
                      </label>
                      <p className="text-gray-900 dark:text-white font-mono text-sm">
                        {viewService._id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                {viewService.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Full Address
                    </label>
                    <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-600 p-3 rounded-lg">
                      {viewService.address}
                    </p>
                  </div>
                )}

                {/* Image URL Section */}
                {viewService.image && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Image URL
                    </label>
                    <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-600 p-3 rounded-lg break-all font-mono text-sm">
                      {viewService.image}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openUpdateModal(viewService);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Edit Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;