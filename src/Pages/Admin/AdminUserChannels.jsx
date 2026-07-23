import React, { useState, useEffect } from 'react';
import { Select, Table, Button, Modal, Form, Input, InputNumber, Switch, Tag, Popconfirm, message, Empty, Typography, Avatar, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, EyeOutlined, UserOutlined, TagOutlined } from '@ant-design/icons';
import axiosInstance, { api } from '../../API/api';

const { Option } = Select;
const { Title, Text } = Typography;
const { Search } = Input;

const countries = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Brazil', 'Pakistan', 'Bangladesh', 'Nigeria',
  'Philippines', 'Indonesia', 'Mexico', 'South Africa', 'Other'
];

const languages = [
  'English', 'Hindi', 'Spanish', 'French', 'Arabic', 'Portuguese',
  'Bengali', 'Russian', 'Urdu', 'German', 'Japanese', 'Korean',
  'Tamil', 'Telugu', 'Marathi', 'Punjabi', 'Other'
];

const channelTypes = [
  'Long Videos', 'Short Videos', 'Both Long & Short Videos'
];

const AdminUserChannels = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [channels, setChannels] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState('');

  // Edit Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const [form] = Form.useForm();
  const [updating, setUpdating] = useState(false);

  // View state: 'users' or 'channels'
  const [view, setView] = useState('users');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`${api}/users`);
      if (response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleSearchUser = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchUserQuery(value);
    const filtered = users.filter(u => 
      (u.name && u.name.toLowerCase().includes(value)) || 
      (u.email && u.email.toLowerCase().includes(value))
    );
    setFilteredUsers(filtered);
  };

  const handleViewUserChannels = async (user) => {
    setSelectedUser(user);
    setView('channels');
    setLoadingChannels(true);
    try {
      const response = await axiosInstance.get(`${api}/admin/users/${user._id}/channels`);
      setChannels(response.data?.channels || []);
    } catch (error) {
      console.error('Error fetching user channels:', error);
      message.error('Failed to load channels for this user');
      setChannels([]);
    } finally {
      setLoadingChannels(false);
    }
  };

  const handleBackToUsers = () => {
    setView('users');
    setSelectedUser(null);
    setChannels([]);
  };

  const handleDelete = async (channelId) => {
    try {
      await axiosInstance.delete(`${api}/channels/${channelId}`);
      message.success('Channel deleted successfully');
      setChannels(channels.filter(c => c._id !== channelId));
      // Optionally re-fetch users to update channel counts
      fetchUsers();
    } catch (error) {
      console.error('Error deleting channel:', error);
      message.error('Failed to delete channel');
    }
  };

  const handleEditClick = (channel) => {
    setEditingChannel(channel);

    // A channel is considered sold if the boolean flag is true OR if the
    // status string was set to "sold" / "Sold" (older records only used status).
    const isSold =
      channel.sold === true ||
      (typeof channel.status === 'string' &&
        channel.status.toLowerCase() === 'sold');

    form.setFieldsValue({
      name: channel.name,
      channelLink: channel.channelLink,
      customUrl: channel.customUrl,
      category: channel.category,
      channelType: channel.channelType,
      description: channel.description,
      price: channel.price,
      subscriberCount: channel.subscriberCount,
      viewCount: channel.viewCount,
      videoCount: channel.videoCount,
      estimatedEarnings: channel.estimatedEarnings,
      averageViewsPerVideo: channel.averageViewsPerVideo,
      recentViews: channel.recentViews,
      watchTimeHours: channel.watchTimeHours,
      country: channel.country,
      joinedDate: channel.joinedDate ? new Date(channel.joinedDate).toISOString().split('T')[0] : '',
      my_language: channel.my_language,
      copyrightStrike: channel.copyrightStrike || '0',
      communityStrike: channel.communityStrike || '0',
      monetized: channel.monetized || false,
      organicGrowth: channel.organicGrowth || false,
      status: channel.status || 'Available',
      sold: isSold,
      soldPrice: channel.soldPrice || '',
      userEmail: channel.contactInfo?.email || '',
      contactNumber: channel.contactInfo?.phone || '',
    });
    setIsEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setUpdating(true);

      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      await axiosInstance.put(`${api}/channels/${editingChannel._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      message.success('Channel updated successfully');
      setIsEditModalVisible(false);
      // Refresh channels for this user
      if (selectedUser) {
        const response = await axiosInstance.get(`${api}/admin/users/${selectedUser._id}/channels`);
        setChannels(response.data?.channels || []);
      }
    } catch (error) {
      console.error('Error updating channel:', error);
      message.error('Failed to update channel');
    } finally {
      setUpdating(false);
    }
  };

  const userColumns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => {
        const initials = (record?.name || record?.email || 'U').charAt(0).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar 
              src={record?.avatar}
              style={{ backgroundColor: '#1890ff' }} 
              icon={!record?.name && !record?.email && !record?.avatar ? <UserOutlined /> : null}
            >
              {!record?.avatar && (record?.name || record?.email) ? initials : null}
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">{record?.name || 'Unknown User'}</div>
              <div className="text-xs text-gray-500">{record?.email || '-'}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Channels Posted',
      dataIndex: 'channelCount',
      key: 'channelCount',
      sorter: (a, b) => (a.channelCount || 0) - (b.channelCount || 0),
      render: (count) => (
        <Tag color="purple" className="font-bold text-sm">
          {count || 0}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewUserChannels(record)}
          className="bg-purple-600 hover:bg-purple-700 border-none"
        >
          View Channels
        </Button>
      ),
    },
  ];

  const channelColumns = [
    {
      title: 'Channel Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img 
            src={record.imageUrls?.[0] || 'https://via.placeholder.com/40'} 
            alt={text} 
            className="w-10 h-10 rounded-full object-cover border shadow-sm" 
          />
          <span className="font-semibold text-gray-800">{text}</span>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => <Tag color="cyan">{cat}</Tag>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => Number(a.price) - Number(b.price),
      render: (price) => <span className="font-bold text-gray-700">₹{Number(price).toLocaleString()}</span>,
    },
    {
      title: 'Subscribers',
      dataIndex: 'subscriberCount',
      key: 'subscriberCount',
      sorter: (a, b) => Number(a.subscriberCount) - Number(b.subscriberCount),
      render: (count) => <span className="font-medium">{count?.toLocaleString()}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Monetized',
      dataIndex: 'monetized',
      key: 'monetized',
      render: (monetized) => (
        <Tag color={monetized ? 'blue' : 'default'}>
          {monetized ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Edit Channel">
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => handleEditClick(record)} 
              size="small"
              ghost
            />
          </Tooltip>
          <Popconfirm
            title="Delete the channel"
            description="Are you sure you want to permanently delete this channel?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Channel">
              <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const categories = [
    "Gaming", "Tech", "Finance", "Artificial intelligence",
    "Business & Entrepreneurship", "Education", "Health & Fitness",
    "Food", "Infotainment", "Vlogging", "Sports", "Commentary",
    "Entertainment", "Music", "Motivation & Self-Improvement", "Other"
  ];

  return (
    <div className="bg-white dark:bg-[#171127] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
      
      {view === 'users' && (
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <Title level={4} style={{ margin: 0 }}>Select a User to View Channels</Title>
            <Search 
              placeholder="Search by name or email..." 
              value={searchUserQuery}
              onChange={handleSearchUser}
              className="max-w-xs"
              size="large"
              allowClear
            />
          </div>

          <Table 
            columns={userColumns} 
            dataSource={filteredUsers} 
            rowKey="_id"
            loading={fetchingUsers}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty description="No users found." /> }}
            scroll={{ x: 600 }}
            className="shadow-sm border border-gray-50 rounded-lg overflow-hidden"
          />
        </div>
      )}

      {view === 'channels' && selectedUser && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBackToUsers}
              size="large"
              className="hover:bg-gray-50"
            >
              Back
            </Button>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {selectedUser.name || 'Unknown User'}'s Channels
              </Title>
              <Text type="secondary">{selectedUser.email}</Text>
            </div>
          </div>

          <Table 
            columns={channelColumns} 
            dataSource={channels} 
            rowKey="_id"
            loading={loadingChannels}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty description="This user hasn't posted any channels yet." /> }}
            scroll={{ x: 800 }}
            className="shadow-sm border border-gray-50 rounded-lg overflow-hidden"
          />
        </div>
      )}

      {/* Edit Channel Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <EditOutlined className="text-purple-600" />
            <span>Edit Channel Details</span>
          </div>
        }
        visible={isEditModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalVisible(false)}
        confirmLoading={updating}
        okText="Save Changes"
        cancelText="Cancel"
        destroyOnClose
        width={800}
      >
        <Form form={form} layout="vertical" className="mt-4 max-h-[70vh] overflow-y-auto px-2">
          {/* Section 1: Basic Info */}
          <div className="border-b border-gray-100 pb-2 mb-4">
            <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Basic Info</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="name" 
              label={<span className="font-medium text-gray-700">Channel Name</span>}
              rules={[{ required: true, message: 'Please enter channel name' }]}
            >
              <Input size="large" placeholder="Enter channel name" />
            </Form.Item>

            <Form.Item 
              name="customUrl" 
              label={<span className="font-medium text-gray-700">Custom URL / Handle</span>}
              rules={[{ required: true, message: 'Please enter custom URL' }]}
            >
              <Input size="large" placeholder="e.g. @channelhandle" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="channelLink" 
              label={<span className="font-medium text-gray-700">YouTube Channel Link</span>}
              rules={[{ required: true, message: 'Please enter YouTube link' }]}
            >
              <Input size="large" placeholder="https://youtube.com/..." />
            </Form.Item>

            <Form.Item 
              name="category" 
              label={<span className="font-medium text-gray-700">Category</span>}
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select size="large" placeholder="Select category">
                {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="channelType" 
              label={<span className="font-medium text-gray-700">Channel Type</span>}
              rules={[{ required: true, message: 'Please select channel type' }]}
            >
              <Select size="large" placeholder="Select channel type">
                {channelTypes.map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item 
              name="price" 
              label={<span className="font-medium text-gray-700">Price (₹)</span>}
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber size="large" className="w-full" min={0} placeholder="e.g. 15000" />
            </Form.Item>
          </div>

          {/* Section 2: Stats */}
          <div className="border-b border-gray-100 pb-2 mb-4 mt-6">
            <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Stats</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="subscriberCount" 
              label={<span className="font-medium text-gray-700">Subscribers</span>}
              rules={[{ required: true, message: 'Please enter subscriber count' }]}
            >
              <InputNumber size="large" className="w-full" min={0} placeholder="Total subs" />
            </Form.Item>

            <Form.Item 
              name="viewCount" 
              label={<span className="font-medium text-gray-700">Total Views</span>}
              rules={[{ required: true, message: 'Please enter total views' }]}
            >
              <InputNumber size="large" className="w-full" min={0} placeholder="Total views" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="videoCount" 
              label={<span className="font-medium text-gray-700">Total Videos</span>}
              rules={[{ required: true, message: 'Please enter total videos' }]}
            >
              <InputNumber size="large" className="w-full" min={0} placeholder="Total videos" />
            </Form.Item>

            <Form.Item 
              name="estimatedEarnings" 
              label={<span className="font-medium text-gray-700">Estimated Monthly Earnings (₹)</span>}
              rules={[{ required: true, message: 'Please enter estimated earnings' }]}
            >
              <InputNumber size="large" className="w-full" min={0} placeholder="Monthly earnings" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="averageViewsPerVideo" 
              label={<span className="font-medium text-gray-700">Avg Views per Video</span>}
              rules={[{ required: true, message: 'Please enter average views' }]}
            >
              <InputNumber size="large" className="w-full" min={0} placeholder="Average views" />
            </Form.Item>

            <Form.Item 
              name="recentViews" 
              label={<span className="font-medium text-gray-700">Recent Views (30d)</span>}
              rules={[{ required: true, message: 'Please enter recent views' }]}
            >
              <InputNumber size="large" className="w-full" min={0} placeholder="Views last 30 days" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="watchTimeHours" 
              label={<span className="font-medium text-gray-700">Watch Time (Hours)</span>}
              rules={[{ required: true, message: 'Please enter watch time hours' }]}
            >
              <InputNumber size="large" className="w-full" min={0} placeholder="Watch time" />
            </Form.Item>

            <Form.Item 
              name="joinedDate" 
              label={<span className="font-medium text-gray-700">Joined Date</span>}
              rules={[{ required: true, message: 'Please enter joined date' }]}
            >
              <Input size="large" type="date" />
            </Form.Item>
          </div>

          {/* Section 3: Channel details & configuration */}
          <div className="border-b border-gray-100 pb-2 mb-4 mt-6">
            <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Details & Strikes</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="country" 
              label={<span className="font-medium text-gray-700">Audience Country</span>}
              rules={[{ required: true, message: 'Please select country' }]}
            >
              <Select size="large" placeholder="Select country">
                {countries.map(c => <Option key={c} value={c}>{c}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item 
              name="my_language" 
              label={<span className="font-medium text-gray-700">Language</span>}
              rules={[{ required: true, message: 'Please select language' }]}
            >
              <Select size="large" placeholder="Select language">
                {languages.map(l => <Option key={l} value={l}>{l}</Option>)}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="copyrightStrike" 
              label={<span className="font-medium text-gray-700">Copyright Strikes</span>}
              rules={[{ required: true, message: 'Please select copyright strike count' }]}
            >
              <Select size="large">
                <Option value="0">0 Strikes</Option>
                <Option value="1">1 Strike</Option>
                <Option value="2">2 Strikes</Option>
                <Option value="3+">3+ Strikes</Option>
              </Select>
            </Form.Item>

            <Form.Item 
              name="communityStrike" 
              label={<span className="font-medium text-gray-700">Community Strikes</span>}
              rules={[{ required: true, message: 'Please select community strike count' }]}
            >
              <Select size="large">
                <Option value="0">0 Strikes</Option>
                <Option value="1">1 Strike</Option>
                <Option value="2">2 Strikes</Option>
                <Option value="3+">3+ Strikes</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Section 4: Contact Info */}
          <div className="border-b border-gray-100 pb-2 mb-4 mt-6">
            <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Contact Info</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="userEmail" 
              label={<span className="font-medium text-gray-700">Seller Email</span>}
              rules={[
                { required: true, message: 'Please enter seller email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input size="large" placeholder="seller@example.com" />
            </Form.Item>

            <Form.Item 
              name="contactNumber" 
              label={<span className="font-medium text-gray-700">Seller Phone Number</span>}
              rules={[{ required: true, message: 'Please enter seller phone' }]}
            >
              <Input size="large" placeholder="e.g. +91 9999999999" />
            </Form.Item>
          </div>

          {/* Section 5: Settings */}
          <div className="border-b border-gray-100 pb-2 mb-4 mt-6">
            <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Settings & Status</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <Form.Item 
              name="monetized" 
              label={<span className="font-medium text-gray-700">Monetized</span>}
              valuePropName="checked"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>

            <Form.Item 
              name="organicGrowth" 
              label={<span className="font-medium text-gray-700">Organic Growth</span>}
              valuePropName="checked"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>

            <Form.Item 
              name="status" 
              label={<span className="font-medium text-gray-700">Status</span>}
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select size="large">
                <Option value="Available">Available</Option>
                <Option value="approved">Approved</Option>
                <Option value="sold">Sold</Option>
                <Option value="unsold">Unsold</Option>
                <Option value="pending">Under Review</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Section 6: Mark as Sold */}
          <div className="border-b border-gray-100 pb-2 mb-4 mt-6">
            <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider flex items-center gap-1">
              <TagOutlined /> Mark as Sold
            </h3>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)',
              border: '1px solid #fecaca',
              borderRadius: 10,
              padding: '16px 20px',
              marginBottom: 8,
            }}
          >
            <div className="grid grid-cols-2 gap-4 items-start">
              <Form.Item
                name="sold"
                label={<span className="font-semibold text-gray-800">Mark Channel as Sold</span>}
                valuePropName="checked"
                extra={
                  <span className="text-xs text-gray-500">
                    Enabling this will hide the channel from the marketplace and flag it as sold.
                  </span>
                }
              >
                <Switch
                  checkedChildren="✅ Sold"
                  unCheckedChildren="Not Sold"
                  style={{ minWidth: 90 }}
                  onChange={(checked) => {
                    // Auto-sync the status dropdown when toggled
                    if (checked) {
                      form.setFieldValue('status', 'sold');
                    } else {
                      form.setFieldValue('status', 'approved');
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, cur) => prev.sold !== cur.sold}
              >
                {({ getFieldValue }) =>
                  getFieldValue('sold') ? (
                    <Form.Item
                      name="soldPrice"
                      label={<span className="font-semibold text-gray-800">Sold Price (₹)</span>}
                      rules={[{ required: true, message: 'Please enter the sold price' }]}
                      extra={
                        <span className="text-xs text-gray-500">
                          The final price at which this channel was sold.
                        </span>
                      }
                    >
                      <InputNumber
                        size="large"
                        className="w-full"
                        min={0}
                        placeholder="e.g. 25000"
                        prefix="₹"
                        formatter={(val) => val ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                        parser={(val) => val.replace(/,/g, '')}
                      />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </div>
          </div>

          <Form.Item 
            name="description" 
            label={<span className="font-medium text-gray-700">Description</span>}
            rules={[{ required: true, message: 'Please enter channel description' }]}
            className="mt-4"
          >
            <Input.TextArea size="large" rows={4} placeholder="Enter channel description..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserChannels;
