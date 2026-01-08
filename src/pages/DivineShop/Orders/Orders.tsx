import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import { ScaleLoader } from "react-spinners";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";


// ✅ Define Order Interface
interface Order {
  _id: string;
  userId: string | null;
  name: string;
  city: string;
  state:string;
  phone: string;
  order_details: {
    _id: string;
    productName: string;
    image: string;
    productDescription: string;
    displayPrice: number;
    brand: string;
    weight: string;
  };
  quantity: number;
  total_price: number;
  payment_method: string;
  is_payment_done: boolean;
  createdAt: string;
  transaction_id: string;
  delivery_date: string;
  is_order_complete: boolean;
}

// ✅ Orders Component
const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Modal state
  const [modalLoading, setModalLoading] = useState(false); // Modal loading state

  // ✅ Fetch Orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/order");
      if (Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

 

 // ✅ Fetch Order Details by ID
const fetchOrderDetails = async (orderId: string) => {
  console.log("Fetching order details for ID:", orderId); // Log the order ID
  setModalLoading(true);

  try {
    const response = await axiosInstance.get(`/order/${orderId}`);
    console.log("API Response:", response.data); // Log the response from API
    setSelectedOrder(response.data.data || response.data);
    // Store order details in state
  } catch (error) {
    console.error("Error fetching order details:", error);
  } finally {
    setModalLoading(false);
  }
};

  // ✅ Close Modal
  const closeModal = () => setSelectedOrder(null);

  // ✅ Filter Orders based on Search
  const filteredOrders = orders.filter((order) =>
    order.order_details.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );


  
// ✅ Function to Delete an Order
const deleteOrder = async (orderId: string) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/order/delete/${orderId}`);

        // ✅ Update the UI by removing the deleted order
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));

        Swal.fire({
          title: "Deleted!",
          text: "Order has been successfully deleted.",
          icon: "success"
        });
      } catch (error) {
        console.error("Error deleting order:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete order. Please try again.",
          icon: "error"
        });
      }
    }
  });
};

// Cancel order
const cancelOrder = async (orderId: string) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to cancel this order?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, cancel it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axiosInstance.patch(`/order/cancel/${orderId}`);

        // ✅ Update the UI immediately
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, is_order_complete: false, status: "Canceled" } : order
          )
        );

        Swal.fire({
          title: "Canceled!",
          text: "The order has been successfully canceled.",
          icon: "success"
        });
      } catch (error) {
        console.error("Error canceling order:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to cancel the order. Please try again.",
          icon: "error"
        });
      }
    }
  });
};



  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <Breadcrumb pageName="Orders" />

      <div className="rounded-sm border-stroke bg-white dark:bg-gray-700 shadow-default p-6">
        {/* ✅ Search Bar */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* ✅ Display Loader when Fetching Data */}
        {loading ? (
          <div className="flex justify-center py-10">
            <ScaleLoader color="#3498db" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-lg font-semibold">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* ✅ Table Header */}
              <thead>
                <tr className=" dark:bg-gray-600 text-center">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Total Price</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Approval</th>
                  <th className="px-4 py-2">Actions</th>
                  <th className="px-4 py-2">Details</th>
                </tr>
              </thead>

              {/* ✅ Table Body */}
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="text-center">
                    {/* Product Image & Name */}
                    <td className="px-4 py-2 flex items-center gap-2">
                      <img
                        src={order.order_details.image || "https://via.placeholder.com/50"}
                        alt={order.order_details.productName}
                        className="w-12 h-12"
                      />
                      {order.order_details.productName}
                    </td>

                    {/* User Name */}
                    <td className="px-4 py-2">{order.name || "Guest User"}</td>

                    

                    {/* Total Price */}
                    <td className="px-4 py-2 font-semibold text-green-600">
                      ₹{order.total_price.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2">
  {order.is_order_complete ? (
    <span className="text-green-600 font-semibold">Completed</span>
  ) : order.status === "Canceled" ? (
    <span className="text-red-600 font-semibold">Canceled</span>
  ) : (
    <span className="text-yellow-500 font-semibold">Pending</span>
  )}
</td>

                    {/* approval */}
                    <td className="px-4 py-2">
  <div className="flex items-center justify-center gap-2">
    {!order.is_order_complete && order.status !== "Canceled" && (
      <button
        className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600"
        onClick={() => cancelOrder(order._id)}
      >
        Cancel
      </button>
    )}
  </div>
</td>


                    {/* Actions */}
                    <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                    {/* <FaEdit className="text-blue-500 hover:text-blue-300"></FaEdit> */}
                    <FaTrashAlt onClick={() => deleteOrder(order._id)}  className="text-red-500 hover:text-red-700"></FaTrashAlt>
                    </div>
                    </td>

                    {/* Invoice Button */}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => fetchOrderDetails(order._id)}
                        className="text-blue-700 dark:text-blue-300 font-bold hover:underline px-3 py-2 rounded-md"
                      >
                        View Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Order Details Modal */}
      {selectedOrder && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-700 dark:text-gray-300 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto mt-16">
      <h2 className="text-xl font-semibold mb-4 text-center">Order Details</h2>

      {modalLoading ? (
        <div className="text-center">
          <ScaleLoader color="#3498db" />
        </div>
      ) : (
        <>
          {/* ✅ Order Details */}
          <div className="flex justify-center mb-4">
            <img
              src={selectedOrder.order_details.image}
              alt=""
              className="w-32 h-32"
            />
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Name:</strong> {selectedOrder.name}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>City:</strong> {selectedOrder.city}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>State:</strong> {selectedOrder.state}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Phone:</strong> {selectedOrder.phone}
          </p> 
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Product:</strong> {selectedOrder.order_details.productName}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Quantity:</strong> {selectedOrder.quantity}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Price:</strong> ₹{selectedOrder.total_price.toLocaleString()}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Brand:</strong> {selectedOrder.order_details.brand}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Weight:</strong> {selectedOrder.order_details.weight}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Payment Method:</strong> {selectedOrder.payment_method}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Transaction ID:</strong> {selectedOrder.transaction_id}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Delivery Date:</strong> {new Date(selectedOrder.delivery_date).toDateString()}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Status:</strong>{" "}
            {selectedOrder.is_order_complete ? "Completed" : "Pending"}
          </p>

          {/* Close Button */}
          <button
            onClick={closeModal}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full"
          >
            Close
          </button>
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default Orders;
