import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, DollarSign, TrendingUp } from "lucide-react";

const ChannelCard = ({ channel }) => {
  const navigate = useNavigate();

  // 🛡️ Prevent crash if channel data isn't ready yet
  if (!channel) return null;

  const formatNumber = (num) => {
    if (!num && num !== 0) return "—";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";

    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  };

  // 🧮 Safe discount calculation
  const discount = channel?.originalPrice
    ? Math.round(
        (1 - parseFloat(channel?.price || 0) / parseFloat(channel?.originalPrice || 1)) *
          100
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative group">
        <img
          src={channel?.bannerUrl || "/images/yt.png"}
          alt={channel?.name || "YouTube Channel"}
          className="w-full h-48 object-contain"
        />

        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (channel?.customUrl) window.open(channel.customUrl, "_blank");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
          >
            <ExternalLink size={16} />
            View on YouTube
          </button>
        </div>

        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
          {channel?.monetized && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <DollarSign size={12} />
              Monetized
            </span>
          )}
          {channel?.mostDemanding && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <TrendingUp size={12} />
              Trending
            </span>
          )}
        </div>

        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      <div
        className="p-4 cursor-pointer"
        onClick={() => navigate(`/channel/${channel?._id}`)}
      >
        <h3 className="text-xl font-bold mb-2 truncate">
          {channel?.name || "Unnamed Channel"}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Subscribers</span>
            <span className="text-lg font-semibold">
              {formatNumber(channel?.subscriberCount)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Total Views</span>
            <span className="text-lg font-semibold">
              {formatNumber(channel?.viewCount)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Recent Views</span>
            <span className="text-lg font-semibold">
              {formatNumber(channel?.recentViews)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Videos</span>
            <span className="text-lg font-semibold">
              {formatNumber(channel?.videoCount)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Lifetime</span>
            <span className="text-lg font-semibold">
              {formatDate(channel?.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelCard;
