import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Input, Select, Modal, Spin, Tag, Checkbox, Button, Descriptions, Tooltip, Space } from 'antd';
import { Check, X, Eye, EyeOff, Edit, Trash2, Maximize2, ShoppingBag } from 'lucide-react';
import axiosInstance, { api } from '../../API/api';
import formatINR from '../../Utils/formatINR';

const { Search } = Input;
const { Option } = Select;

// wa.me needs the number with country code and digits only. Sellers type numbers
// in many shapes ("098765 43210", "+91-98765...", "9876543210"); assume India when no code is given.
const toWhatsAppNumber = (phone) => {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 10) digits = `91${digits}`;
  return digits.length >= 11 && digits.length <= 15 ? digits : null;
};

const sellerWhatsAppUrl = (channel) => {
  const number = toWhatsAppNumber(channel?.contactInfo?.phone);
  if (!number) return null;
  const text = `Hey, Thank you for listing your YouTube channel “${channel.name || 'your channel'}” on SocialSwap.in.

We currently have active buyers interested in purchasing your channel.

Please let us know your availability for a brief discussion to move forward with the transaction.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 01-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.44 9.44 0 01-1.45-5.04c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.91.99 6.7 2.78a9.42 9.42 0 012.77 6.7c0 5.22-4.25 9.46-9.47 9.46zm8.06-17.53A11.33 11.33 0 0012.04.63C5.76.63.65 5.74.65 12.02c0 2 .52 3.96 1.52 5.69L.55 23.6l6.04-1.58a11.36 11.36 0 005.44 1.39h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.33-8.05z" />
  </svg>
);

const AdminChannels = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelDetailsLoading, setChannelDetailsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    monetized: ''
  });

  const categories = [
    "Gaming", "Tech", "Finance", "Artificial intelligence",
    "Business & Entrepreneurship", "Education", "Health & Fitness",
    "Food", "Infotainment", "Vlogging", "Sports", "Commentary",
    "Entertainment", "Music", "Motivation & Self-Improvement", "Other"
  ];

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await axiosInstance.get(`${api}/admin/channels`);
      setChannels(response.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelDetails = async (channelId) => {
    setChannelDetailsLoading(true);
    try {
      const response = await axiosInstance.get(`${api}/admin/channel/${channelId}`);
      console.log(response?.data?.data);
      setSelectedChannel(response?.data?.data);
    } catch (error) {
      console.error('Error fetching channel details:', error);
    } finally {
      setChannelDetailsLoading(false);
    }
  };

  const toggleMostDemanding = async (channelId, currentValue) => {
  try {
    const response = await axiosInstance.patch(
      `${api}/admin/channels/${channelId}/demanding`, // Fixed template literal
      { mostDemanding: !currentValue }
    );

    if (response.status === 200) { // Correct Axios response check
      setChannels(prevChannels =>
        prevChannels.map(channel =>
          channel._id === channelId
            ? { ...channel, mostDemanding: !currentValue }
            : channel // Fixed incorrect variable name
        )
      );
    }
  } catch (error) {
    console.error('Error updating channel:', error);
  }
};


  const handleViewChannel = (channelId) => {
    setModalVisible(true);
    fetchChannelDetails(channelId);
  };

  const handleApproveChannel = async (channelId) => {
    try {
      await axiosInstance.patch(`${api}/admin/channels/${channelId}/approve`);
      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel._id === channelId ? { ...channel, status: 'approved' } : channel
        )
      );
    } catch (error) {
      console.error('Error approving channel:', error);
    }
  };

  const handleRejectChannel = async (channelId) => {
    try {
      await axiosInstance.patch(`${api}/admin/channels/${channelId}/reject`, { reason: 'Rejected by admin' });
      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel._id === channelId ? { ...channel, status: 'rejected' } : channel
        )
      );
    } catch (error) {
      console.error('Error rejecting channel:', error);
    }
  };

  const handleDeleteChannel = async (channelId) => {
    try {
      await axiosInstance.delete(`${api}/admin/channels/${channelId}`);
      setChannels((prevChannels) =>
        prevChannels.filter((channel) => channel._id !== channelId)
      );
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  const handleToggleVisibility = async (channelId, currentHidden) => {
    try {
      const res = await axiosInstance.patch(`${api}/admin/channels/${channelId}/toggle-visibility`);
      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel._id === channelId ? { ...channel, isHidden: res.data.isHidden } : channel
        )
      );
    } catch (error) {
      console.error('Error toggling channel visibility:', error);
    }
  };

  const handleToggleSold = async (channelId) => {
    try {
      const res = await axiosInstance.patch(`${api}/admin/channels/${channelId}/toggle-sold`);
      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel._id === channelId
            ? { ...channel, sold: res.data.sold, status: res.data.status }
            : channel
        )
      );
    } catch (error) {
      console.error('Error toggling channel sold status:', error);
    }
  };

  const columns = [
    {
      title: 'Channel Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Subscribers',
      dataIndex: 'subscriberCount',
      key: 'subscriberCount',
      render: (count) => count?.toLocaleString(),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const isSold = record.sold === true || status === 'sold' || status === 'Sold';
        if (isSold) {
          return (
            <Tag color="red" style={{ fontWeight: 600 }}>
              SOLD OUT
            </Tag>
          );
        }
        return (
          <Tag color={status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'gold'}>
            {status ? status.toUpperCase() : 'PENDING'}
          </Tag>
        );
      },
    },
    {
      title: 'Monetized',
      dataIndex: 'monetized',
      key: 'monetized',
      render: (monetized) => (
        <Tag color={monetized ? 'green' : 'red'}>
          {monetized ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Most Demanding',
      dataIndex: 'mostDemanding',
      key: 'mostDemanding',
      render: (mostDemanding, record) => (
        <Checkbox
          checked={mostDemanding || false}
          onChange={() => toggleMostDemanding(record._id, mostDemanding)}
        />
      ),
    },
    {
      title: 'Hidden',
      dataIndex: 'isHidden',
      key: 'isHidden',
      render: (isHidden) => (
        <Tag color={isHidden ? 'orange' : 'default'}>
          {isHidden ? 'Hidden' : 'Visible'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const isSold = record.sold === true || record.status === 'sold' || record.status === 'Sold';
        return (
          <Space size="small" wrap>
            <Tooltip title="Approve">
              <Button
                type="primary"
                shape="circle"
                style={{ background: '#52c41a', borderColor: '#52c41a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => handleApproveChannel(record._id)}
                disabled={record.status === 'approved' || isSold}
                icon={<Check size={16} />}
              />
            </Tooltip>
            <Tooltip title="Reject">
              <Button
                danger
                shape="circle"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => handleRejectChannel(record._id)}
                disabled={record.status === 'rejected' || isSold}
                icon={<X size={16} />}
              />
            </Tooltip>
            <Tooltip title={record.isHidden ? 'Show' : 'Hide'}>
              <Button
                shape="circle"
                style={record.isHidden
                  ? { background: '#52c41a', borderColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }
                  : { background: '#fa8c16', borderColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }
                }
                onClick={() => handleToggleVisibility(record._id, record.isHidden)}
                icon={record.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
              />
            </Tooltip>
            <Tooltip title={isSold ? "Mark as Available / Unsold" : "Mark as Sold Out"}>
              <Button
                shape="circle"
                style={
                  isSold
                    ? { background: '#ef4444', borderColor: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }
                    : { background: '#fff', borderColor: '#ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }
                }
                onClick={() => handleToggleSold(record._id)}
                icon={<ShoppingBag size={16} />}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Button 
                shape="circle" 
                onClick={() => navigate(`/edit-channel/${record._id}`)}
                icon={<Edit size={16} />}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              />
            </Tooltip>
            <Tooltip title="View Details">
              <Button 
                shape="circle" 
                onClick={() => handleViewChannel(record._id)}
                icon={<Maximize2 size={16} />}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button 
                danger 
                type="primary" 
                shape="circle" 
                onClick={() => handleDeleteChannel(record._id)}
                icon={<Trash2 size={16} />}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-2 sm:p-4">
       
        <hr />
        <br />
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">YouTube Channels Admin Dashboard</h1>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Search
          placeholder="Search channels..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
        
        <Select
          value={filters.category}
          onChange={(value) => setFilters({...filters, category: value})}
          placeholder="All Categories"
        >
          <Option value="">All Categories</Option>
          {categories.map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>

        <Select
          value={filters.status}
          onChange={(value) => setFilters({...filters, status: value})}
          placeholder="All Status"
        >
          <Option value="">All Status</Option>
          <Option value="sold">Sold</Option>
          <Option value="unsold">Unsold</Option>
        </Select>

        <Select
          value={filters.monetized}
          onChange={(value) => setFilters({...filters, monetized: value})}
          placeholder="All Monetization"
        >
          <Option value="">All Monetization</Option>
          <Option value="true">Monetized</Option>
          <Option value="false">Not Monetized</Option>
        </Select>
      </div>

      <div className="overflow-x-auto w-full">
        <Table
          columns={columns}
          dataSource={channels.filter(channel => {
            const isSold = channel.sold === true || channel.status === 'sold' || channel.status === 'Sold';
            const matchesStatus = filters.status === ''
              ? true
              : filters.status === 'sold'
                ? isSold
                : !isSold;

            return (
              channel.name.toLowerCase().includes(filters.search.toLowerCase()) &&
              (filters.category === '' || channel.category === filters.category) &&
              matchesStatus &&
              (filters.monetized === '' || channel.monetized?.toString() === filters.monetized)
            );
          })}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </div>

<Modal
  title="Channel Details"
  visible={modalVisible}
  onCancel={() => {
    setModalVisible(false);
    setSelectedChannel(null);
  }}
  width={800}
  footer={null}
>
  {
    console.log(selectedChannel)
  }
  {channelDetailsLoading ? (
    <div className="flex justify-center py-8">
      <Spin />
    </div>
  ) : selectedChannel ? (
    <>
    {sellerWhatsAppUrl(selectedChannel) ? (
      <a
        href={sellerWhatsAppUrl(selectedChannel)}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white hover:text-white font-bold text-sm shadow-sm transition-colors"
      >
        <WhatsAppIcon /> WhatsApp Seller
      </a>
    ) : (
      <div className="mb-4 w-full px-5 py-3 rounded-xl bg-gray-100 text-gray-500 text-sm text-center">
        WhatsApp unavailable: this listing has no valid seller phone number.
      </div>
    )}
    <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
      <Descriptions.Item label="Channel Name">{selectedChannel.name}</Descriptions.Item>
      <Descriptions.Item label="Subscribers">{selectedChannel.subscriberCount?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Channel Link" span={2}>
        {selectedChannel.channelLink ? (
          <a href={selectedChannel.channelLink} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', wordBreak: 'break-all' }}>
            {selectedChannel.channelLink}
          </a>
        ) : '—'}
      </Descriptions.Item>
      <Descriptions.Item label="Category">{selectedChannel.category}</Descriptions.Item>
      <Descriptions.Item label="Status">
        <Tag color={(selectedChannel.status === 'sold' || selectedChannel.sold) ? 'red' : 'green'}>
          {(selectedChannel.status === 'sold' || selectedChannel.sold) ? 'SOLD OUT' : selectedChannel.status}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Monetized">
        <Tag color={selectedChannel.monetized ? 'green' : 'red'}>
          {selectedChannel.monetized ? 'Yes' : 'No'}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Most Demanding">
        <Checkbox
          checked={selectedChannel.mostDemanding || false}
          onChange={() => toggleMostDemanding(selectedChannel._id, selectedChannel.mostDemanding)}
        />
      </Descriptions.Item>
      <Descriptions.Item label="Price">{formatINR(selectedChannel.price)}</Descriptions.Item>
      <Descriptions.Item label="Total Views">{selectedChannel.viewCount?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Video Count">{selectedChannel.videoCount?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Estimated Earnings">{selectedChannel.estimatedEarnings ? `${formatINR(selectedChannel.estimatedEarnings)}/mo` : '—'}</Descriptions.Item>
      <Descriptions.Item label="Country">{selectedChannel.country}</Descriptions.Item>
      <Descriptions.Item label="Language">{selectedChannel.language}</Descriptions.Item>
      <Descriptions.Item label="Average Views Per Video">{selectedChannel.averageViewsPerVideo?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Recent Views">{selectedChannel.recentViews?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Copyright Strikes">{selectedChannel.copyrightStrike}</Descriptions.Item>
      <Descriptions.Item label="Watch Time (Hours)">{selectedChannel.watchTimeHours?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Joined Date">{new Date(selectedChannel.joinedDate).toLocaleDateString()}</Descriptions.Item>
      <Descriptions.Item label="Email">{selectedChannel.contactInfo?.email}</Descriptions.Item>
      <Descriptions.Item label="Phone">
        <span className="inline-flex items-center gap-2 flex-wrap">
          {selectedChannel.contactInfo?.phone}
          {sellerWhatsAppUrl(selectedChannel) && (
            <a
              href={sellerWhatsAppUrl(selectedChannel)}
              target="_blank"
              rel="noopener noreferrer"
              title="Message seller on WhatsApp"
              className="inline-flex items-center gap-1 text-[#1ebe5b] font-semibold"
            >
              <WhatsAppIcon size={16} /> WhatsApp
            </a>
          )}
        </span>
      </Descriptions.Item>
      {selectedChannel.description && (
        <Descriptions.Item label="Description" span={2}>
          {selectedChannel.description}
        </Descriptions.Item>
      )}
      {selectedChannel.dashboardImage && (
        <Descriptions.Item label="YouTube Studio Dashboard" span={2}>
          <img
            src={selectedChannel.dashboardImage}
            alt="YouTube Studio Dashboard"
            style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' }}
          />
        </Descriptions.Item>
      )}
      {selectedChannel.imageUrls && selectedChannel.imageUrls.length > 0 && (
        <Descriptions.Item label="Channel Screenshots" span={2}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedChannel.imageUrls.map((url, index) => (
              <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={url}
                  alt={`Screenshot ${index + 1}`}
                  style={{ width: '140px', height: 'auto', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                />
              </a>
            ))}
          </div>
        </Descriptions.Item>
      )}
      {selectedChannel.bannerUrl && (
        <Descriptions.Item label="Banner" span={2}>
          <img
            src={selectedChannel.bannerUrl}
            alt="Channel Banner"
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </Descriptions.Item>
      )}
    </Descriptions>
    </>
  ) : (
    <div>No channel data available</div>
  )}
</Modal>

    </div>
  );
};

export default AdminChannels;
