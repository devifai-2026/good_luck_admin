import { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { BounceLoader, MoonLoader, ScaleLoader } from 'react-spinners';
import Swal from "sweetalert2";
import UpdateForm from './UpdateForm';
import { uploadImageToCloudinary } from '../../../hooks/uploadImagesToCloudinary';

// Define Product Interface
interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  category: {
    _id: string;
    category_name: string;
  };
  displayPrice: number;
  originalPrice: number;
  in_stock: boolean;
  image: string;
  brand: string;
  rating: number;
  weight: string;
  createdAt: string;
}

// Define Category Interface
interface Category {
  _id: string;
  category_name: string;
}

// Component
const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Search state
  const [selectedCategory, setSelectedCategory] = useState(''); // Category filter
  const [categories, setCategories] = useState<string[]>([]); // Unique category names
  const [categoryData, setCategoryData] = useState<Category[]>([]); // Complete category data
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  
  // Form data state for adding a new product
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    category: '',
    displayPrice: 0,
    originalPrice: 0,
    in_stock: true,
    image: '',
    brand: '',
    rating: 0,
    weight: ''
  });

  // ✅ Handle Input Changes
  const handleChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;
  
    if (name === "image" && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0], // Store the selected file
      }));
    } else if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked, // ✅ Use 'checked' for checkboxes
      }));
    } else if (["displayPrice", "originalPrice", "rating"].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value === "" ? "" : Number(value), // ✅ Allow empty input
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  // ✅ Handle Form Submission

const handleAddProduct = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.productName || !formData.category || !formData.displayPrice) {
    Swal.fire({
      title: "Error!",
      text: "Please fill in all required fields.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
    return;
  }

  setLoading(true);

  try {
    let imageUrl = '';

    // ✅ Upload image to Cloudinary if a file is selected
    if (formData.image instanceof File) {
      imageUrl = await uploadImageToCloudinary(formData.image);
      if (!imageUrl) {
        Swal.fire({
          title: "Error!",
          text: "Image upload failed.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        setLoading(false);
        return;
      }
    } else {
      // Use existing URL string if no new file selected
      imageUrl = formData.image as string;
    }

    // ✅ Create product data with uploaded image URL
    const productData = {
      ...formData,
      image: imageUrl,
    };

    // ✅ Send product data to backend
    const response = await axiosInstance.post("/product/createProduct", productData);

    console.log("Product Created:", response.data);

    // ✅ Update UI with the new product IMMEDIATELY
    if (response.data.data) {
      setProducts(prev => [response.data.data, ...prev]);
    }

    Swal.fire({
      title: "Success!",
      text: "Product added successfully!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });

    // ✅ Reset form and close modal
    setFormData({
      productName: '',
      productDescription: '',
      category: '',
      displayPrice: 0,
      originalPrice: 0,
      in_stock: true,
      image: '',
      brand: '',
      rating: 0,
      weight: ''
    });
    
    setShowModal(false);
    
    // ✅ Also refresh the list from server to ensure consistency
    fetchProducts();

  } catch (error) {
    console.error("Error adding product:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to add product. Please try again.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  } finally {
    setLoading(false);
  }
};

  // ✅ Open Add Product Form
  const handleAddProductClick = () => {
    // Reset form data
    setFormData({
      productName: '',
      productDescription: '',
      category: '',
      displayPrice: 0,
      originalPrice: 0,
      in_stock: true,
      image: '',
      brand: '',
      rating: 0,
      weight: '',
    });

    setIsAddMode(true);
    setShowModal(true);
  };

  // ✅ Fetch Products and Categories from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fetch products
      const productResponse = await axiosInstance.get('/product');
      if (Array.isArray(productResponse.data.data)) {
        setProducts(productResponse.data.data); // Store products in state
      }

      // ✅ Fetch product categories
      const categoryResponse = await axiosInstance.get('/productCategory');
      if (Array.isArray(categoryResponse.data.data)) {
        // Store complete category data
        setCategoryData(categoryResponse.data.data);
        // Extract just the category names for the filter dropdown
        const uniqueCategories = categoryResponse.data.data.map(
          (cat: Category) => cat.category_name
        );
        setCategories(uniqueCategories); // Store category names
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Single Product by ID
  const fetchProductDetails = async (productId: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/product/${productId}`);
      if (response.data) {
        setSelectedProduct(response.data.data); // Store product details
        setIsAddMode(false);
        setShowModal(true); 
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Edit Product
  const handleEditProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/product/${productId}`);
      if (response.data) {
        setSelectedProduct(response.data.data); // Store product details
        setShowUpdateForm(true); // Show update form
      }
    } catch (error) {
      console.error('Error fetching product details for edit:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Delete Product
  const handleDeleteProduct = async (productId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", 
      cancelButtonColor: "#3085d6", 
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/product/delete/${productId}`);
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== productId)
          );
          Swal.fire({
            title: "Deleted!",
            text: "Product has been deleted.",
            icon: "success",
            confirmButtonColor: "#3085d6"
          });
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the product. Please try again.",
            icon: "error",
            confirmButtonColor: "#d33"
          });
        }
      }
    });
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
  }, []);

  // ✅ Filter Products based on Search and Category
  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === '' ||
        product.category?.category_name === selectedCategory)
  );

  return (
    <div>
      <Breadcrumb pageName="Products" />

      <div className="rounded-sm dark:bg-gray-700 border-stroke bg-white shadow-default p-6">
        {/* ✅ Search & Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 bg-white dark:bg-gray-700 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Category Filter */}
          <select
            className="w-full md:w-1/3 border border-gray-300 px-4 py-2 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Add Product Button */}
          <button 
            onClick={handleAddProductClick}
            className="rounded-md bg-blue-400 px-4 py-2 text-white font-medium hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>

        {/* ✅ Products Table */}
        {loading ? (
          <div className="flex justify-center py-10">
            <ScaleLoader color="#3498db" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-lg font-semibold">
            No products found.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="text-center">
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Display Price</th>
                  <th className="px-4 py-2">Original Price</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="text-center">
                    {/* Image */}
                    <td className="px-4 py-2">
                      <img
                        src={product.image || 'https://via.placeholder.com/100'}
                        alt={product.productName}
                        className="h-12 w-12 rounded-full mx-auto"
                      />
                    </td>

                    {/* Product Name */}
                    <td className="px-4 py-2">{product.productName}</td>

                    {/* Category */}
                    <td className="px-4 py-2">
                      {product.category?.category_name || 'N/A'}
                    </td>

                    {/* Display Price */}
                    <td className="px-4 py-2 font-semibold text-green-600">
                      ₹{product.displayPrice.toLocaleString()}
                    </td>

                    {/* Original Price */}
                    <td className="px-4 py-2 font-semibold">
                      ₹{product.originalPrice.toLocaleString()}
                    </td>
                    {/* Stock Status */}
                    <td className="px-4 py-2">
                      {product.in_stock ? (
                        <div className="bg-green-200 rounded-xl text-sm whitespace-nowrap px-2 py-1 text-gray-600 dark:text-black">
                          In Stock
                        </div>
                      ) : (
                        <div className="bg-red-200 rounded-xl text-sm whitespace-nowrap px-2 py-1 text-gray-600 dark:text-black">
                          Out of Stock
                        </div>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button onClick={() => fetchProductDetails(product._id)} className="text-blue-500 hover:text-blue-700">
                          <FaEye />
                        </button>
                        <button onClick={() => handleEditProduct(product._id)} className="text-blue-500 hover:text-blue-700">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* ✅ Product Details Modal */}
      {showModal && selectedProduct && !isAddMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col dark:bg-gray-600">
            
            {/* ✅ Modal Header (Fixed) */}
            <div className="p-4 border-b text-center bg-gray-100 sticky top-0 z-10">
              <h2 className="text-lg font-semibold">Product Details</h2>
            </div>

            {/* ✅ Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* Product Image */}
              <div className="flex justify-center mb-4">
                <img
                  src={selectedProduct.image || 'https://via.placeholder.com/100'}
                  alt="Product"
                  className="w-32 h-32 rounded-lg border"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedProduct.productName}</p>
                <p><strong>Category:</strong> {selectedProduct.category.category_name}</p>
                <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                <p><strong>Weight:</strong> {selectedProduct.weight}</p>
                <p><strong>Price:</strong> ₹{selectedProduct.displayPrice.toLocaleString()}</p>
                <p><strong>Original Price:</strong> ₹{selectedProduct.originalPrice.toLocaleString()}</p>
                <p><strong>Rating:</strong> ⭐ {selectedProduct.rating}</p>
                <p><strong>Stock Status:</strong> {selectedProduct.in_stock ? 'In Stock' : 'Out of Stock'}</p>
                <p><strong>Description:</strong> {selectedProduct.productDescription}</p>
                <p><strong>Created At:</strong> {new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* ✅ Modal Footer (Fixed) */}
            <div className="p-4 bg-gray-100 dark:bg-gray-600 sticky bottom-0">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-2xl font-bold"
              >
                Close
              </button>
            </div>
            
          </div>
        </div>
      )}
      
      {/* ✅ Add Product Modal */}
      {showModal && isAddMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 z-50 ">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col dark:bg-gray-600 mt-8">
            
            {/* ✅ Modal Header */}
            <div className="p-4 border-b text-center dark:bg-gray-700 dark:text-white sticky top-0 z-10">
              <h2 className="text-lg font-semibold">Add New Product</h2>
            </div>

            {/* ✅ Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <form onSubmit={handleAddProduct} className="space-y-4">
                
                {/* ✅ Product Name */}
                <div>
                  <label className="block text-sm font-medium">Product Name</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                {/* ✅ Category */}
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Category</option>
                    {categoryData.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ Brand */}
                <div>
                  <label className="block text-sm font-medium">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                {/* ✅ Weight */}
                <div>
                  <label className="block text-sm font-medium">Weight (in grams)</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                {/* ✅ Display Price */}
                <div>
                  <label className="block text-sm font-medium">Display Price (₹)</label>
                  <input
                    type="number"
                    name="displayPrice"
                    value={formData.displayPrice}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                {/* ✅ Original Price */}
                <div>
                  <label className="block text-sm font-medium">Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                {/* ✅ Rating */}
                <div>
                  <label className="block text-sm font-medium">Rating (Out of 5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                {/* ✅ Stock Status */}
                <div>
                  <label className="block text-sm font-medium">Stock Status</label>
                  <select
                    name="in_stock"
                    value={formData.in_stock ? "true" : "false"}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                {/* ✅ Product Description */}
                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                {/* ✅ Product Image */}
                <div>
                  <label className="block text-sm font-medium">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                  {formData.image instanceof File && (
                    <p className="text-sm text-gray-500 mt-1">Selected file: {(formData.image as File).name}</p>
                  )}
                </div>

                {/* ✅ Submit and Cancel Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? (
    <BounceLoader
    size={20} color="#fff" />
  ) : (
    "Add Product"
  )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* ✅ Show Update Form Modal */}
      {showUpdateForm && selectedProduct && (
        <UpdateForm
          product={selectedProduct}
          onClose={() => setShowUpdateForm(false)}
          onUpdate={fetchProducts} // Refresh product list after update
        />
      )}
    </div>
  );
};

export default Products;