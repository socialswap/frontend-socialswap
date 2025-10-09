import React, { useEffect, useState } from 'react';
import { 
  Play, 
  Users, 
  DollarSign, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Clock,
  Tag,
  RefreshCcw
} from 'lucide-react';
import axiosInstance, { api } from '../../API/api';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    unsold: { class: 'bg-yellow-100 text-yellow-800' },
    sold: { class: 'bg-green-100 text-green-800' }
  };

  const config = statusConfig[status] || statusConfig.unsold;

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${config.class}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ChannelDetails = ({ channel }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
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
              <h3 className="text-sm font-medium text-gray-900">
                {channel.name}
              </h3>
              <p className="text-sm text-gray-500">
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
        <div className="border-t border-gray-200 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>Subscribers</span>
              </div>
              <p className="text-sm text-gray-900">{channel.subscriberCount.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>Views</span>
              </div>
              <p className="text-sm text-gray-900">{channel.viewCount.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <DollarSign className="w-4 h-4" />
                <span>Est. Earnings</span>
              </div>
              <p className="text-sm text-gray-900">${channel.estimatedEarnings.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Watch Time</span>
              </div>
              <p className="text-sm text-gray-900">{channel.watchTimeHours} hours</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Channel Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="text-gray-900">{channel.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="text-gray-900">{channel.channelType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monetized</span>
                <span className="text-gray-900">{channel.monetized ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {channel.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Description</h4>
              <p className="text-sm text-gray-600">{channel.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axiosInstance.get(`${api}/orders`);
        if (response.data.success) {
          setChannels(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch channels');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">YouTube Channels</h1>
        
        {channels.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No channels found</h3>
            <p className="text-gray-500">Buy channels to see them listed here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {channels.map((channel) => (
              <ChannelDetails key={channel._id} channel={channel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;