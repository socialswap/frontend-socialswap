import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const { confirmPassword, ...signupData } = values;
      console.log('Payload to send:', { ...signupData });

      const response = await axiosInstance.post(`${api}/auth/signup`, { ...signupData });

      if (response.data.success) {
        message.success('Signup successful! Please login.');
        navigate('/login');
      } else {
        message.error(response.data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      message.error(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>

      <Card 
        className="w-full max-w-lg backdrop-blur-md bg-white/30 border border-white/50 shadow-lg"
        style={{
          borderRadius: '16px',
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Your Account</h2>
        
        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ role: 'buyer' }}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Full Name" 
              className="h-10 !bg-white/50 border-white/50 hover:!bg-white/70 focus:!bg-white/70 transition-all duration-300"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />} 
              placeholder="Email" 
              className="h-10 !bg-white/50 border-white/50 hover:!bg-white/70 focus:!bg-white/70 transition-all duration-300"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Please input your phone number!' },
              { pattern: /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, message: 'Please enter a valid phone number!' }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined className="text-gray-400" />} 
              placeholder="Phone Number" 
              className="h-10 !bg-white/50 border-white/50 hover:!bg-white/70 focus:!bg-white/70 transition-all duration-300"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters long!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="Password" 
              className="h-10 !bg-white/50 border-white/50 hover:!bg-white/70 focus:!bg-white/70 transition-all duration-300"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="Confirm Password" 
              className="h-10 !bg-white/50 border-white/50 hover:!bg-white/70 focus:!bg-white/70 transition-all duration-300"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item name="role" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-10 bg-gradient-to-r from-[#F83758] to-[#D62D4C] hover:from-[#D62D4C] hover:to-[#F83758] border-none transition-all duration-300"
              style={{ borderRadius: '8px' }}
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>
        
        <div className="text-center mt-4">
          <span className="text-gray-700">Already have an account? </span>
          <Link 
            to="/login" 
            className="text-[#F83758] hover:text-[#D62D4C] transition-colors duration-300"
          >
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;