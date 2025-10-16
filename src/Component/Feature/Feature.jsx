import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { api, url } from '../../API/api';
import { FaYoutube, FaCheckCircle, FaUsers, FaCalendarAlt, FaDollarSign, FaStar, FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Carousel from './Carousel';

const API_BASE_URL = api;

const ChannelCard = ({ channel }) => {
  const navigate = useNavigate();
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
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[280px] mx-2"
      onClick={() => navigate(`/channel/${channel?._id}`)}
    >
      <div className="relative">
        <img
          src={channel.bannerUrl ?channel.bannerUrl : '/images/yt.png'}
          alt={channel.bannerUrl}
          className="w-full h-60 object-contain"
        />
        {channel.status === 'unsold' && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            Premium
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{channel.name}</h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400 text-sm" />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-black">Subs: {channel?.subscriberCount}</p>
          <div>
            {channel.originalPrice && (
              <p className="text-sm text-gray-500 line-through">₹{parseFloat(channel.price)}</p>
            )}
            <p className="text-lg font-bold text-black">₹{channel.price ?? 0}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


const FeaturedListings = () => {
  const [featuredChannels, setFeaturedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedChannels = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/channels/demanding`);
        console.log(response);
        
        setFeaturedChannels(response?.data);
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
        <h2 className="text-3xl font-bold text-center text-black mb-2">Most Demanding Channels</h2>
        <p className="text-center text-gray-600 mb-12">
          Unmatched channels—superior performance and customer satisfaction in one.
        </p>
        <AnimatePresence>
          {loading ? (
            <div className="flex gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-lg min-w-[280px]"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : featuredChannels?.length > 0 ? (
            <Carousel>
              {featuredChannels.map((channel) => (
                <ChannelCard key={channel._id} channel={channel} />
              ))}
            </Carousel>
          ) : (
            <div className="text-center text-gray-800">
              No featured channels available at the moment.
            </div>
          )}
        </AnimatePresence>
  
      </div>
    </section>
  );
};

export default FeaturedListings;