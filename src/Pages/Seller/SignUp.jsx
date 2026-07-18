import React from 'react';
import { Form, Input, Button, message } from 'antd';
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
    <div className="futuristic-login-container min-h-screen flex justify-center items-center bg-gradient-to-br from-[#f5f5f5] via-[#ffffff] to-[#fafafa] dark:bg-gradient-to-br dark:from-[#070312] dark:via-[#110824] dark:to-[#0D071C] dark:text-white relative overflow-hidden p-5 font-sans">
      {/* Floating background gradient circles */}
      <div className="absolute rounded-full pointer-events-none z-[1] filter blur-[40px] opacity-20 w-[300px] h-[300px] bg-gradient-to-br from-[rgba(255,255,255,0.4)] to-[rgba(255,255,255,0.2)] dark:bg-gradient-to-br dark:from-[rgba(124,58,237,0.45)] dark:to-[rgba(124,58,237,0.1)] top-[20%] right-[10%] animate-orb-float-1" aria-hidden="true" />
      <div className="absolute rounded-full pointer-events-none z-[1] filter blur-[40px] opacity-20 w-[250px] h-[250px] bg-gradient-to-br from-[rgba(255,255,255,0.35)] to-[rgba(255,255,255,0.15)] dark:bg-gradient-to-br dark:from-[rgba(217,70,239,0.35)] dark:to-[rgba(217,70,239,0.05)] bottom-[20%] left-[10%] animate-orb-float-2" aria-hidden="true" />
      <div className="absolute rounded-full pointer-events-none z-[1] filter blur-[40px] opacity-20 w-[200px] h-[200px] bg-gradient-to-br from-[rgba(255,255,255,0.3)] to-[rgba(255,255,255,0.1)] dark:bg-gradient-to-br dark:from-[rgba(59,130,246,0.3)] dark:to-[rgba(59,130,246,0.05)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orb-float-3" aria-hidden="true" />

      <div className="relative w-full max-w-[450px] bg-white dark:bg-[#171127] backdrop-blur-md rounded-[24px] p-10 sm:p-[50px_40px] z-10 border border-gray-100 dark:border-white/5 shadow-xl transition-all duration-300">
        <h2 className="font-sans font-bold text-center text-black dark:text-white text-4xl mb-[10px] tracking-[2px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_10px_rgba(124,58,237,0.4)] animate-text-glow">Join SocialSwap</h2>
        <p className="font-sans text-center text-black/60 dark:text-[#C9C4DD] text-[0.95rem] mb-[40px] tracking-[1px]">Empowering you to buy & sell verified YouTube channels</p>
        
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
            className="mb-6"
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Full Name" 
              className="!bg-[rgba(255,255,255,0.9)] dark:!bg-[rgba(13,7,28,0.95)] !border-2 !border-[rgba(0,0,0,0.15)] dark:!border-[rgba(124,58,237,0.35)] hover:!border-[rgba(0,0,0,0.3)] dark:hover:!border-[#8B5CF6] focus:!border-[rgba(0,0,0,0.5)] dark:focus:!border-[#8B5CF6] !rounded-[12px] !text-black dark:!text-white !p-[14px_16px] !text-[15px] transition-all duration-300 font-sans hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_15px_rgba(124,58,237,0.25)] focus:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:focus:shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:!bg-white dark:hover:!bg-[rgba(24,17,46,1)] focus:!bg-white dark:focus:!bg-[rgba(24,17,46,1)]"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
            className="mb-6"
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              className="!bg-[rgba(255,255,255,0.9)] dark:!bg-[rgba(13,7,28,0.95)] !border-2 !border-[rgba(0,0,0,0.15)] dark:!border-[rgba(124,58,237,0.35)] hover:!border-[rgba(0,0,0,0.3)] dark:hover:!border-[#8B5CF6] focus:!border-[rgba(0,0,0,0.5)] dark:focus:!border-[#8B5CF6] !rounded-[12px] !text-black dark:!text-white !p-[14px_16px] !text-[15px] transition-all duration-300 font-sans hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_15px_rgba(124,58,237,0.25)] focus:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:focus:shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:!bg-white dark:hover:!bg-[rgba(24,17,46,1)] focus:!bg-white dark:focus:!bg-[rgba(24,17,46,1)]"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Please input your phone number!' },
              { pattern: /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, message: 'Please enter a valid phone number!' }
            ]}
            className="mb-6"
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Phone Number" 
              className="!bg-[rgba(255,255,255,0.9)] dark:!bg-[rgba(13,7,28,0.95)] !border-2 !border-[rgba(0,0,0,0.15)] dark:!border-[rgba(124,58,237,0.35)] hover:!border-[rgba(0,0,0,0.3)] dark:hover:!border-[#8B5CF6] focus:!border-[rgba(0,0,0,0.5)] dark:focus:!border-[#8B5CF6] !rounded-[12px] !text-black dark:!text-white !p-[14px_16px] !text-[15px] transition-all duration-300 font-sans hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_15px_rgba(124,58,237,0.25)] focus:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:focus:shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:!bg-white dark:hover:!bg-[rgba(24,17,46,1)] focus:!bg-white dark:focus:!bg-[rgba(24,17,46,1)]"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters long!' }
            ]}
            className="mb-6"
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              className="!bg-[rgba(255,255,255,0.9)] dark:!bg-[rgba(13,7,28,0.95)] !border-2 !border-[rgba(0,0,0,0.15)] dark:!border-[rgba(124,58,237,0.35)] hover:!border-[rgba(0,0,0,0.3)] dark:hover:!border-[#8B5CF6] focus:!border-[rgba(0,0,0,0.5)] dark:focus:!border-[#8B5CF6] !rounded-[12px] !text-black dark:!text-white !p-[14px_16px] !text-[15px] transition-all duration-300 font-sans hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_15px_rgba(124,58,237,0.25)] focus:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:focus:shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:!bg-white dark:hover:!bg-[rgba(24,17,46,1)] focus:!bg-white dark:focus:!bg-[rgba(24,17,46,1)]"
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
            className="mb-6"
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirm Password" 
              className="!bg-[rgba(255,255,255,0.9)] dark:!bg-[rgba(13,7,28,0.95)] !border-2 !border-[rgba(0,0,0,0.15)] dark:!border-[rgba(124,58,237,0.35)] hover:!border-[rgba(0,0,0,0.3)] dark:hover:!border-[#8B5CF6] focus:!border-[rgba(0,0,0,0.5)] dark:focus:!border-[#8B5CF6] !rounded-[12px] !text-black dark:!text-white !p-[14px_16px] !text-[15px] transition-all duration-300 font-sans hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_15px_rgba(124,58,237,0.25)] focus:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:focus:shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:!bg-white dark:hover:!bg-[rgba(24,17,46,1)] focus:!bg-white dark:focus:!bg-[rgba(24,17,46,1)]"
            />
          </Form.Item>

          <Form.Item name="role" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-[50px] !bg-black dark:!bg-gradient-to-r dark:from-[#7C3AED] dark:to-[#A855F7] !border-none !rounded-[12px] font-sans font-semibold text-[16px] tracking-[1px] !text-white cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(124,58,237,0.3)]"
            >
              SIGN UP
            </Button>
          </Form.Item>
        </Form>
        
        <div className="border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(124,58,237,0.2)] pt-6 mt-[30px] text-center">
          <p className="text-black/60 dark:text-[#9C96B8] font-sans text-[14px] text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-sans font-medium text-black dark:text-[#D946EF] hover:text-black/70 dark:hover:text-[#E879F9] transition-all duration-300 hover:drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;