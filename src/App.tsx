import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Customer from './pages/Customer/Customer';
import Rashifal from './pages/Rashifal/Rashifal';
import Dakshina from './pages/Dakshina/Dakshina';
import Products from './pages/DivineShop/Products/Products';
import Categories from './pages/DivineShop/Categories/Categories';
import Orders from './pages/DivineShop/Orders/Orders';
import ManageAstrologers from './pages/Astrologers/ManageAstrologers/ManageAstrologers';
import PendingAstrologers from './pages/Astrologers/PendingAstrologers/PendingAstrologers';
import ViewProfile from './pages/ViewProfile/ViewProfile';
import CallHistory from './pages/AppHistory/CallHistory/CallHistory';
import AstrologerHistory from './pages/AppHistory/ChatHistory/AstrologerHistory/AstrologerHistory';
import Job from './pages/Jobs/Jobs';
import Panchang from './pages/Panchang/Panchang';
import { Toaster } from 'react-hot-toast';
import WithdrawlRequest from './pages/Astrologers/WithdrawlRequest/WithdrawlRequest';
import UpdateRequest from './pages/Astrologers/UpdateRequest/UpdateRequest';
import AstrologersCategory from './pages/Astrologers/AstrologersCategory/AstrologersCategory';
import WalletHistory from './pages/WalletHistory';
import TextAd from './pages/Home&Land/Home/Home';
import BannerAd from './pages/Home&Land/Land/Land';
import JobBannerAd from './pages/Jobs/bannerAd';
import JobTextAd from './pages/Jobs/textAd';
import  MarraigeMaking from './pages/MarraigeMaking/MarraigeMaking';
import Matrimony from './pages/Matriomony/Matrimony';
import Dating from './pages/Dating/Dating';
import { LiveTv } from './pages/LiveTv/LiveTv';
import { JanamKundali } from './pages/JanamKundali/JanamKundali';
import  Subscription  from './pages/Subscription/Subscription';
import Category from './pages/LocalServices/Category';
import Services from './pages/LocalServices/Services';
import CalenderEvent from './pages/CalenderEvent/CalenderEvent';
import AdminAd from './pages/AdminAd/AdminAd';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      // If no user is found, navigate to the sign-in page
      navigate('/auth/signin');
    } else {
      // If a user exists, set isAuthenticated to true
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard | Good Luck" />
              <ECommerce />
            </>
          }
        />
        <Route
          path='customer'
          element={
            <>
              <PageTitle title="Customer | Good Luck" />
              <Customer></Customer>
            </>
          }
        />
        <Route
          path='astrologers/manageAstrologers'
          element={
            <>
              <PageTitle title="Manage Astrologers | Good Luck" />
              <ManageAstrologers/>
            </>
          }
        />
        <Route
          path='astrologers/pendingAstrologers'
          element={
            <>
              <PageTitle title="Pending Astrologers | Good Luck" />
              <PendingAstrologers/>
            </>
          }
        />
        <Route
          path='astrologers/astrologersCategory'
          element={
            <>
              <PageTitle title=" Astrologers Category | Good Luck" />
              <AstrologersCategory/>
            </>
          }
        />
        <Route
          path='astrologers/updateAstrologers'
          element={
            <>
              <PageTitle title="Update Request | Good Luck" />
              <UpdateRequest/>
            </>
          }
        />
        <Route
          path='astrologers/withdrawlAstrologers'
          element={
            <>
              <PageTitle title="Withdrawl Requests | Good Luck" />
              <WithdrawlRequest/>
            </>
          }
        />
        <Route
          path='localService/category'
          element={
            <>
              <PageTitle title="Local Service Category | Good Luck" />
              <Category/>
            </>
          }
        />
        <Route
          path='localService/services'
          element={
            <>
              <PageTitle title="Local Service Services | Good Luck" />
              <Services/>
            </>
          }
        />
        <Route
          path='divineShop/products'
          element={
            <>
              <PageTitle title="Customer | Good Luck" />
              <Products/>
            </>
          }
        />
        <Route
          path='divineShop/categories'
          element={
            <>
              <PageTitle title="Categories | Good Luck" />
              <Categories/>
            </>
          }
        />
        <Route
          path='divineShop/orders'
          element={
            <>
              <PageTitle title="Good Luck" />
              <Orders/>
            </>
          }
        />
        <Route
          path='advertisement/textAd'
          element={
            <>
              <PageTitle title="Home & Land Text Ad | Good Luck" />
              <TextAd/>
            </>
          }
        />
        <Route
          path='/advertisement/bannerAd'
          element={
            <>
              <PageTitle title="Home & Land Banner Ad | Good Luck" />
              <BannerAd/>
            </>
          }
        />
          <Route
          path='jobs/textAd'
          element={
            <>
              <PageTitle title=" Jobs Text Ad | Good Luck" />
              <JobTextAd/>
            </>
          }
        />
        <Route
          path='jobs/bannerAd'
          element={
            <>
              <PageTitle title="Jobs Banner Ad | Good Luck" />
              <JobBannerAd/>
            </>
          }
        />
        <Route
          path='jobs'
          element={
            <>
              <PageTitle title="Jobs | Good Luck" />
              <Job/>
            </>
          }
        />
        <Route
          path="/adminad"
          element={
            <>
              <PageTitle title="AdminAd | Good Luck" />
              <AdminAd />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | Good Luck" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/calendarEvent"
          element={
            <>
              <PageTitle title="Calendar Event | Good Luck" />
              <CalenderEvent />
            </>
          }
        />
        <Route
          path="/marraigemaking"
          element={
            <>
              <PageTitle title="Marraige Making | Good Luck" />
              <MarraigeMaking/>
            </>
          }
        />
        <Route
          path="/matrimony"
          element={
            <>
              <PageTitle title="Matrimony | Good Luck" />
             <Matrimony/>
            </>
          }
        />
         <Route
          path="/livetv"
          element={
            <>
              <PageTitle title="Life TV | Good Luck" />
             <LiveTv/>
            </>
          }
        />
        <Route
          path="/dating"
          element={
            <>
              <PageTitle title="Dating | Good Luck" />
             <Dating/>
            </>
          }
        />
         <Route
          path="/janamkundli"
          element={
            <>
              <PageTitle title="Dating | Good Luck" />
             <JanamKundali/>
            </>
          }
        />
        <Route
          path="/managesubscription"
          element={
            <>
              <PageTitle title="Manage Subcription | Good Luck" />
             <Subscription/>
            </>
          }
        />
        <Route
          path="/dakshina"
          element={
            <>
              <PageTitle title="Dakshina | Good Luck" />
              <Dakshina />
            </>
          }
        />
        <Route
          path="/panchang"
          element={
            <>
              <PageTitle title="Dakshina | Good Luck" />
              <Panchang />
            </>
          }
        />
        <Route
          path="/rashifal"
          element={
            <>
              <PageTitle title="Rashifal | Good Luck" />
              <Rashifal />
            </>
          }
        />
        <Route
          path="/walletHistory"
          element={
            <>
              <PageTitle title="Wallet History | Good Luck" />
              <WalletHistory/>
            </>
          }
        />
        <Route
          path="/viewProfile"
          element={
            <>
              <PageTitle title="Profile | Good Luck" />
              <ViewProfile />
            </>
          }
        />
        <Route
          path="/appHistory/chat/astrologerHistory"
          element={
            <>
              <PageTitle title="Call History | Good Luck" />
              <AstrologerHistory />
            </>
          }
        />
        <Route
          path="/appHistory/callHistory"
          element={
            <>
              <PageTitle title="Call History | Good Luck" />
              <CallHistory />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | Good Luck" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | Good Luck" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | Good Luck" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | Good Luck" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | Good Luck" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | Good Luck" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | Good Luck" />
              <Buttons />
            </>
          }
        />
       
      </Routes>
    </DefaultLayout>
    </>
  ) : (
    <>
    <Toaster position="top-right" reverseOrder={false} />
<Routes>
<Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | Good Luck" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | Good Luck" />
              <SignUp />
            </>
          }
        />
</Routes>
</>
  );
}

export default App;
