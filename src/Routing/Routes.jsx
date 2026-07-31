import React, { Suspense, lazy } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

import HomePage from '../Pages/LandingPage/HomePage';

const Stats = lazy(() => import('../Component/Stats/Stats'));
const FeaturedListings = lazy(() => import('../Component/Feature/Feature'));
const DetailPageWrapper = lazy(() => import('../Component/Channel/DetailPageWrapper'));
const CartPage = lazy(() => import('../Component/Cart/Cart'));
const NotFoundPage = lazy(() => import('../Component/PageNotFound/PageNotFound'));
const Login = lazy(() => import('../Pages/Seller/Login'));
const Signup = lazy(() => import('../Pages/Seller/SignUp'));
const ChannelList = lazy(() => import('../Pages/Channels/Channels'));
const AdminDashboard = lazy(() => import('../Pages/Admin/AdminDashboard'));
const UnauthorizedComponent = lazy(() => import('../Component/UnAuthorized/UnAuthorized'));
const ChannelTransactionSteps = lazy(() => import('../Component/Steps/Steps/ChannelSteps/ChannelSteps'));
const BlogSection = lazy(() => import('../Pages/Blogs/Blogs'));
const UserProfile = lazy(() => import('../Component/Profile/Profile'));
const PublicUserProfile = lazy(() => import('../Pages/Profile/PublicUserProfile'));
const GrowYourChannel = lazy(() => import('../Pages/GrowYourChannel/GrowYourChannel'));
const AboutPage = lazy(() => import('../Pages/About/About'));
const ContactPage = lazy(() => import('../Pages/Contact/Contact'));
const Privacy = lazy(() => import('./Privacy'));
const PaymentSuccessful = lazy(() => import('../Component/Success/Success'));
const Confirmation = lazy(() => import('../Component/Success/Confirmation'));
const Orders = lazy(() => import('../Component/Orders/Orders'));
const TransactionsPanel = lazy(() => import('../Component/Profile/Transactions'));
const MyChannels = lazy(() => import('../Component/Profile/MyChannels'));
const UploadChannel = lazy(() => import('../Pages/SellerPanel/UploadChannel'));
const PrivacyPolicy = lazy(() => import('../ExternalPages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('../ExternalPages/TermsAndConditions'));
const RefundAndReturnPolicy = lazy(() => import('../ExternalPages/RefundPolicy'));
const ShippingAndCancellationPolicy = lazy(() => import('../ExternalPages/Cancellation'));
const BlogDetail = lazy(() => import('../Pages/Blogs/BlogDetail'));
const UserChat = lazy(() => import('../Pages/Chat/UserChat'));
const AdminChat = lazy(() => import('../Pages/Admin/AdminChat'));
const ProfileLayout = lazy(() => import('../Component/Profile/ProfileLayout'));
const ServicesPage = lazy(() => import('../Pages/Services/ServicesPage'));
const ServiceDetail = lazy(() => import('../Pages/Services/ServiceDetail'));
const ToolsHub = lazy(() => import('../Pages/Tools/ToolsHub'));
const ToolDetail = lazy(() => import('../Pages/Tools/ToolDetail'));

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
    { path: '/channel/:username', element: <DetailPageWrapper /> },
    { path: '/how-to', element: <ChannelTransactionSteps /> },
    { path: '/blogs', element: <BlogSection /> },
    { path: '/blogs/:id', element: <BlogDetail /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/contact', element: <ContactPage /> },
    { 
      path: '/user/transactions', 
      element: <ProtectedRoute element={<ProfileLayout><TransactionsPanel /></ProfileLayout>} isAuthRequired={true} /> 
    },

    { path: '/user/my-channels', element: <ProtectedRoute element={<ProfileLayout><MyChannels /></ProfileLayout>} isAuthRequired={true} /> },
    {
      path: '/user/upload-channel',
      element: <ProtectedRoute element={<UploadChannel />} isAuthRequired={true} />
    },
    {
      path: '/edit-channel/:id',
      element: <ProtectedRoute element={<UploadChannel />} isAuthRequired={true} />
    },

    {
      path: '/user/cart',
      element: <ProtectedRoute element={<CartPage />} isAuthRequired={true} />
    },
    {
      path: '/login',
      element: <ProtectedRoute element={<Login />} isGuestRequired={true} />
    },
    { path: '/user/orders', element: <ProtectedRoute element={<ProfileLayout><Orders /></ProfileLayout>} isAuthRequired={true} /> },
    {
      path: '/signup',
      element: <ProtectedRoute element={<Signup />} isGuestRequired={true} />
    },
    { path: '/channels', element: <ChannelList /> },
    { path: '/grow', element: <GrowYourChannel /> },
    {
      path: '/admin/dashboard',
      element: <ProtectedRoute element={<AdminDashboard />} isAuthRequired={true} />
    },
    { path: '/unauthorized', element: <UnauthorizedComponent /> },
    { 
      path: '/user/profile', 
      element: <ProtectedRoute element={<ProfileLayout><UserProfile /></ProfileLayout>} isAuthRequired={true} />
    },
    { path: '/userprofile/:username', element: <PublicUserProfile /> },
    { 
      path: '/user/chat', 
      element: <ProtectedRoute element={<UserChat />} isAuthRequired={true} />
    },
    { 
      path: '/admin/chats', 
      element: <ProtectedRoute element={<AdminChat />} isAuthRequired={true} />
    },
    { path: '/services', element: <ServicesPage /> },
    { path: '/services/:slug', element: <ServiceDetail /> },
    { path: '/tools', element: <ToolsHub /> },
    { path: '/tools/:toolSlug', element: <ToolDetail /> },
    { path: '*', element: <NotFoundPage /> }
  ];

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>}>
      {useRoutes(routes)}
    </Suspense>
  );
};

export default Routes;