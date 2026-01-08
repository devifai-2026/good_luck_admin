import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

const Job = () => {
  const [modal, setModal] = useState(false);
  const [jobText, setJobText] = useState("");
  const [banner, setBanner] = useState<File | null>(null);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBanner(file);
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Job" />

      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark p-6">
        <button onClick={toggleModal} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Add Job
        </button>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold mb-4">Post a Job</h2>

            {/* Job Text Input */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description:</label>
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 mb-4"
              placeholder="Write job details..."
            />

            {/* Banner Upload */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Banner:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button onClick={toggleModal} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Job Description:", jobText);
                  console.log("Banner:", banner);
                  toggleModal();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Post Card */}
      <div className="mt-6 w-full max-w-md border rounded-lg shadow-md p-4 dark:bg-boxdark">
        <h3 className="text-lg font-semibold">Job Details</h3>
        <p className="text-gray-700 dark:text-gray-300 mt-2">{jobText || "Sample job description"}</p>
        <div className="mt-4 w-full h-40 bg-gray-300 rounded-md flex items-center justify-center">
          {banner ? (
            <img src={URL.createObjectURL(banner)} alt="Banner" className="w-full h-full object-cover rounded-md" />
          ) : (
            <span className="text-gray-600">No Image</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Job;