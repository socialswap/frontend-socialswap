import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, List, message, Spin, Modal, Form, Input } from 'antd';
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

// Previous styled components remain the same...
const StyledCard = styled(Card)`
  width: 100%;
  max-width: 480px;
  margin: 4rem auto;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255,255,255,0.78), rgba(255,255,255,0.65)) padding-box,
              linear-gradient(120deg, #7c3aed, #06b6d4, #f43f5e) border-box;
  border: 1px solid transparent;
  box-shadow: 0 20px 40px rgba(17, 12, 46, 0.08);
  backdrop-filter: blur(10px);
  transition: transform 220ms ease, box-shadow 220ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 24px 48px rgba(17, 12, 46, 0.12);
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  padding: 1.75rem 0 1.25rem;
  position: relative;
  border-bottom: 1px dashed rgba(0,0,0,0.06);
  margin-bottom: 1rem;

  .back-button {
    position: absolute;
    left: 0;
    top: 1rem;
    border: none;
    background: none;
    padding: 8px;
    cursor: pointer;
    color: #6b7280;
    border-radius: 12px;
    transition: background 180ms ease, transform 180ms ease, color 180ms ease;
  }
  .back-button:hover {
    background: rgba(124, 58, 237, 0.08);
    color: #7c3aed;
    transform: translateX(-1px);
  }

  .header-text {
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: .3px;
    background: linear-gradient(120deg, #7c3aed, #06b6d4);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .avatar-container {
    margin: 1rem 0 0.75rem;
  }
  .avatar-container img {
    height: 88px;
    width: 88px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.9);
    box-shadow: 0 10px 24px rgba(17, 12, 46, 0.12), 0 0 0 6px rgba(124, 58, 237, 0.08);
    object-fit: cover;
  }

  .username {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0.6rem 0 0.15rem;
    color: #0f172a;
    letter-spacing: 0.2px;
  }

  .user-handle {
    color: #64748b;
    margin: 0;
    font-size: 0.9rem;
  }
`;

const EditButton = styled(Button)`
  background-image: linear-gradient(120deg, #7c3aed, #06b6d4);
  color: #fff;
  border-radius: 999px;
  border: none;
  padding: 6px 18px;
  margin-top: 0.75rem;
  box-shadow: 0 10px 20px rgba(124, 58, 237, 0.18);
  transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
  font-weight: 600;

  &:hover {
    filter: brightness(1.03);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(124, 58, 237, 0.22);
  }
`;

const StyledList = styled(List)`
  .ant-list-item {
    padding: 14px 18px;
    cursor: pointer;
    border-radius: 14px;
    margin: 6px 8px;
    border: 1px solid rgba(124, 58, 237, 0.08);
    background: rgba(255,255,255,0.6);
    transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
    
    &:hover {
      background-color: rgba(124, 58, 237, 0.04);
      transform: translateY(-1px);
      box-shadow: 0 10px 22px rgba(17, 12, 46, 0.06);
      border-color: rgba(124, 58, 237, 0.18);
    }

    .ant-list-item-meta-title {
      margin: 0;
      font-weight: 600;
      color: #0f172a;
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


  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { 'x-auth-token': token };
  };

  const fetchUserProfile = useCallback(async () => {
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
  }, [profileForm]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

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