import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Spin, Tag, message } from 'antd';
import { 
  ArrowLeft, Phone, Mail, MessageSquare, Calendar, Shield, 
  ExternalLink, Youtube, DollarSign, Eye, Edit, User, CheckCircle2,
  TrendingUp, Video, Globe, Award, Sparkles, MessageCircle
} from 'lucide-react';
import axiosInstance, { api } from '../../API/api';
import SEOHead from '../../Component/SEO/SEOHead';

const AdminUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${api}/users/${userId}`);
        setUserData(res.data);
      } catch (err) {
        console.error('Error fetching admin user profile:', err);
        message.error(err.response?.data?.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d071c] flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium animate-pulse">
            Loading user & seller details...
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d071c] flex flex-col items-center justify-center pt-24 px-4">
        <div className="text-5xl mb-4">👤</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Could not find user details for ID: {userId}</p>
        <button
          onClick={() => navigate('/admin/chats')}
          className="px-5 py-2.5 bg-[#7C3AED] text-white font-medium rounded-xl hover:bg-purple-700 transition"
        >
          Back to Chats
        </button>
      </div>
    );
  }

  const channels = userData.channels || [];
  const contactPhone = userData.contactNumber || userData.mobile || userData.sellerPhone;

  return (
    <>
      <SEOHead title={`${userData.name || 'User'} Profile | Admin SocialSwap`} noIndex={true} />

      <div className="min-h-screen bg-gray-50 dark:bg-[#0d071c] text-gray-800 dark:text-gray-100 pt-20 pb-16 px-3 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Top Back & Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#7C3AED] dark:hover:text-[#A855F7] transition-colors p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-purple-900/30"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-[#7C3AED] dark:text-[#A855F7] rounded-full border border-purple-200 dark:border-purple-800/40">
              Admin View
            </span>
          </div>

          {/* User Profile Card */}
          <div className="bg-white dark:bg-[#18112e] rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 dark:border-purple-900/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
              {/* Avatar / DP */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-4 border-white dark:border-[#241a42] shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black uppercase">
                {userData.avatar ? (
                  <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
                ) : (
                  userData.name?.charAt(0) || 'U'
                )}
              </div>

              {/* Info Column */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight truncate">
                    {userData.name || 'User'}
                  </h1>
                  <Tag color={userData.role === 'admin' ? 'purple' : 'blue'} className="text-xs uppercase font-bold rounded-md px-2 py-0.5">
                    {userData.role || 'User'}
                  </Tag>
                  <Tag color={userData.status === 'suspended' ? 'orange' : userData.status === 'disabled' ? 'red' : 'green'} className="text-xs uppercase font-bold rounded-md px-2 py-0.5">
                    {userData.status || 'Active'}
                  </Tag>
                </div>

                {userData.username && (
                  <p className="text-sm font-semibold text-[#7C3AED] dark:text-[#A855F7] mb-3">
                    @{userData.username}
                  </p>
                )}

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                  {/* Contact Number */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#231542] rounded-xl border border-gray-100 dark:border-purple-900/20">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Phone size={18} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block uppercase">Contact Number</span>
                      {contactPhone ? (
                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          <span className="font-bold text-gray-900 dark:text-white text-sm">{contactPhone}</span>
                          <a 
                            href={`tel:${contactPhone}`} 
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                            title="Call Phone"
                          >
                            Call
                          </a>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <a 
                            href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
                            title="Open WhatsApp"
                          >
                            <MessageCircle size={12} /> WhatsApp
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Not provided</span>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#231542] rounded-xl border border-gray-100 dark:border-purple-900/20">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block uppercase">Email</span>
                      <a href={`mailto:${userData.email}`} className="font-bold text-gray-900 dark:text-white text-sm truncate block hover:text-[#7C3AED]">
                        {userData.email}
                      </a>
                    </div>
                  </div>

                  {/* Joined Date */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#231542] rounded-xl border border-gray-100 dark:border-purple-900/20">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block uppercase">Joined On</span>
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {/* Seller Status */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#231542] rounded-xl border border-gray-100 dark:border-purple-900/20">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Award size={18} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block uppercase">Seller Status</span>
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {channels.length > 0 ? `Active Seller (${channels.length} Listed)` : 'Buyer / No Channels'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-5 justify-center sm:justify-start">
                  <button
                    onClick={() => navigate('/admin/chats', { state: { prefillUserId: userData._id } })}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition shadow-sm"
                  >
                    <MessageSquare size={16} /> Open Chat with User
                  </button>
                  {userData.username && (
                    <a
                      href={`/userprofile/@${userData.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#231542] hover:bg-gray-200 dark:hover:bg-[#2e1d55] text-gray-700 dark:text-gray-200 font-semibold rounded-xl text-sm transition border border-gray-200 dark:border-purple-900/30"
                    >
                      <ExternalLink size={15} /> Public Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Seller Channels Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                <Youtube className="text-red-500" size={24} /> 
                Channels Listed by this Seller ({channels.length})
              </h2>
            </div>

            {channels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {channels.map((channel) => (
                  <div
                    key={channel._id}
                    className="bg-white dark:bg-[#18112e] rounded-2xl p-5 border border-gray-200/80 dark:border-purple-900/30 shadow-sm flex flex-col justify-between gap-4 relative hover:border-purple-300 dark:hover:border-purple-700/50 transition-all"
                  >
                    <div>
                      {/* Channel Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={channel.imageUrls?.[0] || 'https://via.placeholder.com/60'}
                            alt={channel.name}
                            className="w-14 h-14 rounded-xl object-cover border border-gray-100 dark:border-purple-900/20 shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="font-bold text-base text-gray-900 dark:text-white truncate">
                              {channel.name}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                              {channel.category} • {channel.channelType || 'YouTube Channel'}
                            </span>
                          </div>
                        </div>

                        {/* Status Tags */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <Tag color={channel.status === 'approved' ? 'green' : channel.status === 'rejected' ? 'red' : 'gold'}>
                            {channel.status?.toUpperCase() || 'PENDING'}
                          </Tag>
                          {channel.isHidden && (
                            <Tag color="orange">HIDDEN</Tag>
                          )}
                        </div>
                      </div>

                      {/* Stats Badges */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 dark:border-purple-900/20 text-center my-3">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Subscribers</span>
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            {channel.subscriberCount?.toLocaleString() || '0'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Price</span>
                          <span className="text-xs font-bold text-[#7C3AED] dark:text-[#A855F7]">
                            ${channel.price || '0'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Monetized</span>
                          <span className={`text-xs font-bold ${channel.monetized ? 'text-emerald-500' : 'text-gray-400'}`}>
                            {channel.monetized ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>

                      {/* Contact Info provided during Upload */}
                      {channel.contactInfo && (channel.contactInfo.phone || channel.contactInfo.email) && (
                        <div className="p-2.5 bg-purple-50/60 dark:bg-purple-900/20 rounded-xl mb-3 text-xs space-y-1">
                          <span className="font-semibold text-purple-800 dark:text-purple-300 block text-[11px] uppercase">
                            Uploaded Channel Contact Info:
                          </span>
                          {channel.contactInfo.phone && (
                            <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                              <Phone size={12} className="text-emerald-500" /> Phone: <span className="font-bold">{channel.contactInfo.phone}</span>
                            </p>
                          )}
                          {channel.contactInfo.email && (
                            <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                              <Mail size={12} className="text-blue-500" /> Email: <span>{channel.contactInfo.email}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Studio Dashboard Screenshot */}
                      {channel.dashboardImage && (
                        <div className="mb-3">
                          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1 uppercase">
                            Studio Dashboard Screenshot:
                          </span>
                          <div 
                            onClick={() => setPreviewImage(channel.dashboardImage)}
                            className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-purple-900/40 cursor-pointer group"
                          >
                            <img 
                              src={channel.dashboardImage} 
                              alt="Dashboard Screenshot" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1 transition-opacity">
                              <Eye size={14} /> Click to expand
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Channel Card Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-purple-900/20 gap-2 flex-wrap">
                      {channel.channelLink && (
                        <a
                          href={channel.channelLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[#7C3AED] dark:text-[#A855F7] hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink size={13} /> YouTube Channel
                        </a>
                      )}
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => navigate(`/channel/${channel.customUrl || channel._id}`)}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-purple-900/30 hover:bg-gray-200 dark:hover:bg-purple-900/50 text-gray-700 dark:text-gray-300 font-medium rounded-lg text-xs transition"
                        >
                          View Listing
                        </button>
                        <button
                          onClick={() => navigate(`/edit-channel/${channel._id}`)}
                          className="px-3 py-1.5 bg-purple-100 dark:bg-purple-800/40 hover:bg-purple-200 dark:hover:bg-purple-800/60 text-[#7C3AED] dark:text-purple-200 font-semibold rounded-lg text-xs transition inline-flex items-center gap-1"
                        >
                          <Edit size={12} /> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#18112e] rounded-2xl p-10 text-center border border-gray-200/80 dark:border-purple-900/30 shadow-sm">
                <div className="text-4xl mb-3">📺</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">No Channels Listed</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  This user has not uploaded or listed any YouTube channels for sale yet.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal
        visible={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        width={900}
        centered
        bodyStyle={{ padding: 12, backgroundColor: 'transparent' }}
      >
        {previewImage && (
          <img 
            src={previewImage} 
            alt="YouTube Studio Dashboard Full" 
            className="w-full h-auto rounded-xl object-contain max-h-[85vh] mx-auto" 
          />
        )}
      </Modal>
    </>
  );
};

export default AdminUserProfile;
