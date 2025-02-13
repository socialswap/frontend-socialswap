import React from 'react';
import { Typography, Row, Col, Card, Button, List, Statistic, Divider } from 'antd';
import { 
  YoutubeOutlined, DollarOutlined, SafetyOutlined, RocketOutlined,
  CheckCircleOutlined, GlobalOutlined, TeamOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const primaryColor = 'black';
const secondaryColor = 'white';
const textColor = 'black';
const lightGrey = '#f0f0f0';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  color: ${textColor};
`;

const Section = styled.div`
  margin-bottom: 80px;
`;

const HeroSection = styled(Section)`
  text-align: center;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: none;
  background-color: ${secondaryColor};
  &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
`;

const StatsSection = styled(Section)`
  background-color: ${lightGrey};
  padding: 60px;
  border-radius: 8px;
`;

const FAQSection = styled(Section)``;

const CTASection = styled(Section)`
  text-align: center;
  background-color: ${lightGrey};
  padding: 60px;
  border-radius: 8px;
`;

const StyledButton = styled(Button)`
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
  border-radius: 4px;
`;

const AboutPage = () => {
  const navigate = useNavigate()
  const CTASection = styled.div`
  text-align: center;
  padding: 24px;

  @media (min-width: 768px) {
    text-align: left;
    padding: 48px;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    width: auto;
    margin-bottom: 0;
  }
`;
  const features = [
    {
      title: 'Verified Channels',
      description: 'All channels are thoroughly vetted for authenticity and compliance.',
      icon: <SafetyOutlined style={{ fontSize: '24px', color: primaryColor }} />,
    },
    {
      title: 'Seamless Transactions',
      description: 'Secure escrow system for safe transfers between buyers and sellers.',
      icon: <DollarOutlined style={{ fontSize: '24px', color: primaryColor }} />,
    },
    {
      title: 'Growth Potential',
      description: 'Access established channels and unlock immediate growth opportunities.',
      icon: <RocketOutlined style={{ fontSize: '24px', color: primaryColor }} />,
    },
    {
      title: 'Expert Support',
      description: '24/7 assistance from our team of YouTube and digital media experts.',
      icon: <TeamOutlined style={{ fontSize: '24px', color: primaryColor }} />,
    },
  ];

  const faqItems = [
    {
      question: 'How does the buying process work?',
      answer: `Our platform facilitates a secure transaction between buyers and sellers. Once you find a channel you're interested in, you can make an offer. If accepted, our escrow service holds the payment while we assist with the channel transfer process.`,
    },
    {
      question: 'Is it safe to buy a YouTube channel?',
      answer: `Yes, when done through a reputable platform like ours. We verify all channels and ensure they comply with YouTube's terms of service. Our escrow system also protects both buyers and sellers throughout the transaction.`,
    },
    {
      question: 'Can I sell my YouTube channel on your platform?',
      answer: `Absolutely! If your channel meets our quality standards and guidelines, you can list it on our marketplace. We'll help you showcase your channel's value to potential buyers.`,
    },
    {
      question: 'What happens after I buy a channel?',
      answer: 'Once the transaction is complete, we guide you through the transfer process. This includes changing account ownership, updating payment information, and ensuring you have full control of the channel.',
    },
  ];

  return (
    <PageContainer className=''>
      <HeroSection className='neumorphism-card mt-16'>
        <YoutubeOutlined style={{ fontSize: '48px', color: primaryColor, marginBottom: '24px' }} />
        <Title level={1} style={{ marginBottom: '24px', color: primaryColor }}>Welcome to SocialSwap</Title>
        <Paragraph style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto', color: textColor }}>
          The premier marketplace for buying and selling YouTube channels. 
          We connect content creators with entrepreneurs, helping to build digital empires.
        </Paragraph>
      </HeroSection>

      <Section>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px', color: primaryColor }}>Why Choose SocialSwap?</Title>
        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <FeatureCard>
                <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
                <Title level={4} style={{ color: primaryColor }}>{feature.title}</Title>
                <Paragraph style={{ color: textColor }}>{feature.description}</Paragraph>
              </FeatureCard>
            </Col>
          ))}
        </Row>
      </Section>

      <StatsSection>
        <Row gutter={[32, 32]} justify="space-around">
          <Col>
            <Statistic title="Channels Sold" value={500} prefix={<CheckCircleOutlined style={{ color: primaryColor }} />} />
          </Col>
          <Col>
            <Statistic title="Happy Customers" value={5000} prefix={<TeamOutlined style={{ color: primaryColor }} />} />
          </Col>
          <Col>
            <Statistic title="Countries Served" value={21} prefix={<GlobalOutlined style={{ color: primaryColor }} />} />
          </Col>
          <Col>
            <Statistic title="Success Rate" value={100} suffix="%" prefix={<RocketOutlined style={{ color: primaryColor }} />} />
          </Col>
        </Row>
      </StatsSection>

      <Section>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: primaryColor }}>Our Mission</Title>
        <Paragraph style={{ fontSize: '16px', textAlign: 'center', maxWidth: '800px', margin: '0 auto', color: textColor }}>
          At SocialSwap, we're passionate about fostering the growth of digital content and entrepreneurship. 
          Our mission is to create a trusted ecosystem where content creators can monetize their hard work, 
          and visionary entrepreneurs can acquire established channels to expand their online presence.
        </Paragraph>
      </Section>

      <FAQSection>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px', color: primaryColor }}>Frequently Asked Questions</Title>
        <List
          itemLayout="vertical"
          dataSource={faqItems}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<Text strong style={{ fontSize: '18px', color: primaryColor }}>{item.question}</Text>}
                description={<Paragraph style={{ color: textColor }}>{item.answer}</Paragraph>}
              />
            </List.Item>
          )}
        />
      </FAQSection>

      <CTASection>
      <Title level={2} style={{ marginBottom: '24px', color: primaryColor }}>
        Ready to Get Started?
      </Title>
      <Paragraph style={{ fontSize: '16px', marginBottom: '32px', color: textColor }}>
        Whether you're looking to buy your next YouTube channel or sell your digital asset, 
        SocialSwap is here to make it happen. Join our community of creators and entrepreneurs today!
      </Paragraph>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <StyledButton
          type="primary"
          onClick={() => navigate('/channels')}
          size="large"
          style={{
            backgroundColor: primaryColor,
            borderColor: primaryColor,
            color: secondaryColor,
          }}
        >
          Browse Channels
        </StyledButton>
        <StyledButton
          size="large"
          onClick={() => navigate('/seller-dashboard')}
          style={{
            backgroundColor: secondaryColor,
            borderColor: primaryColor,
            color: primaryColor,
          }}
        >
          List Your Channel
        </StyledButton>
      </div>
    </CTASection>
    </PageContainer>
  );
};

export default AboutPage;