import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card, Avatar, Statistic, Tag, Divider, Button, message, Skeleton, Descriptions, Image, Carousel
} from 'antd';
import {
  UserOutlined, DollarOutlined, ClockCircleOutlined, EyeOutlined, VideoCameraOutlined,
  WhatsAppOutlined, ShoppingCartOutlined, CheckCircleOutlined, CloseCircleOutlined,
  LeftOutlined, RightOutlined
} from '@ant-design/icons';
import axiosInstance, { api, url } from '../../API/api';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';

const DetailPage = () => {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = useState(false);


  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await axiosInstance.get(`${api}/channels/${id}`);
        setChannel(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch channel details');
        setLoading(false);
      }
    };

    const checkCartStatus = async () => {
      if (!localStorage.getItem('token')) {
        return;
      }
      try {
        const response = await axiosInstance.get(`${api}/cart`);
        const cartItems = response.data.channels;
        setIsInCart(cartItems.some((item) => item._id === id));
      } catch (err) {
        message.error('Failed to check cart status');
      }
    };

    fetchChannel();
    checkCartStatus();
  }, [id]);

  const handleMakeOffer = () => {
    const message = encodeURIComponent(`Hello, I'm interested in buying the YouTube channel "${channel.name}" (ID: ${channel._id}). Can we discuss the details?`);
    const whatsappUrl = `https://wa.me/+919423523291?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = async () => {
    if (!localStorage.getItem('token')) {
      return navigate('/login');
    }
    try {
      if (isInCart) {
        await axiosInstance.delete(`${api}/cart/remove/${channel._id}`);
        setIsInCart(false);
        message.success(`${channel.name} has been removed from your cart.`);
      } else {
        await axiosInstance.post(`${api}/cart/add`, {
          channelId: channel._id,
          quantity: 1,
        });
        setIsInCart(true);
        message.success(`${channel.name} has been added to your cart!`);
      }
    } catch (err) {
      message.error('Error updating cart.');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (!channel) {
    return <div className="text-center py-12">Channel not found</div>;
  }

// Function to decode JWT and extract user information
const decodeToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found in localStorage');
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    return { decoded, userId: decoded._id };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
  const handleBuyNow = async () => {
    if (!channel) {
        message.error('Channel data not available');
        return;
    }

    setPaymentLoading(true);

    try {
        const user = decodeToken();
        // Create payment order for single channel
        const paymentResponse = await axiosInstance.post(`${api}/create-order`, {
            amount: channel.price,
            cartItems: [{
                id: channel._id,
                name: channel.name,
                price: channel.price,
                quantity: 1
            }],
            user: user?.decoded
        });

        if (paymentResponse.data.success) {
            const { data } = paymentResponse.data;

            // Store transaction details in local storage
            localStorage.setItem('currentTransaction', JSON.stringify({
                transactionId: data.transactionId,
                amount: channel.price,
                cartItems: [channel]
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="detail-page w-full max-w-7xl mx-auto p-4 mb-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Banner and Images */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            {/* Banner Image */}
            <div className="relative w-full h-[300px] mb-6 rounded-lg overflow-hidden">
              <img 
                src={channel.bannerUrl ? channel.bannerUrl : '/images/yt.png'}
                alt="Channel Banner"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Channel Images Gallery */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Channel Images</h3>
              <Carousel
                autoplay
                arrows
                prevArrow={<LeftOutlined />}
                nextArrow={<RightOutlined />}
                className="channel-images-carousel"
              >
                {channel.imageUrls?.map((imageUrl, index) => (
                  <div key={index} className="h-[400px]">
                    <Image
                      src={ imageUrl}
                      alt={`Channel Image ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Channel Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Statistic title="Total Views" value={channel.viewCount} prefix={<EyeOutlined />} />
              <Statistic title="Recent Views" value={channel.recentViews} prefix={<EyeOutlined />} />
              <Statistic title="Video Count" value={channel.videoCount} prefix={<VideoCameraOutlined />} />
              <Statistic title="Avg. Views" value={channel.averageViewsPerVideo} prefix={<EyeOutlined />} />
              <Statistic title="Watch Time" value={`${channel.watchTimeHours}h`} prefix={<ClockCircleOutlined />} />
              <Statistic title="Earnings" value={`$${channel.estimatedEarnings.toFixed(2)}`} prefix={<DollarOutlined />} />
            </div>
          </Card>
        </div>

        {/* Right Column - Channel Info */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
         

            <div className="flex flex-wrap gap-2 mb-4">
              <Tag color="green">{channel.category}</Tag>
              <Tag color="blue">{channel.language}</Tag>
              <Tag color={channel.monetized ? 'gold' : 'default'}>
                {channel.monetized ? 'Monetized' : 'Not Monetized'}
              </Tag>
            </div>

            <div className="text-3xl font-bold text-red-500 mb-6">₹{channel.price ?? '0'}</div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{channel.description}</p>
            </div>

            <Divider />

            <Descriptions size="small" column={1} className="mb-6">
              <Descriptions.Item label="Channel Type">{channel.channelType}</Descriptions.Item>
              <Descriptions.Item label="Joined Date">
                {new Date(channel.joinedDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Country">{channel.country}</Descriptions.Item>
              <Descriptions.Item label="Copyright Strike">{channel.copyrightStrike}</Descriptions.Item>
              <Descriptions.Item label="Last 28 days views">{channel.recentViews}</Descriptions.Item>
              <Descriptions.Item label="Last 48 hours views">{channel.copyrightStrike}</Descriptions.Item>
              <Descriptions.Item label="Last 365 days views">{channel.copyrightStrike}</Descriptions.Item>
              {/* <Descriptions.Item label="Community Strike">{channel.communityStrike}</Descriptions.Item> */}
             
            </Descriptions>

            <div className="flex flex-col gap-4">
              <Button
                type="primary"
                icon={<WhatsAppOutlined />}
                size="large"
                onClick={handleMakeOffer}
                className="bg-[#075e54] hover:bg-[#128C7E] h-12"
                block
              >
                Make an Offer
              </Button>
              <Button
                type={isInCart ? 'default' : 'primary'}
                icon={<ShoppingCartOutlined />}
                size="large"
                onClick={handleAddToCart}
                className={`h-12 ${isInCart ? 'bg-gray-100' : ''}`}
                block
              >
                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </Button>
              <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingCartOutlined />}
                                onClick={handleBuyNow}
                                loading={paymentLoading}
                            >
                                Buy Now ₹{channel.price}
                            </Button>
            </div>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        .channel-images-carousel .slick-slide {
          padding: 8px;
        }
        
        .channel-images-carousel .slick-arrow {
          color: #000;
          font-size: 24px;
          z-index: 2;
        }
        
        .channel-images-carousel .slick-prev {
          left: 10px;
        }
        
        .channel-images-carousel .slick-next {
          right: 10px;
        }

        .ant-carousel .slick-dots-bottom {
          bottom: -30px;
        }

        .ant-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </motion.div>
  );
};

export default DetailPage;