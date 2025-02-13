import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Avatar, 
  Typography, 
  Spin, 
  Empty,
  Tag,
  Row,
  Col,
  message
} from 'antd';
import { YoutubeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import axiosInstance, { api } from '../../API/api';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ChannelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const StyledCard = styled(Card)`
  .channel-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .channel-info {
    margin-left: 12px;
    flex: 1;
  }

  .stats-container {
    margin-top: 16px;
  }

  .stat-item {
    margin-bottom: 8px;
  }
`;

const MyChannels = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannels();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { 'x-auth-token': token };
  };

  const fetchChannels = async () => {
    try {
      const response = await axiosInstance.get(`${api}/my-channels`, {
        headers: getAuthHeader()
      });
      setChannels(response.data.data.channels);
    } catch (error) {
      message.error('Failed to fetch channels');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderChannelCard = (channel) => (
    <StyledCard key={channel._id}>
      <div className="channel-header">
        <Avatar 
          size={64} 
          src={channel.avatar || null}
          icon={!channel.avatar && <YoutubeOutlined />}
        />
        <div className="channel-info">
          <Title level={4} style={{ margin: 0 }}>{channel.name}</Title>
          <Text type="secondary">{channel.customUrl}</Text>
        </div>
      </div>

      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
        {channel.description}
      </Text>

      <Row gutter={[16, 16]}>
        <Col span={12} className="stat-item">
          <Text strong>Subscribers:</Text> {channel.subscriberCount}
        </Col>
        <Col span={12} className="stat-item">
          <Text strong>Views:</Text> {channel.viewCount}
        </Col>
        <Col span={12} className="stat-item">
          <Text strong>Videos:</Text> {channel.videoCount}
        </Col>
        <Col span={12} className="stat-item">
          <Text strong>Earnings:</Text> ${channel.estimatedEarnings}
        </Col>
      </Row>

      <div style={{ marginTop: '16px' }}>
        <Tag color="blue">{channel.category}</Tag>
        <Tag color="purple">{channel.channelType}</Tag>
        <Tag color={channel.status === 'unsold' ? 'green' : 'red'}>
          {channel.status}
        </Tag>
        {channel.mostDemanding && <Tag color="gold">Most Demanding</Tag>}
      </div>

      <div style={{ marginTop: '16px' }}>
        <Text type="secondary">
          Joined: {formatDate(channel.joinedDate)}
        </Text>
      </div>
    </StyledCard>
  );

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title level={2}>
        <YoutubeOutlined style={{ marginRight: 8 }} />
        My YouTube Channels
      </Title>

      {channels.length === 0 ? (
        <Empty 
          description="No channels found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <ChannelGrid>
          {channels.map(renderChannelCard)}
        </ChannelGrid>
      )}
    </PageContainer>
  );
};

export default MyChannels;