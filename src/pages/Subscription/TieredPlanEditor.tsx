import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Swal from 'sweetalert2';

export type Tier = {
  price: number;
  durationInMonths: number;
  features: string[];
  isPremium: boolean;
  isTrusted: boolean;
};

export type TieredSubscriptionPlan = {
  _id: string;
  silver: Tier;
  gold: Tier;
  platinum: Tier;
};

type TierKey = 'silver' | 'gold' | 'platinum';

const TIER_META: Record<TierKey, { label: string; accent: string; ring: string }> = {
  silver: { label: 'Silver', accent: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200', ring: 'border-gray-300 dark:border-gray-600' },
  gold: { label: 'Gold', accent: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', ring: 'border-amber-400' },
  platinum: { label: 'Platinum', accent: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', ring: 'border-purple-400' },
};

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);

const TierCard = ({ tierKey, tier }: { tierKey: TierKey; tier: Tier }) => {
  const meta = TIER_META[tierKey];
  return (
    <div className={`rounded-2xl border-2 ${meta.ring} bg-white dark:bg-gray-800 p-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white">{meta.label}</h4>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${meta.accent}`}>
          {tier.durationInMonths} month{tier.durationInMonths > 1 ? 's' : ''}
        </span>
      </div>
      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(tier.price)}</p>
      <div className="flex flex-wrap gap-2">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            tier.isPremium ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          {tier.isPremium ? '★ Premium Tag' : 'No Premium Tag'}
        </span>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            tier.isTrusted ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          {tier.isTrusted ? '✓ Trusted Badge' : 'No Trusted Badge'}
        </span>
      </div>
      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        {tier.features.map((feature, index) => (
          <li key={index}>✓ {feature}</li>
        ))}
      </ul>
    </div>
  );
};

export const TieredPlanCards = ({ plan }: { plan: TieredSubscriptionPlan }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <TierCard tierKey="silver" tier={plan.silver} />
    <TierCard tierKey="gold" tier={plan.gold} />
    <TierCard tierKey="platinum" tier={plan.platinum} />
  </div>
);

type EditableTier = { price: number; featuresText: string };

const toEditableTier = (tier: Tier): EditableTier => ({
  price: tier.price,
  featuresText: tier.features.join('\n'),
});

export const TieredPlanEditModal = ({
  plan,
  patchUrl,
  onClose,
  onSaved,
}: {
  plan: TieredSubscriptionPlan;
  patchUrl: string;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}) => {
  const [values, setValues] = useState<Record<TierKey, EditableTier>>({
    silver: toEditableTier(plan.silver),
    gold: toEditableTier(plan.gold),
    platinum: toEditableTier(plan.platinum),
  });
  const [saving, setSaving] = useState(false);

  const updateTier = (tierKey: TierKey, patch: Partial<EditableTier>) => {
    setValues((prev) => ({ ...prev, [tierKey]: { ...prev[tierKey], ...patch } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: Record<TierKey, { price: number; features: string[] }> = {
        silver: { price: values.silver.price, features: values.silver.featuresText.split('\n').map((f) => f.trim()).filter(Boolean) },
        gold: { price: values.gold.price, features: values.gold.featuresText.split('\n').map((f) => f.trim()).filter(Boolean) },
        platinum: { price: values.platinum.price, features: values.platinum.featuresText.split('\n').map((f) => f.trim()).filter(Boolean) },
      };

      await axiosInstance.patch(patchUrl, body);
      await onSaved();
      onClose();

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Subscription plans updated successfully.',
        confirmButtonColor: '#2563EB',
      });
    } catch (err) {
      console.error('Update failed', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update subscription plans. Please try again.',
        confirmButtonColor: '#DC2626',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">Edit Silver / Gold / Platinum Plans</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Premium Tag and Trusted Badge are fixed per tier and cannot be changed here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(TIER_META) as TierKey[]).map((tierKey) => {
            const meta = TIER_META[tierKey];
            return (
              <div key={tierKey} className={`rounded-xl border ${meta.ring} p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">{meta.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${meta.accent}`}>
                    {plan[tierKey].durationInMonths} month{plan[tierKey].durationInMonths > 1 ? 's' : ''}
                  </span>
                </div>

                <label className="block mb-1 text-sm font-medium">Price (INR)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 mb-3 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
                  value={values[tierKey].price}
                  onChange={(e) => updateTier(tierKey, { price: Number(e.target.value) })}
                />

                <label className="block mb-1 text-sm font-medium">Features (one per line)</label>
                <textarea
                  className="w-full px-3 py-2 mb-3 rounded border border-gray-300 dark:bg-gray-700 dark:text-white h-28"
                  value={values[tierKey].featuresText}
                  onChange={(e) => updateTier(tierKey, { featuresText: e.target.value })}
                />

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full ${plan[tierKey].isPremium ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
                    {plan[tierKey].isPremium ? '★ Premium (fixed)' : 'No Premium (fixed)'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full ${plan[tierKey].isTrusted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {plan[tierKey].isTrusted ? '✓ Trusted (fixed)' : 'No Trusted (fixed)'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
