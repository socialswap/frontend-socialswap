import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../../API/api';
import AdminChannels from './AdminChannels';
import AdminTransactions from './AdminTransactions';

const { Option } = Select;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => handleViewDetails(record)}>View Details</Button>
          <Button onClick={() => handleDeleteUser(record._id)} danger>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button
          type="primary"
          icon={<PictureOutlined />}
          onClick={() => navigate('/admin/banners')}
          size="large"
        >
          Manage Banners
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="_id"
        loading={loading}
      />
      
      <Modal
        title="User Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdateRole}>
          <Form.Item name="name" label="Name">
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Role
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <AdminChannels/>
      <AdminTransactions/>
    </div>
  );
};

export default AdminDashboard;