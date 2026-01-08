import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { FaEdit, FaTrash } from "react-icons/fa";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "../../../hooks/uploadImagesToCloudinary";


// ✅ Define Category Interface
interface Category {
  _id: string;
  image: string;
  category_name: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editCategoryData, setEditCategoryData] = useState<Category | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // ✅ Fetch Categories from API
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/productCategory");
      console.log("Fetched Categories:", response.data); // Debugging

      if (Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Delete Category Function with SweetAlert2
  const deleteCategory = async (categoryId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/productCategory/delete/${categoryId}`);
  
          // ✅ Update UI correctly
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category._id !== categoryId)
          );
  
          Swal.fire({
            title: "Deleted!",
            text: "Category has been deleted.",
            icon: "success"
          });
        } catch (error) {
          console.error("Error deleting category:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete category.",
            icon: "error"
          });
        }
      }
    });
  };
  

  // ✅ Open Edit Modal & Set Initial Data
  const openEditModal = (category: Category) => {
    setEditCategoryData(category);
    setPreviewImage(category.image); // Show existing image as preview
    setSelectedImage(null); // Reset file input
  };

  // ✅ Close Edit Modal
  const closeEditModal = () => {
    setEditCategoryData(null); // Reset edit data
    setSelectedImage(null); // Clear selected image
    setPreviewImage(null); // Remove preview image
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

  // ✅ Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Show preview
    }
  };

  const updateCategory = async () => {
    if (!editCategoryData) return;
  
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update this category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsUpdating(true);
  
        try {
          // ✅ Upload new image to Cloudinary if a new image is selected
          let imageURL = editCategoryData.image;
          if (selectedImage) {
            imageURL = await uploadImageToCloudinary(selectedImage);
            if (!imageURL) {
              toast.error("Image upload failed.");
              setIsUpdating(false);
              return;
            }
          }
  
          // ✅ Send only the updated data
          const response = await axiosInstance.patch(
            `/productCategory/update/${editCategoryData._id}`,
            {
              category_name: editCategoryData.category_name,
              image: imageURL,
            }
          );
  
          console.log("Update Response:", response.data);
  
          // ✅ Update UI immediately
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category._id === editCategoryData._id
                ? { ...category, category_name: editCategoryData.category_name, image: imageURL }
                : category
            )
          );
  
          Swal.fire({
            title: "Updated!",
            text: "Category has been updated successfully.",
            icon: "success",
          });
  
          closeEditModal(); // ✅ Close modal
        } catch (error) {
          console.error("Error updating category:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to update category.",
            icon: "error",
          });
        } finally {
          setIsUpdating(false);
        }
      }
    });
  };
  
  // ✅ Open Add Category Modal
  const openAddCategoryModal = () => {
    setShowAddCategoryModal(true);
    setNewCategoryName("");
    setNewCategoryImage(null);
    setPreviewImage(null);
  };

  // ✅ Close Add Category Modal
  const closeAddCategoryModal = () => {
    setShowAddCategoryModal(false);
    setNewCategoryName("");
    setNewCategoryImage(null);
    setPreviewImage(null);
  };

  // ✅ Handle Image Selection
  const handleNewCategoryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCategoryImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Show image preview
    }
  };

  // ✅ Handle Add Category API Request with Cloudinary
  const handleAddCategory = async () => {
    if (!newCategoryName || !newCategoryImage) {
      toast.error("Please enter a category name and select an image.");
      return;
    }
  
    setIsAdding(true);
  
    try {
      // ✅ Upload image to Cloudinary first
      const imageURL = await uploadImageToCloudinary(newCategoryImage);
      if (!imageURL) {
        toast.error("Image upload failed.");
        setIsAdding(false);
        return;
      }
  
      // ✅ Send only the image URL to backend
      const response = await axiosInstance.post("/productCategory/createProductCategory", {
        category_name: newCategoryName,
        image: imageURL,
      });
  
      console.log("Category Created:", response.data);
  
      // ✅ Ensure the response structure is correct
      const newCategory = response.data.data || response.data;
  
      // ✅ Update UI with new category
      setCategories((prevCategories) => [...prevCategories, newCategory]);
  
      toast.success("Category added successfully.");
      closeAddCategoryModal(); // ✅ Close modal
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category.");
    } finally {
      setIsAdding(false);
    }
  };
  

  return (
    <div>
      <Breadcrumb pageName="Category" />

      {/* ✅ Date Filters & Add Category Button */}
      <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col md:flex-row justify-between items-center gap-4 border-stroke bg-white dark:bg-gray-700">
        {/* Calendar Input */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">From</span>
          <input
            type="date"
            className="border dark:bg-gray-700 border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-sm font-medium">To</span>
          <input
            type="date"
            className="border dark:bg-gray-700 border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Add Category Button */}
        <button onClick={openAddCategoryModal} className="btn btn-primary bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white rounded-lg font-semibold">
          Add Category
        </button>
      </div>

      <div className="rounded-sm border-stroke bg-white dark:bg-gray-600 shadow-lg p-6">
        {/* ✅ DaisyUI Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <ScaleLoader color="#3498db" />
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No categories found.</div>
          ) : (
            <table className="table w-full  border-gray-200">
              {/* ✅ Table Head */}
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 text-gray-700">
                  <th className="py-2 px-4 text-left">Image</th>
                  <th className="py-2 px-4 text-left">Category Name</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>

              {/* ✅ Table Body */}
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className=" ">
                    {/* ✅ Category Image & Name */}
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={category.image || "https://via.placeholder.com/50"}
                        alt={category.category_name}
                        className="w-12 h-12 rounded"
                      />
                    </td>

                    {/* ✅ Category Name */}
                    <td className="py-3 px-4">{category.category_name}</td>

                    {/* ✅ Actions */}
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => openEditModal(category)} className="btn btn-sm btn-outline btn-primary mr-2 text-blue-500 hover:text-blue-600">
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error text-red-500 hover:text-red-600"
                        onClick={() => deleteCategory(category._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* ✅ Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Category</h2>

            {previewImage && (
              <img src={previewImage} alt="Preview" className="w-24 h-24 mx-auto mb-3 rounded border" />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleNewCategoryImage}
              className="w-full mb-3 px-4 py-2 border rounded-md"
            />

            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full mb-3 px-4 py-2 border rounded-md"
              placeholder="Category Name"
            />

            <div className="flex justify-between gap-3">
              <button onClick={closeAddCategoryModal} className="btn bg-gray-500 text-white w-1/2">
                Cancel
              </button>
              <button onClick={handleAddCategory} className="btn bg-blue-500 text-white w-1/2">
                {isAdding ? "Adding..." : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Edit Modal */}
      {editCategoryData && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Category</h2>

            {/* ✅ Image Preview */}
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-24 h-24 mx-auto mb-3 rounded border"
              />
            )}

            {/* ✅ Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-3 px-4 py-2 border rounded-md"
            />

            {/* ✅ Category Name Input */}
            <input
              type="text"
              name="category_name"
              value={editCategoryData.category_name}
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-2 border rounded-md"
              placeholder="Category Name"
            />

            {/* ✅ Action Buttons */}
            <div className="flex justify-between gap-3">
              <button
                onClick={closeEditModal}
                className="btn bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 w-1/2"
              >
                Cancel
              </button>
              <button
                onClick={updateCategory}
                className="btn bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-1/2"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;