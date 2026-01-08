import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PuffLoader, ScaleLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axiosInstance from '../../utils/axiosInstance';

// ✅ Define Category Interface
interface Category {
  _id: string;
  name: string;
}

const LocalServiceCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editCategoryData, setEditCategoryData] = useState<Category | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/localCategory/getAll');
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Delete Category
  const deleteCategory = async (id: string) => {
    Swal.fire({
      title: 'Delete?',
      text: 'This will permanently delete the category.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton:
          'bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded mr-2',
        cancelButton:
          'bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded',
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/localCategory/delete/${id}`);
          setCategories((prev) => prev.filter((cat) => cat._id !== id));
          Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete category.', 'error');
        }
      }
    });
  };

  // ✅ Open & Close Edit Modal
  const openEditModal = (category: Category) => {
    setEditCategoryData(category);
  };

  const closeEditModal = () => {
    setEditCategoryData(null);
  };

  // ✅ Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editCategoryData) {
      setEditCategoryData({
        ...editCategoryData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // ✅ Update Category
  const updateCategory = async () => {
    if (!editCategoryData) return;
    setIsUpdating(true);

    try {
      await axiosInstance.patch(
        `/localCategory/update/${editCategoryData._id}`,
        {
          name: editCategoryData.name,
        },
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === editCategoryData._id
            ? { ...cat, name: editCategoryData.name }
            : cat,
        ),
      );
      toast.success('Category updated');
      closeEditModal();
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // ✅ Add Category
  const handleAddCategory = async () => {
    if (!newCategoryName) {
      toast.error('Please enter a category name');
      return;
    }

    setIsAdding(true);
    try {
      const response = await axiosInstance.post(
        '/localCategory/createLocalCategory',
        {
          name: newCategoryName,
        },
      );

      const newCat = response.data.data || response.data;
      setCategories((prev) => [...prev, newCat]);
      toast.success('Category added');
      closeAddCategoryModal();
    } catch (err) {
      toast.error('Add failed');
    } finally {
      setIsAdding(false);
    }
  };

  // ✅ Add Modal Controls
  const openAddCategoryModal = () => {
    setShowAddCategoryModal(true);
    setNewCategoryName('');
  };

  const closeAddCategoryModal = () => {
    setShowAddCategoryModal(false);
    setNewCategoryName('');
  };

  return (
    <div>
      <Breadcrumb pageName="Local Service Categories" />

      {/* Filter + Add Button */}
      <div className="py-6 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-700">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search category by name..."
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <button
          onClick={openAddCategoryModal}
          className="btn bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Category
        </button>
      </div>

      {/* Category Table */}
      <div className="bg-white dark:bg-gray-600 p-6 rounded shadow">
        {loading ? (
          <div className="flex justify-center py-10">
            <ScaleLoader color="#3498db" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <th>Name</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {categories
                  .filter((cat) => cat.name.toLowerCase().includes(searchQuery))
                  .map((cat) => (
                    <tr key={cat._id}>
                      <td>{cat.name}</td>
                      <td className="space-x-2">
                        <button
                          className="btn btn-sm btn-outline text-blue-500"
                          onClick={() => openEditModal(cat)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline text-red-500"
                          onClick={() => deleteCategory(cat._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded w-96 dark:bg-gray-700 dark:border dark:border-gray-900">
            <h2 className="text-lg font-semibold mb-4">Add Category</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Category Name"
            />
            <div className="flex justify-between">
              <button
                onClick={closeAddCategoryModal}
                className="btn bg-gray-500 text-white w-1/2 mr-2 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="btn bg-blue-500 text-white w-1/2 py-2 rounded-lg flex items-center justify-center"
                disabled={isAdding}
              >
                {isAdding ? <PuffLoader color="#ffffff" size={24} /> : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editCategoryData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
            <input
              type="text"
              name="name"
              value={editCategoryData.name}
              onChange={handleInputChange}
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="Category Name"
            />
            <div className="flex justify-between">
              <button
                onClick={closeEditModal}
                className="btn bg-gray-500 text-white w-1/2 mr-2 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={updateCategory}
                className="btn bg-blue-500 text-white w-1/2 py-2 rounded-lg flex items-center justify-center"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <PuffLoader color="#ffffff" size={24} />
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalServiceCategories;
