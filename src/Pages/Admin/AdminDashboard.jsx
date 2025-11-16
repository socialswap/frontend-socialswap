import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
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
} from 'antd';
import { PictureOutlined, ReloadOutlined, UserOutlined, TeamOutlined, SafetyCertificateOutlined, SearchOutlined, DeleteOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../../API/api';
import AdminChannels from './AdminChannels';
import AdminTransactions from './AdminTransactions';

const { Option } = Select;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleUpdateRole = async (values) => {
    try {
      await axios.put(`${api}/users/${selectedUser._id}/role`, { role: values.role });
      message.success('User role updated successfully');
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      message.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${api}/users/${userId}`);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
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
            <Avatar style={{ backgroundColor: '#1890ff' }} icon={!record?.name && !record?.email ? <UserOutlined /> : null}>
              {record?.name || record?.email ? initials : null}
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View details">
            <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
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

  return (
    <div className="p-6 mt-20">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ margin: 0 }}>Admin Dashboard</Title>
        <Space>
          <Tooltip title="Refresh">
            <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={loading}>
              Refresh
            </Button>
          </Tooltip>
          <Button
            type="primary"
            icon={<PictureOutlined />}
            onClick={() => navigate('/admin/banners')}
            size="large"
          >
            Manage Banners
          </Button>
          <Button
            type="default"
            icon={<FileTextOutlined />}
            onClick={() => navigate('/admin/blogs')}
            size="large"
          >
            Manage Blogs
          </Button>
        </Space>
      </div>

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

      <Card bordered>
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
      </Card>

      <Modal
        title="User Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Space align="start" className="mb-4">
          <Avatar size={48} style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />}>
            {(selectedUser?.name || selectedUser?.email || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Title level={5} style={{ margin: 0 }}>{selectedUser?.name || '-'}</Title>
            <Text type="secondary">{selectedUser?.email || '-'}</Text>
          </div>
        </Space>
        <Form layout="vertical" form={form} onFinish={handleUpdateRole}>
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
          <Form.Item>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Update Role
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <div className="mt-8">
        <AdminChannels />
      </div>
      <div className="mt-8">
        <AdminTransactions />
      </div>
    </div>
  );
};

export default AdminDashboard;