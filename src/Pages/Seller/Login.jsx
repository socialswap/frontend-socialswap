// src/Pages/Seller/Login.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../API/api';
import { auth, setupRecaptcha, googleProvider, appleProvider } from '../../firebase';
import { signInWithPhoneNumber, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // send OTP via Firebase
  const sendOtp = async () => {
    try {
      const phoneValue = form.getFieldValue('phone');
      if (!phoneValue) return message.error('Please enter phone in +<countrycode><number> format, e.g. +919876543210');

      setLoading(true);
      setupRecaptcha('recaptcha-container');
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneValue, appVerifier);
      setConfirmationResult(result);
      message.success('OTP sent to ' + phoneValue);
    } catch (err) {
      console.error('sendOtp err', err);
      message.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // verify OTP code from form
  const verifyOtp = async () => {
    try {
      const code = form.getFieldValue('otp');
      if (!confirmationResult) return message.error('Please request OTP first');
      setLoading(true);
      const cred = await confirmationResult.confirm(code);
      const idToken = await cred.user.getIdToken();

      // send idToken to backend to create/verify session (backend will verify via firebase-admin)
      const res = await axiosInstance.post('/auth/firebase-login', { idToken });
      if (res.data.success) {
        // store your app JWT returned by backend
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user?.role);
        message.success('Login successful');
        navigate('/');
      } else {
        message.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('verifyOtp err', err);
      message.error(err.message || 'OTP verify failed');
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in
  const onGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await axiosInstance.post('/auth/firebase-login', { idToken });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user?.role);
        message.success('Login successful');
        navigate('/');
      } else {
        message.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('google sign in', err);
      message.error(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  // Apple sign-in (web) — requires server-side Apple/Firebase setup
  const onAppleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, appleProvider);
      const idToken = await result.user.getIdToken();
      const res = await axiosInstance.post('/auth/firebase-login', { idToken });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user?.role);
        message.success('Login successful');
        navigate('/');
      } else {
        message.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('apple sign in', err);
      message.error(err.message || 'Apple sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <Form form={form} layout="vertical">
          <Form.Item name="phone" label="Phone (E.164)" rules={[{ required: true, message: 'Phone required' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="+91**********" />
          </Form.Item>
          {!confirmationResult && (
            <Form.Item>
              <Button type="primary" loading={loading} onClick={sendOtp}>Send OTP</Button>
            </Form.Item>
          )}

          {confirmationResult && (
            <>
              <Form.Item name="otp" label="OTP" rules={[{ required: true }]}>
                <Input placeholder="Enter OTP" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" loading={loading} onClick={verifyOtp}>Verify OTP & Login</Button>
              </Form.Item>
            </>
          )}

          <div id="recaptcha-container" /> {/* required for firebase phone auth */}

          <div style={{ marginTop: 12 }}>
            <Button block onClick={onGoogleSignIn} style={{ marginBottom: 8 }}>Sign in with Google</Button>
            <Button block onClick={onAppleSignIn}>Sign in with Apple</Button>
          </div>
        </Form>

        <div className="text-center mt-4">
          <span className="text-gray-700">Don't have an account? </span>
          <Link to="/signup" className="text-[#F83758] hover:text-[#D62D4C]">Sign up</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
