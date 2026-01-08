import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { RxDashboard } from 'react-icons/rx';
import {
  FaCalendar,
  FaHistory,
  FaRegUser,
  FaTools,
  FaUserPlus,
} from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { BsMoonStars, BsPersonWorkspace, BsShop } from 'react-icons/bs';
import { GiLovers, GiRamProfile, GiWallet } from 'react-icons/gi';
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { MdKeyboardArrowDown, MdSubscriptions } from 'react-icons/md';
import { ImGift } from 'react-icons/im';
import { RiUserHeartLine } from 'react-icons/ri';
import { FiTv } from 'react-icons/fi';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { HiArrowPathRoundedSquare } from 'react-icons/hi2';
import { TbZodiacSagittarius } from 'react-icons/tb';
import { FcCalendar } from 'react-icons/fc';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <p className="text-gray-200 text-2xl lg:text-4xl font-bold text-center">
            GOOD LUCK
          </p>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-2 px-4 lg:mt-0 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/' || pathname.includes('dashboard')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="/"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === '/' ||
                            pathname.includes('dashboard')) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <RxDashboard />
                        Dashboard
                      </NavLink>

                      {/* <!-- Commented out the dropdown menu --> */}
                      {/* 
        <svg className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'}`} width="20" height="20">
          <path fillRule="evenodd" clipRule="evenodd" d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z" />
        </svg>

        <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                  (isActive && '!text-white')
                }
              >
                eCommerce
              </NavLink>
            </li>
          </ul>
        </div>
        */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Customer --> */}
              {/* <li>
                <NavLink
                  to="/customer"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('customer') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                 <FaRegUser />
                  Customer
                </NavLink>
              </li> */}
              {/* <!-- Customer --> */}
              {/* <!-- Menu Item Calendar --> */}
              <li>
                <NavLink
                  to="/calendar"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname === '/calendar' && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FaCalendar />
                  Calendar
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/calendarEvent"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname === '/calendarEvent' &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FcCalendar />
                  Calendar Event
                </NavLink>
              </li>

              {/* <!-- Menu Item Calendar Event --> */}
              <li>
                <NavLink
                  to="/adminad"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname === '/adminad' && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FaUserPlus />
                  AdminAd
                </NavLink>
              </li>

              {/* <!-- Menu Item Calendar Event --> */}

              {/* <!--Astrologer --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="astrologers"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === '/forms' ||
                            pathname.includes('astrologers')) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <FiUsers />
                        Astrologers
                        <MdKeyboardArrowDown className="text-2xl ml-auto" />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/astrologers/manageAstrologers"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Manage Astrologers
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/astrologers/astrologersCategory"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Astrologers Category
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/astrologers/pendingAstrologers"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Pending Astrologers
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/astrologers/updateAstrologers"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Update Request
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/astrologers/withdrawlAstrologers"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Withdrawl Request
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Astrologer --> */}

              {/* <!-- Local Services --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/divineShop' || pathname.includes('divineShop')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="divineShop"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === '/divineShop' ||
                            pathname.includes('divineShop')) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <FaTools />
                        Local Services
                        <MdKeyboardArrowDown className="text-2xl ml-auto" />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/localService/category"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Category
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/localService/services"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Services
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Local Services --> */}

              {/* <!-- Devine Shop --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/divineShop' || pathname.includes('divineShop')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="divineShop"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === '/divineShop' ||
                            pathname.includes('divineShop')) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <BsShop />
                        Divine Shop
                        <MdKeyboardArrowDown className="text-2xl ml-auto" />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/divineShop/Products"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Products
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/divineShop/categories"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Categories
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/divineShop/orders"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Orders
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Devine Shop --> */}

              {/* <!-- Home & Land  --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/divineShop' || pathname.includes('divineShop')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="divineShop"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === '/advertisement' ||
                            pathname.includes('advertisement')) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <IoHomeOutline />
                        Home & Land Ad
                        <MdKeyboardArrowDown className="text-2xl ml-auto" />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/advertisement/textAd"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Text Ad
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/advertisement/bannerAd"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Banner Ad
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Home & Land --> */}

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/divineShop' || pathname.includes('divineShop')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="divineShop"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === '/jobs' || pathname.includes('jobs')) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <BsPersonWorkspace />
                        Jobs
                        <MdKeyboardArrowDown className="text-2xl ml-auto" />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/jobs/textAd"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Text Ad
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/jobs/bannerAd"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Banner Ad
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Jobs Starts --> */}
              {/* <li>
                <NavLink
                  to="/jobs"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('jobs') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                <BsPersonWorkspace />
                  Jobs
                </NavLink>
              </li> */}
              {/* <!--Jobs Ends --> */}
              {/* <!-- Dakshina Starts --> */}
              <li>
                <NavLink
                  to="/dakshina"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('dakshina') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <ImGift />
                  Dakshina
                </NavLink>
              </li>
              {/* <!--Dakshina Ends --> */}
              {/* <!-- Matrimony Starts --> */}
              <li>
                <NavLink
                  to="/matrimony"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('matrimony') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <RiUserHeartLine />
                  Matrimony
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/marraigemaking"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('marraigemaking') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FaHandHoldingHeart />
                  Marraige Making
                </NavLink>
              </li>
              {/* <!--Matrimony Ends --> */}
              {/* <!-- Dating Starts --> */}
              <li>
                <NavLink
                  to="/dating"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('dating') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <GiLovers />
                  Dating
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/livetv"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('livetv') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FiTv />
                  Live Tv
                </NavLink>
              </li>
              {/* <!--Dating Ends --> */}
              {/* <!-- Panchang Starts --> */}
              <li>
                <NavLink
                  to="/panchang"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('panchang') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <BsMoonStars />
                  Panchang
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/janamkundli"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('janamkundli') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <TbZodiacSagittarius />
                  Janam Kundali
                </NavLink>
              </li>
              {/* <!--Panchang Ends --> */}
              {/* <!-- Rashifal Starts --> */}
              <li>
                <NavLink
                  to="/rashifal"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('rashifal') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <GiRamProfile />
                  Rashifal
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/managesubscription"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('managesubscription') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <MdSubscriptions />
                  Manage Subcription
                </NavLink>
              </li>
              {/* <!--Rashifal Ends --> */}
              {/* <!--Wallet History --> */}

              {/* <!-- Menu Item Tables --> */}

              {/* <!-- Menu Item Settings --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/history' || pathname.includes('history')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === '/history' ||
                            pathname.includes('history')) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <HiArrowPathRoundedSquare />
                        App History
                        <MdKeyboardArrowDown className="text-2xl ml-auto" />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <SidebarLinkGroup
                              activeCondition={
                                pathname === '/history/chat' ||
                                pathname.includes('history/chat')
                              }
                            >
                              {(handleClick, open) => {
                                return (
                                  <React.Fragment>
                                    <NavLink
                                      to="#"
                                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                        (pathname === '/history/chat' ||
                                          pathname.includes('history/chat')) &&
                                        'bg-graydark dark:bg-meta-4'
                                      }`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        sidebarExpanded
                                          ? handleClick()
                                          : setSidebarExpanded(true);
                                      }}
                                    >
                                      Chat History
                                      <MdKeyboardArrowDown />
                                    </NavLink>
                                    {/* <!-- Dropdown Menu Start --> */}
                                    <div
                                      className={`translate transform overflow-hidden ${
                                        !open && 'hidden'
                                      }`}
                                    >
                                      <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                        <li>
                                          <NavLink
                                            to="/appHistory/chat/astrologerHistory"
                                            className={({ isActive }) =>
                                              'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                              (isActive && '!text-white')
                                            }
                                          >
                                            Astrologer History
                                          </NavLink>
                                        </li>
                                      </ul>
                                    </div>
                                    {/* <!-- Dropdown Menu End --> */}
                                  </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>
                          {/* <li>
                            <NavLink
                              to="/appHistory/callHistory"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Call History
                            </NavLink>
                          </li> */}
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <li>
                <NavLink
                  to="/walletHistory"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('walletHistory') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <GiWallet />
                  Wallet History
                </NavLink>
              </li>
              {/* <!-- Menu Item Settings --> */}
              {/* View Profile starts */}
              {/* <li>
                <NavLink
                  to="/viewProfile"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('settings') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                 <IoSettingsOutline />
                  View Profile
                </NavLink>
              </li> */}
              {/* View profile ends */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
