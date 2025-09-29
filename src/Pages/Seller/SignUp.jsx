// ===== Updated SignUp.jsx =====
import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, PhoneOutlined, NumberOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      const phoneValue = form.getFieldValue('phone');
      if (!phoneValue) return message.error('Please enter your phone number');
      setLoading(true);
      const res = await axiosInstance.post(`${api}/auth/send-otp`, { phone: phoneValue });
      if (res.data.success) {
        setOtpSent(true);
        message.success('OTP sent successfully');
      } else {
        message.error(res.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndSignup = async (values) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(`${api}/auth/signup`, {
        name: values.name,
        phone: values.phone,
        otp: values.otp,
        role: 'buyer'
      });
      if (res.data.success) {
        message.success('Signup successful! Please login.');
        navigate('/login');
      } else {
        message.error(res.data.message || 'Signup failed');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      <Card className="w-full max-w-lg backdrop-blur-md bg-white/30 border border-white/50 shadow-lg" style={{ borderRadius: '16px' }}>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Your Account</h2>
        <Form form={form} layout="vertical" onFinish={verifyOtpAndSignup}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>

          <Form.Item name="phone" rules={[{ required: true, message: 'Please input your phone number!' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" disabled={otpSent} />
          </Form.Item>

          {otpSent && (
            <Form.Item name="otp" rules={[{ required: true, message: 'Please input the OTP!' }]}>
              <Input prefix={<NumberOutlined />} placeholder="Enter OTP" />
            </Form.Item>
          )}

          {!otpSent ? (
            <Button type="primary" onClick={sendOtp} loading={loading} className="w-full">
              Send OTP
            </Button>
          ) : (
            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
              Verify OTP & Sign Up
            </Button>
          )}
        </Form>

        <div className="text-center mt-4">
          <span className="text-gray-700">Already have an account? </span>
          <Link to="/login" className="text-[#F83758] hover:text-[#D62D4C] transition-colors duration-300">
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;