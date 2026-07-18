import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, DollarSign, TrendingUp } from "lucide-react";
import { message } from "antd";
import axiosInstance from "../../API/api";

const ChannelCard = ({ channel }) => {
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const channelId = channel?._id;
  const heroImage = channel?.logoUrl || channel?.bannerUrl || channel?.imageUrls?.[0] || "/images/yt.png";

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

  if (!channel) return null;

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
      className="bg-bg-card border border-border-color/20 text-text-primary rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative group bg-bg-secondary/40">
        <img
          src={heroImage}
          alt={channel?.name || "YouTube Channel"}
          className="w-full h-48 object-contain p-4"
        />

        <div className="absolute inset-0 bg-bg-secondary/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (channel?.customUrl) window.open(channel.customUrl, "_blank");
            }}
            className="bg-purple-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-hover transition-colors"
          >
            <ExternalLink size={16} />
            View on YouTube
          </button>
        </div>

        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
          {channel?.monetized && (
            <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <DollarSign size={12} />
              Monetized
            </span>
          )}
          {channel?.mostDemanding && (
            <span className="bg-purple-secondary text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <TrendingUp size={12} />
              Trending
            </span>
          )}
        </div>

        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-accent-pink text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      <div
        className="p-4 cursor-pointer"
        onClick={() => navigate(`/channel/${channel?._id}`)}
      >
        <h3 className="text-xl font-bold mb-2 truncate text-text-primary">
          {channel?.name || "Unnamed Channel"}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-text-secondary text-sm">Subscribers</span>
            <span className="text-lg font-semibold text-text-primary">
              {formatNumber(channel?.subscriberCount)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-text-secondary text-sm">Total Views</span>
            <span className="text-lg font-semibold text-text-primary">
              {formatNumber(channel?.viewCount)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-text-secondary text-sm">Recent Views</span>
            <span className="text-lg font-semibold text-text-primary">
              {formatNumber(channel?.recentViews)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-text-secondary text-sm">Videos</span>
            <span className="text-lg font-semibold text-text-primary">
              {formatNumber(channel?.videoCount)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border-color/20">
          <div className="flex flex-col">
            <span className="text-text-secondary text-sm">Lifetime</span>
            <span className="text-lg font-semibold text-text-primary">
              {formatDate(channel?.createdAt)}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: isInCart ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={cartLoading}
            onClick={handleAddToCart}
            className={`px-5 py-2 rounded-lg text-sm font-semibold text-white ${cartLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            style={{
              background: isInCart
                ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                : 'var(--btn-gradient)',
              boxShadow: isInCart
                ? '0 6px 16px rgba(34, 197, 94, 0.2)'
                : 'var(--purple-glow)',
            }}
          >
            {isInCart ? 'Go to Cart' : cartLoading ? 'Adding...' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelCard;
