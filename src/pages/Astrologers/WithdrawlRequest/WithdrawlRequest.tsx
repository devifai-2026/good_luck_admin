import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";

// Define the withdrawal request interface
interface WithdrawalRequest {
  _id: string;
  astrologerId: string;
  amount: number;
  status: string;
  requestedAt: string;
  createdAt: string;
}

// Component
const WithdrawalRequests = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Stores ID of the row being processed

  // ✅ Fetch withdrawal requests
  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/withdraw");
      if (Array.isArray(response.data.data)) {
        setWithdrawals(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching withdrawal requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Status Update (Approve or Reject)
  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    const confirmText = newStatus === "approved" ? "Yes, approve it!" : "Yes, reject it!";
    const actionText = newStatus === "approved" ? "approved" : "rejected";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${actionText} this withdrawal request.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: "Cancel",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        setActionLoading(id); // Show loading indicator for the row
        await axiosInstance.patch(`/withdraw/${id}`, { status: newStatus });

        // Update the UI after successful response
        setWithdrawals((prev) =>
          prev.map((withdraw) =>
            withdraw._id === id ? { ...withdraw, status: newStatus } : withdraw
          )
        );

        Swal.fire("Success!", `Withdrawal request has been ${actionText}.`, "success");
      } catch (error) {
        console.error(`Error updating withdrawal status to ${newStatus}:`, error);
        Swal.fire("Error!", `Failed to ${actionText} the withdrawal request.`, "error");
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Withdrawal Requests" />

      <div className="w-full max-w-full border-stroke bg-white dark:bg-gray-700 shadow-md rounded-lg p-6">
        {/* Show loader while fetching data */}
        {loading ? (
          <div className="flex justify-center py-10">
            <ScaleLoader color="#3498db" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-lg font-semibold">
            No withdrawal requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* ✅ DaisyUI Table */}
            <table className="table w-full border-collapse ">
              {/* Table Header */}
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-center">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Astrologer ID</th>
                  <th className="px-4 py-3">Amount (₹)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Requested At</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {withdrawals.map((withdraw) => (
                  <tr key={withdraw._id} className="text-center hover:bg-gray-100 dark:hover:bg-gray-500">
                    <td className="px-4 py-3">{withdraw._id.slice(-6)}</td>
                    <td className="px-4 py-3">{withdraw.astrologerId.slice(-6)}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">₹{withdraw.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded text-white text-sm font-semibold ${
                          withdraw.status === "pending"
                            ? "bg-yellow-500"
                            : withdraw.status === "approved"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {withdraw.status.charAt(0).toUpperCase() + withdraw.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(withdraw.requestedAt).toLocaleDateString("en-IN")}
                    </td>

                    {/* ✅ Actions - Approve & Reject Buttons */}
                    <td className="px-4 py-3 flex justify-center gap-2">
                      {/* Approve Button */}
                      <button
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                        onClick={() => handleUpdateStatus(withdraw._id, "approved")}
                        disabled={actionLoading === withdraw._id}
                      >
                        {actionLoading === withdraw._id ? "Processing..." : "Approve"}
                      </button>

                      {/* Reject Button */}
                      <button
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                        onClick={() => handleUpdateStatus(withdraw._id, "rejected")}
                        disabled={actionLoading === withdraw._id}
                      >
                        {actionLoading === withdraw._id ? "Processing..." : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default WithdrawalRequests;
