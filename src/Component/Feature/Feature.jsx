import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { api, cachedGet, apiCache } from '../../API/api';
import { message } from 'antd';
import { FaCheckCircle, FaUsers, FaEye, FaChartLine, FaClock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Carousel from './Carousel';

const API_BASE_URL = api;

export const ChannelCard = ({ channel }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const channelId = channel?._id;
  const heroImage = channel?.logoUrl || channel?.bannerUrl || channel?.imageUrls?.[0] || '/images/yt.png';

  useEffect(() => {
    const fetchCartStatus = async () => {
      try {
        const response = await axiosInstance.get('/cart');
        const cartChannels = response?.data?.channels || [];
        setIsInCart(cartChannels.some(item => item?._id === channelId));
      } catch (error) {
        console.error('Failed to fetch cart status', error);
      }
    };

    if (localStorage.getItem('token') && channelId) {
      fetchCartStatus();
    } else {
      setIsInCart(false);
    }
  }, [channelId]);

  const handleAddToCart = async (event) => {
    event.stopPropagation();

    if (!localStorage.getItem('token')) {
      message.info('Please login to add channels to your cart.');
      navigate('/login');
      return;
    }

    if (isInCart) {
      navigate('/user/cart');
      return;
    }

    try {
      setCartLoading(true);
      await axiosInstance.post('/cart/add', {
        channelId,
        quantity: 1,
      });
      setIsInCart(true);
      message.success('Channel added to cart');
    } catch (error) {
      console.error('Failed to add channel to cart', error);
      message.error('Unable to add channel to cart right now.');
    } finally {
      setCartLoading(false);
    }
  };

  const discount = channel.originalPrice ? Math.round((1 - parseFloat(channel.price) / parseFloat(channel.originalPrice)) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className="relative rounded-card overflow-hidden cursor-pointer min-w-[300px] mx-3 group border border-white/40 dark:border-white/10 bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] shadow-card transition-all duration-300"
      style={{
        minHeight: '540px',
      }}
      onClick={() => navigate(`/channel/${channel?._id}`)}
    >
      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, var(--glow-hero) 0%, transparent 70%)',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
        }}
      />

      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden">
        <motion.img
          src={heroImage}
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
                background: 'var(--btn-gradient)',
                color: 'white',
                boxShadow: 'var(--purple-glow)',
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
        <h3 className="text-lg font-bold mb-3 text-text-primary truncate group-hover:text-purple-secondary transition-colors">
          {channel.name}
        </h3>

        {/* Channel Category & Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-primary/10 text-purple-primary">
            {channel.category}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-secondary/10 text-purple-secondary">
            {channel.channelType}
          </span>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-border-color/20">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 text-xs text-text-secondary mb-1">
              <FaUsers className="text-purple-primary" />
              <span>Subs</span>
            </div>
            <span className="font-bold text-sm text-text-primary">
              {channel?.subscriberCount?.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 text-xs text-text-secondary mb-1">
              <FaEye className="text-purple-secondary" />
              <span>Views</span>
            </div>
            <span className="font-bold text-sm text-text-primary">
              {(channel?.viewCount / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 text-xs text-text-secondary mb-1">
              <FaClock className="text-accent-pink" />
              <span>Videos</span>
            </div>
            <span className="font-bold text-sm text-text-primary">
              {channel?.videoCount}
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div>
            {channel.originalPrice && parseFloat(channel.originalPrice) > parseFloat(channel.price) && (
              <p className="text-sm text-text-muted line-through mb-1">
                ₹{parseFloat(channel.originalPrice).toLocaleString()}
              </p>
            )}
            <p className="text-2xl font-bold text-text-primary">
              ₹{parseFloat(channel.price ?? 0).toLocaleString()}
            </p>
          </div>
          
          {/* Status Badge */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: channel.status === 'approved' 
                ? 'rgba(34, 197, 94, 0.15)' 
                : channel.status === 'Sold' 
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(59, 130, 246, 0.15)',
              color: channel.status === 'approved' 
                ? '#22c55e' 
                : channel.status === 'Sold' 
                ? '#ef4444'
                : '#3b82f6',
            }}
          >
            <FaCheckCircle className="text-xs" />
            {channel.status === 'approved' ? 'Available' : channel.status}
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: isInCart ? 1 : 1.03 }}
          whileTap={{ scale: 0.98 }}
          disabled={cartLoading}
          onClick={handleAddToCart}
          className={`mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white shadow-lg ${cartLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
          style={{
            background: isInCart
              ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
              : 'var(--btn-gradient)',
            boxShadow: isInCart
              ? '0 10px 20px rgba(34, 197, 94, 0.25)'
              : 'var(--purple-glow)',
          }}
        >
          {isInCart ? 'Go to Cart' : cartLoading ? 'Adding...' : 'Add to Cart'}
        </motion.button>

        {/* Credibility Footer - Shows on Hover */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
          className="mt-4 pt-4 border-t border-border-color/20 space-y-2"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Avg Views/Video</span>
            <span className="font-semibold text-text-primary">
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
              <span className="text-text-secondary">Recent Views</span>
              <span className="font-semibold text-text-primary">
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
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
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

const DEMANDING_URL = `${API_BASE_URL}/channels/demanding`;

const FeaturedListings = () => {
  const [featuredChannels, setFeaturedChannels] = useState(() => {
    const cached = apiCache.get(DEMANDING_URL);
    return cached?.data || [];
  });
  const [filteredChannels, setFilteredChannels] = useState(() => {
    const cached = apiCache.get(DEMANDING_URL);
    return cached?.data || [];
  });
  const [loading, setLoading] = useState(() => !apiCache.has(DEMANDING_URL));
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  const filters = ['All', 'Gaming', 'Finance', 'Animation', 'Entertainment', 'Facts', 'Music', 'News'];

  useEffect(() => {
    const fetchFeaturedChannels = async () => {
      try {
        const response = await cachedGet(`${API_BASE_URL}/channels/demanding`);
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
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-transparent text-text-primary transition-all duration-300"
    >
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-accent-pink/10 to-transparent rounded-full blur-3xl" />

      <div className="mx-auto relative z-10">
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-4 border backdrop-blur-[18px] shadow-sm"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderColor: 'rgba(16, 185, 129, 0.2)',
            }}
          >
            <span style={{ color: '#10B981' }}>
              🔥 Trending Now
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl font-bold mb-3 text-text-primary">
            Most Demanding Channels
          </h2>
          
          {/* Accent Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 mx-auto mb-4 rounded-full"
            style={{
              background: 'var(--btn-gradient)',
            }}
          />

          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
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
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                style={
                  activeFilter === filter
                    ? {
                        background: 'var(--btn-gradient)',
                        boxShadow: 'var(--purple-glow)',
                      }
                    : {
                        background: 'var(--bg-glass)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }
                }
              >
                <span>{filter}</span>
                {count > 0 && (
                  <span 
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      activeFilter === filter 
                        ? 'bg-white/25 text-white' 
                        : 'bg-bg-secondary text-text-secondary'
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
                <div key={i} className="relative rounded-card overflow-hidden bg-white/20 dark:bg-[#110C1F]/20 backdrop-blur-[18px] border border-white/20 dark:border-white/5 animate-pulse min-w-[300px] mx-3" style={{ minHeight: '540px' }}>
                  <div className="relative h-48 bg-gray-300 dark:bg-gray-700/50"></div>
                  <div className="p-5">
                    <div className="h-5 bg-gray-300 dark:bg-gray-700/50 rounded w-3/4 mb-3"></div>
                    <div className="flex gap-2 mb-3">
                      <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700/50 rounded-full"></div>
                      <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700/50 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700/50">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="flex flex-col gap-1">
                          <div className="h-3 w-10 bg-gray-300 dark:bg-gray-700/50 rounded"></div>
                          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700/50 rounded"></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700/50 rounded"></div>
                      <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700/50 rounded-full"></div>
                    </div>
                    <div className="h-12 w-full bg-gray-300 dark:bg-gray-700/50 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-error font-medium"
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
              className="text-center py-12"
            >
              <div className="inline-flex flex-col items-center gap-4">
                <div className="text-6xl">🔍</div>
                <p className="text-lg font-medium text-text-primary">No channels found in "{activeFilter}"</p>
                <p className="text-sm text-text-muted">Try selecting a different category</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter('All')}
                  className="mt-4 px-6 py-2 rounded-full font-medium text-sm text-white"
                  style={{
                    background: 'var(--btn-gradient)',
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
              background: 'var(--btn-gradient)',
              boxShadow: 'var(--purple-glow)',
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
