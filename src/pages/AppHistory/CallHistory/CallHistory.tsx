import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

const CallHistory = () => {
  const tableData = [
    {
      id: 1,
      astrologer: 'Astrologer 1',
      user: 'User A',
      callDuration: '10 min',
      startedTime: '10:00 AM',
      endedTime: '10:10 AM',
      totalAmount: '$50',
    },
    {
      id: 2,
      astrologer: 'Astrologer 2',
      user: 'User B',
      callDuration: '15 min',
      startedTime: '11:00 AM',
      endedTime: '11:15 AM',
      totalAmount: '$75',
    },
  ];

  return (
    <div>
      <Breadcrumb pageName="Call History" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Calendar Input */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">From</span>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary dark:text-white dark:bg-dark dark:border-gray-600"
            />
            <span className="text-sm font-medium">To</span>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary dark:text-white dark:bg-dark dark:border-gray-600"
            />
          </div>

          {/* Add Product Button */}
          <button className="rounded-md bg-blue-500 px-2 py-1 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-400 dark:hover:bg-blue-700">
            Fetch Call History
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6">
          <p className="font-medium text-center">Astrologer</p>
          <p className="font-medium text-center">User</p>
          <p className="font-medium text-center">Call Duration</p>
          <p className="font-medium text-center">Started Time</p>
          <p className="font-medium text-center">Ended Time</p>
          <p className="font-medium text-center">Total Amount</p>
          <p className="font-medium text-center">Action</p>
        </div>

        {/* Table Body */}

        {tableData.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-7 border-t border-stroke py-3 px-4 dark:border-strokedark md:px-6"
          >
            <p className="text-center">{item.astrologer}</p>
            <p className="text-center">{item.user}</p>
            <p className="text-center">{item.callDuration}</p>
            <p className="text-center">{item.startedTime}</p>
            <p className="text-center">{item.endedTime}</p>
            <p className="text-center">{item.totalAmount}</p>
            <div className="flex justify-center gap-4">
              <button className="text-white bg-blue-500 py-1 px-2 rounded-md">
                Listen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallHistory;
