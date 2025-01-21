import React, { useState } from 'react';
import { Carousel, Button, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const PromotionalBanner = () => {
  const [carouselRef, setCarouselRef] = useState(null);

  const banners = [
    {
      title: "Summer Sale!",
      description: "Get 50% off on all channels this summer",
      buttonText: "Shop Now",
      buttonLink: "/summer-sale",
    //   backgroundColor: "#FFD700",
      textColor: "#000000"
    },
    {
      title: "New Channels Added",
      description: "Explore our latest additions to find your perfect match",
      buttonText: "Explore More",
      buttonLink: "/new-channels",
    //   backgroundColor: "#4CAF50",
      textColor: "#000000"
    },
    {
      title: "Limited Time Offer",
      description: "Buy one channel, get another 50% off",
      buttonText: "Get Offer",
      buttonLink: "/limited-offer",
    //   backgroundColor: "#F44336",
      textColor: "#000000"
    }
  ];

  const nextBanner = () => {
    carouselRef.next();
  };

  const prevBanner = () => {
    carouselRef.prev();
  };

  return (
    <div className="promotional-banner shadow-lg mx-[2px]" style={{ position: 'relative', marginBottom: '2rem' }}>
      <Carousel
        autoplay
        ref={setCarouselRef}
        dots={true}
        effect="fade"
      >
        {banners.map((banner, index) => (
          <div key={index}>
            <div style={{
              height: '300px',
              background: banner.backgroundColor,
              color: banner.textColor,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem'
            }}>
              <Title level={2} style={{ color: banner.textColor, marginBottom: '1rem' }}>{banner.title}</Title>
              <Paragraph style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{banner.description}</Paragraph>
              <Button type="primary" size="large" href={banner.buttonLink}>{banner.buttonText}</Button>
            </div>
          </div>
        ))}
      </Carousel>
      <Button
        icon={<LeftOutlined />}
        onClick={prevBanner}
        style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)' }}
      />
      <Button
        icon={<RightOutlined />}
        onClick={nextBanner}
        style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
      />
    </div>
  );
};

export default PromotionalBanner;