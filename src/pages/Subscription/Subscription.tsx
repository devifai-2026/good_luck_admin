import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';

type ServiceType = 'advertisement' | 'local' | 'dating' | 'matrimony';

type SubscriptionPlan = {
  one_month_plan: number;
  one_year_plan: number;
  _id: string; // assuming the backend returns this ID
};

interface ApiResponse {
  data: SubscriptionPlan;
}

const apiEndpoints: Record<ServiceType, string> = {
  advertisement: 'advertisement/get',
  local: 'local/subscription/get',
  dating: 'dating/subscription/get',
  matrimony: 'matrimony/subscription/get',
};

const patchEndpoints: Record<ServiceType, string> = {
  advertisement: 'advertisement/update/',
  local: 'local/subscription/update/',
  dating: 'dating/subscription/update/',
  matrimony: 'matrimony/subscription/update/',
};

const Subscription = () => {
  const [activeService, setActiveService] = useState<ServiceType>('advertisement');
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editValues, setEditValues] = useState<SubscriptionPlan>({
    one_month_plan: 0,
    one_year_plan: 0,
    _id: '',
  });

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);

  const fetchSubscriptionData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<ApiResponse>(apiEndpoints[activeService]);
      setSubscriptionData(response.data.data);
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [activeService]);

  const handleEditClick = () => {
    if (subscriptionData) {
      setEditValues(subscriptionData);
      setIsEditModalOpen(true);
    }
  };

  const handleSave = async () => {
    try {
      const { _id, one_month_plan, one_year_plan } = editValues;
  
      await axiosInstance.patch(`${patchEndpoints[activeService]}${_id}`, {
        one_month_plan,
        one_year_plan,
      });
  
      setIsEditModalOpen(false);
      await fetchSubscriptionData();
  
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Subscription plan updated successfully.',
        confirmButtonColor: '#2563EB',
      });
    } catch (err) {
      console.error('Update failed', err);
  
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update subscription plan. Please try again.',
        confirmButtonColor: '#DC2626',
      });
    }
  };
  
  return (
    <>
      <Breadcrumb pageName="Manage Subscription" />
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Subscription Plans</h2>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {(['advertisement', 'local', 'dating', 'matrimony'] as ServiceType[]).map((service) => (
            <button
              key={service}
              className={`px-4 py-2 rounded-md text-white font-medium transition-all ${
                activeService === service ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-700'
              }`}
              onClick={() => setActiveService(service)}
              disabled={loading && activeService !== service}
            >
              {service.charAt(0).toUpperCase() + service.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 my-8">{error}</p>
        ) : subscriptionData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlanCard title="Monthly Plan" price={subscriptionData.one_month_plan} formatPrice={formatPrice} />
            <PlanCard title="Yearly Plan" price={subscriptionData.one_year_plan} formatPrice={formatPrice} />
          </div>
        ) : null}

        {!loading && !error && subscriptionData && (
          <button
            onClick={handleEditClick}
            className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-medium rounded-lg hover:opacity-90 transition-all"
          >
            Edit Plan
          </button>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Edit {activeService} Subscription</h3>

            <label className="block mb-2 font-medium">Monthly Plan (INR)</label>
            <input
              type="number"
              className="w-full px-4 py-2 mb-4 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
              value={editValues.one_month_plan}
              onChange={(e) =>
                setEditValues({ ...editValues, one_month_plan: Number(e.target.value) })
              }
            />

            <label className="block mb-2 font-medium">Yearly Plan (INR)</label>
            <input
              type="number"
              className="w-full px-4 py-2 mb-6 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
              value={editValues.one_year_plan}
              onChange={(e) =>
                setEditValues({ ...editValues, one_year_plan: Number(e.target.value) })
              }
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PlanCard = ({
  title,
  price,
  formatPrice,
}: {
  title: string;
  price: number;
  formatPrice: (price: number) => string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-gray-200 dark:border-gray-700">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(price)}</p>
  </div>
);

export default Subscription;
