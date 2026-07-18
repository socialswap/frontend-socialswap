import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Button, List, message, Spin, Modal, Form, Input, Switch } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  ShoppingOutlined, 
  DashboardOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  TransactionOutlined,
  BellOutlined,
  CameraOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import axiosInstance, { api } from '../../API/api';
import { useNavigate } from 'react-router-dom';
import { subscribeToPush, unsubscribeFromPush } from '../../App';
import imageCompression from 'browser-image-compression';

// Previous styled components remain the same...
const StyledCard = styled(Card)`
  width: 100%;
  max-width: 100%;
  margin: 0;
  border-radius: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card, 0 8px 32px rgba(124,58,237,0.1));
  backdrop-filter: blur(10px);
  transition: transform 220ms ease, box-shadow 220ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-purple, 0 12px 40px rgba(124,58,237,0.15));
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
  
  .avatar-overlay {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #7c3aed;
    color: white;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
  }
  
  .avatar-overlay:hover {
    transform: scale(1.1);
    background: #6d28d9;
  }

  .username {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0.6rem 0 0.15rem;
    color: var(--text-primary);
    letter-spacing: 0.2px;
  }

  .user-handle {
    color: var(--text-secondary);
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
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
    
    &:hover {
      background-color: rgba(124, 58, 237, 0.08);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: rgba(124, 58, 237, 0.3);
    }

    .ant-list-item-meta-title {
      margin: 0;
      font-weight: 600;
      color: var(--text-primary);
    }
  }
`;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const fileInputRef = useRef(null);
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const navigate = useNavigate();

  // Notification toggle state — checks REAL subscription, not just browser permission
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  // Check if a real push subscription currently exists in the browser
  const checkSubscriptionStatus = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    if (!('Notification' in window) || Notification.permission !== 'granted') return false;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      return !!sub; // true if subscribed, false if not
    } catch {
      return false;
    }
  };

  useEffect(() => {
    checkSubscriptionStatus().then(setNotifEnabled);
  }, []);

  const handleNotifToggle = async (checked) => {
    setNotifLoading(true);
    try {
      if (checked) {
        // Request browser permission first
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          const sub = await subscribeToPush();
          if (sub) {
            setNotifEnabled(true);
            message.success('🔔 Push notifications enabled!');
          } else {
            setNotifEnabled(false);
            message.error('Failed to subscribe. Please try again.');
          }
        } else if (perm === 'denied') {
          setNotifEnabled(false);
          message.warning(
            'Notifications are blocked. Click the 🔒 icon in your browser address bar → Notifications → Allow.',
            6
          );
        }
      } else {
        // Unsubscribe from push manager AND remove from backend
        await unsubscribeFromPush();
        const stillActive = await checkSubscriptionStatus();
        setNotifEnabled(stillActive);
        if (!stillActive) {
          message.success('🔕 Push notifications disabled.');
          message.info(
            'Note: Browser-level permission stays "Allowed" — only our app stops sending you pushes.',
            5
          );
        }
      }
    } catch (err) {
      console.error('[Push Toggle]', err);
      message.error('Something went wrong. Try refreshing.');
    } finally {
      setNotifLoading(false);
    }
  };


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
      profileForm.setFieldsValue({ 
        name: response.data.name,
        mobile: response.data.mobile
      });
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

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      message.loading({ content: 'Optimizing and uploading image...', key: 'avatarUpload' });
      
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/webp',
      };
      const compressedFile = await imageCompression(file, options);
      
      const formData = new FormData();
      formData.append('avatar', compressedFile, compressedFile.name.replace(/\.[^/.]+$/, "") + ".webp");

      const response = await axiosInstance.post(`${api}/profile/avatar`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setUser(prev => ({ ...prev, avatar: response.data.url }));
        message.success({ content: 'Profile photo updated successfully!', key: 'avatarUpload' });
        // Optionally update localStorage if Header relies on it, though Header fetches it now
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      message.error({ content: 'Failed to upload profile photo', key: 'avatarUpload' });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      title: 'Change Password',
      icon: <LockOutlined />,
      onClick: () => setIsPasswordModalVisible(true),
      action: null
    },
    {
      title: 'Push Notifications',
      icon: <BellOutlined />,
      onClick: null,
      action: (
        <Switch
          checked={notifEnabled}
          loading={notifLoading}
          onChange={handleNotifToggle}
          checkedChildren="On"
          unCheckedChildren="Off"
          style={{ background: notifEnabled ? '#6d28d9' : undefined }}
        />
      )
    },
    {
      title: 'Help & Support',
      icon: <QuestionCircleOutlined />,
      onClick: () => handleMakeOffer(),
      action: null
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
          <span className="header-text">Profile</span>
          <div className="avatar-container m-auto flex items-center justify-center">
            <div className="relative inline-block">
              <Spin spinning={uploadingAvatar}>
                <img src={user?.avatar || "/images/userImg.jpg"} alt="User Avatar" />
              </Spin>
              <div 
                className="avatar-overlay" 
                onClick={() => fileInputRef.current?.click()}
              >
                <CameraOutlined style={{ fontSize: '14px' }} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>
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
            <List.Item
              onClick={item.action ? undefined : item.onClick}
              style={{ cursor: item.action ? 'default' : 'pointer' }}
              extra={item.action}
            >
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
          initialValues={{ name: user?.name, mobile: user?.mobile }}
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
          <Form.Item
            name="mobile"
            label="Mobile Number"
            rules={[
              { required: false, message: 'Please enter your mobile number' },
              { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="e.g. 9876543210" />
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