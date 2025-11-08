import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';
import { FaCheckCircle, FaUsers, FaEye, FaChartLine, FaClock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Carousel from './Carousel';

const API_BASE_URL = api;

const ChannelCard = ({ channel }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const discount = channel.originalPrice ? Math.round((1 - parseFloat(channel.price) / parseFloat(channel.originalPrice)) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer min-w-[300px] mx-3 group"
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      }}
      onClick={() => navigate(`/channel/${channel?._id}`)}
    >
      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(248, 55, 88, 0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
        }}
      />

      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden">
        <motion.img
          src={channel.bannerUrl ? channel.bannerUrl : '/images/yt.png'}
          alt={channel.name}
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Gradient Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-4"
        >
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            className="px-6 py-2 bg-white/95 text-gray-900 rounded-full font-semibold text-sm shadow-xl hover:bg-white transition-colors"
          >
            View Details →
          </motion.button>
        </motion.div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {channel.status === 'unsold' && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              }}
            >
              <FaCheckCircle className="text-xs" />
              Premium
            </motion.span>
          )}
          {discount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, #F83758 0%, #ff6b6b 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(248, 55, 88, 0.4)',
              }}
            >
              🔥 -{discount}%
            </motion.span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Channel Name */}
        <h3 className="text-lg font-bold mb-3 text-gray-900 truncate group-hover:text-[#F83758] transition-colors">
          {channel.name}
        </h3>

        {/* Channel Category & Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
            {channel.category}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
            {channel.channelType}
          </span>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <FaUsers className="text-blue-500" />
              <span>Subs</span>
            </div>
            <span className="font-bold text-sm text-gray-900">
              {channel?.subscriberCount?.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <FaEye className="text-purple-500" />
              <span>Views</span>
            </div>
            <span className="font-bold text-sm text-gray-900">
              {(channel?.viewCount / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <FaClock className="text-green-500" />
              <span>Videos</span>
            </div>
            <span className="font-bold text-sm text-gray-900">
              {channel?.videoCount}
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div>
            {channel.originalPrice && parseFloat(channel.originalPrice) > parseFloat(channel.price) && (
              <p className="text-sm text-gray-400 line-through mb-1">
                ₹{parseFloat(channel.originalPrice).toLocaleString()}
              </p>
            )}
            <p className="text-2xl font-bold text-gray-900">
              ₹{parseFloat(channel.price ?? 0).toLocaleString()}
            </p>
          </div>
          
          {/* Status Badge */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: channel.status === 'approved' 
                ? 'rgba(16, 185, 129, 0.1)' 
                : channel.status === 'Sold' 
                ? 'rgba(239, 68, 68, 0.1)'
                : 'rgba(59, 130, 246, 0.1)',
              color: channel.status === 'approved' 
                ? '#10b981' 
                : channel.status === 'Sold' 
                ? '#ef4444'
                : '#3b82f6',
            }}
          >
            <FaCheckCircle className="text-xs" />
            {channel.status === 'approved' ? 'Available' : channel.status}
          </motion.div>
        </div>

        {/* Credibility Footer - Shows on Hover */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
          className="mt-4 pt-4 border-t border-gray-100 space-y-2"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Avg Views/Video</span>
            <span className="font-semibold text-gray-900">
              {channel?.averageViewsPerVideo?.toLocaleString()}
            </span>
          </div>
          {channel.monetized && (
            <div className="flex items-center gap-2 text-xs">
              <FaChartLine className="text-green-500" />
              <span className="text-green-600 font-medium">Monetized Channel</span>
            </div>
          )}
          {channel.recentViews > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Recent Views</span>
              <span className="font-semibold text-gray-900">
                {(channel.recentViews / 1000).toFixed(0)}K
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
        }}
        animate={{
          x: isHovered ? [-300, 300] : 0,
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};


const FeaturedListings = () => {
  const [featuredChannels, setFeaturedChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  const filters = ['All', 'Gaming', 'Finance', 'Animation', 'Entertainment', 'Facts', 'Music', 'News'];

  useEffect(() => {
    const fetchFeaturedChannels = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/channels/demanding`);
        console.log(response);
        
        setFeaturedChannels(response?.data);
        setFilteredChannels(response?.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch featured channels');
        setLoading(false);
      }
    };

    fetchFeaturedChannels();
  }, []);

  // Filter channels when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredChannels(featuredChannels);
    } else {
      const filtered = featuredChannels.filter(
        (channel) => channel.category === activeFilter
      );
      setFilteredChannels(filtered);
    }
  }, [activeFilter, featuredChannels]);

  const handleViewAllClick = () => {
    navigate('/channels');
  };

  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #fafbff 0%, #f9fafb 50%, #ffffff 100%)',
      }}
    >
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-red-100/40 to-transparent rounded-full blur-3xl" />

      <div className=" mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-4 px-6 py-2 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 24px rgba(248, 55, 88, 0.1)',
              border: '1px solid rgba(248, 55, 88, 0.1)',
            }}
          >
            <span className="text-sm font-semibold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              🔥 Trending Now
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Most Demanding Channels
            </span>
          </h2>
          
          {/* Accent Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 mx-auto mb-4 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #F83758, #ff6b6b, #ff9f40)',
            }}
          />

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Unmatched channels—superior performance and customer satisfaction in one.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filters.map((filter) => {
            const count = filter === 'All' 
              ? featuredChannels.length 
              : featuredChannels.filter(ch => ch.category === filter).length;
            
            return (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeFilter === filter
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={
                  activeFilter === filter
                    ? {
                        background: 'linear-gradient(135deg, #F83758 0%, #ff6b6b 100%)',
                        boxShadow: '0 4px 16px rgba(248, 55, 88, 0.3)',
                      }
                    : {
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                      }
                }
              >
                <span>{filter}</span>
                {count > 0 && (
                  <span 
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      activeFilter === filter 
                        ? 'bg-white/20' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Channels Carousel */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-6 overflow-hidden"
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl min-w-[300px] h-96"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(240, 240, 240, 0.8))',
                  }}
                />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-red-500 font-medium"
            >
              {error}
            </motion.div>
          ) : filteredChannels?.length > 0 ? (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Carousel className="p-8">
                {filteredChannels.map((channel) => (
                  <ChannelCard key={channel._id} channel={channel} />
                ))}
              </Carousel>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 py-12"
            >
              <div className="inline-flex flex-col items-center gap-4">
                <div className="text-6xl">🔍</div>
                <p className="text-lg font-medium text-gray-700">No channels found in "{activeFilter}"</p>
                <p className="text-sm text-gray-500">Try selecting a different category</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter('All')}
                  className="mt-4 px-6 py-2 rounded-full font-medium text-sm text-white"
                  style={{
                    background: 'linear-gradient(135deg, #F83758 0%, #ff6b6b 100%)',
                  }}
                >
                  View All Channels
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewAllClick}
            className="px-8 py-4 rounded-full font-semibold text-white shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #F83758 0%, #ff6b6b 100%)',
              boxShadow: '0 8px 24px rgba(248, 55, 88, 0.3)',
            }}
          >
            View All Channels →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedListings;
