import React, { useState, useEffect } from 'react';
import { Typography, Empty, message, Skeleton, Button, Popconfirm } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';
import {jwtDecode} from 'jwt-decode';

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
          style={{ padding: 24, borderRadius: 24, background: 'white' }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
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
          <div className="bg-white rounded-3xl shadow-xl border border-dashed border-gray-200 py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  Your cart is empty. <Link to="/buy">Continue shopping</Link>
                </span>
              }
            />
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {cartItems.map((item) => (
                <div
                  key={item?._id}
                  onClick={() => navigate(`/channel/${item?._id}`)}
                  className="group relative rounded-3xl border border-gray-100 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item?.logoUrl || item?.bannerUrl || item?.imageUrls?.[0] || '/images/yt3.png'}
                      alt={item?.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-900 shadow">
                        {item?.category || 'Channel'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Popconfirm
                        title={`Remove ${item?.name}?`}
                        description="This channel will be removed from your cart."
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          removeFromCart(item);
                        }}
                        onCancel={(e) => e?.stopPropagation()}
                        okText="Remove"
                        cancelText="Keep"
                      >
                        <Button
                          danger
                          shape="circle"
                          icon={<DeleteOutlined />}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <Title level={4} style={{ marginBottom: 4 }}>
                        {item?.name}
                      </Title>
                      <Text type="secondary">{item?.channelType || 'YouTube Channel'}</Text>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="rounded-2xl bg-gray-50 p-3">
                        <Text className="block text-xs uppercase text-gray-500">Subscribers</Text>
                        <Text strong className="text-lg">
                          {(item?.subscriberCount || 0).toLocaleString()}
                        </Text>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-3">
                        <Text className="block text-xs uppercase text-gray-500">Views</Text>
                        <Text strong className="text-lg">
                          {(item?.viewCount || 0).toLocaleString()}
                        </Text>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-3">
                        <Text className="block text-xs uppercase text-gray-500">Videos</Text>
                        <Text strong className="text-lg">
                          {(item?.videoCount || 0).toLocaleString()}
                        </Text>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <Text type="secondary" className="text-xs uppercase">
                          Price
                        </Text>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(item?.price)}
                        </div>
                        {item?.quantity > 1 && (
                          <Text type="secondary" className="text-xs">
                            Qty: {item?.quantity} • Subtotal {formatCurrency(item?.price * item?.quantity)}
                          </Text>
                        )}
                      </div>
                      <Button
                        type="primary"
                        size="large"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/channel/${item?._id}`);
                        }}
                        style={{
                          borderRadius: 999,
                          paddingInline: 24,
                          background: 'linear-gradient(135deg, #F83758 0%, #ff6b6b 100%)',
                          border: 'none',
                          boxShadow: '0 12px 24px rgba(248, 55, 88, 0.25)',
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <Text type="secondary" className="uppercase text-xs tracking-widest">
                    Total cart value
                  </Text>
                  <div className="text-4xl font-bold text-gray-900">{formatCurrency(getTotalValue())}</div>
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
                    background: 'linear-gradient(135deg, #F83758 0%, #ff6b6b 100%)',
                    border: 'none',
                    paddingInline: 32,
                    borderRadius: 16,
                    boxShadow: '0 20px 35px rgba(248, 55, 88, 0.25)',
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
  );
};

export default CartPage;