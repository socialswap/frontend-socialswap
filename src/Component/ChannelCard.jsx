import React, { useState } from "react";
import { Tag, Tooltip, Badge } from "antd";
import { EyeOutlined, UserOutlined, DollarOutlined, YoutubeOutlined, CheckCircleFilled, FireOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ChannelCard = ({ channel }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  if (!channel) return null;

  const handleClick = () => {
    navigate(`/channel/${channel._id}`);
  };

  const banner = channel.bannerUrl || channel.imageUrls?.[0];
  const avatar = channel.avatar || channel.imageUrls?.[0];

  const hasDiscount = channel.discount && channel.discount > 0;
  const isPremium = channel.monetized && (channel.subscriberCount > 100000 || channel.mostDemanding);

  return (
    <motion.div
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-2xl overflow-hidden bg-white cursor-pointer group"
      style={{
        boxShadow: isHovered 
          ? '0 20px 40px rgba(37, 99, 235, 0.15), 0 0 0 2px rgba(37, 99, 235, 0.1)' 
          : '0 4px 24px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Banner Section with Interactive Overlay */}
      <div className="relative h-40 overflow-hidden">
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
            <p className="text-lg font-bold mb-1">View Details</p>
            <p className="text-xs opacity-90">→</p>
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
            <h3 className="text-lg text-white font-bold line-clamp-1 flex-1 drop-shadow-lg">
              {channel.name}
            </h3>
            {channel.verified && (
              <CheckCircleFilled className="text-blue-400 text-base flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-xs text-gray-200 drop-shadow">
            {channel.category || "N/A"} • {channel.channelType || "Standard"}
          </p>
        </div>
      </div>

      {/* Channel Info */}
      <div className="p-4">
        {/* Avatar & Info Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img
              src={avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
            />
            {channel.monetized && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <DollarOutlined className="text-white text-[10px]" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-800">
                {channel.my_language || "English"} • {channel.country?.trim() || "Global"}
              </p>
            </div>
            <Tag
              color={channel.monetized ? "green" : "default"}
              className="rounded-md text-xs mt-1"
            >
              {channel.monetized ? "✓ Monetized" : "Not Monetized"}
            </Tag>
          </div>
        </div>

        {/* Stats Grid with Icons */}
        <div 
          className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.9) 0%, rgba(243, 244, 246, 0.9) 100%)',
          }}
        >
          <Tooltip title="Total Subscribers">
            <div className="text-center">
              <UserOutlined className="text-blue-500 text-base mb-1" />
              <p className="text-sm font-bold text-gray-900">
                {(channel.subscriberCount || 0) >= 1000 
                  ? `${(channel.subscriberCount / 1000).toFixed(1)}K` 
                  : channel.subscriberCount || 0}
              </p>
              <p className="text-[10px] text-gray-500 font-medium">Subscribers</p>
            </div>
          </Tooltip>
          <Tooltip title="Total Views">
            <div className="text-center border-l border-r border-gray-300">
              <EyeOutlined className="text-green-500 text-base mb-1" />
              <p className="text-sm font-bold text-gray-900">
                {(channel.viewCount || 0) >= 1000000 
                  ? `${(channel.viewCount / 1000000).toFixed(1)}M` 
                  : (channel.viewCount || 0) >= 1000 
                  ? `${(channel.viewCount / 1000).toFixed(1)}K` 
                  : channel.viewCount || 0}
              </p>
              <p className="text-[10px] text-gray-500 font-medium">Views</p>
            </div>
          </Tooltip>
          <Tooltip title="Videos Published">
            <div className="text-center">
              <VideoCameraOutlined className="text-purple-500 text-base mb-1" />
              <p className="text-sm font-bold text-gray-900">
                {channel.videoCount || 0}
              </p>
              <p className="text-[10px] text-gray-500 font-medium">Videos</p>
            </div>
          </Tooltip>
        </div>

        {/* Info Strip with Credibility */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Est. Earnings:</span>
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

        {/* Price Section with CTA */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-0.5">Asking Price</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">
                ₹{parseInt(channel.price || 0).toLocaleString()}
              </p>
              {hasDiscount && (
                <p className="text-sm text-gray-400 line-through">
                  ₹{parseInt(channel.price / (1 - channel.discount / 100)).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <Tooltip title="View on YouTube">
            <motion.a
              href={channel.customUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-lg shadow-lg transition-colors"
            >
              <YoutubeOutlined />
            </motion.a>
          </Tooltip>
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
