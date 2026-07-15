import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography } from 'antd';
import { ShopOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';

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
  const [isHovered, setIsHovered] = useState(false);
  const formattedStatic = number.toLocaleString('en-US');
  const placeholderValue = formattedStatic.replace(/\d/g, '0');

  // Hover transitions logic
  const blockStyle = {
    '--stat-gradient-start': gradientStart,
    '--stat-gradient-end': gradientEnd,
    '--stat-glow': glow,
    '--stat-animation-delay': `${index * 0.2}s`,
    transform: isHovered ? 'translateY(-14px) scale(1.01)' : active ? 'translateY(0)' : 'translateY(24px)',
    boxShadow: isHovered ? `0 35px 60px -35px ${glow}` : `0 22px 45px -25px ${glow}`,
  };

  const iconWrapperStyle = {
    transform: isHovered ? 'translateZ(0) scale(1.05)' : 'none',
    boxShadow: isHovered 
      ? `0 20px 45px -25px ${glow}, 0 0 25px -16px rgba(255, 255, 255, 0.85)` 
      : '0 16px 25px -22px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.35)',
  };

  const iconStyle = {
    transform: isHovered 
      ? (modifier === 'channels' ? 'rotateY(360deg)' : modifier === 'customers' ? 'translateZ(0) scale(1.08)' : 'none')
      : 'none',
  };

  const burstStyle = {
    opacity: isHovered ? 1 : 0,
    transform: isHovered ? 'scale(1.1)' : 'scale(0.65)',
  };

  const timelineStyle = {
    width: isHovered ? '100%' : '38%',
    opacity: isHovered ? 0.95 : 0.7,
  };

  return (
    <div
      className={`relative flex flex-col gap-7 px-8 py-9 rounded-[24px] bg-gradient-to-b from-[rgba(255,255,255,0.9)] to-[rgba(250,252,255,0.96)] dark:from-[rgba(24,17,46,0.9)] dark:to-[rgba(13,7,28,0.96)] border border-transparent bg-origin-border bg-clip-padding transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] ${active ? 'opacity-100 animate-fade-in-rise' : 'opacity-0'}`}
      style={blockStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Border Mask */}
      <div
        className="absolute inset-0 rounded-[24px] p-[1px] pointer-events-none transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0)) border-box, linear-gradient(135deg, ${gradientStart}, ${gradientEnd}) border-box`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: isHovered ? 1 : active ? 0.75 : 0.55,
        }}
      />

      {/* Icon Wrapper */}
      <div 
        className="relative w-[82px] h-[82px] flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.65),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(24,17,46,0.65),rgba(13,7,28,0))] overflow-visible transition-all duration-600 before:content-[''] before:absolute before:inset-[-18%] before:rounded-full before:bg-[radial-gradient(circle,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_60%)] before:shadow-[0_0_35px_-15px_rgba(255,255,255,0.85),0_0_60px_-25px_var(--stat-gradient-end)] before:opacity-90 before:z-0"
        style={iconWrapperStyle}
      >
        <span className="relative z-10 text-[2.6rem] text-[rgba(21,27,41,0.92)] dark:text-white filter drop-shadow-[0_12px_15px_rgba(15,17,39,0.15)] transition-transform duration-600" style={iconStyle}>{icon}</span>
        <span className={`absolute inset-0 rounded-full border-2 border-[rgba(255,255,255,0.4)] animate-pulse-ring z-0 ${isHovered ? 'animate-[pulseRing_2.9s_ease-in-out_infinite]' : ''}`} />
        {modifier === 'customers' && (
          <span 
            className="absolute z-0 inset-[-40%] pointer-events-none rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.45),rgba(255,255,255,0)),radial-gradient(circle_at_30%_30%,rgba(229,9,20,0.18),rgba(229,9,20,0)),radial-gradient(circle_at_70%_70%,rgba(0,184,255,0.2),rgba(0,184,255,0))] transition-all duration-600" 
            style={burstStyle}
          />
        )}
      </div>

      {/* Metric */}
      <div className="flex flex-col items-start">
        <Title level={2} className="!flex items-baseline gap-2 !m-0 !p-0 !text-[clamp(2.25rem,4vw,3rem)] !font-extrabold !bg-gradient-to-r !from-[var(--stat-gradient-start)] !to-[var(--stat-gradient-end)] bg-clip-text !text-transparent drop-shadow-[0_0_22px_rgba(255,255,255,0.35)]">
          {active ? (
            <CountUp start={0} end={number} duration={2.6} separator="," />
          ) : (
            <span>{placeholderValue}</span>
          )}
          <span className="text-[1.6rem] font-semibold bg-inherit bg-clip-text text-transparent">+</span>
        </Title>
        <span 
          className="relative inline-flex w-[100px] h-[5px] mt-3 mb-4 rounded-full bg-[rgba(20,28,45,0.08)] dark:bg-[rgba(255,255,255,0.08)] overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[var(--stat-gradient-start)] before:to-[var(--stat-gradient-end)] before:animate-meter-sweep"
          style={{ '--stat-animation-delay': `${index * 0.2}s` }}
        />
        <Text className="text-[1rem] font-medium tracking-[0.02em] !text-[rgba(21,30,45,0.78)] dark:!text-[#9C96B8]">{label}</Text>
        {modifier === 'years' && (
          <span 
            className="block h-[3px] mt-4 rounded-full bg-gradient-to-r from-[var(--stat-gradient-start)] to-[var(--stat-gradient-end)] origin-left transition-all duration-750" 
            style={timelineStyle}
          />
        )}
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
    <section className="relative py-16 bg-gradient-to-b from-white via-[#f7faff] to-[#eef5ff] dark:from-[#070312] dark:via-[#0d071c] dark:to-[#110824] overflow-hidden" ref={sectionRef}>
      <div className="w-[min(280px,40vw)] sm:w-[min(220px,60vw)] h-1 mx-auto mt-0 mb-10 rounded-full bg-gradient-to-r from-[rgba(229,9,20,0.9)] to-[rgba(0,184,255,0.9)] opacity-80 shadow-[0_0_22px_rgba(229,9,20,0.32)]" />
      <Card className="stats-card-custom-bg relative max-w-[1100px] mx-auto px-6 py-10 sm:px-12 sm:py-14 rounded-[28px] shadow-[0_40px_70px_-60px_rgba(4,17,46,0.4)] dark:shadow-[0_40px_70px_-60px_rgba(0,0,0,0.7)] overflow-hidden backdrop-blur-md" variant="borderless">
        <div className="text-center mb-12">
          <Title level={2} className="!m-0 font-sans !font-bold text-[clamp(1.75rem,4vw,2.6rem)] tracking-[0.04em] bg-gradient-to-r from-[rgba(229,9,20,0.92)] to-[rgba(0,184,255,0.95)] bg-clip-text !text-transparent">
            Our Impact In Numbers
          </Title>
          <Text className="inline-block mt-3 text-[rgba(22,31,55,0.72)] dark:text-[#C9C4DD] text-[0.95rem] tracking-[0.01em]">
            A charged-up snapshot of the creators and brands thriving with SocialSwap.
          </Text>
        </div>
        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {statsData.map(({ key, ...stat }, index) => (
            <StatItem key={key} index={index} active={hasAnimated} {...stat} />
          ))}
        </div>
      </Card>
      <div className="w-[min(280px,40vw)] sm:w-[min(220px,60vw)] h-1 mx-auto mt-12 rounded-full bg-gradient-to-r from-[rgba(229,9,20,0.9)] to-[rgba(0,184,255,0.9)] opacity-65 shadow-[0_0_22px_rgba(0,184,255,0.28)]" />
    </section>
  );
};

export default Stats;
