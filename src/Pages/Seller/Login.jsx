import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axiosInstance.post(`${api}/auth/login`, values, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', user?.role);
        
        message.success('Login successful!');
        
        if (user.role === 'buyer') {
          return navigate('/');
        }
        if (user.role === 'seller') {
          return navigate('/seller-dashboard');
        }
        if (user.role === 'admin') {
          return navigate('/admin-dashboard');
        }
      } else {
        message.error(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>

      {/* Glass card */}
      <Card 
        className="w-full max-w-md backdrop-blur-md bg-white/30 border border-white/50 shadow-lg"
        style={{
          borderRadius: '16px',
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Email"
              className="h-10 !bg-white/50 border-white/50 hover:!bg-white/70 focus:!bg-white/70 transition-all duration-300"
              style={{
                borderRadius: '8px',
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="Password"
              className="h-10 !bg-white/50 border-white/50 hover:!bg-white/70 focus:!bg-white/70 transition-all duration-300"
              style={{
                borderRadius: '8px',
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-10 bg-gradient-to-r from-[#F83758] to-[#D62D4C] hover:from-[#D62D4C] hover:to-[#F83758] border-none transition-all duration-300"
              style={{
                borderRadius: '8px',
              }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center">
          <a 
            href='https://api.whatsapp.com/send/?phone=8010803291&text=Hello%2C+I have forgot the password can u please help' 
            className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
          >
            Forgot password?
          </a>
        </div>
        <div className="text-center mt-4">
          <span className="text-gray-700">Don't have an account? </span>
          <Link 
            to="/signup" 
            className="text-[#F83758] hover:text-[#D62D4C] transition-colors duration-300"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;