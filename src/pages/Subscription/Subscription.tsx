import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { TieredPlanCards, TieredPlanEditModal, TieredSubscriptionPlan } from './TieredPlanEditor';

type ServiceType = 'advertisement' | 'local' | 'dating' | 'matrimony';

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
  const [tieredData, setTieredData] = useState<TieredSubscriptionPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchSubscriptionData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(apiEndpoints[activeService]);
      setTieredData(response.data.data);
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeService]);

  return (
    <>
      <Breadcrumb pageName="Manage Subscription" />
      <div className="max-w-5xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl shadow-lg">
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
        ) : tieredData ? (
          <TieredPlanCards plan={tieredData} />
        ) : null}

        {!loading && !error && tieredData && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-medium rounded-lg hover:opacity-90 transition-all"
          >
            Edit Plans
          </button>
        )}
      </div>

      {isEditModalOpen && tieredData && (
        <TieredPlanEditModal
          plan={tieredData}
          patchUrl={`${patchEndpoints[activeService]}${tieredData._id}`}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={fetchSubscriptionData}
        />
      )}
    </>
  );
};

export default Subscription;
