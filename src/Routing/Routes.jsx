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
import UnauthorizedComponent from '../Component/UnAuthorized/UnAuthorized';
import ChannelTransactionSteps from '../Component/Steps/Steps/ChannelSteps/ChannelSteps';
import BlogSection from '../Pages/Blogs/Blogs';
import UserProfile from '../Component/Profile/Profile';
import GrowYourChannel from '../Pages/GrowYourChannel/GrowYourChannel';
import AboutPage from '../Pages/About/About';
import Privacy from './Privacy';
import PaymentSuccessful from '../Component/Success/Success';
import Confirmation from '../Component/Success/Confirmation';
import Orders from '../Component/Orders/Orders';
import TransactionsPanel from '../Component/Profile/Transactions';
import MyChannels from '../Component/Profile/MyChannels';
import UploadChannel from '../Pages/SellerPanel/UploadChannel';
import PrivacyPolicy from '../ExternalPages/PrivacyPolicy';
import TermsAndConditions from '../ExternalPages/TermsAndConditions';
import RefundAndReturnPolicy from '../ExternalPages/RefundPolicy';
import ShippingAndCancellationPolicy from '../ExternalPages/Cancellation';
import BlogDetail from '../Pages/Blogs/BlogDetail';
import UserChat from '../Pages/Chat/UserChat';
import AdminChat from '../Pages/Admin/AdminChat';
import ProfileLayout from '../Component/Profile/ProfileLayout';
const ProtectedRoute = ({ element, isAuthRequired = false, isGuestRequired = false }) => {
  const token = localStorage.getItem('token');

  if (isAuthRequired && !token) {
    return <Navigate to="/login" replace />;
  }

  if (isGuestRequired && token) {
    return <Navigate to="/" replace />;
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
    { path: '/blogs/:id', element: <BlogDetail /> },
    { path: '/about', element: <AboutPage /> },
    { 
      path: '/transactions', 
      element: <ProtectedRoute element={<ProfileLayout><TransactionsPanel /></ProfileLayout>} isAuthRequired={true} /> 
    },

    { path: '/my-channels', element: <ProtectedRoute element={<ProfileLayout><MyChannels /></ProfileLayout>} isAuthRequired={true} /> },
    {
      path: '/upload-channel',
      element: <ProtectedRoute element={<UploadChannel />} isAuthRequired={true} />
    },
    {
      path: '/edit-channel/:id',
      element: <ProtectedRoute element={<UploadChannel />} isAuthRequired={true} />
    },

    {
      path: '/cart',
      element: <ProtectedRoute element={<CartPage />} isAuthRequired={true} />
    },
    {
      path: '/login',
      element: <ProtectedRoute element={<Login />} isGuestRequired={true} />
    },
    { path: '/orders', element: <ProtectedRoute element={<ProfileLayout><Orders /></ProfileLayout>} isAuthRequired={true} /> },
    {
      path: '/signup',
      element: <ProtectedRoute element={<Signup />} isGuestRequired={true} />
    },
    { path: '/channels', element: <ChannelList /> },
    { path: '/grow', element: <GrowYourChannel /> },
    {
      path: '/admin-dashboard',
      element: <ProtectedRoute element={<AdminDashboard />} isAuthRequired={true} />
    },
    { path: '/unauthorized', element: <UnauthorizedComponent /> },
    { 
      path: '/profile', 
      element: <ProtectedRoute element={<ProfileLayout><UserProfile /></ProfileLayout>} isAuthRequired={true} />
    },
    { 
      path: '/chat', 
      element: <ProtectedRoute element={<UserChat />} isAuthRequired={true} />
    },
    { 
      path: '/admin/chats', 
      element: <ProtectedRoute element={<AdminChat />} isAuthRequired={true} />
    },
    { path: '*', element: <NotFoundPage /> }
  ];

  return useRoutes(routes);
};

export default Routes;