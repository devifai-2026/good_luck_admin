import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChatCard from '../../components/Chat/ChatCard';
import TableOne from '../../components/Tables/TableOne';
import { FiUsers } from "react-icons/fi";
import { IoCartOutline, IoVideocamOutline } from "react-icons/io5";
import { BsChatDots } from 'react-icons/bs';
import { FaPhoneAlt } from "react-icons/fa";
import { IoPlanetOutline } from "react-icons/io5";
import { PiUsersThree } from "react-icons/pi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import axiosInstance from '../../utils/axiosInstance';

const ECommerce: React.FC = () => {

  const [totalAstrologers, setTotalAstrologers] = useState<number>(0);
  const [totalOrders,setTotalOrders] = useState<number>(0)
  const [totalUsers,setTotalUsers] = useState<number>(0)
  const [totalEarning,setTotalEarning] = useState<number>(0)
  const [pendingAstrologers,setPendingAstrologers] = useState<number>(0)


 // Total Users
 useEffect(() => {
  const fetchTotalUsers= async () => {
    try {
      const response = await axiosInstance.get('/auth/getAllUsers');

      console.log("API Response:", response.data); // Debugging

      if (Array.isArray(response.data)) { 
        setTotalUsers(response.data.length);
      } else if (response.data && Array.isArray(response.data.data)) {
        setTotalUsers(response.data.data.length);
      } else {
        console.error("Unexpected API response:", response.data);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error("Error fetching astrologers:", error);
      setTotalUsers(0);
    }
  };
  fetchTotalUsers();
}, []);


  // Total Astrologers
  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const response = await axiosInstance.get('/astrologer');

        console.log("API Response:", response.data); // Debugging

        if (Array.isArray(response.data)) { 
          setTotalAstrologers(response.data.length);
        } else if (response.data && Array.isArray(response.data.data)) {
          setTotalAstrologers(response.data.data.length);
        } else {
          console.error("Unexpected API response:", response.data);
          setTotalAstrologers(0);
        }
      } catch (error) {
        console.error("Error fetching astrologers:", error);
        setTotalAstrologers(0);
      }
    };
    fetchAstrologers();
  }, []);


  // Total Pending Request
  useEffect(() => {
    const fetchPendingAstrologers = async () => {
      try {
        const response = await axiosInstance.get('/astrologer/pending');

        console.log("API Response:", response.data); // Debugging

        if (Array.isArray(response.data)) { 
          setPendingAstrologers(response.data.length);
        } else if (response.data && Array.isArray(response.data.data)) {
          setPendingAstrologers(response.data.data.length);
        } else {
          console.error("Unexpected API response:", response.data);
          setPendingAstrologers(0);
        }
      } catch (error) {
        console.error("Error fetching astrologers:", error);
        setPendingAstrologers(0);
      }
    };
    fetchPendingAstrologers();
  }, []);


   // Total Orders
   useEffect(() => {
    const fetchTotalOrders= async () => {
      try {
        const response = await axiosInstance.get('/order');

        console.log("API Response:", response.data); // Debugging

        if (Array.isArray(response.data)) { 
          setTotalOrders(response.data.length);
        } else if (response.data && Array.isArray(response.data.data)) {
          setTotalOrders(response.data.data.length);
        } else {
          console.error("Unexpected API response:", response.data);
          setTotalOrders(0);
        }
      } catch (error) {
        console.error("Error fetching astrologers:", error);
        setTotalOrders(0);
      }
    };
    fetchTotalOrders();
  }, []);


     // Total Orders
     useEffect(() => {
      const fetchTotalEarnings= async () => {
        try {
          const response = await axiosInstance.get('/order');
  
          console.log("API Response:", response.data); // Debugging
  
          if (Array.isArray(response.data)) { 
            setTotalEarning(response.data.length);
          } else if (response.data && Array.isArray(response.data.data)) {
            setTotalEarning(response.data.data.length);
          } else {
            console.error("Unexpected API response:", response.data);
            setTotalEarning(0);
          }
        } catch (error) {
          console.error("Error fetching astrologers:", error);
          setTotalEarning(0);
        }
      };
      fetchTotalEarnings();
    }, []);


  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 text-center">
        <CardDataStats title="Total Users" total={totalUsers.toString()} rate="0.95%" levelDown>
        <FiUsers className='text-blue-700 text-xl md:text-2xl' />
        </CardDataStats>
        <CardDataStats title="Total Astrologers" total={totalAstrologers.toString()} rate="0.85%" levelDown>
        <PiUsersThree className='text-blue-700 text-xl md:text-2xl' />
        </CardDataStats>
        <CardDataStats title="Total Pending Request" total={pendingAstrologers.toString()} rate="0.85%" levelDown>
        <IoPlanetOutline className='text-blue-700 text-xl md:text-2xl' />
        </CardDataStats>
        <CardDataStats title="Total Orders" total={totalOrders.toString()} rate="2.59%" levelUp>
        <IoCartOutline className='text-blue-700 text-xl md:text-2xl' />
        </CardDataStats>
        <CardDataStats title="Total Earnings" total={totalEarning.toString()} rate="0.85%" levelDown>
        <FaIndianRupeeSign className='text-blue-700 text-xl md:text-2xl' />
        </CardDataStats>
        <CardDataStats title="Amount Due" total="₹50" rate="0.85%" levelDown>
        <FaIndianRupeeSign className='text-blue-700 text-xl md:text-2xl' />
        </CardDataStats>
        {/* <CardDataStats title="Completed Audio Calls" total="7" rate="0.85%" levelDown>
        <FaPhoneAlt className='text-blue-700 text-xl md:text-2xl' />
        </CardDataStats>
        <CardDataStats title="Completed Video Calls" total="17" rate="0.85%" levelDown>
        <IoVideocamOutline className='text-blue-700 text-xl md:text-2xl' />
        </CardDataStats>
        <CardDataStats title="Completed Chats" total="17" rate="0.85%" levelDown>
        <BsChatDots className='text-blue-700 text-xl md:text-2xl' />
        </CardDataStats>
        */}
       
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        {/* <ChartThree />
        <MapOne /> */}
        <div className="col-span-12 xl:col-span-7">
          <TableOne />
        </div>
       <div className='col-span-12 xl:col-span-5 mt-8'>
       <ChatCard />
       </div>
      </div>
    </>
  );
};

export default ECommerce;
