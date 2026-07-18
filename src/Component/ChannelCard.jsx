import React, { useState, useEffect } from "react";
import { Tag, Tooltip, Badge, message } from "antd";
import { EyeOutlined, UserOutlined, DollarOutlined, YoutubeOutlined, CheckCircleFilled, FireOutlined, VideoCameraOutlined } from "@ant-design/icons";
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

  const banner = channel.logoUrl || channel.bannerUrl || channel.imageUrls?.[0] || '/images/yt.png';
  const avatar = channel.avatar || channel.logoUrl || channel.imageUrls?.[0];

  const hasDiscount = channel.discount && channel.discount > 0;
  const isPremium = channel.monetized && (channel.subscriberCount > 100000 || channel.mostDemanding);

  return (
    <motion.div
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 cursor-pointer group border border-transparent dark:border-gray-700"
      style={{
        boxShadow: isHovered 
          ? '0 20px 40px rgba(37, 99, 235, 0.15), 0 0 0 2px rgba(37, 99, 235, 0.1)' 
          : '0 4px 24px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Banner Section with Interactive Overlay */}
      <div className="relative h-20 overflow-hidden">
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
          className="absolute inset-0 bg-gradient-to-t from-blue-600/90 to-transparent flex items-center justify-center"
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

        {/* Channel Name Overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-start gap-2">
            <h3 className="text-base text-white font-bold line-clamp-1 flex-1 drop-shadow-lg">
              {channel.name}
            </h3>
            {channel.verified && (
              <CheckCircleFilled className="text-blue-400 text-base flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-[10px] text-gray-200 drop-shadow">
            {channel.category || "N/A"} • {channel.channelType || "Standard"}
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
              className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
            />
            {channel.monetized && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <DollarOutlined className="text-white text-[10px]" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {channel.my_language || "English"} • {channel.country?.trim() || "Global"}
              </p>
            </div>
            <Tag
              color={channel.monetized ? "green" : "default"}
              className="rounded text-[10px] py-0 px-1 mt-0.5 border-none bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            >
              {channel.monetized ? "✓ Monetized" : "Not Monetized"}
            </Tag>
          </div>
        </div>

        {/* Stats Grid with Icons */}
        <div 
          className="grid grid-cols-3 gap-1 mb-2 px-2 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-700/50"
        >
          <Tooltip title="Total Subscribers">
            <div className="text-center">
              <UserOutlined className="text-blue-500 text-[10px] mb-0.5" />
              <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">
                {(channel.subscriberCount || 0) >= 1000 
                  ? `${(channel.subscriberCount / 1000).toFixed(1)}K` 
                  : channel.subscriberCount || 0}
              </p>
              <p className="text-[8px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Subscribers</p>
            </div>
          </Tooltip>
          <Tooltip title="Total Views">
            <div className="text-center border-l border-r border-gray-300 dark:border-gray-600">
              <EyeOutlined className="text-green-500 text-[10px] mb-0.5" />
              <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">
                {(channel.viewCount || 0) >= 1000000 
                  ? `${(channel.viewCount / 1000000).toFixed(1)}M` 
                  : (channel.viewCount || 0) >= 1000 
                  ? `${(channel.viewCount / 1000).toFixed(1)}K` 
                  : channel.viewCount || 0}
              </p>
              <p className="text-[8px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Views</p>
            </div>
          </Tooltip>
          <Tooltip title="Videos Published">
            <div className="text-center">
              <VideoCameraOutlined className="text-purple-500 text-[10px] mb-0.5" />
              <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">
                {channel.videoCount || 0}
              </p>
              <p className="text-[8px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Videos</p>
            </div>
          </Tooltip>
        </div>

        {/* Info Strip with Credibility */}
        <div className="flex items-center justify-between text-[10px] text-gray-600 dark:text-gray-400 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <span className="text-gray-500 dark:text-gray-400">Est. Earnings:</span>
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
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0">Asking Price</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
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
            whileHover={{ scale: (isInCart && !isCartView) ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={cartLoading}
            onClick={handleAddToCart}
            className={`flex-1 text-center py-1.5 rounded-xl font-semibold text-white text-[11px] ${cartLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
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
            whileHover={{ scale: 1.02 }}
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
            className="flex-1 text-center py-1.5 rounded-xl font-semibold text-white text-[11px]"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
              boxShadow: '0 8px 16px rgba(124, 58, 237, 0.2)',
            }}
          >
            Request Deal
          </motion.button>
        </div>

        {/* Hot Deal Pulsing Badge */}
        {channel.mostDemanding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-center"
          >
            <Tag color="orange" className="font-semibold animate-pulse">
              🔥 Hot Deal - High Demand
            </Tag>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChannelCard;
