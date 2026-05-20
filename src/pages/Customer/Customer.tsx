import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const Customer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const customers = [
    {
      id: 1,
      profile: 'https://via.placeholder.com/40',
      Name: 'John Doe',
      contactNo: '+1234567890',
      email: 'customer1@example.com',
      birthDate: '1990-01-01',
      birthTime: '10:30 AM',
      walletBalance: '₹100.00',
    },
    {
      id: 2,
      profile: 'https://via.placeholder.com/40',
      Name: 'Rachel Addison',
      contactNo: '+9876543210',
      email: 'customer2@example.com',
      birthDate: '1985-05-15',
      birthTime: '02:45 PM',
      walletBalance: '₹250.50',
    },
    {
      id: 3,
      profile: 'https://via.placeholder.com/40',
      Name: 'Michel Clerk',
      contactNo: '+1122334455',
      email: 'customer3@example.com',
      birthDate: '1995-07-22',
      birthTime: '08:15 AM',
      walletBalance: '₹75.30',
    },
  ];

  return (
    <>
      <Breadcrumb pageName="Customers" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <div>
            <form action="#" method="POST">
              <div className="relative">
                <button className="absolute left-0 top-1/2 -translate-y-1/2">
                  {/* Search Icon */}
                  <svg
                    className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                    />
                  </svg>
                </button>

                <input
                  type="text"
                  placeholder="Type to search..."
                  className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setIsModalOpen(true)} className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300">
              Recharge Wallet
            </button>

            <button className="rounded-md bg-blue-300 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-300">
              Add Customer
            </button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recharge Wallet
              </h2>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Amount */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount
                </label>
                <select
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="" disabled selected>Select Amount</option>
                  <option value="25">₹25</option>
                  <option value="50">₹50</option>
                  <option value="100">₹100</option>
                  <option value="200">₹200</option>
                  <option value="500">₹500</option>
                  <option value="1000">₹1000</option>
                </select>
              </div>



              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  Recharge
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Headers */}
        <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className="flex items-center px-2 col-span-2 sm:col-span-2">
            <p className="font-medium text-center">Profile</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Contact No</p>
          </div>
          <div className="flex items-center justify-center col-span-2 sm:col-span-2">
            <p className="font-medium text-center">Email</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Birth Date</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Birth Time</p>
          </div>
          <div className="flex items-center justify-center col-span-1">
            <p className="font-medium text-center">Wallet Balance</p>
          </div>
        </div>
        {/* Table body */}
        <div>
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
            >
              <div className="flex items-center px-2 col-span-2 sm:col-span-2 gap-2">
                <img
                  src={customer.profile}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <span>{customer.Name}</span>
              </div>
              <div className="flex items-center justify-center col-span-1">
                <p className="text-center">{customer.contactNo}</p>
              </div>
              <div className="flex items-center justify-center col-span-2 sm:col-span-2">
                <p className="text-center">{customer.email}</p>
              </div>
              <div className="flex items-center justify-center col-span-1">
                <p className="text-center">{customer.birthDate}</p>
              </div>
              <div className="flex items-center justify-center col-span-1">
                <p className="text-center">{customer.birthTime}</p>
              </div>
              <div className="flex items-center justify-center col-span-1">
                <p className="text-center">{customer.walletBalance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Customer;
