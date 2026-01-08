import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Swal from "sweetalert2";

interface Astrologer {
  _id: string;
  Fname: string;
  Lname: string;
  profile_picture?: string;
}

const ChatCard = () => {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPendingAstrologers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/astrologer/pending");
        if (Array.isArray(response.data.data)) {
          setAstrologers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching pending astrologers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAstrologers();
  }, []);

  const handleApproveAstrologer = async (id: string) => {
    const { isConfirmed } = await Swal.fire({
      title: "Approve Astrologer?",
      text: "This will approve the astrologer's application",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel"
    });

    if (!isConfirmed) return;

    try {
      await axiosInstance.patch(`/astrologer/approve/${id}`);
      setAstrologers(prev => prev.filter(astro => astro._id !== id));
      Swal.fire("Approved!", "Astrologer has been approved.", "success");
    } catch (error) {
      console.error("Error approving astrologer:", error);
      Swal.fire("Error!", "Failed to approve astrologer.", "error");
    }
  };

  const handleRejectAstrologer = async (id: string) => {
    const { value: reason } = await Swal.fire({
      title: "Rejection Reason",
      input: "textarea",
      inputPlaceholder: "Enter reason for rejection...",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) return "Please provide a reason!";
      }
    });

    if (!reason) return;

    try {
      await axiosInstance.patch(`/astrologer/reject/${id}`, {
        request_status: "rejected",
        request_status_message: reason
      });
      setAstrologers(prev => prev.filter(astro => astro._id !== id));
      Swal.fire("Rejected!", "Astrologer has been rejected.", "success");
    } catch (error) {
      console.error("Error rejecting astrologer:", error);
      Swal.fire("Error!", "Failed to reject astrologer.", "error");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
          Pending Astrologer Requests
        </h4>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : astrologers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Profile
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {astrologers.map((astro) => (
                  <tr key={astro._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={astro.profile_picture || "https://ui-avatars.com/api/?background=random&name="+astro.Fname+"+"+astro.Lname}
                            alt=""
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {astro.Fname} {astro.Lname}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleApproveAstrologer(astro._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectAstrologer(astro._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No pending astrologer requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatCard;