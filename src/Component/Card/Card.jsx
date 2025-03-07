import React, { useState, useEffect } from 'react';
import { Card, Typography, Tag, Tooltip, Modal } from 'antd';
import { HeartOutlined, ShoppingCartOutlined, EyeOutlined, DeleteOutlined, ShareAltOutlined, DollarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
    FacebookShareButton, 
    TwitterShareButton, 
    WhatsappShareButton, 
    LinkedinShareButton,
    TelegramShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    LinkedinIcon,
    TelegramIcon
} from 'react-share';
import axiosInstance, { api, url } from '../../API/api';

const { Text } = Typography;
const MotionCard = motion(Card);

const StyledCard = styled(MotionCard)`
  width: 99%;
  margin: auto;
  border-radius: 8px;
  overflow: hidden;
  .ant-card-body {
    padding: 12px;
  }
  .ant-card-cover {
    position: relative;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: contain;
`;

const MonetizedTag = styled(Tag)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #faad14;
  color: white;
  border: none;
  padding: 2px 8px;
  border-radius: 4px;
`;

const PremiumTag = styled(Tag)`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #722ed1;
  color: white;
  border: none;
  padding: 2px 8px;
  border-radius: 4px;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 50px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActionButton = styled.button`
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ShareModalContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  .share-button {
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.1);
    }
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 12px 0;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  .label {
    color: #666;
    font-size: 12px;
  }
  .value {
    font-weight: 600;
    font-size: 14px;
  }
`;

const Price = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
  display: block;
`;

const OriginalPrice = styled(Text)`
  text-decoration: line-through;
  color: #999;
  font-size: 14px;
`;

const Description = styled(Text)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  margin: 8px 0;
`;

const ChannelCard = ({ channel, updateCartStatus }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkCartStatus();
  }, [channel._id]);

  const checkCartStatus = async () => {
  
    try {
      const response = await axiosInstance.get(`${api}/cart`);
      const cartItems = response.data.channels;
      setIsInCart(cartItems.some(item => item._id === channel._id));
    } catch (err) {
      console.error('Failed to check cart status', err);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem('token') ) {
      return navigate('/login');
    }
    try {
      if (isInCart) {
        await axiosInstance.delete(`${api}/cart/remove/${channel._id}`);
        setIsInCart(false);
      } else {
        await axiosInstance.post(`${api}/cart/add`, {
          channelId: channel._id,
          quantity: 1
        });
        setIsInCart(true);
      }
      if (updateCartStatus) {
        updateCartStatus();
      }
    } catch (err) {
      console.error('Error updating cart', err);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/channel/${channel._id}`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setIsShareModalVisible(true);
  };

  const shareUrl = `${window.location.origin}/channel/${channel._id}`;
  const shareTitle = `Check out this YouTube channel: ${channel.name}`;
  const shareDescription = `${channel.description.substring(0, 100)}...`;
  
  return (
    <>
      <StyledCard
        onClick={handleViewDetails}
        hoverable
        key={channel.name}
        cover={
          <div style={{ position: 'relative' }}>
            <StyledImage 
              alt={channel.name} 
              src={channel.bannerUrl ? channel.bannerUrl : '/images/yt.png'} 
            />
            {/* <PremiumTag>Premium</PremiumTag> */}
            {channel.monetized && (
              <MonetizedTag icon={<DollarOutlined />}>Monetized</MonetizedTag>
            )}
            <ActionButtons>
              <Tooltip title={isInCart ? "Remove from Cart" : "Add to Cart"}>
                <ActionButton onClick={handleAddToCart}>
                  {!isInCart ? <ShoppingCartOutlined /> : <DeleteOutlined style={{color: 'red'}}/>}
                </ActionButton>
              </Tooltip>
              <Tooltip title="View Details">
                <ActionButton onClick={handleViewDetails}>
                  <EyeOutlined />
                </ActionButton>
              </Tooltip>
              <Tooltip title="Share">
                <ActionButton onClick={handleShare}>
                  <ShareAltOutlined />
                </ActionButton>
              </Tooltip>
            </ActionButtons>
          </div>
        }
      >
        <Text strong className="text-lg mb-2 block">{channel.name}</Text>
        {channel.estimatedEarnings > 0 && (
          <Price>₹{formatNumber(channel.estimatedEarnings)}</Price>
        )}
        
        <Stats>
          <StatItem>
            <span className="label">Subscribers</span>
            <span className="value">{formatNumber(channel.subscriberCount)}</span>
          </StatItem>
          <StatItem>
            <span className="label">Total Views</span>
            <span className="value">{formatNumber(channel.viewCount)}</span>
          </StatItem>
          <StatItem>
            <span className="label">Recent Views</span>
            <span className="value">{formatNumber(channel.recentViews)}</span>
          </StatItem>
          <StatItem>
            <span className="label">Videos</span>
            <span className="value">{formatNumber(channel.videoCount)}</span>
          </StatItem>
        </Stats>

        <Description>{channel.description}</Description>

        <div className="mt-2">
          <Tag color="blue">{channel.category}</Tag>
          <Tag color="cyan">{channel.channelType}</Tag>
          {channel.language && (
            <Tag color="purple">{channel.language}</Tag>
          )}
        </div>
      </StyledCard>

      <Modal
        title="Share This Channel"
        open={isShareModalVisible}
        onCancel={(e) => {
          e.stopPropagation();
          setIsShareModalVisible(false);
        }}
        footer={null}
      >
        <ShareModalContent onClick={e => e.stopPropagation()}>
          <FacebookShareButton url={shareUrl} quote={shareTitle} hashtag="#YouTubeChannel" className="share-button">
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={shareTitle} className="share-button">
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <WhatsappShareButton url={shareUrl} title={shareTitle} className="share-button">
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareDescription} className="share-button">
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
          <TelegramShareButton url={shareUrl} title={shareTitle} className="share-button">
            <TelegramIcon size={40} round />
          </TelegramShareButton>
        </ShareModalContent>
      </Modal>
    </>
  );
};

export default ChannelCard;
