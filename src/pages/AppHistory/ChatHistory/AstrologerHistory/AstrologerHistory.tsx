import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";

interface TableData {
  id: number;
  astrologer: string;
  user: string;
  chatDuration: string;
  startedTime: string;
  endedTime: string;
  chatRoomId: string;
  totalAmount: string;
}

const tableData: TableData[] = [
  {
    id: 1,
    astrologer: "Astrologer 1",
    user: "User A",
    chatDuration: "12 min",
    startedTime: "10:00 AM",
    endedTime: "10:12 AM",
    chatRoomId: "CR12345",
    totalAmount: "₹40",
  },
  {
    id: 2,
    astrologer: "Astrologer 2",
    user: "User B",
    chatDuration: "20 min",
    startedTime: "11:00 AM",
    endedTime: "11:20 AM",
    chatRoomId: "CR67890",
    totalAmount: "₹60",
  },
];

const AstrologerHistory: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <Breadcrumb pageName="Astrologer History" />
      
      {/* Glassmorphism Container - Increased blur */}
      <div className="relative rounded-xl overflow-hidden my-6">
        {/* Frosted Glass Background with stronger blur */}
        <div className="absolute inset-0 bg-white bg-opacity-15 backdrop-blur-xl rounded-xl border border-white border-opacity-25 shadow-2xl"></div>
        
        {/* Content */}
        <div className="relative bg-white bg-opacity-5 p-8 backdrop-blur-md">
          {/* Date Filter Section */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-5 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white/90">From</span>
              <input
                type="date"
                className="border border-white/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary bg-white/20 text-white placeholder-white/50"
                placeholder="Start date"
              />
              <span className="text-sm font-medium text-white/90">To</span>
              <input
                type="date"
                className="border border-white/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary bg-white/20 text-white placeholder-white/50"
                placeholder="End date"
              />
            </div>
            <button className="rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-2.5 text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all">
              Search
            </button>
          </div>

          {/* Premium Lock Overlay - More prominent */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10 backdrop-blur-sm">
            <div className="text-center p-10 max-w-lg bg-gradient-to-br from-gray-900/80 to-gray-800/90 rounded-2xl border border-white/10 shadow-xl">
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
              <h3 className="text-3xl font-bold text-white mb-3">Premium Feature Locked</h3>
              <p className="text-gray-300/90 mb-8 text-lg leading-relaxed">
                This advanced feature requires a premium subscription. Contact our development team to unlock full access to the Astrologer History analytics.
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 text-lg">
                Contact Developer Team
              </button>
            </div>
          </div>

          {/* Table Header (More blurred) */}
          <div className="grid grid-cols-8 border-t border-white/10 py-5 px-6 text-white/30 blur-sm">
            <p className="font-medium text-center">Astrologer</p>
            <p className="font-medium text-center">User</p>
            <p className="font-medium text-center">Chat Duration</p>
            <p className="font-medium text-center">Started Time</p>
            <p className="font-medium text-center">Ended Time</p>
            <p className="font-medium text-center">ChatRoom Id</p>
            <p className="font-medium text-center">Total Amount</p>
            <p className="font-medium text-center">Action</p>
          </div>

          {/* Table Body (More blurred) */}
          {tableData.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-8 border-t border-white/10 py-4 px-6 text-white/30 blur-sm"
            >
              <p className="text-center flex items-center justify-center">{item.astrologer}</p>
              <p className="text-center flex items-center justify-center">{item.user}</p>
              <p className="text-center flex items-center justify-center">{item.chatDuration}</p>
              <p className="text-center flex items-center justify-center">{item.startedTime}</p>
              <p className="text-center flex items-center justify-center">{item.endedTime}</p>
              <p className="text-center flex items-center justify-center">{item.chatRoomId}</p>
              <p className="text-center flex items-center justify-center">{item.totalAmount}</p>
              <p className="text-center flex items-center justify-center">
                <button className="bg-blue-600/30 text-white/50 font-bold border-2 border-blue-600/30 px-4 py-2 rounded-lg">
                  See Chat
                </button>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AstrologerHistory;