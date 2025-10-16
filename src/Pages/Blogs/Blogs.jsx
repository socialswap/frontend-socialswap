import React from 'react';
import { Row, Col, Card, Typography, Button, Image } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// Sample blog data
const featuredPost = [{
  id: 1,
  title: "The Future of YouTube: Trends to Watch in 2024",
  excerpt: "Explore the emerging trends that are shaping the future of YouTube and content creation. From AI-driven recommendations to interactive video experiences, discover what's next for the platform and how creators can stay ahead of the curve.",
  imageUrl: "/api/placeholder/800/600",
  date: "2024-03-20"
},
{
  id: 2,
  title: "Mastering YouTube SEO",
  excerpt: "Boost your video visibility with expert SEO tips.",
  imageUrl: "/api/placeholder/400/300",
  date: "2024-03-15"
},
{
  id: 3,
  title: "Crafting Viral Content",
  excerpt: "Learn the art of creating shareable, viral videos.",
  imageUrl: "/api/placeholder/400/300",
  date: "2024-03-10"
},
{
  id: 4,
  title: "YouTube Analytics Deep Dive",
  excerpt: "Understand your audience with in-depth analytics.",
  imageUrl: "/api/placeholder/400/300",
  date: "2024-03-05"
},
{
  id: 5,
  title: "Monetization Strategies",
  excerpt: "Explore various ways to monetize your channel.",
  imageUrl: "/api/placeholder/400/300",
  date: "2024-02-28"
}
];

const BlogSection = () => {
  return (
    <div style={{ padding: '40px 0', backgroundColor: '#f0f0f0' }} className='mt-16'>
      <Title level={2} style={{ textAlign: 'center', color: 'black', marginBottom: '40px' }}>
        Latest from Our Blog
      </Title>
      <Row justify='center'>
        {
          featuredPost?.map((item, index) => {
            return (
              <Card key={item.id} className='m-4 w-[60%]' style={{ backgroundColor: 'white' }}>
                <Row gutter={[24, 24]} justify="center">
                  <Col xs={24} md={12}>
                    <Image
                      src={ 'images/yt3.png'}
                      alt={item.title}
                      style={{ width: '100%', height: '15rem', objectFit: 'contain' }}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Title level={3} style={{ color: 'black', marginBottom: '12px' }}>{item.title}</Title>
                    <Paragraph style={{ color: 'black', marginBottom: '12px' }}>{item.excerpt}</Paragraph>
                    <Paragraph style={{ color: 'black', marginBottom: '16px' }}>{item.date}</Paragraph>
                    <Button type="primary" style={{ backgroundColor: 'black', borderColor: 'black', color: 'white' }}>
                      Read More <ArrowRightOutlined />
                    </Button>
                  </Col>
                </Row>
              </Card>
            )
          })
        }
      </Row>
    </div>
  );
};

export default BlogSection;