import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Button, List } from 'antd';
import { 
  YoutubeOutlined, DollarOutlined, SafetyOutlined, RocketOutlined,
  CheckCircleOutlined, GlobalOutlined, TeamOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

// YouTube-like light theme with subtle gaming-inspired accents
const primaryColor = '#FF0000'; // YouTube red
const backgroundColor = '#ffffff';
const surfaceColor = '#ffffff';
const surfaceAltColor = '#fafafa';
const textColor = '#111111';
const subTextColor = '#444444';
const accentNeon = '#00E5FF';
const accentPurple = '#7C4DFF';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  background-color: ${backgroundColor};
  color: ${textColor};
  min-height: 100vh;
  position: relative;
`;

const Section = styled.div`
  margin-bottom: 80px;
`;

const CurvedDivider = styled.div`
  position: relative;
  height: 80px;
  margin: 24px 0 8px 0;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    left: -10%;
    right: -10%;
    top: 0;
    height: 120%;
    background: radial-gradient(120% 80px at 50% 0%, rgba(255,0,0,0.08), transparent 60%),
                linear-gradient(180deg, transparent 0%, ${surfaceAltColor} 100%);
    transform: translateY(-60%) skewY(-3deg);
  }
`;

const HeroSection = styled(Section)`
  text-align: center;
`;

const HeroGlass = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 900px;
  padding: 32px 28px;
  border-radius: 16px;
  backdrop-filter: saturate(160%) blur(8px);
  background: linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.45));
  border: 1px solid rgba(255,255,255,0.7);
  box-shadow: 0 25px 60px rgba(0,0,0,0.12);
  z-index: 1;
`;

const TrustedRibbon = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 8px 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255,0,0,0.08), rgba(124,77,255,0.08));
  color: ${subTextColor};
  font-weight: 600;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
`;

const FeatureCard = styled(Card)`
  height: 100%;
  border: 1px solid ${surfaceAltColor};
  background-color: ${surfaceColor};
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  &:hover {
    transform: translateY(-6px) rotateX(2deg);
    border-color: ${primaryColor};
    box-shadow: 0 16px 36px rgba(0,0,0,0.12), 0 0 0 3px rgba(255,0,0,0.08);
  }
`;

const TrustStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px 22px;
  padding: 18px 12px 0 12px;
`;

const TrustBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #efefef;
  background: #fff;
  color: ${subTextColor};
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(0,0,0,0.05);
`;

const StatsSection = styled(Section)`
  background-color: ${surfaceAltColor};
  padding: 40px 24px;
  border-radius: 8px;
  border: 1px solid #eeeeee;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
`;

const AwardBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  align-items: stretch;
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const AwardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff, #fbfbfb);
  border: 1px solid #f0f0f0;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  will-change: transform;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(0,0,0,0.08);
    border-color: rgba(255,0,0,0.25);
  }
`;

const AwardIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(255,0,0,0.1), rgba(124,77,255,0.12));
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
`;

const AwardText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
`;

const AwardNum = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${textColor};
`;

const AwardLabel = styled.div`
  font-size: 13px;
  color: ${subTextColor};
`;

const CountUp = ({ to = 0, duration = 1200 }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const step = (t) => {
      const elapsed = t - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * to));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{value.toLocaleString()}</>;
};

const FAQSection = styled(Section)``;

const TimelineSection = styled(Section)`
  position: relative;
`;

const Timeline = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StepCard = styled.div`
  position: relative;
  padding: 18px 16px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #efefef;
  box-shadow: 0 10px 24px rgba(0,0,0,0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  will-change: transform;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 36px rgba(0,0,0,0.08);
  }
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const StepDot = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: linear-gradient(145deg, ${primaryColor}, ${accentPurple});
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  box-shadow: 0 8px 20px rgba(255,0,0,0.3);
`;

const StepTitle = styled.div`
  font-weight: 700;
  color: ${textColor};
`;

const StepDesc = styled.div`
  color: ${subTextColor};
  font-size: 14px;
`;

const CTASection = styled(Section)`
  text-align: center;
  background-color: ${surfaceAltColor};
  padding: 48px 24px;
  border-radius: 8px;
  border: 1px solid #eeeeee;
  position: relative;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    inset: -200%;
    background: conic-gradient(from 0deg, ${primaryColor}, ${accentNeon}, ${accentPurple}, ${primaryColor});
    animation: rotateBorder 6s linear infinite;
    filter: blur(30px);
    opacity: 0.25;
  }
  &:after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 8px;
    background: ${surfaceAltColor};
    z-index: 1;
  }
`;

const StyledButton = styled(Button)`
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
  border-radius: 4px;
  border-width: 2px;
  &:not(.ant-btn-primary) {
    color: ${textColor};
    border-color: ${primaryColor};
    background-color: transparent;
  }
  &.ant-btn-primary {
    background: linear-gradient(90deg, ${primaryColor}, ${accentPurple});
    border-color: transparent;
  }
  position: relative;
  overflow: hidden;
  z-index: 2;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 120%;
    height: 100%;
    background: linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.35), transparent 60%);
    transition: left 0.6s ease;
  }
  &:hover::after {
    left: 150%;
  }
  &:hover {
    box-shadow: 0 10px 24px rgba(255,0,0,0.18), 0 0 0 3px rgba(255,0,0,0.12);
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0px) scale(0.98);
  }
`;

const CTAHint = styled.div`
  margin-top: 6px;
  color: ${subTextColor};
  font-size: 13px;
`;

const Arrow = styled.span`
  display: inline-block;
  margin-left: 10px;
  transition: transform 0.25s ease;
  ${StyledButton}:hover & {
    transform: translateX(4px);
  }
`;

const HelpWidget = styled.button`
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 999px;
  border: 1px solid #efefef;
  background: #ffffff;
  color: ${textColor};
  font-weight: 700;
  box-shadow: 0 14px 28px rgba(0,0,0,0.12);
  cursor: pointer;
  z-index: 50;
  animation: floatIcon 4s ease-in-out infinite;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.16);
  }
`;

const AccentBackdrop = styled.div`
  position: absolute;
  inset: -10% -10% auto -10%;
  height: 320px;
  background: radial-gradient(600px 200px at 50% 0%, rgba(255,0,0,0.08), transparent 60%),
              radial-gradient(400px 160px at 20% 0%, rgba(0,229,255,0.08), transparent 60%),
              radial-gradient(400px 160px at 80% 0%, rgba(124,77,255,0.08), transparent 60%);
  pointer-events: none;
  animation: floatBackdrop 8s ease-in-out infinite alternate;
`;

 

const IconWrap = styled.div`
  margin-bottom: 16px;
  display: inline-flex;
  padding: 10px;
  border-radius: 12px;
  background: linear-gradient(145deg, rgba(255,0,0,0.06), rgba(0,229,255,0.06));
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04);
  animation: floatIcon 4s ease-in-out infinite;
`;

const GradientTitle = styled(Title)`
  && {
    background: linear-gradient(90deg, ${textColor}, ${primaryColor}, ${accentNeon}, ${textColor});
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent !important;
    background-size: 300% 100%;
    animation: gradientShift 6s ease-in-out infinite;
  }
`;

const Keyframes = styled.div`
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes floatIcon {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
    100% { transform: translateY(0px); }
  }
  @keyframes floatBackdrop {
    0% { transform: translateY(0px); opacity: 0.9; }
    100% { transform: translateY(10px); opacity: 1; }
  }
  @keyframes rotateBorder {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeUp {
    0% { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0px); }
  }
  @keyframes gridDrift {
    0% { background-position: 0% 0%, 0% 0%; }
    50% { background-position: 0% 0%, 100% 100%; }
    100% { background-position: 0% 0%, 0% 0%; }
  }
  @keyframes pulseGlow {
    0% { box-shadow: 0 6px 18px rgba(0,0,0,0.06), 0 0 0 0 rgba(255,0,0,0.06); }
    50% { box-shadow: 0 10px 28px rgba(0,0,0,0.08), 0 0 0 6px rgba(255,0,0,0.035); }
    100% { box-shadow: 0 6px 18px rgba(0,0,0,0.06), 0 0 0 0 rgba(255,0,0,0.06); }
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`;

const AboutPage = () => {
  const navigate = useNavigate()
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
      <Keyframes />
      <AccentBackdrop />
      <HeroSection className='neumorphism-card mt-16' style={{ animation: 'fadeUp 0.6s ease both' }}>
        {/* <AmbientGrid /> */}
        <HeroGlass>
          <IconWrap>
            <YoutubeOutlined style={{ fontSize: '48px', color: primaryColor }} />
          </IconWrap>
          <GradientTitle level={1} style={{ marginBottom: '10px' }}>Welcome to SocialSwap</GradientTitle>
          <Paragraph style={{ fontSize: '18px', maxWidth: '760px', margin: '0 auto', color: subTextColor }}>
            The premier marketplace for buying and selling YouTube channels. 
            We connect content creators with entrepreneurs, helping to build digital empires.
          </Paragraph>
          <TrustedRibbon>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: primaryColor, display: 'inline-block' }} />
            Trusted by 500+ creators worldwide
          </TrustedRibbon>
        </HeroGlass>
      </HeroSection>

      <CurvedDivider />

      <Section>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px', color: textColor }}>Why Choose SocialSwap?</Title>
        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <FeatureCard style={{ animation: 'pulseGlow 6s ease-in-out infinite' }}>
                <IconWrap>{feature.icon}</IconWrap>
                <Title level={4} style={{ color: textColor }}>{feature.title}</Title>
                <Paragraph style={{ color: subTextColor }}>{feature.description}</Paragraph>
              </FeatureCard>
            </Col>
          ))}
        </Row>
        <TrustStrip>
          <TrustBadge><SafetyOutlined style={{ color: primaryColor }} /> Secure Escrow</TrustBadge>
          <TrustBadge><CheckCircleOutlined style={{ color: primaryColor }} /> Verified Sellers</TrustBadge>
          <TrustBadge><GlobalOutlined style={{ color: primaryColor }} /> 21 Countries</TrustBadge>
          <TrustBadge><TeamOutlined style={{ color: primaryColor }} /> 5000+ Customers</TrustBadge>
        </TrustStrip>
      </Section>

      <StatsSection style={{ animation: 'fadeUp 0.6s ease both' }}>
        <AwardBar>
          <AwardItem>
            <AwardIcon>
              <CheckCircleOutlined style={{ color: primaryColor, fontSize: 22 }} />
            </AwardIcon>
            <AwardText>
              <AwardNum><CountUp to={500} />+</AwardNum>
              <AwardLabel>Channels Sold</AwardLabel>
            </AwardText>
          </AwardItem>
          <AwardItem>
            <AwardIcon>
              <TeamOutlined style={{ color: primaryColor, fontSize: 22 }} />
            </AwardIcon>
            <AwardText>
              <AwardNum><CountUp to={5000} />+</AwardNum>
              <AwardLabel>Happy Customers</AwardLabel>
            </AwardText>
          </AwardItem>
          <AwardItem>
            <AwardIcon>
              <GlobalOutlined style={{ color: primaryColor, fontSize: 22 }} />
            </AwardIcon>
            <AwardText>
              <AwardNum><CountUp to={21} /></AwardNum>
              <AwardLabel>Countries Served</AwardLabel>
            </AwardText>
          </AwardItem>
          <AwardItem>
            <AwardIcon>
              <RocketOutlined style={{ color: primaryColor, fontSize: 22 }} />
            </AwardIcon>
            <AwardText>
              <AwardNum><CountUp to={100} />%</AwardNum>
              <AwardLabel>Success Rate</AwardLabel>
            </AwardText>
          </AwardItem>
        </AwardBar>
      </StatsSection>

      <TimelineSection style={{ animation: 'fadeUp 0.6s ease both' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '18px', color: textColor }}>How Buying Works</Title>
        <Paragraph style={{ fontSize: '16px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 28px', color: subTextColor }}>
          A clear, secure path from browsing to full ownership — guided every step of the way.
        </Paragraph>
        <Timeline>
          <StepCard>
            <StepHeader>
              <StepDot>1</StepDot>
              <StepTitle>Browse Channels</StepTitle>
            </StepHeader>
            <StepDesc>Explore verified listings with real metrics and history.</StepDesc>
          </StepCard>
          <StepCard>
            <StepHeader>
              <StepDot>2</StepDot>
              <StepTitle>Make Secure Offer</StepTitle>
            </StepHeader>
            <StepDesc>Negotiate confidently with transparent pricing.</StepDesc>
          </StepCard>
          <StepCard>
            <StepHeader>
              <StepDot>3</StepDot>
              <StepTitle>Escrow Initiated</StepTitle>
            </StepHeader>
            <StepDesc>Your funds are protected while transfer begins.</StepDesc>
          </StepCard>
          <StepCard>
            <StepHeader>
              <StepDot>4</StepDot>
              <StepTitle>Channel Transfer</StepTitle>
            </StepHeader>
            <StepDesc>We assist with safe ownership handover and setup.</StepDesc>
          </StepCard>
          <StepCard>
            <StepHeader>
              <StepDot>5</StepDot>
              <StepTitle>Full Ownership</StepTitle>
            </StepHeader>
            <StepDesc>Start growing with your new channel on day one.</StepDesc>
          </StepCard>
        </Timeline>
      </TimelineSection>

      <Section>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '16px', color: textColor }}>Our Mission</Title>
        <Paragraph style={{ fontSize: '16px', textAlign: 'center', maxWidth: '800px', margin: '0 auto', color: subTextColor }}>
          At SocialSwap, we're passionate about fostering the growth of digital content and entrepreneurship. 
          Our mission is to create a trusted ecosystem where content creators can monetize their hard work, 
          and visionary entrepreneurs can acquire established channels to expand their online presence.
        </Paragraph>
      </Section>

      <FAQSection>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px', color: textColor }}>Frequently Asked Questions</Title>
        <List
          itemLayout="vertical"
          dataSource={faqItems}
          renderItem={item => (
            <List.Item style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')} onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0px)')}>
              <List.Item.Meta
                title={<Text strong style={{ fontSize: '18px', color: textColor }}>{item.question}</Text>}
                description={<Paragraph style={{ color: subTextColor }}>{item.answer}</Paragraph>}
              />
            </List.Item>
          )}
        />
      </FAQSection>

      <CTASection>
      <Title level={2} style={{ marginBottom: '16px', color: textColor, position: 'relative', zIndex: 2 }}>
        Ready to Get Started?
      </Title>
      <Paragraph style={{ fontSize: '16px', marginBottom: '24px', color: subTextColor, position: 'relative', zIndex: 2 }}>
        Whether you're looking to buy your next YouTube channel or sell your digital asset, 
        SocialSwap is here to make it happen. Join our community of creators and entrepreneurs today!
      </Paragraph>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 2 }}>
        <StyledButton
          type="primary"
          onClick={() => navigate('/channels')}
          size="large"
        >
          Browse Channels <Arrow>→</Arrow>
        </StyledButton>
        <CTAHint>New listings added daily</CTAHint>
        <StyledButton
          size="large"
          onClick={() => navigate('/seller-dashboard')}
        >
          List Your Channel
        </StyledButton>
      </div>
    </CTASection>

    </PageContainer>
  );
};

export default AboutPage;
