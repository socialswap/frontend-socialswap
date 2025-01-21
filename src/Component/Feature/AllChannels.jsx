import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { api, url } from '../../API/api';
import { FaYoutube, FaCheckCircle, FaUsers, FaCalendarAlt, FaDollarSign, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ExternalLink, TrendingUp } from 'lucide-react';

const API_BASE_URL = api;

const ChannelCard = ({ channel }) => {
  const navigate = useNavigate();
  
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  const discount = channel.originalPrice ? Math.round((1 - parseFloat(channel.price) / parseFloat(channel.originalPrice)) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative group">
        <img
          src={ channel.bannerUrl ? url+channel.bannerUrl : '/images/yt.png'}
          alt={channel.name}
          className="w-full h-48 object-contain"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://youtube.com/channel/${channel.customUrl}`, '_blank');
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
          >
            <ExternalLink size={16} />
            View on YouTube
          </button>
        </div>
        <div className="absolute top-2 left-2 flex flex-wrap gap-2">

          {channel.monetized && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <DollarSign size={12} />
              Monetized
            </span>
          )}
          {channel.mostDemanding && (
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

      <div className="p-4" onClick={() => navigate(`/channel/${channel._id}`)}>
        <h3 className="text-xl font-bold mb-2 truncate">{channel.name}</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Subscribers</span>
            <span className="text-lg font-semibold">{formatNumber(channel.subscriberCount)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Total Views</span>
            <span className="text-lg font-semibold">{formatNumber(channel.viewCount)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Recent Views</span>
            <span className="text-lg font-semibold">{formatNumber(channel.recentViews)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Videos</span>
            <span className="text-lg font-semibold">{formatNumber(channel.videoCount)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Lifetime Earnings</span>
            <span className="text-xl font-bold text-green-600">
            ₹
            {formatNumber(channel.estimatedEarnings) > 0 ? formatNumber(channel.estimatedEarnings) : '0' }
            </span>
          </div>
          <div className="text-right">
            <span className="text-gray-500 text-sm">Price</span>
            <div className="flex flex-col">
              {channel.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                 ₹{ channel.originalPrice >= 0 ? channel.originalPrice : '0' }
                </span>
              )}
              <span className="text-xl font-bold text-black">
              ₹{channel.price}

              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


const AllChannels = () => {
  const [featuredChannels, setFeaturedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedChannels = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/channels`);
        console.log(response.data.channels,response.data.channels.length);
        
        setFeaturedChannels(response?.data?.channels?.slice(0, 12));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch featured channels');
        setLoading(false);
      }
    };

    fetchFeaturedChannels();
  }, []);

  const handleViewAllClick = () => {
    navigate('/channels');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-black mb-2">Channels with high reach</h2>
        <p className="text-center text-gray-600 mb-12">
          Youtube channels which are performing extraordinary than usual.
        </p>
        <AnimatePresence>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : featuredChannels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredChannels.map((channel) => (
                <ChannelCard key={channel._id} channel={channel} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-800">
              No featured channels available at the moment.
            </div>
          )}
        </AnimatePresence>
        <div className="mt-12 text-center">
          <button
            onClick={handleViewAllClick}
            className="bg-black text-white font-bold py-3 px-6 rounded-full hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
          >
            View All Channels
          </button>
        </div>
      </div>
    </section>
  );
};

export default AllChannels;