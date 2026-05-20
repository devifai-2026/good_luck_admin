import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PuffLoader, ScaleLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axiosInstance from '../../utils/axiosInstance';
import { uploadImageToCloudinary } from '../../hooks/uploadImagesToCloudinary';

interface Category {
  _id: string;
  name: string;
  icon: string | null;
}

const LocalServiceCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIconFile, setNewIconFile] = useState<File | null>(null);
  const [newIconPreview, setNewIconPreview] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Edit modal state
  const [editData, setEditData] = useState<Category | null>(null);
  const [editIconFile, setEditIconFile] = useState<File | null>(null);
  const [editIconPreview, setEditIconPreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
        } catch {
          Swal.fire('Error!', 'Failed to delete category.', 'error');
        }
      }
    });
  };

  // ✅ Add Modal
  const openAddModal = () => {
    setShowAddModal(true);
    setNewName('');
    setNewIconFile(null);
    setNewIconPreview(null);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewName('');
    setNewIconFile(null);
    setNewIconPreview(null);
  };

  const handleNewIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewIconFile(file);
      setNewIconPreview(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async () => {
    if (!newName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setIsAdding(true);
    try {
      let iconURL: string | null = null;
      if (newIconFile) {
        iconURL = await uploadImageToCloudinary(newIconFile);
        if (!iconURL) {
          toast.error('Icon upload failed');
          setIsAdding(false);
          return;
        }
      }

      const response = await axiosInstance.post(
        '/localCategory/createLocalCategory',
        { name: newName, icon: iconURL },
      );

      const newCat = response.data.data || response.data;
      setCategories((prev) => [...prev, newCat]);
      toast.success('Category added successfully');
      closeAddModal();
    } catch {
      toast.error('Failed to add category');
    } finally {
      setIsAdding(false);
    }
  };

  // ✅ Edit Modal
  const openEditModal = (category: Category) => {
    setEditData(category);
    setEditIconFile(null);
    setEditIconPreview(category.icon || null);
  };

  const closeEditModal = () => {
    setEditData(null);
    setEditIconFile(null);
    setEditIconPreview(null);
  };

  const handleEditIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditIconFile(file);
      setEditIconPreview(URL.createObjectURL(file));
    }
  };

  const updateCategory = async () => {
    if (!editData) return;
    if (!editData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsUpdating(true);
    try {
      let iconURL: string | null = editData.icon;
      if (editIconFile) {
        iconURL = await uploadImageToCloudinary(editIconFile);
        if (!iconURL) {
          toast.error('Icon upload failed');
          setIsUpdating(false);
          return;
        }
      }

      await axiosInstance.patch(`/localCategory/update/${editData._id}`, {
        name: editData.name,
        icon: iconURL,
      });

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === editData._id
            ? { ...cat, name: editData.name, icon: iconURL }
            : cat,
        ),
      );
      toast.success('Category updated');
      closeEditModal();
    } catch {
      toast.error('Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={openAddModal}
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
        ) : filteredCategories.length === 0 ? (
          <p className="text-center text-gray-500">No categories found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <th>Icon</th>
                  <th>Name</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      {cat.icon ? (
                        <img
                          src={cat.icon}
                          alt={cat.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-500 flex items-center justify-center text-gray-400 text-xs">
                          No Icon
                        </div>
                      )}
                    </td>
                    <td>{cat.name}</td>
                    <td className="text-center space-x-2">
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
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 dark:bg-gray-700 dark:border dark:border-gray-900">
            <h2 className="text-lg font-semibold mb-4">Add Category</h2>

            {newIconPreview && (
              <img
                src={newIconPreview}
                alt="Icon Preview"
                className="w-20 h-20 mx-auto mb-3 rounded object-cover border"
              />
            )}

            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Category Icon (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleNewIconChange}
              className="w-full mb-3 px-3 py-2 border rounded dark:bg-gray-600 dark:text-white"
            />

            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Category Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="e.g. Plumber, Electrician"
            />

            <div className="flex justify-between">
              <button
                onClick={closeAddModal}
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
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 dark:bg-gray-700 dark:border dark:border-gray-900">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              Edit Category
            </h2>

            {editIconPreview && (
              <img
                src={editIconPreview}
                alt="Icon Preview"
                className="w-20 h-20 mx-auto mb-3 rounded object-cover border"
              />
            )}

            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Category Icon
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleEditIconChange}
              className="w-full mb-3 px-3 py-2 border rounded dark:bg-gray-600 dark:text-white"
            />

            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Category Name
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
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
