import React, { useState, useEffect } from "react";
import { Tag, Tooltip, message } from "antd";
import { EyeOutlined, UserOutlined, YoutubeOutlined, CheckCircleFilled, FireOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../API/api";

const ChannelCard = ({ channel, isCartView = false, onRemove }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const channelId = channel?._id;

  useEffect(() => {
    const fetchCartStatus = async () => {
      try {
        const response = await axiosInstance.get('/cart');
        const items = response?.data?.channels || [];
        setIsInCart(items.some(item => item?._id === channelId));
      } catch (error) {
        console.error('Failed to check cart status', error);
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

    if (isCartView && onRemove) {
      onRemove(channel);
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
      navigate('/user/cart');
    } catch (error) {
      console.error('Failed to add channel to cart', error);
      message.error('Unable to add channel to cart right now.');
    } finally {
      setCartLoading(false);
    }
  };

  if (!channel) return null;

  const handleClick = () => {
    const slug = channel.customUrl || channel._id;
    navigate(`/channel/${slug}`);
  };

  const banner = channel.dashboardImage || channel.logoUrl || channel.bannerUrl || channel.imageUrls?.[0] || '/images/yt.png';
  const avatar = channel.avatar || channel.logoUrl || channel.imageUrls?.[0];

  const hasDiscount = channel.discount && channel.discount > 0;
  const isPremium = channel.monetized && (channel.subscriberCount > 100000 || channel.mostDemanding);

  return (
    <motion.div
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-card overflow-hidden bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] cursor-pointer group border border-white/40 dark:border-white/10"
      style={{
        boxShadow: isHovered 
          ? '0 30px 70px rgba(120, 90, 255, 0.25)' 
          : '0 15px 40px rgba(120, 90, 255, 0.15)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Banner Section with Interactive Overlay */}
      <div className="relative h-32 overflow-hidden">
        <motion.img
          src={banner}
          alt={channel.name}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        {/* Interactive Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-[#6E4BFF]/90 to-transparent flex items-center justify-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-center"
          >
            <p className="text-base font-bold mb-1">View Details</p>
            <p className="text-[10px] opacity-90">→</p>
          </motion.div>
        </motion.div>

        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isPremium && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Tag
                icon={<FireOutlined />}
                color="gold"
                className="font-semibold shadow-lg"
              >
                Premium
              </Tag>
            </motion.div>
          )}
          {hasDiscount && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <Tag color="red" className="font-semibold shadow-lg">
                {channel.discount}% OFF
              </Tag>
            </motion.div>
          )}
        </div>

        {/* Category & Language Overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-xs text-white font-bold line-clamp-1 drop-shadow-lg">
            {channel.category || "N/A"} • {channel.channelType || "Standard"}
          </h3>
          <p className="text-[10px] text-gray-200 drop-shadow">
            {channel.my_language || "English"} • {channel.country?.trim() || "Global"}
          </p>
        </div>
      </div>

      {/* Channel Info */}
      <div className="p-2.5">
        {/* Avatar & Info Row */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <img
              src={avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full border-2 border-white/40 dark:border-white/10 object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-[#312E4A] dark:text-white line-clamp-1">
                {channel.name}
              </p>
              {channel.verified && (
                <CheckCircleFilled className="text-blue-500 text-xs flex-shrink-0" />
              )}
            </div>
            {channel.monetized && (
              <Tag
                color="green"
                className="rounded text-[10px] py-0 px-1 mt-0.5 border-none bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              >
                ✓ Monetized
              </Tag>
            )}
          </div>
        </div>

        {/* Stats Grid with Icons */}
        <div 
          className="grid grid-cols-3 gap-1 mb-2 px-2 py-1.5 rounded-card bg-white/30 dark:bg-[#110C1F]/30 backdrop-blur-md border border-white/20 dark:border-white/10"
        >
          <Tooltip title="Total Subscribers">
            <div className="text-center">
              <UserOutlined className="text-[#6E4BFF] text-[10px] mb-0.5" />
              <p className="text-[11px] font-bold text-[#312E4A] dark:text-white">
                {(channel.subscriberCount || 0) >= 1000 
                  ? `${(channel.subscriberCount / 1000).toFixed(1)}K` 
                  : channel.subscriberCount || 0}
              </p>
              <p className="text-[8px] text-[#6F6B8A] dark:text-[#C6B4FF] font-medium uppercase tracking-wider">Subscribers</p>
            </div>
          </Tooltip>
          <Tooltip title="Total Views">
            <div className="text-center border-l border-r border-white/20 dark:border-white/10">
              <EyeOutlined className="text-green-500 text-[10px] mb-0.5" />
              <p className="text-[11px] font-bold text-[#312E4A] dark:text-white">
                {(channel.viewCount || 0) >= 1000000 
                  ? `${(channel.viewCount / 1000000).toFixed(1)}M` 
                  : (channel.viewCount || 0) >= 1000 
                  ? `${(channel.viewCount / 1000).toFixed(1)}K` 
                  : channel.viewCount || 0}
              </p>
              <p className="text-[8px] text-[#6F6B8A] dark:text-[#C6B4FF] font-medium uppercase tracking-wider">Views</p>
            </div>
          </Tooltip>
          <Tooltip title="Videos Published">
            <div className="text-center">
              <VideoCameraOutlined className="text-purple-500 text-[10px] mb-0.5" />
              <p className="text-[11px] font-bold text-[#312E4A] dark:text-white">
                {channel.videoCount || 0}
              </p>
              <p className="text-[8px] text-[#6F6B8A] dark:text-[#C6B4FF] font-medium uppercase tracking-wider">Videos</p>
            </div>
          </Tooltip>
        </div>

        {/* Info Strip with Credibility */}
        <div className="flex items-center justify-between text-[10px] text-[#6F6B8A] dark:text-[#C6B4FF] mb-2 pb-2 border-b border-white/20 dark:border-white/10">
          <div className="flex items-center gap-1">
            <span className="text-[#6F6B8A] dark:text-[#C6B4FF]">Est. Earnings:</span>
            <span className="font-bold text-green-600">
              ₹{(channel.estimatedEarnings || 0).toLocaleString()}/mo
            </span>
          </div>
          {channel.recentViews && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <span>👁</span>
              <span>{channel.recentViews > 100 ? `${channel.recentViews} views` : 'Recently viewed'}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] text-[#6F6B8A] dark:text-[#C6B4FF] font-medium mb-0">Asking Price</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-lg font-bold text-[#312E4A] dark:text-white">
                ₹{parseInt(channel.price || 0).toLocaleString()}
              </p>
              {hasDiscount && (
                <p className="text-xs text-gray-400 line-through">
                  ₹{parseInt(channel.price / (1 - channel.discount / 100)).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <Tooltip title="View on YouTube">
            <motion.a
              href={(() => {
                const url = channel.customUrl || '';
                if (url.startsWith('http')) return url;
                if (url.startsWith('@') || url.startsWith('UC')) return `https://www.youtube.com/${url}`;
                if (url) return `https://www.youtube.com/@${url}`;
                return `https://www.youtube.com/results?search_query=${encodeURIComponent(channel.name)}`;
              })()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-base shadow-lg transition-colors"
            >
              <YoutubeOutlined />
            </motion.a>
          </Tooltip>
        </div>

        <div className="flex gap-2 mt-2.5">
          <motion.button
            whileHover={{ scale: (isInCart && !isCartView) ? 1 : 1.03, y: -3 }}
            whileTap={{ scale: 0.98 }}
            disabled={cartLoading}
            onClick={handleAddToCart}
            className={`flex-1 text-center py-1.5 rounded-button font-semibold text-white text-[11px] ${cartLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            style={{
              background: (isInCart && !isCartView)
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #F83758 0%, #ff6b6b 100%)',
              boxShadow: '0 8px 16px rgba(248, 55, 88, 0.2)',
            }}
          >
            {isCartView ? 'Remove from Cart' : (isInCart ? 'In Cart' : cartLoading ? 'Adding...' : 'Add to Cart')}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              if (!localStorage.getItem('token')) {
                message.info('Please login to request an Escrow Deal.');
                navigate('/login');
                return;
              }
              navigate('/user/chat', { state: { requestDeal: channel } });
            }}
            className="flex-1 text-center py-1.5 rounded-button font-semibold text-white text-[11px]"
            style={{
              background: 'linear-gradient(135deg, #7B61FF 0%, #B88DFF 100%)',
              boxShadow: '0 8px 16px rgba(120, 90, 255, 0.25)',
            }}
          >
            Request Deal
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
};

export const ChannelCardSkeleton = () => (
  <div 
    className="relative rounded-card overflow-hidden bg-white/20 dark:bg-[#110C1F]/20 backdrop-blur-[18px] border border-white/20 dark:border-white/5 animate-pulse min-w-[300px]"
    style={{ minHeight: '420px' }}
  >
    <div className="relative h-32 overflow-hidden bg-gray-300 dark:bg-gray-700/50"></div>
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700/50 shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700/50 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700/50 rounded w-1/4"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800/50 rounded-lg"></div>
        ))}
      </div>
      <div className="flex justify-between items-end mb-6">
        <div className="space-y-2 w-1/2">
          <div className="h-3 bg-gray-200 dark:bg-gray-800/50 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700/50 rounded w-3/4"></div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700/50"></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-9 bg-gray-300 dark:bg-gray-700/50 rounded-button"></div>
        <div className="flex-1 h-9 bg-gray-300 dark:bg-gray-700/50 rounded-button"></div>
      </div>
    </div>
  </div>
);

export default ChannelCard;
