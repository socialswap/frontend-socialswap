import React, { useState, useEffect } from 'react';
import { Tabs, Button, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';

const { TabPane } = Tabs;

// Static categories data
const CATEGORIES = [
  "Gaming",
  "Tech",
  "Finance",
  "Artificial intelligence",
  "Business & Entrepreneurship",
  "Education",
  "Health & Fitness",
  "Food",
  "Infotainment",
  "Vlogging",
  "Sports",
  "Commentary",
  "Entertainment",
  "Music",
  "Motivation & Self-Improvement",
  "Other"
];

const Categories = () => {
  const [channels, setChannels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      <Tabs 
        defaultActiveKey="0" 
        tabPosition="left"
        onChange={(key) => {
          const category = CATEGORIES[parseInt(key)];
          navigate(`/channels?category=${category}`);
        }}
      >
        {CATEGORIES.map((category, index) => (
          <TabPane 
            tab={
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                <span>{category}</span>
                <span className="text-xs text-gray-500">
                  ({channels[category]?.length || 0})
                </span>
              </div>
            } 
            key={index}
          >
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">{category} Channels</h2>
              <p className="text-gray-600 mb-4">
                {channels[category]?.length || 0} channels available
              </p>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate(`/channels?category=${category}`)}
              >
                View All {category} Channels
              </Button>
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Categories;