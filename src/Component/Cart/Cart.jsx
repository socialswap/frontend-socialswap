import React, { useState, useEffect } from 'react';
import { Typography, Empty, message, Skeleton, Button, Popconfirm, ConfigProvider, theme } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';
import {jwtDecode} from 'jwt-decode';
import ChannelCard from '../ChannelCard';

const { Title, Text } = Typography;

// Function to decode JWT and extract user information
const decodeToken = () => {
  // Retrieve the JWT token from localStorage (or wherever it is stored)
  const token = localStorage.getItem('token'); 

  if (!token) {
    console.error('No token found in localStorage');
    return null; // If token doesn't exist
  }

  try {
    // Decode the token to access its payload (user data, etc.)
    const decoded = jwtDecode(token); 
    console.log('Decoded token:', decoded);

    // You can now access the decoded data, e.g., userId, roles, etc.
    const userId = decoded._id; // Assuming the user ID is in the payload
    return { decoded, userId };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// Example usage
const decodedData = decodeToken();
if (decodedData) {
  console.log('User ID from decoded token:', decodedData.userId);
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark') || 
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDarkMode(isDark);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => observer.disconnect();
  }, []);

  const formatCurrency = (value = 0) =>
    `₹${Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;


  const enrichCartItems = async (items = []) => {
    return Promise.all(
      items.map(async (item) => {
        const rawChannel = item?.channel ? { ...item.channel, ...item } : { ...item };
        const channelId = rawChannel?._id || item?.channelId;

        if (!channelId) return rawChannel;

        const hasStats =
          Number(rawChannel?.subscriberCount || 0) > 0 ||
          Number(rawChannel?.viewCount || 0) > 0 ||
          Number(rawChannel?.videoCount || 0) > 0;

        if (hasStats) {
          return {
            ...rawChannel,
            quantity: rawChannel?.quantity ?? item?.quantity ?? 1,
          };
        }

        try {
          const detailResponse = await axiosInstance.get(`/channels/${channelId}`);
          const detail = detailResponse?.data || {};
          return {
            ...detail,
            ...rawChannel,
            _id: detail?._id || channelId,
            quantity: rawChannel?.quantity ?? item?.quantity ?? 1,
            price: rawChannel?.price ?? detail?.price,
          };
        } catch (err) {
          console.error('Failed to enrich cart item', channelId, err);
          return {
            ...rawChannel,
            quantity: rawChannel?.quantity ?? item?.quantity ?? 1,
          };
        }
      })
    );
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/cart');
        const channels = response?.data?.channels || [];
        const normalized = await enrichCartItems(channels);
        setCartItems(normalized);
      } catch (error) {
        console.error('Error fetching cart:', error);
        message.error('Failed to load cart items.');
      } finally{
        setLoading(false);
      }
    };
    fetchCartItems();
    
  }, []);

  const removeFromCart = async (itemToRemove) => {
    try {
      await axiosInstance.delete(`/cart/remove/${itemToRemove._id}`);
      const updatedCart = cartItems.filter(item => item?._id !== itemToRemove?._id);
      setCartItems(updatedCart);
      message.success(`${itemToRemove.name} has been removed from your cart.`);
    } catch (error) {
      console.error('Error removing item:', error);
      message.error('Failed to remove item from cart.');
    }
  };

  const getTotalValue = () => {
    return cartItems?.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 1), 0);
  };

  const initiatePayment = async () => {
    const totalAmount = getTotalValue();
    
    if (totalAmount <= 0) {
      message.error('Cart is empty or total amount is invalid.');
      return;
    }
  
    setPaymentLoading(true);
  
    try {
      // Create payment order with cart items
      const paymentResponse = await axiosInstance.post(`${api}/create-order`, { 
        amount: totalAmount,
        cartItems: cartItems.map(item => ({
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          
        })),
        user:decodeToken()?.decoded
      });
      
      if (paymentResponse.data.success) {
        const { data } = paymentResponse.data;
        
        // Store transaction details in local storage
        localStorage.setItem('currentTransaction', JSON.stringify({
          transactionId: data.transactionId,
          amount: totalAmount,
          cartItems: cartItems
        }));
  
        // Redirect to PhonePe payment page
        if (data.data.instrumentResponse?.redirectInfo?.url) {
          window.location.href = data.data.instrumentResponse.redirectInfo.url;
        } else {
          message.error('No redirect URL found. Payment initialization failed.');
        }
      } else {
        message.error('Failed to create payment order.');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      message.error('An error occurred while processing payment.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
  //       <Skeleton active />
  //     </div>
  //   );
  // }

  console.log(cartItems);
  
  const renderSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((s) => (
        <Skeleton
          key={s}
          active
          paragraph={{ rows: 4 }}
          avatar={false}
          style={{ padding: 24, borderRadius: 24, background: isDarkMode ? '#171127' : 'white' }}
        />
      ))}
    </div>
  );

  return (
    <ConfigProvider 
      theme={{ 
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: isDarkMode ? {
          colorBgBase: '#07030F',
          colorBgContainer: '#171127',
          colorBgElevated: '#1f1635',
          colorBorder: 'rgba(255,255,255,0.08)',
          colorPrimary: '#7C3AED',
          colorTextBase: '#ffffff',
        } : {
          colorPrimary: '#7C3AED',
        }
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#07030F] dark:via-[#0F0A1D] dark:to-[#07030F] pt-28 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2} style={{ marginBottom: 0 }}>
              Your Shopping Cart
            </Title>
            <Text type="secondary">
              Review your shortlisted channels and proceed when you’re ready to secure the deal.
            </Text>
          </div>

          {loading ? (
            renderSkeleton()
          ) : cartItems.length === 0 ? (
            <div className="bg-white dark:bg-[#171127] rounded-3xl shadow-xl border border-dashed border-gray-200 dark:border-white/5 py-16">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-500 dark:text-gray-400">
                    Your cart is empty. <Link to="/channels">Continue shopping</Link>
                  </span>
                }
              />
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cartItems.map((item) => (
                  <div key={item?._id}>
                    <ChannelCard 
                      channel={item} 
                      isCartView={true} 
                      onRemove={() => removeFromCart(item)} 
                    />
                  </div>
                ))}
              </div>

              <div className="mt-10 max-w-3xl mx-auto bg-white dark:bg-[#171127] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <Text type="secondary" className="uppercase text-xs tracking-widest">
                      Total cart value
                    </Text>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">{formatCurrency(getTotalValue())}</div>
                    <Text type="secondary">Secure checkout powered by PhonePe</Text>
                  </div>
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    size="large"
                    onClick={initiatePayment}
                    loading={paymentLoading}
                    disabled={cartItems.length === 0}
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #B983FF 100%)',
                      border: 'none',
                      paddingInline: 32,
                      borderRadius: 16,
                      boxShadow: isDarkMode ? '0 15px 30px rgba(124, 58, 237, 0.3)' : '0 15px 30px rgba(124, 58, 237, 0.15)',
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CartPage;