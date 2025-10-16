import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Card, Avatar, Statistic, Button, Spin, message } from 'antd';
import { UserOutlined, EyeOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';

const { TabPane } = Tabs;

// Static categories data
const CATEGORIES = [
  "Gaming",
  "Vlogging",
  "Entertainment",
  "Tech & Reviews",
  "Music",
  "Education",
  "Travel",
  "Animation",
  "Motivation & Self help",
  "Health & Fitness",
  "Sports",
  "Beauty & Fashion",
  "Other"
];

const ChannelCard = ({ channel }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      className="mb-4"
      cover={<img alt={channel.name} src={channel.bannerUrl} className="h-32 object-cover" />}
    >
      <Card.Meta
        avatar={<Avatar src={channel.avatarUrl} icon={<UserOutlined />} />}
        title={channel.name}
        description={channel.customUrl}
      />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Statistic title="Subscribers" value={channel.subscriberCount} prefix={<UserOutlined />} />
        <Statistic title="Views" value={channel.viewCount} prefix={<EyeOutlined />} />
        <Statistic title="Videos" value={channel.videoCount} prefix={<VideoCameraOutlined />} />
      </div>
      <Button 
        type="primary" 
        className="mt-4 w-full"
        onClick={() => navigate(`/channel/${channel._id}`)}
      >
        View Details
      </Button>
    </Card>
  );
};

const Categories = () => {
  const [channels, setChannels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axiosInstance.get(`${api}/channels`);
        const channelsByCategory = CATEGORIES.reduce((acc, category) => {
          acc[category] = response.data.filter(channel => channel.category === category);
          return acc;
        }, {});
        setChannels(channelsByCategory);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch channels');
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  if (loading) {
    return <Spin size="large" className="flex justify-center items-center h-screen" />;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">YouTube Channel Categories</h1>
      <Tabs defaultActiveKey="0" tabPosition="left">
        {CATEGORIES.map((category, index) => (
          <TabPane tab={category} key={index}>
            <h2 className="text-2xl font-semibold mb-4">{category} Channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels[category] && channels[category].length > 0 ? (
                channels[category].map(channel => (
                  <ChannelCard key={channel._id} channel={channel} />
                ))
              ) : (
                <p>No channels found in this category.</p>
              )}
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Categories;