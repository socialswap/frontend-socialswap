import React, { useState, useCallback } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';
import { useGoogleLogin } from '@react-oauth/google';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

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
      return navigate('/user/upload-channel');
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
    <div className="futuristic-login-container min-h-screen flex justify-center items-center bg-gradient-to-br from-[#f5f5f5] via-[#ffffff] to-[#fafafa] dark:bg-gradient-to-br dark:from-[#070312] dark:via-[#110824] dark:to-[#0D071C] dark:text-white relative overflow-hidden p-5 font-sans">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      
      {/* Floating Gradient Orbs */}
      <div className="absolute rounded-full pointer-events-none z-[1] filter blur-[40px] opacity-20 w-[300px] h-[300px] bg-gradient-to-br from-[rgba(255,255,255,0.4)] to-[rgba(255,255,255,0.2)] dark:bg-gradient-to-br dark:from-[rgba(124,58,237,0.45)] dark:to-[rgba(124,58,237,0.1)] top-[20%] right-[10%] animate-orb-float-1"></div>
      <div className="absolute rounded-full pointer-events-none z-[1] filter blur-[40px] opacity-20 w-[250px] h-[250px] bg-gradient-to-br from-[rgba(255,255,255,0.35)] to-[rgba(255,255,255,0.15)] dark:bg-gradient-to-br dark:from-[rgba(217,70,239,0.35)] dark:to-[rgba(217,70,239,0.05)] bottom-[20%] left-[10%] animate-orb-float-2"></div>
      <div className="absolute rounded-full pointer-events-none z-[1] filter blur-[40px] opacity-20 w-[200px] h-[200px] bg-gradient-to-br from-[rgba(255,255,255,0.3)] to-[rgba(255,255,255,0.1)] dark:bg-gradient-to-br dark:from-[rgba(59,130,246,0.3)] dark:to-[rgba(59,130,246,0.05)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orb-float-3"></div>

      <div className="relative w-full max-w-[450px] bg-white dark:bg-[#171127] backdrop-blur-md rounded-[24px] p-10 sm:p-[50px_40px] z-10 border border-gray-100 dark:border-white/5 shadow-xl transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="font-sans font-bold text-center text-black dark:text-white text-4xl mb-[10px] tracking-[2px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_10px_rgba(124,58,237,0.4)] animate-text-glow">WELCOME BACK</h1>
          <p className="font-sans text-center text-black/60 dark:text-[#C9C4DD] text-[0.95rem] mb-[40px] tracking-[1px]">Sign in to your account to continue</p>
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
              className="!bg-[rgba(255,255,255,0.9)] dark:!bg-[rgba(13,7,28,0.95)] !border-2 !border-[rgba(0,0,0,0.15)] dark:!border-[rgba(124,58,237,0.35)] hover:!border-[rgba(0,0,0,0.3)] dark:hover:!border-[#8B5CF6] focus:!border-[rgba(0,0,0,0.5)] dark:focus:!border-[#8B5CF6] !rounded-[12px] !text-black dark:!text-white !p-[14px_16px] !text-[15px] transition-all duration-300 font-sans hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_15px_rgba(124,58,237,0.25)] focus:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:focus:shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:!bg-white dark:hover:!bg-[rgba(24,17,46,1)] focus:!bg-white dark:focus:!bg-[rgba(24,17,46,1)]"
              disabled={otpSent}
            />
          </Form.Item>
          {!otpSent ? (
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="w-full h-[50px] !bg-black dark:!bg-gradient-to-r dark:from-[#7C3AED] dark:to-[#A855F7] !border-none !rounded-[12px] font-sans font-semibold text-[16px] tracking-[1px] !text-white cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(124,58,237,0.3)]"
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
                  className="!bg-[rgba(255,255,255,0.9)] dark:!bg-[rgba(13,7,28,0.95)] !border-2 !border-[rgba(0,0,0,0.15)] dark:!border-[rgba(124,58,237,0.35)] hover:!border-[rgba(0,0,0,0.3)] dark:hover:!border-[#8B5CF6] focus:!border-[rgba(0,0,0,0.5)] dark:focus:!border-[#8B5CF6] !rounded-[12px] !text-black dark:!text-white !p-[14px_16px] !text-[15px] transition-all duration-300 font-sans hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_15px_rgba(124,58,237,0.25)] focus:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:focus:shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:!bg-white dark:hover:!bg-[rgba(24,17,46,1)] focus:!bg-white dark:focus:!bg-[rgba(24,17,46,1)] text-center text-2xl tracking-widest"
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="w-full h-[50px] !bg-black dark:!bg-gradient-to-r dark:from-[#7C3AED] dark:to-[#A855F7] !border-none !rounded-[12px] font-sans font-semibold text-[16px] tracking-[1px] !text-white cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(124,58,237,0.3)]"
                >
                  VERIFY OTP
                </Button>
              </Form.Item>
              <Form.Item>
                <Button 
                  type="link" 
                  onClick={handleChangeEmail}
                  className="w-full font-sans font-medium text-black dark:text-[#D946EF] hover:text-black/70 dark:hover:text-[#E879F9] transition-all duration-300 text-center hover:drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
                >
                  Change Email
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
        
        {isGoogleOAuthEnabled && (
          <>
            <Divider className="!border-[rgba(0,0,0,0.1)] dark:!border-[rgba(124,58,237,0.2)] !my-[30px]">
              <span className="text-[rgba(0,0,0,0.5)] dark:text-[#9C96B8] font-sans text-[14px]">Or continue with</span>
            </Divider>
            
            <Button 
              onClick={handleGoogleLogin}
              className="w-full h-[50px] !bg-[rgba(255,255,255,0.9)] dark:!bg-[rgba(24,17,46,0.95)] !border-2 !border-[rgba(0,0,0,0.15)] dark:!border-[rgba(124,58,237,0.35)] !rounded-[12px] font-sans font-medium !text-[#1a1a2e] dark:!text-[#C9C4DD] transition-all duration-300 flex items-center justify-center gap-3 hover:!border-[rgba(0,0,0,0.3)] dark:hover:!border-[#8B5CF6] hover:!bg-white dark:hover:!bg-[rgba(13,7,28,1)] hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:-translate-y-[2px]"
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