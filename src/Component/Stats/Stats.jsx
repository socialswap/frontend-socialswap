import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { ShopOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';

const { Title, Text } = Typography;

const StatItem = ({ icon, number, text, duration = 2 }) => (
  <div className="flex items-center space-x-4">
    <div className="text-4xl text-black-800">{icon}</div>
    <div>
      <Title level={3} className="m-0 text-gray-800">
        {/* Apply the counting animation here */}
        <CountUp end={number} duration={duration} separator="," />
        +
      </Title>
      <Text className="text-gray-600">{text}</Text>
    </div>
  </div>
);

const Stats = () => (
  <Card className="shadow-md my-6 mx-[2rem]">
    <Row gutter={[16, 16]} justify="space-around" align="middle">
      <Col xs={24} sm={24} md={8}>
        <StatItem 
          icon={<ShopOutlined />} 
          number={500} 
          text="Available Channels" 
          duration={20} // Duration for the counting animation
        />
      </Col>
      <Col xs={24} sm={24} md={8}>
        <StatItem 
          icon={<UserOutlined />} 
          number={35000} 
          text="Happy Customers" 
          duration={20} // Duration for a larger number
        />
      </Col>
      <Col xs={24} sm={24} md={8}>
        <StatItem 
          icon={<CalendarOutlined />} 
          number={5} 
          text="Years Of Business" 
          duration={20} // Shorter duration for smaller numbers
        />
      </Col>
    </Row>
  </Card>
);

export default Stats;
