import { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import Swal from "sweetalert2";

// ✅ Define Product Interface
interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  category: string;
  rating: number;
  brand: string;
  weight: string;
  originalPrice: number;
  displayPrice: number;
  in_stock: boolean;
}

// ✅ Define Props for `UpdateForm`
interface UpdateFormProps {
  product: Product;
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateForm = ({ product, onClose, onUpdate }: UpdateFormProps) => {
  // ✅ Create a copy of the product state
  const [updatedProduct, setUpdatedProduct] = useState<Product>({ ...product });

  // ✅ Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: name === "in_stock" 
        ? value === "true" 
        : name === "rating" || name === "originalPrice" || name === "displayPrice"
          ? parseFloat(value)
          : value,
    }));
  };

  // ✅ Handle Update Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 🔥 Send PATCH request to update product
      await axiosInstance.patch(`/product/update/${product._id}`, updatedProduct);

      Swal.fire("Success!", "Product updated successfully!", "success");

      onUpdate(); // Refresh product list
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire("Error!", "Failed to update product.", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-center">Update Product</h2>

        {/* ✅ Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="productName"
              value={updatedProduct.productName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Product Name"
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="productDescription"
              value={updatedProduct.productDescription}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Product Description"
              rows={3}
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={updatedProduct.brand}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Brand"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input
              type="text"
              name="weight"
              value={updatedProduct.weight}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Weight (e.g., 50g)"
            />
          </div>

          {/* Category ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
            <input
              type="text"
              name="category"
              value={updatedProduct.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Category ID"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <input
              type="number"
              name="rating"
              value={updatedProduct.rating}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Rating (0-5)"
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          {/* Display Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Price (₹)</label>
            <input
              type="number"
              name="displayPrice"
              value={updatedProduct.displayPrice}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Display Price"
              min="0"
            />
          </div>

          {/* Original Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
            <input
              type="number"
              name="originalPrice"
              value={updatedProduct.originalPrice}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Original Price"
              min="0"
            />
          </div>

          {/* Stock Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
            <select
              name="in_stock"
              value={String(updatedProduct.in_stock)}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>

          {/* ✅ Submit Button */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Update
          </button>

          {/* ✅ Close Button */}
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateForm;