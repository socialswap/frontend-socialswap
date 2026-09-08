import React, { useEffect, useState } from 'react';
import { 
  Play, 
  Users, 
  IndianRupee, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Clock,
  RefreshCcw,
  Package,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import axiosInstance, { api } from '../../API/api';
import SEOHead from '../SEO/SEOHead';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    unsold: { class: 'bg-yellow-100 text-yellow-800' },
    sold: { class: 'bg-green-100 text-green-800' }
  };

  const config = statusConfig[status] || statusConfig.unsold;

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${config.class}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Confirmed'}
    </span>
  );
};

const ChannelDetails = ({ channel }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-[#110C1F]/60 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden shrink-0">
              {channel.avatar ? (
                <img 
                  src={channel.avatar} 
                  alt={channel.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Play className="w-full h-full p-2 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {channel.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {channel.customUrl}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={channel.status} />
            {isExpanded ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-white/10 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>Subscribers</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{channel.subscriberCount?.toLocaleString() || 0}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Eye className="w-4 h-4" />
                <span>Views</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{channel.viewCount?.toLocaleString() || 0}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <IndianRupee className="w-4 h-4" />
                <span>Est. Earnings</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{channel.estimatedEarnings?.toLocaleString() || 0}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Watch Time</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{channel.watchTimeHours || 0} hours</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Channel Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Category</span>
                <span className="text-gray-900 dark:text-white font-medium">{channel.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type</span>
                <span className="text-gray-900 dark:text-white font-medium">{channel.channelType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Monetized</span>
                <span className="text-gray-900 dark:text-white font-medium">{channel.monetized ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {channel.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Description</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{channel.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white dark:bg-[#110C1F]/60 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 overflow-hidden border border-purple-500/20">
            {service.image ? (
              <img src={service.image} alt={service.serviceName} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                {service.category || 'Service'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                <CheckCircle2 className="w-3 h-3" /> CONFIRMED
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {service.serviceName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Purchased on {new Date(service.purchasedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })} • Txn: {service.transactionId}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-white/5">
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Paid</span>
            <span className="text-lg font-black text-purple-600 dark:text-purple-400">
              ₹{service.price?.toLocaleString()}
            </span>
          </div>

          <a
            href={`https://wa.me/+919423523291?text=${encodeURIComponent(`Hi, I need assistance regarding my purchased service: ${service.serviceName} (Txn: ${service.transactionId})`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Support
          </a>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [channels, setChannels] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('services'); // 'services' or 'channels'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`${api}/orders`);
        if (response.data.success) {
          setChannels(response.data.channels || response.data.data || []);
          setServices(response.data.services || []);
          // Default tab to services if services exist, else channels
          if (response.data.services?.length > 0) {
            setActiveTab('services');
          } else {
            setActiveTab('channels');
          }
        } else {
          throw new Error(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-4 flex items-center justify-center min-h-[300px]">
        <SEOHead title="My Orders | SocialSwap" noIndex={true} />
        <RefreshCcw className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4">
        <div className="w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <SEOHead title="My Orders | SocialSwap" noIndex={true} />
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Purchases & Orders</h1>
        
        {/* Tabs */}
        <div className="flex gap-3 mb-6 border-b border-gray-200 dark:border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'services'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            <Package className="w-4 h-4" />
            Purchased Services ({services.length})
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'channels'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            <Play className="w-4 h-4" />
            YouTube Channels ({channels.length})
          </button>
        </div>

        {/* Services Tab Content */}
        {activeTab === 'services' && (
          services.length === 0 ? (
            <div className="bg-white dark:bg-[#110C1F]/60 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No purchased services found</h3>
              <p className="text-gray-500 dark:text-gray-400">Order services to see them listed here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service, index) => (
                <ServiceCard key={service._id || index} service={service} />
              ))}
            </div>
          )
        )}

        {/* Channels Tab Content */}
        {activeTab === 'channels' && (
          channels.length === 0 ? (
            <div className="bg-white dark:bg-[#110C1F]/60 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-8 text-center">
              <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No channels found</h3>
              <p className="text-gray-500 dark:text-gray-400">Buy channels to see them listed here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {channels.map((channel) => (
                <ChannelDetails key={channel._id} channel={channel} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Orders;