import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography } from 'antd';
import { ShopOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import './Stats.css';

const { Title, Text } = Typography;

const statsData = [
  {
    key: 'channels',
    modifier: 'channels',
    icon: <ShopOutlined />,
    number: 500,
    label: 'Available Channels',
    gradientStart: '#E50914',
    gradientEnd: '#FF6CAB',
    glow: 'rgba(229, 9, 20, 0.38)',
  },
  {
    key: 'customers',
    modifier: 'customers',
    icon: <UserOutlined />,
    number: 35000,
    label: 'Happy Customers',
    gradientStart: '#00B8FF',
    gradientEnd: '#46F0FF',
    glow: 'rgba(70, 240, 255, 0.35)',
  },
  {
    key: 'years',
    modifier: 'years',
    icon: <CalendarOutlined />,
    number: 5,
    label: 'Years Of Business',
    gradientStart: '#FF7A18',
    gradientEnd: '#AF002D',
    glow: 'rgba(255, 122, 24, 0.32)',
  },
];

const StatItem = ({
  icon,
  number,
  label,
  gradientStart,
  gradientEnd,
  glow,
  modifier,
  active,
  index,
}) => {
  const formattedStatic = number.toLocaleString('en-US');
  const placeholderValue = formattedStatic.replace(/\d/g, '0');

  return (
    <div
      className={`stat-block stat-block--${modifier} ${active ? 'stat-block--active' : ''}`}
      style={{
        '--stat-gradient-start': gradientStart,
        '--stat-gradient-end': gradientEnd,
        '--stat-glow': glow,
        '--stat-animation-delay': `${index * 0.2}s`,
      }}
    >
      <div className="stat-block__icon-wrapper">
        <span className="stat-block__icon">{icon}</span>
        <span className="stat-block__pulse" />
        {modifier === 'customers' && <span className="stat-block__burst" />}
      </div>
      <div className="stat-block__metric">
        <Title level={2} className="stat-block__number">
          {active ? (
            <CountUp start={0} end={number} duration={2.6} separator="," />
          ) : (
            <span>{placeholderValue}</span>
          )}
          <span className="stat-block__suffix">+</span>
        </Title>
        <span className="stat-block__meter" />
        <Text className="stat-block__label">{label}</Text>
        {modifier === 'years' && <span className="stat-block__timeline" />}
      </div>
    </div>
  );
};

const Stats = () => {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!hasAnimated && entry.isIntersecting) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-divider stats-divider--top" />
      <Card className="stats-card" bordered={false}>
        <div className="stats-header">
          <Title level={2} className="stats-title">
            Our Impact In Numbers
          </Title>
          <Text className="stats-description">
            A charged-up snapshot of the creators and brands thriving with SocialSwap.
          </Text>
        </div>
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <StatItem key={stat.key} index={index} active={hasAnimated} {...stat} />
          ))}
        </div>
      </Card>
      <div className="stats-divider stats-divider--bottom" />
    </section>
  );
};

export default Stats;
