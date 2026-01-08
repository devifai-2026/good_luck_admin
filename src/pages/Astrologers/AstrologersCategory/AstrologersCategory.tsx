import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ScaleLoader from "react-spinners/ScaleLoader";
import axiosInstance from "../../../utils/axiosInstance";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MoonLoader } from "react-spinners";

// Define TypeScript interface for category data
interface Category {
  _id: string;
  name: string;
  createdAt: string;
}

// Component
const AstrologersCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ✅ Fetch Categories from API (GET)
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<{ success: boolean; data: Category[] }>("/astrologer/category/getAll");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast.error(error.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Handle Add/Update Category (POST or PATCH)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) return toast.error("Please enter a category name!");

    setButtonLoading(true);
    try {
      const payload = { name: categoryName };

      if (isEditing) {
        await axiosInstance.patch(`/astrologer/category/update/${editingId}`, payload);
        toast.success("Category updated successfully!");
      } else {
        await axiosInstance.post("/astrologer/category/create", payload);
        toast.success("Category added successfully!");
      }

      fetchCategories(); // Refresh list
      closeModal();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category.");
    } finally {
      setButtonLoading(false);
    }
  };

  // ✅ Handle Delete Category (DELETE)
  const handleDeleteCategory = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/astrologer/category/delete/${id}`);
          setCategories(categories.filter((category) => category._id !== id));
          Swal.fire("Deleted!", "Category has been deleted.", "success");
        } catch (error: any) {
          console.error("Error deleting category:", error);
          Swal.fire("Error!", error.response?.data?.message || "Failed to delete.", "error");
        }
      }
    });
  };

  // ✅ Handle Edit Click
  const handleEditClick = (category: Category) => {
    setCategoryName(category.name);
    setEditingId(category._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // ✅ Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCategoryName("");
    setEditingId(null);
  };

  return (
    <>
      <Breadcrumb pageName="Astrologers Category" />

      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        {/* Add Category Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Add Category
          </button>
        </div>

        {/* Categories Table */}
        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <ScaleLoader color="#3498db" />
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-center">
                  <th className="px-4 py-2">Category Name</th>
                  <th className="px-4 py-2">Created At</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No Categories Found
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category._id} className="text-center">
                      <td className="px-4 py-2">{category.name}</td>
                      <td className="px-4 py-2">{new Date(category.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <div className="flex justify-center gap-4">
                          <button onClick={() => handleEditClick(category)} className="text-blue-500">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDeleteCategory(category._id)} className="text-red-500">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Adding/Editing Category */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-gray-700 dark:text-gray-500">
            <h2 className="text-lg font-semibold mb-4">{isEditing ? "Update Category" : "Add Category"}</h2>

            <form onSubmit={handleSaveCategory}>
              {/* Category Name Input */}
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name:</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mb-4 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Enter category name"
              />

              {/* Buttons */}
              <div className="flex justify-between">
                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={buttonLoading}>
                  {buttonLoading ? <MoonLoader size={18} color="#fff" /> : isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AstrologersCategory;
