import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tag, Button, message, Image, Progress } from 'antd';
import {
  UserOutlined, EyeOutlined, VideoCameraOutlined, WhatsAppOutlined, 
  ShoppingCartOutlined, CheckCircleFilled, GlobalOutlined, CalendarOutlined,
  WarningOutlined, DollarOutlined, SafetyOutlined, FireOutlined, ClockCircleOutlined,
  YoutubeOutlined, ThunderboltOutlined, RiseOutlined,
  TrophyOutlined, LineChartOutlined
} from '@ant-design/icons';
import axiosInstance, { api } from '../../API/api';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';

const DetailPage = ({ channel: initialChannel, refreshData }) => {
  const [channel, setChannel] = useState(initialChannel);
  const [isInCart, setIsInCart] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialChannel) {
      setChannel(initialChannel);
    }
  }, [initialChannel]);

  const checkCartStatus = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      return;
    }
    try {
      const response = await axiosInstance.get(`${api}/cart`);
      const cartItems = response.data.channels;
      setIsInCart(cartItems.some((item) => item._id === id));
    } catch (err) {
      console.error('Cart check failed:', err);
    }
  }, [id]);

  useEffect(() => {
    checkCartStatus();
  }, [checkCartStatus]);

  const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return { decoded, userId: decoded._id };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const handleMakeOffer = () => {
    const msg = encodeURIComponent(
      `Hello, I'm interested in buying the YouTube channel "${channel.name}" (ID: ${channel._id}). Can we discuss the details?`
    );
    const whatsappUrl = `https://wa.me/+919423523291?text=${msg}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = async () => {
    if (!localStorage.getItem('token')) {
      return navigate('/login');
    }
    try {
      if (isInCart) {
        await axiosInstance.delete(`${api}/cart/remove/${channel._id}`);
        setIsInCart(false);
        message.success(`${channel.name} removed from cart`);
      } else {
        await axiosInstance.post(`${api}/cart/add`, {
          channelId: channel._id,
          quantity: 1,
        });
        setIsInCart(true);
        message.success(`${channel.name} added to cart!`);
      }
    } catch (err) {
      message.error('Error updating cart');
    }
  };

  const handleBuyNow = async () => {
    if (!channel) {
        message.error('Channel data not available');
        return;
    }

    setPaymentLoading(true);

    try {
        const user = decodeToken();
        const paymentResponse = await axiosInstance.post(`${api}/create-order`, {
            amount: channel.price,
            cartItems: [{
                id: channel._id,
                name: channel.name,
                price: channel.price,
                quantity: 1
            }],
            user: user?.decoded
        });

        if (paymentResponse.data.success) {
            const { data } = paymentResponse.data;

            localStorage.setItem('currentTransaction', JSON.stringify({
                transactionId: data.transactionId,
                amount: channel.price,
                cartItems: [channel]
            }));

            if (data.data.instrumentResponse?.redirectInfo?.url) {
                window.location.href = data.data.instrumentResponse.redirectInfo.url;
        } else {
          message.error('No redirect URL found');
        }
      } else {
        message.error('Failed to create payment order');
        }
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Payment processing failed');
    } finally {
        setPaymentLoading(false);
    }
};

  if (!channel) return null;

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getAvatarGradient = (name) => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-red-500 to-red-600',
      'from-orange-500 to-orange-600',
      'from-yellow-500 to-yellow-600',
      'from-green-500 to-green-600',
      'from-teal-500 to-teal-600',
      'from-cyan-500 to-cyan-600',
      'from-indigo-500 to-indigo-600',
    ];
    const charCode = name?.charCodeAt(0) || 67;
    return gradients[charCode % gradients.length];
  };

  // Calculate engagement metrics
  const engagementRate = channel.subscriberCount > 0 
    ? ((channel.viewCount / channel.subscriberCount / channel.videoCount) * 100).toFixed(1)
    : 0;
  
  const avgViewsGrowth = channel.recentViews > channel.averageViewsPerVideo ? '+14' : '-5';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* FULL-WIDTH CHANNEL HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Channel Profile & Identity */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            {/* Large Avatar */}
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className={`w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center bg-gradient-to-br ${getAvatarGradient(channel.name)}`}>
                {channel.logoUrl || channel.avatar ? (
                  <img
                    src={channel.logoUrl || channel.avatar}
                    alt={channel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl md:text-6xl font-bold">
                    {channel.name?.charAt(0).toUpperCase() || 'C'}
                  </span>
                )}
              </div>
              {channel.monetized && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-green-400 to-green-600 rounded-full p-3 shadow-lg">
                  <DollarOutlined className="text-white text-2xl" />
                </div>
              )}
            </motion.div>

            {/* Channel Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 break-words">{channel.name}</h1>
                {channel.verified && (
                  <CheckCircleFilled className="text-blue-500 text-3xl" />
                )}
              </div>

              <p className="text-lg md:text-2xl text-gray-600 mb-4">
                {formatNumber(channel.subscriberCount)} Subscribers • {channel.videoCount} Videos
              </p>

              {/* YouTube Red Accent Line */}
              <div className="w-24 md:w-32 h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-full mx-auto md:mx-0 mb-6"></div>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Tag color="blue" className="text-sm font-semibold px-4 py-1.5 rounded-lg border-0">
                  <CheckCircleFilled className="mr-1" /> Verified Listing
                </Tag>
                <Tag 
                  color={channel.monetized ? 'green' : 'red'} 
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg border-0"
                >
                  {channel.monetized ? '💰 Monetized' : '❌ Not Monetized'}
                </Tag>
                {channel.organicGrowth && (
                  <Tag color="gold" className="text-sm font-semibold px-4 py-1.5 rounded-lg border-0">
                    <FireOutlined className="mr-1" /> Organic Growth
                  </Tag>
                )}
                <Tag color="purple" className="text-sm font-semibold px-4 py-1.5 rounded-lg border-0">
                  📁 {channel.category}
                </Tag>
              </div>
            </div>

            {/* Last Updated Badge */}
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-500 mb-2">Last Updated</div>
              <div className="text-base font-semibold text-gray-700">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Description */}
          {channel.description && (
            <div className="max-w-4xl mx-auto md:mx-0">
              <p className="text-gray-700 text-lg leading-relaxed text-center md:text-left">
                {channel.description}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* MAIN DASHBOARD CONTENT */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="space-y-8">
            {/* 📊 ANALYTICS DASHBOARD SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <LineChartOutlined className="text-blue-500" />
                  Channel Analytics
                </h2>
                <div className="text-sm text-gray-500">Real-time data</div>
              </div>

              {/* 3×2 Analytics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Card 1: Subscribers */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(59, 130, 246, 0.15)' }}
                  transition={{ duration: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="bg-blue-500 rounded-xl p-3 w-fit mb-4 shadow-lg">
                      <UserOutlined className="text-white text-2xl" />
                    </div>
                    <p className="text-sm text-blue-700 font-semibold mb-1">Total Subscribers</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {formatNumber(channel.subscriberCount)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <RiseOutlined />
                      <span>Active audience</span>
                    </div>
                  </div>
                </motion.div>

                {/* Card 2: Total Views */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(34, 197, 94, 0.15)' }}
                  transition={{ duration: 0.2 }}
                  className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="bg-green-500 rounded-xl p-3 w-fit mb-4 shadow-lg">
                      <EyeOutlined className="text-white text-2xl" />
                    </div>
                    <p className="text-sm text-green-700 font-semibold mb-1">Total Views</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {formatNumber(channel.viewCount)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <TrophyOutlined />
                      <span>Lifetime reach</span>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Total Videos */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(168, 85, 247, 0.15)' }}
                  transition={{ duration: 0.2 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="bg-purple-500 rounded-xl p-3 w-fit mb-4 shadow-lg">
                      <VideoCameraOutlined className="text-white text-2xl" />
                    </div>
                    <p className="text-sm text-purple-700 font-semibold mb-1">Total Videos</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {channel.videoCount}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <VideoCameraOutlined />
                      <span>Content library</span>
                    </div>
                  </div>
                </motion.div>

                {/* Card 4: Est. Earnings */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(251, 191, 36, 0.15)' }}
                  transition={{ duration: 0.2 }}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl p-6 border border-yellow-200 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/30 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="bg-yellow-500 rounded-xl p-3 w-fit mb-4 shadow-lg">
                      <DollarOutlined className="text-white text-2xl" />
                    </div>
                    <p className="text-sm text-yellow-700 font-semibold mb-1">Est. Monthly Earnings</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      ₹{formatNumber(channel.estimatedEarnings || 0)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-yellow-600">
                      <FireOutlined />
                      <span>Revenue potential</span>
                    </div>
                  </div>
                </motion.div>

                {/* Card 5: Avg Views/Video */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(107, 114, 128, 0.15)' }}
                  transition={{ duration: 0.2 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/30 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="bg-gray-500 rounded-xl p-3 w-fit mb-4 shadow-lg">
                      <EyeOutlined className="text-white text-2xl" />
                    </div>
                    <p className="text-sm text-gray-700 font-semibold mb-1">Avg. Views / Video</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {formatNumber(channel.averageViewsPerVideo)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <LineChartOutlined />
                      <span>Per content</span>
                    </div>
                  </div>
                </motion.div>

                {/* Card 6: Recent Views (28d) */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(59, 130, 246, 0.15)' }}
                  transition={{ duration: 0.2 }}
                  className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-2xl p-6 border border-cyan-200 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200/30 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="bg-cyan-500 rounded-xl p-3 w-fit mb-4 shadow-lg">
                      <ClockCircleOutlined className="text-white text-2xl" />
                    </div>
                    <p className="text-sm text-cyan-700 font-semibold mb-1">Recent Views (28 Days)</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {formatNumber(channel.recentViews)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-cyan-600">
                      <RiseOutlined />
                      <span>{avgViewsGrowth}% vs avg</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* 📈 PERFORMANCE OVERVIEW */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <LineChartOutlined className="text-blue-500" />
                  Performance Overview
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <Tag color="green" className="font-semibold">
                    <RiseOutlined /> {avgViewsGrowth}% growth
                  </Tag>
                </div>
              </div>

              {/* Performance Bars */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
                    <span className="text-sm font-bold text-blue-600">{engagementRate}%</span>
                  </div>
                  <Progress 
                    percent={parseFloat(engagementRate)} 
                    strokeColor={{
                      '0%': '#3b82f6',
                      '100%': '#8b5cf6',
                    }}
                    showInfo={false}
                    strokeWidth={12}
                    className="mb-1"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Content Consistency</span>
                    <span className="text-sm font-bold text-green-600">92%</span>
                  </div>
                  <Progress 
                    percent={92} 
                    strokeColor={{
                      '0%': '#10b981',
                      '100%': '#059669',
                    }}
                    showInfo={false}
                    strokeWidth={12}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Audience Retention</span>
                    <span className="text-sm font-bold text-purple-600">87%</span>
                  </div>
                  <Progress 
                    percent={87} 
                    strokeColor={{
                      '0%': '#a855f7',
                      '100%': '#7c3aed',
                    }}
                    showInfo={false}
                    strokeWidth={12}
                  />
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(channel.averageViewsPerVideo)}</p>
                  <p className="text-xs text-gray-500 mt-1">Avg. Views</p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(channel.recentViews)}</p>
                  <p className="text-xs text-gray-500 mt-1">Recent Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{channel.videoCount}</p>
                  <p className="text-xs text-gray-500 mt-1">Total Videos</p>
                </div>
              </div>
            </motion.div>

            {/* 📺 CHANNEL PREVIEW SECTION */}
            {channel.imageUrls && channel.imageUrls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <VideoCameraOutlined className="text-red-500 text-2xl" />
                  Channel Preview & Screenshots
                </h3>

                {/* Main Image Display */}
                <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg" style={{ height: '300px', }}>
                  <Image
                    src={channel.imageUrls[currentImageIndex]}
                    alt={`Preview ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                    preview={{
                      src: channel.imageUrls[currentImageIndex]
                    }}
                  />
                  
                  {/* Image Counter Badge */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {channel.imageUrls.length}
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {channel.imageUrls.map((img, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden cursor-pointer border-3 transition-all ${
                        currentImageIndex === index
                          ? 'border-blue-500 shadow-xl ring-2 ring-blue-200'
                          : 'border-gray-300 opacity-60 hover:opacity-100 hover:border-blue-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* YouTube Link Button */}
                {channel.customUrl && (
                  <a
                    href={channel.customUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block"
                  >
                    <Button
                      type="primary"
                      size="large"
                      icon={<YoutubeOutlined />}
                      className="w-full font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
                        border: 'none',
                        height: '48px'
                      }}
                    >
                      🎥 View Full Channel on YouTube
                    </Button>
                  </a>
                )}
              </motion.div>
            )}

            {/* 📋 CHANNEL DETAILS PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <GlobalOutlined className="text-blue-500" />
                Channel Information
              </h3>
              
              <div className="space-y-4">
                {/* Joined Date */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <CalendarOutlined className="text-blue-600 text-lg" />
                    </div>
                    <span className="text-gray-700 font-medium">Joined Date</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {new Date(channel.joinedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Country */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-lg p-2">
                      <GlobalOutlined className="text-green-600 text-lg" />
                    </div>
                    <span className="text-gray-700 font-medium">Country</span>
                  </div>
                  <span className="font-bold text-gray-900">{channel.country}</span>
                </div>

                {/* Channel Type */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 rounded-lg p-2">
                      <VideoCameraOutlined className="text-purple-600 text-lg" />
                    </div>
                    <span className="text-gray-700 font-medium">Channel Type</span>
                  </div>
                  <span className="font-bold text-gray-900">{channel.channelType}</span>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-100 rounded-lg p-2">
                      <GlobalOutlined className="text-cyan-600 text-lg" />
                    </div>
                    <span className="text-gray-700 font-medium">Language</span>
                  </div>
                  <span className="font-bold text-gray-900">{channel.my_language}</span>
                </div>

                {/* Copyright Strikes */}
                <div className="flex items-center justify-between py-3 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${channel.copyrightStrike === '0' ? 'bg-green-100' : 'bg-red-100'}`}>
                      <WarningOutlined className={`text-lg ${channel.copyrightStrike === '0' ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <span className="text-gray-700 font-medium">Copyright Strikes</span>
                  </div>
                  <Tag 
                    color={channel.copyrightStrike === '0' ? 'green' : 'red'} 
                    className="font-bold text-base px-4 py-1 rounded-lg"
                  >
                    {channel.copyrightStrike || 0}
                  </Tag>
                </div>
              </div>
            </motion.div>

          {/* PURCHASE PANEL - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
              {/* Main Purchase Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 relative">
                {/* Decorative gradient background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 -mr-32 -mt-32"></div>
                
                <div className="relative">
                  {/* Price Section */}
                  <div className="mb-8 text-center">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Asking Price
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ₹{parseInt(channel.price || 0).toLocaleString()}
                      </span>
                    </div>
                    <Tag 
                      color="blue" 
                      className="text-sm font-semibold px-4 py-1.5 border-0"
                      icon={<CheckCircleFilled />}
                    >
                      Verified Listing
                    </Tag>
                  </div>

                  {/* Quick Stats */}
                  <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center gap-2">
                          <UserOutlined className="text-blue-500" />
                          Subscribers
                        </span>
                        <span className="font-bold text-gray-900">{formatNumber(channel.subscriberCount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center gap-2">
                          <EyeOutlined className="text-green-500" />
                          Total Views
                        </span>
                        <span className="font-bold text-gray-900">{formatNumber(channel.viewCount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center gap-2">
                          <DollarOutlined className="text-yellow-500" />
                          Monthly Earnings
                        </span>
                        <span className="font-bold text-gray-900">₹{formatNumber(channel.estimatedEarnings || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      type="primary"
                      size="large"
                      icon={<WhatsAppOutlined />}
                      onClick={handleMakeOffer}
                      className="w-full h-12 sm:h-14 font-semibold sm:font-bold text-sm sm:text-base whitespace-normal break-words"
                      style={{
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                      }}
                    >
                      💬 Make an Offer via WhatsApp
                    </Button>

                    <Button
                      type={isInCart ? 'default' : 'primary'}
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddToCart}
                      className="w-full h-12 sm:h-14 font-semibold sm:font-bold text-sm sm:text-base whitespace-normal break-words"
                      style={
                        !isInCart
                          ? {
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              border: 'none',
                              color: 'white',
                              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            }
                          : {
                              borderColor: '#d1d5db',
                              color: '#6b7280'
                            }
                      }
                    >
                      {isInCart ? '✓ In Cart - Remove' : '🛒 Add to Cart'}
                    </Button>

                    <Button
                      type="primary"
                      size="large"
                      icon={<ThunderboltOutlined />}
                      onClick={handleBuyNow}
                      loading={paymentLoading}
                      className="w-full h-14 sm:h-16 font-bold sm:font-extrabold text-base sm:text-lg whitespace-normal break-words"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        border: 'none',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                      }}
                    >
                      ⚡ Buy Now - ₹{parseInt(channel.price || 0).toLocaleString()}
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <SafetyOutlined className="text-green-500 text-lg" />
                      <span className="font-medium">🔒 Secure Payment via Razorpay</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <CheckCircleFilled className="text-blue-500" />
                      <span className="font-medium">✅ Verified Channel Transfer</span>
                    </div>
                  </div>

                  {/* Social Proof Badge */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <FireOutlined className="text-orange-500" />
                      <span className="font-semibold text-gray-700">
                        🔥 12 buyers viewed today
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrophyOutlined className="text-yellow-500" />
                  Why This Channel?
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {channel.monetized && (
                    <li className="flex items-center gap-2">
                      <CheckCircleFilled className="text-green-500" />
                      <span>Fully Monetized & Revenue Ready</span>
                    </li>
                  )}
                  {channel.organicGrowth && (
                    <li className="flex items-center gap-2">
                      <CheckCircleFilled className="text-blue-500" />
                      <span>Organic Growth - No Fake Engagement</span>
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <CheckCircleFilled className="text-purple-500" />
                    <span>Active Audience & High Engagement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleFilled className="text-orange-500" />
                    <span>Complete Ownership Transfer</span>
                  </li>
                </ul>
              </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
