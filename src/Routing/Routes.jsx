import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

import Stats from '../Component/Stats/Stats';
import FeaturedListings from '../Component/Feature/Feature';
import DetailPageWrapper from '../Component/Channel/DetailPageWrapper';
import CartPage from '../Component/Cart/Cart';
import HomePage from '../Pages/LandingPage/HomePage';
import NotFoundPage from '../Component/PageNotFound/PageNotFound';
import Login from '../Pages/Seller/Login';
import Signup from '../Pages/Seller/SignUp';
import ChannelList from '../Pages/Channels/Channels';
import AdminDashboard from '../Pages/Admin/AdminDashboard';
import AdminBanners from '../Pages/Admin/AdminBanners';
import SellerPanel from '../Pages/SellerPanel/SellerPanel ';
import UnauthorizedComponent from '../Component/UnAuthorized/UnAuthorized';
import PurchaseSteps from '../Component/Steps/Steps/Steps';
import SellChannelSteps from '../Component/Steps/Steps/SellChannel';
import ChannelTransactionSteps from '../Component/Steps/Steps/ChannelSteps/ChannelSteps';
import BlogSection from '../Pages/Blogs/Blogs';
import UserProfile from '../Component/Profile/Profile';
import GrowYourChannel from '../Pages/GrowYourChannel/GrowYourChannel';
import AboutPage from '../Pages/About/About';
import PaymentGateway from '../Pages/Payment/Payment';
import Privacy from './Privacy';
import PaymentSuccessful from '../Component/Success/Success';
import Confirmation from '../Component/Success/Confirmation';
import Orders from '../Component/Orders/Orders';
import TransactionsPanel from '../Component/Profile/Transactions';
import MyChannels from '../Component/Profile/MyChannels';
import PrivacyPolicy from '../ExternalPages/PrivacyPolicy';
import TermsAndConditions from '../ExternalPages/TermsAndConditions';
import RefundAndReturnPolicy from '../ExternalPages/RefundPolicy';
import ShippingAndCancellationPolicy from '../ExternalPages/Cancellation';

const ProtectedRoute = ({ element, isAuthRequired = false }) => {
  const token = localStorage.getItem('token');

  if (isAuthRequired && !token) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

const Routes = () => {
  const routes = [
    { path: '/', element: <HomePage /> },
    { path: '/payment/success', element: <PaymentSuccessful /> },
    { path: '/confirmation/:id', element: <Confirmation /> },
    { path: '/privacy', element: <Privacy /> },
    { path: '/privacy-policy', element: <PrivacyPolicy /> },
    { path: '/terms-and-conditions', element: <TermsAndConditions /> },
    { path: '/refund-policy', element: <RefundAndReturnPolicy /> },
    { path: '/shipping-policy', element: <ShippingAndCancellationPolicy /> },
    { path: '/stats', element: <Stats /> },
    { path: '/feature', element: <FeaturedListings /> },
    { path: '/channel/:id', element: <DetailPageWrapper /> },
    { path: '/how-to', element: <ChannelTransactionSteps /> },
    { path: '/blogs', element: <BlogSection /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/transactions', element: <TransactionsPanel /> },

    { path: '/my-channels', element: <MyChannels /> },

    { path: '/payment-gateway/:channel', element: <PaymentGateway /> },
    {
      path: '/cart',
      element: <ProtectedRoute element={<CartPage />} isAuthRequired={true} />
    },
    {
      path: '/seller-dashboard',
      element: <ProtectedRoute element={<SellerPanel />} isAuthRequired={true} />
    },
    { path: '/login', element: <Login /> },
    { path: '/orders', element: <ProtectedRoute element={<Orders />} isAuthRequired={true} /> },
    { path: '/signup', element: <Signup /> },
    { path: '/channels', element: <ChannelList /> },
    { path: '/grow', element: <GrowYourChannel /> },
    {
      path: '/admin-dashboard',
      element: <ProtectedRoute element={<AdminDashboard />} isAuthRequired={true} />
    },
    {
      path: '/admin/banners',
      element: <ProtectedRoute element={<AdminBanners />} isAuthRequired={true} />
    },
    { path: '/unauthorized', element: <UnauthorizedComponent /> },
    { 
      path: '/profile', 
      element: <ProtectedRoute element={<UserProfile />} isAuthRequired={true} />
    },
    { path: '*', element: <NotFoundPage /> }
  ];

  return useRoutes(routes);
};

export default Routes;