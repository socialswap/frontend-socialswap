import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Button, List, message, Spin, Modal, Form, Input } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  ShoppingOutlined, 
  DashboardOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
  TransactionOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import axiosInstance, { api } from '../../API/api';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

// Previous styled components remain the same...
const StyledCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  margin: 4rem auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 16px;
`;

const ProfileHeader = styled.div`
  text-align: center;
  padding: 1.5rem 0;
  position: relative;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 1rem;

  .back-button {
    position: absolute;
    left: 0;
    top: 1rem;
    border: none;
    background: none;
    padding: 8px;
    cursor: pointer;
  }

  .header-text {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .avatar-container {
    margin: 1rem 0;
  }

  .username {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0.5rem 0 0.25rem;
  }

  .user-handle {
    color: #666;
    margin: 0;
  }
`;

const EditButton = styled(Button)`
  background-color: #000;
  color: white;
  border-radius: 20px;
  border: none;
  padding: 4px 16px;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #333;
    color: white;
  }
`;

const StyledList = styled(List)`
  .ant-list-item {
    padding: 12px 24px;
    cursor: pointer;
    
    &:hover {
      background-color: #f9f9f9;
    }

    .ant-list-item-meta-title {
      margin: 0;
    }
  }
`;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { 'x-auth-token': token };
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${api}/profile`, {
        headers: getAuthHeader()
      });
      setUser(response.data);
      profileForm.setFieldsValue({ name: response.data.name });
    } catch (error) {
      message.error('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileEdit = async (values) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`${api}/profile`, values, {
        headers: getAuthHeader()
      });
      setUser(response.data);
      message.success('Profile updated successfully');
      setIsEditProfileModalVisible(false);
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);
      await axiosInstance.put(`${api}/changePassword`, values, {
        headers: getAuthHeader()
      });
      message.success('Password updated successfully');
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Current password is incorrect');
      } else {
        message.error('Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };
  const handleMakeOffer = () => {
    const message = encodeURIComponent(`Hello, I'm interested in buying/selling the YouTube channel`);
    const whatsappUrl = `https://wa.me/+919423523291?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };
  const menuItems = [
    {
      title: 'Seller Panel',
      icon: <DashboardOutlined /> ,
      onClick: () => navigate('/seller-dashboard')
    },
    {
      title: 'My Channels',
      icon: <SettingOutlined />,
      onClick: () => navigate('/my-channels')
    },
    {
      title: 'My Orders',
      icon: <ShoppingOutlined />,
      onClick: () => navigate('/orders')
    },
    {
      title: 'Transactions',
      icon: <TransactionOutlined />,
      onClick: () => navigate('/transactions')
    },
    {
      title: 'Change Password',
      icon: <LockOutlined />,
      onClick: () => setIsPasswordModalVisible(true)
    },
    {
      title: 'Help & Support',
      icon: <QuestionCircleOutlined />,
      onClick: () => handleMakeOffer()
    },
    {
      title: 'Log out',
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  ];

  if (loading) {
    return (
      <StyledCard>
        <Spin size="large" />
      </StyledCard>
    );
  }

  return (
    <>
      <StyledCard bordered={false}>
        <ProfileHeader>
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeftOutlined />
          </button>
          <span className="header-text">Profile</span>
          <div className="avatar-container m-auto flex align-center justify-center">
            <img src="/images/userImg.jpg" alt="" style={{height:'82px'}}/>
          </div>
          <h3 className="username">{user?.name || 'User Name'}</h3>
          <p className="user-handle">@{user?.handle || user?.name?.toLowerCase().replace(/\s/g, '') || 'username'}</p>
          <EditButton onClick={() => setIsEditProfileModalVisible(true)}>
            Edit Profile
          </EditButton>
        </ProfileHeader>

        <StyledList
          itemLayout="horizontal"
          dataSource={menuItems}
          renderItem={item => (
            <List.Item onClick={item.onClick}>
              <List.Item.Meta
                avatar={item.icon}
                title={item.title}
              />
            </List.Item>
          )}
        />
      </StyledCard>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        visible={isEditProfileModalVisible}
        onCancel={() => setIsEditProfileModalVisible(false)}
        footer={null}
      >
        <Form 
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileEdit}
          initialValues={{ name: user?.name }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, message: 'Name must be at least 2 characters' }
            ]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Changes
            </Button>
            <Button 
              style={{ marginLeft: 8 }}
              onClick={() => setIsEditProfileModalVisible(false)}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        visible={isPasswordModalVisible}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form 
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Password
            </Button>
            <Button 
              style={{ marginLeft: 8 }}
              onClick={() => {
                setIsPasswordModalVisible(false);
                passwordForm.resetFields();
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserProfile;