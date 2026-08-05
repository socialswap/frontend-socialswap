import React, { useState, useEffect, useMemo, useRef } from 'react';
import axiosInstance from '../../API/api';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Card,
  Tag,
  Avatar,
  Space,
  Tooltip,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Empty,
  Typography,
  Tabs,
  ConfigProvider,
  theme,
} from 'antd';
import { ReloadOutlined, UserOutlined, TeamOutlined, SafetyCertificateOutlined, SearchOutlined, DeleteOutlined, EyeOutlined, MessageOutlined } from '@ant-design/icons';
import { api } from '../../API/api';
import AdminChannels from './AdminChannels';
import AdminTransactions from './AdminTransactions';
import AdminChat from './AdminChat';
import AdminBlogs from './AdminBlogs';
import AdminDeals from './AdminDeals';
import AdminServices from './AdminServices';
import AdminUserChannels from './AdminUserChannels';
import AdminTestimonials from './AdminTestimonials';
import AdminHomeVideo from './AdminHomeVideo';
import SEOHead from '../../Component/SEO/SEOHead';

const { Option } = Select;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('users');
  const [openChatUserId, setOpenChatUserId] = useState(null);
  const [form] = Form.useForm();
  const tabScrollRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark') || 
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDarkMode(isDark);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${api}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      ...user,
      status: user.status || 'active'
    });
    setModalVisible(true);
  };

  const handleUpdateUser = async (values) => {
    try {
      await axiosInstance.put(`${api}/users/${selectedUser._id}/admin-update`, {
        role: values.role,
        status: values.status
      });
      message.success('User updated successfully');
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`${api}/users/${userId}`);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const handleStartChat = (user) => {
    setOpenChatUserId(user._id);
    setActiveTab('chats');
  };

  const totalUsers = users.length;
  const totalAdmins = useMemo(() => users.filter((u) => u.role === 'admin').length, [users]);
  const totalRegular = useMemo(() => users.filter((u) => u.role === 'user').length, [users]);

  const filteredUsers = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    return users
      .filter((u) => (roleFilter === 'all' ? true : u.role === roleFilter))
      .filter((u) => {
        if (!text) return true;
        const name = (u.name || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        return name.includes(text) || email.includes(text);
      });
  }, [users, searchText, roleFilter]);

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => {
        const initials = (record?.name || record?.email || 'U').charAt(0).toUpperCase();
        return (
          <Space>
            <Avatar 
              src={record?.avatar} 
              style={{ backgroundColor: '#1890ff' }} 
              icon={!record?.name && !record?.email && !record?.avatar ? <UserOutlined /> : null}
            >
              {!record?.avatar && (record?.name || record?.email) ? initials : null}
            </Avatar>
            <div>
              <div className="font-medium">{record?.name || '-'}</div>
              <Text type="secondary" style={{ fontSize: 12 }}>{record?.email || '-'}</Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) =>
        role === 'admin' ? (
          <Tag color="geekblue" icon={<SafetyCertificateOutlined />}>Admin</Tag>
        ) : (
          <Tag color="green">User</Tag>
        ),
    },
    {
      title: 'Channels',
      dataIndex: 'channelCount',
      key: 'channelCount',
      sorter: (a, b) => (a.channelCount || 0) - (b.channelCount || 0),
      render: (count) => (
        <Tag color="purple">{count || 0} Posted</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Suspended', value: 'suspended' },
        { text: 'Disabled', value: 'disabled' },
        { text: 'Deleted', value: 'deleted' },
      ],
      onFilter: (value, record) => (record.status || 'active') === value,
      render: (status) => {
        const currentStatus = status || 'active';
        let color = 'green';
        if (currentStatus === 'suspended') color = 'orange';
        else if (currentStatus === 'disabled') color = 'red';
        else if (currentStatus === 'deleted') color = 'gray';
        return <Tag color={color}>{currentStatus.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View details">
            <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          </Tooltip>
          <Tooltip title="Chat with user">
            <Button icon={<MessageOutlined />} style={{ color: '#7C3AED', borderColor: '#7C3AED' }} onClick={() => handleStartChat(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete user?"
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteUser(record._id)}
          >
            <Tooltip title="Delete user">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const usersTabContent = (
    <>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8}>
          <Card bordered hoverable>
            <Space>
              <Avatar size="large" style={{ backgroundColor: '#1677ff' }} icon={<TeamOutlined />} />
              <div>
                <Statistic title="Total Users" value={totalUsers} />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered hoverable>
            <Space>
              <Avatar size="large" style={{ backgroundColor: '#2f54eb' }} icon={<SafetyCertificateOutlined />} />
              <div>
                <Statistic title="Admins" value={totalAdmins} />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered hoverable>
            <Space>
              <Avatar size="large" style={{ backgroundColor: '#52c41a' }} icon={<UserOutlined />} />
              <div>
                <Statistic title="Regular Users" value={totalRegular} />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card bordered className="mb-6">
        <Row gutter={[12, 12]} align="middle" className="mb-4">
          <Col xs={24} md={12}>
            <Input
              allowClear
              size="large"
              placeholder="Search by name or email"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} md="auto">
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              size="large"
              style={{ minWidth: 160 }}
            >
              <Option value="all">All Roles</Option>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Col>
        </Row>

        <div className="-mx-2 md:mx-0 overflow-x-auto">
          <div className="min-w-[640px] md:min-w-0 px-2 md:px-0">
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="_id"
              loading={loading}
              bordered
              size="middle"
              locale={{ emptyText: <Empty description="No users found" /> }}
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                defaultPageSize: 10,
                showTotal: (total) => `Total ${total} users`,
              }}
            />
          </div>
        </div>
      </Card>
    </>
  );

  const tabItems = [
    {
      key: 'users',
      label: 'Users',
      children: usersTabContent,
    },
    {
      key: 'channels',
      label: 'Channels',
      children: <AdminChannels />,
    },
    {
      key: 'transactions',
      label: 'Transactions',
      children: <AdminTransactions />,
    },
    {
      key: 'chats',
      label: 'Chats & Deals',
      children: <AdminChat isEmbedded={true} prefillUserId={openChatUserId} />,
    },
    {
      key: 'deals_management',
      label: 'Escrow Deals',
      children: <AdminDeals />,
    },
    {
      key: 'blogs',
      label: 'Blog Management',
      children: <AdminBlogs isEmbedded={true} />,
    },
    {
      key: 'services',
      label: 'Services',
      children: <AdminServices />,
    },
    {
      key: 'user_channels',
      label: "User's Channel",
      children: <AdminUserChannels />,
    },
    {
      key: 'testimonials',
      label: 'Testimonials',
      children: <AdminTestimonials isEmbedded={true} />,
    },
    {
      key: 'home_video',
      label: 'Home Video',
      children: <AdminHomeVideo />,
    },
  ];

  return (
    <ConfigProvider 
      theme={{ 
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: isDarkMode ? {
          colorBgBase: '#07030F',
          colorBgContainer: '#171127',
          colorBgElevated: '#1f1635',
          colorBorder: 'rgba(255,255,255,0.08)',
          colorPrimary: '#7C3AED',
          colorTextBase: '#ffffff',
        } : {
          colorPrimary: '#7C3AED',
        }
      }}
    >
      <SEOHead title="Admin Dashboard | SocialSwap" noIndex={true} />
      <div className="max-w-7xl mx-auto mt-20 px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-2">
          <Tooltip title="Refresh">
            <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={loading}>
              Refresh
            </Button>
          </Tooltip>
        </div>
      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems} 
        destroyInactiveTabPane={true}
        size="large"
        className="admin-dashboard-tabs"
        renderTabBar={(props, DefaultTabBar) => (
          <div
            ref={tabScrollRef}
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              paddingBottom: '6px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#7C3AED #f0ebff',
            }}
            className="admin-tabs-scroll-bar"
          >
            <DefaultTabBar {...props} style={{ width: 'max-content', marginBottom: 0 }} />
          </div>
        )}
      />

      <Modal
        title="User Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Space align="start" className="mb-4">
          <Avatar 
            size={48} 
            src={selectedUser?.avatar} 
            style={{ backgroundColor: '#1677ff' }} 
            icon={!selectedUser?.avatar ? <UserOutlined /> : null}
          >
            {!selectedUser?.avatar ? (selectedUser?.name || selectedUser?.email || 'U').charAt(0).toUpperCase() : null}
          </Avatar>
          <div>
            <Title level={5} style={{ margin: 0 }}>{selectedUser?.name || '-'}</Title>
            <Text type="secondary">{selectedUser?.email || '-'}</Text>
            {selectedUser?.channelCount !== undefined && (
              <div className="mt-1">
                <Tag color="purple">{selectedUser.channelCount} Channels Posted</Tag>
              </div>
            )}
          </div>
        </Space>
        <Form layout="vertical" form={form} onFinish={handleUpdateUser}>
          <Form.Item name="name" label="Name">
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="suspended">Suspended</Option>
              <Option value="disabled">Disabled</Option>
              <Option value="deleted">Deleted</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Update User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </ConfigProvider>
  );
};

export default AdminDashboard;