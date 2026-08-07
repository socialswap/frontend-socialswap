import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { CalendarOutlined, ArrowLeftOutlined, SafetyCertificateOutlined, AppstoreOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance, { api } from '../../API/api';
import ChannelCard from '../../Component/ChannelCard';
import SEOHead from '../../Component/SEO/SEOHead';

const PublicUserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ user: null, channels: [] });
  const [error, setError] = useState(null);

  // Clean the username param
  const cleanUsername = username ? username.replace(/^@/, '').toLowerCase().trim() : '';

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!cleanUsername) {
        setError('Username is required');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${api}/users/profile/${cleanUsername}`);
        setData({
          user: res.data.user,
          channels: res.data.channels || []
        });
        setError(null);
      } catch (err) {
        console.error('Error loading public profile:', err);
        setError(err.response?.data?.message || 'User profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [cleanUsername]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#110C1F] dark:to-[#080511] flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data.user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#110C1F] dark:to-[#080511] flex items-center justify-center pt-24 px-4">
        <div className="max-w-md w-full bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[24px] border border-white/60 dark:border-white/10 rounded-[32px] p-8 shadow-card text-center">
          <Result
            status="404"
            title="Profile Not Found"
            subTitle={error || "The user profile you are looking for does not exist or is inactive."}
            extra={[
              <Button 
                key="home" 
                onClick={() => navigate('/')}
                type="primary"
                className="bg-[#6E4BFF] border-none rounded-xl h-11 px-6 font-bold shadow-md hover:scale-[1.02] active:scale-95 transition"
              >
                Go to Homepage
              </Button>
            ]}
          />
        </div>
      </div>
    );
  }

  const { user, channels } = data;
  const canonicalUrl = `https://www.socialswap.in/userprofile/@${user.username}`;

  return (
    <>
      <SEOHead
        title={`${user.name} (@${user.username})`}
        description={`Browse verified YouTube channels listed for sale by ${user.name} (@${user.username}) on SocialSwap.`}
        ogImage={user.avatar || 'https://www.socialswap.in/images/userImg.jpg'}
        canonicalUrl={canonicalUrl}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Browse Channels', url: '/channels' },
          { name: user.name }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#110C1F] dark:to-[#080511] pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden">
        
        {/* Dynamic Background Glow Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-600/10 dark:bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-pink-600/10 dark:bg-pink-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Back button */}
          <Link 
            to="/channels" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-[#6E4BFF] dark:hover:text-[#C6B4FF] mb-6 transition"
          >
            <ArrowLeftOutlined className="text-xs" /> Back to listings
          </Link>

          {/* User Profile Header Card */}
          <div className="bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[24px] border border-white/60 dark:border-white/10 rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] mb-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {/* Profile Avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-[4px] border-white dark:border-[#1C1530] shadow-md bg-gray-100 dark:bg-[#1E1836]">
                <img 
                  src={user.avatar || "/images/userImg.jpg"} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Profile Metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight truncate">
                    {user.name}
                  </h1>
                  {user.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-200 dark:border-purple-500/20">
                      <SafetyCertificateOutlined className="text-xs" /> Staff
                    </span>
                  )}
                </div>

                <p className="text-[#6E4BFF] dark:text-[#C6B4FF] text-base font-bold mb-4">
                  @{user.username}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CalendarOutlined /> Joined {
                      new Date(user.createdAt || parseInt(user._id.substring(0, 8), 16) * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    }
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <AppstoreOutlined /> {channels.length} Listing{channels.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Listings Grid */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
              Active Listings ({channels.length})
            </h2>

            {channels.length > 0 ? (
              <motion.div 
                layout 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              >
                <AnimatePresence>
                  {channels.map(channel => (
                    <motion.div
                      key={channel._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChannelCard channel={channel} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[24px] border border-white/60 dark:border-white/10 rounded-[32px] py-16 text-center shadow-sm">
                <div className="text-5xl mb-4">📺</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No channels for sale</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto font-medium">
                  This user currently doesn't have any active channels listed for sale.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default PublicUserProfile;
