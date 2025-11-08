import React, { useState, useCallback } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';
import { useGoogleLogin } from '@react-oauth/google';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import './Login.css';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState('');

  // Check if Google OAuth is enabled - check inside component to ensure env var is loaded
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  const isGoogleOAuthEnabled = googleClientId && 
    googleClientId.trim() !== '' && 
    googleClientId !== 'your_google_client_id_here' &&
    googleClientId.includes('googleusercontent.com');
  
  // Debug log
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Login Component - Google Client ID:', googleClientId ? 'Found' : 'Not found');
      console.log('Login Component - Google OAuth Enabled:', isGoogleOAuthEnabled);
    }
  }, [googleClientId, isGoogleOAuthEnabled]);

  const handleLoginSuccess = (token, user) => {
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
  };


  // Always call the hook (hooks must be called unconditionally)
  // The provider check happens in index.js, so if we're here, the provider should be available
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google using access token
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        if (!googleResponse.ok) {
          throw new Error('Failed to fetch user info from Google');
        }
        
        const googleUser = await googleResponse.json();

        // Send user info to backend for verification and token generation
        const response = await axiosInstance.post(`${api}/auth/google`, {
          accessToken: tokenResponse.access_token,
          userInfo: {
            id: googleUser.sub,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
          }
        });

        if (response.data.success) {
          const { token, user } = response.data;
          handleLoginSuccess(token, user);
        } else {
          message.error(response.data.message || 'Google login failed.');
        }
      } catch (error) {
        console.error('Google login error:', error);
        message.error(error.response?.data?.message || 'Google login failed. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      message.error('Google login failed. Please try again.');
    },
  });

  const handleGoogleLogin = () => {
    if (isGoogleOAuthEnabled) {
      googleLogin();
    } else {
      message.error('Google login is not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file.');
    }
  };

  const sendEmailOtp = async (email) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post(`${api}/auth/email/send-otp`, {
        email
      });

      if (response.data.success) {
        setEmailForOtp(email);
        setOtpSent(true);
        message.success('OTP sent successfully! Check your email for the verification code.');
      } else {
        message.error(response.data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      message.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOtp = async (email, otp) => {
    try {
      setLoading(true);
      
      const response = await axiosInstance.post(`${api}/auth/email/verify`, {
        email,
        otp
      });

      if (response.data.success) {
        const { token, user: backendUser } = response.data;
        handleLoginSuccess(token, backendUser);
      } else {
        message.error(response.data.message || 'Email login failed.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      message.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    const currentEmail = values.email?.toLowerCase();
    if (!otpSent) {
      await sendEmailOtp(currentEmail);
    } else {
      await verifyEmailOtp(currentEmail || emailForOtp, values.otp);
    }
  };

  const handleChangeEmail = useCallback(() => {
    setOtpSent(false);
    setEmailForOtp('');
    form.resetFields();
  }, [form]);

  // Particles configuration
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesConfig = {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ['#000000', '#666666', '#999999']
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        }
      },
      opacity: {
        value: 0.6,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.2,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#000000',
        opacity: 0.15,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  };

  return (
    <div className="futuristic-login-container">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        className="particles-background"
      />
      
      {/* Floating Gradient Orbs */}
      <div className="floating-orb floating-orb-1"></div>
      <div className="floating-orb floating-orb-2"></div>
      <div className="floating-orb floating-orb-3"></div>

      <div className="glow-border-card">
        <div className="text-center mb-8">
          <h1 className="futuristic-title">WELCOME BACK</h1>
          <p className="futuristic-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Email OTP Login Form */}
        <Form
          form={form}
          name="emailLogin"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address.' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="you@example.com"
              className="futuristic-input"
              disabled={otpSent}
            />
          </Form.Item>
          {!otpSent ? (
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="pulsating-glow-button"
              >
                SEND OTP
              </Button>
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="otp"
                rules={[
                  { required: true, message: 'Please input the OTP!' },
                  {
                    pattern: /^\d{6}$/,
                    message: 'OTP must be a 6-digit number.'
                  }
                ]}
              >
                <Input 
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="futuristic-input text-center text-2xl tracking-widest"
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="pulsating-glow-button"
                >
                  VERIFY OTP
                </Button>
              </Form.Item>
              <Form.Item>
                <Button 
                  type="link" 
                  onClick={handleChangeEmail}
                  className="futuristic-link w-full"
                >
                  Change Email
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
        
        {isGoogleOAuthEnabled && (
          <>
            <Divider className="futuristic-divider">
              <span className="futuristic-divider-inner-text">Or continue with</span>
            </Divider>
            
            <Button 
              onClick={handleGoogleLogin}
              className="futuristic-google-button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </>
        )}
        
        {/* <div className="futuristic-footer-border">
          <span className="futuristic-footer-text">Don't have an account? </span>
          <Link 
            to="/signup" 
            className="futuristic-link text-sm font-semibold"
          >
            Sign up
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Login;