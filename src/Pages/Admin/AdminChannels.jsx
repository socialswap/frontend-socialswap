import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Modal, Spin, Tag, Checkbox, Button, Descriptions } from 'antd';
import axiosInstance, { api } from '../../API/api';

const { Search } = Input;
const { Option } = Select;

const AdminChannels = () => {
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
    "Gaming", "Vlogs", "Music", "Tech", "Facts", "Entertainment",
    "Anime", "Education", "Podcast", "News", "Commentary", "Reaction", "Other"
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
      render: (status) => (
        <Tag color={status === 'sold' ? 'red' : 'green'}>
          {status}
        </Tag>
      ),
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
        <Button type="primary" onClick={() => handleApproveChannel(record._id)}         disabled={record.status === 'approved' || record.status === 'Sold' }
        >
        Approve
      </Button>
      <Button type="danger" onClick={() => handleDeleteChannel(record._id)}>
        Delete
      </Button>
        <Button type="primary" onClick={() => handleViewChannel(record._id)}>
          View
        </Button>
        </>
    
      ),
    },
  ];

  return (
    <div className="p-4">
       
        <hr />
        <br />
      <h1 className="text-2xl font-bold mb-6">YouTube Channels Admin Dashboard</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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

      <Table
        columns={columns}
        dataSource={channels.filter(channel => (
          channel.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          (filters.category === '' || channel.category === filters.category) &&
          (filters.status === '' || channel.status === filters.status) &&
          (filters.monetized === '' || channel.monetized.toString() === filters.monetized)
        ))}
        rowKey="_id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
      />

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
    <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
      <Descriptions.Item label="Channel Name">{selectedChannel.name}</Descriptions.Item>
      <Descriptions.Item label="Subscribers">{selectedChannel.subscriberCount?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Category">{selectedChannel.category}</Descriptions.Item>
      <Descriptions.Item label="Status">
        <Tag color={selectedChannel.status === 'sold' ? 'red' : 'green'}>
          {selectedChannel.status}
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
      <Descriptions.Item label="Price">${selectedChannel.price?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Total Views">{selectedChannel.viewCount?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Video Count">{selectedChannel.videoCount?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Estimated Earnings">${selectedChannel.estimatedEarnings?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Country">{selectedChannel.country}</Descriptions.Item>
      <Descriptions.Item label="Language">{selectedChannel.language}</Descriptions.Item>
      <Descriptions.Item label="Average Views Per Video">{selectedChannel.averageViewsPerVideo?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Recent Views">{selectedChannel.recentViews?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Copyright Strikes">{selectedChannel.copyrightStrike}</Descriptions.Item>
      <Descriptions.Item label="Watch Time (Hours)">{selectedChannel.watchTimeHours?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Joined Date">{new Date(selectedChannel.joinedDate).toLocaleDateString()}</Descriptions.Item>
      <Descriptions.Item label="Email">{selectedChannel.contactInfo?.email}</Descriptions.Item>
      <Descriptions.Item label="Phone">{selectedChannel.contactInfo?.phone}</Descriptions.Item>
      {selectedChannel.description && (
        <Descriptions.Item label="Description" span={2}>
          <a href={selectedChannel.description} target="_blank" rel="noopener noreferrer">
            {selectedChannel.description}
          </a>
        </Descriptions.Item>
      )}
      {selectedChannel.imageUrls && selectedChannel.imageUrls.length > 0 && (
        <Descriptions.Item label="Image Gallery" span={2}>
          <div className="image-gallery">
            {selectedChannel.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Channel Image ${index + 1}`}
                style={{ width: '100px', marginRight: '10px' }}
              />
            ))}
          </div>
        </Descriptions.Item>
      )}
      {selectedChannel.bannerUrl && (
        <Descriptions.Item label="Banner" span={2}>
          <img
            src={selectedChannel.bannerUrl}
            alt="Channel Banner"
            style={{ width: '100%', height: 'auto' }}
          />
        </Descriptions.Item>
      )}
    </Descriptions>
  ) : (
    <div>No channel data available</div>
  )}
</Modal>

    </div>
  );
};

export default AdminChannels;
