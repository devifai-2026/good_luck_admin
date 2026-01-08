import { BRAND } from '../../types/brand';
import BrandOne from '../../images/brand/brand-01.svg';
import BrandTwo from '../../images/brand/brand-02.svg';
import BrandThree from '../../images/brand/brand-03.svg';
import BrandFour from '../../images/brand/brand-04.svg';
import BrandFive from '../../images/brand/brand-05.svg';

const brandData: BRAND[] = [
  {
    logo: BrandOne,
    name: 'Google',
    visitors: 3.5,
    revenues: '5,768',
    sales: 590,
    conversion: 4.8,
  },
  {
    logo: BrandTwo,
    name: 'Twitter',
    visitors: 2.2,
    revenues: '4,635',
    sales: 467,
    conversion: 4.3,
  },
  {
    logo: BrandThree,
    name: 'Github',
    visitors: 2.1,
    revenues: '4,290',
    sales: 420,
    conversion: 3.7,
  },
  {
    logo: BrandFour,
    name: 'Vimeo',
    visitors: 1.5,
    revenues: '3,580',
    sales: 389,
    conversion: 2.5,
  },
  {
    logo: BrandFive,
    name: 'Facebook',
    visitors: 3.5,
    revenues: '6,768',
    sales: 390,
    conversion: 4.2,
  },
];

const TableOne = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden my-8">
      {/* Glassmorphism Background with Strong Blur */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl"></div>
      
      {/* Content */}
      <div className="relative bg-gradient-to-br from-blue-600/80 via-indigo-500/80 to-purple-600/80 p-8 backdrop-blur-md">
        {/* Premium Lock Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl z-10">
          <div className="text-center p-8 max-w-lg bg-gradient-to-br from-gray-900/80 to-gray-800/90 rounded-xl border border-white/10 shadow-xl">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Premium Astrologers Locked</h3>
            <p className="text-gray-300/90 mb-6 text-lg">
              Access to our top-rated astrologers requires a premium subscription.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
              Upgrade to Premium
            </button>
          </div>
        </div>

        {/* Blurred Content Behind Lock */}
        {/* <div className="opacity-50 blur-sm">
          <h3 className="mb-4 text-4xl font-bold text-white text-center">
            Our Top Astrologers⭐
          </h3>
          <h4 className="mb-4 text-3xl font-bold text-white">🎉 Subscribe for More Details!</h4>
          <p className="text-lg text-white/90">
            Get exclusive insights and updates on top astrologers, trending brands,
            and exciting features.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-xl text-white">✨ Stay Tuned!</span>
            <span className="text-xl text-white">🔔 Don't Miss Out!</span>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-red-500 hover:to-pink-500"
            >
              💌 Subscribe Now
            </button>
          </div>
        </div> */}

        {/* Blurred Table Behind Lock */}
        <div className="mt-8 opacity-30 blur-sm">
          <div className="flex flex-col">
            <div className="grid grid-cols-3 rounded-sm bg-gray-2/30 dark:bg-meta-4/30 sm:grid-cols-4">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                  PROFILE
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                  CONTACT
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                  Revenues
                </h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                  TOTAL REQUEST
                </h5>
              </div>
            </div>

            {brandData.map((brand, key) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-4 ${
                  key === brandData.length - 1
                    ? ''
                    : 'border-b border-white/20 dark:border-strokedark'
                }`}
                key={key}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <img src={brand.logo} alt="Brand" className="opacity-70" />
                  </div>
                  <p className="hidden text-white sm:block">
                    {brand.name}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-white">{brand.visitors}K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-green-300">₹{brand.revenues}</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-white">{brand.sales}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOne;