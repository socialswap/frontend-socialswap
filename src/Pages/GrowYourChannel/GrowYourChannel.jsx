import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Typography, Card, Button, Timeline, Modal, Form, Radio, Progress, Row, Col } from 'antd';
import { 
  AimOutlined, VideoCameraOutlined, SearchOutlined, PictureOutlined, 
  ScheduleOutlined, CommentOutlined, TeamOutlined, UnorderedListOutlined, 
  GlobalOutlined, BarChartOutlined, RocketOutlined, LikeOutlined,
  CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const PageWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-gap: 24px;
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    grid-gap: 16px;
  }
  @media (max-width: 576px) {
    padding: 16px;
  }
`;

const StepContent = styled(Card)`
  margin-bottom: 16px;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 16px;
  transition: transform 280ms ease, box-shadow 280ms ease, border-color 280ms ease, background 280ms ease;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.12);
    border-color: ${props => props.accent || 'rgba(64,150,255,0.4)'};
    background: rgba(255,255,255,0.85);
  }
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(1200px 200px at var(--mx, 50%) var(--my, 50%), ${props => (props.accent || '#4096ff')}22, transparent 60%);
    opacity: 0;
    transition: opacity 300ms ease;
    pointer-events: none;
  }
  &:hover::after {
    opacity: 1;
  }
  @media (max-width: 576px) {
    margin-bottom: 12px;
  }
`;

const StepNumber = styled.span`
  background: radial-gradient(circle at 30% 30%, #ffffff, ${props => props.accent || '#1890ff'});
  color: #001529;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 0 0 4px ${props => (props.accent || '#1890ff')}22, 0 6px 16px ${props => (props.accent || '#1890ff')}44;
  transition: transform 220ms ease, box-shadow 220ms ease;
  @media (max-width: 576px) {
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 3px ${props => (props.accent || '#1890ff')}22, 0 4px 12px ${props => (props.accent || '#1890ff')}44;
  }
`;

const IconWrapper = styled.div`
  font-size: 24px;
  color: ${props => props.accent || '#1890ff'};
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.08));
  transition: transform 240ms ease;
  ${StepContent}:hover & {
    transform: translateY(-2px) scale(1.05);
  }
  @media (max-width: 576px) {
    font-size: 20px;
  }
`;

const ScoreCard = styled(Card)`
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  color: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  @media (max-width: 576px) {
    border-radius: 12px;
  }
`;

const ProgressWrapper = styled.div`
  .ant-progress-inner {
    background-color: rgba(255, 255, 255, 0.3);
  }
  .ant-progress-bg {
    background-color: white;
  }
  .ant-progress-text {
    color: white;
    font-weight: bold;
  }
`;

const WhatsAppButton = styled(Button)`
  background-color: #25D366;
  border-color: #25D366;
  &:hover, &:focus {
    background-color: #128C7E;
    border-color: #128C7E;
  }
  @media (max-width: 576px) {
    height: 44px;
    font-size: 15px;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 24px;
  height: calc(100vh - 48px);
  padding: 16px 12px;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffffbb, #ffffff88);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 8px 28px rgba(0,0,0,0.06);
  overflow: auto;
  @media (max-width: 992px) {
    position: static;
    height: auto;
    padding: 12px 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const NavItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  margin: 4px 0;
  border-radius: 10px;
  border: 0;
  background: ${props => (props.active ? `${props.accent}14` : 'transparent')};
  color: #1f1f1f;
  cursor: pointer;
  transition: background 200ms ease, transform 120ms ease;
  outline: none;
  &:hover {
    background: ${props => (props.accent ? `${props.accent}12` : '#f5f5f5')};
    transform: translateX(2px);
  }
  @media (max-width: 992px) {
    width: calc(50% - 4px);
    margin: 2px 0;
  }
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const Roadmap = styled.div`
  position: relative;
  padding-left: 32px;
  &::before {
    content: "";
    position: absolute;
    left: 12px;
    top: 0;
    bottom: 0;
    width: 4px;
    border-radius: 2px;
    background: linear-gradient(180deg, #8ec5ff, #b69cff, #5cf1e7, #8ec5ff);
    background-size: 100% 300%;
    animation: flow 8s ease-in-out infinite;
    filter: drop-shadow(0 0 8px rgba(140, 197, 255, 0.6));
  }
  @keyframes flow {
    0% { background-position: 0% 0%; }
    50% { background-position: 0% 100%; }
    100% { background-position: 0% 0%; }
  }
  .ant-timeline-item-tail {
    border-left: 4px solid transparent !important;
  }
  .ant-timeline-item-head {
    background: transparent !important;
    border: 0 !important;
  }
  @media (max-width: 576px) {
    padding-left: 20px;
  }
  @media (max-width: 480px) {
    padding-left: 16px;
    &::before {
      left: 8px;
      width: 3px;
    }
  }
`;

const ParallaxLayer = styled.div`
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(${props => props.blur || 0}px);
  opacity: ${props => props.opacity || 0.25};
  background: radial-gradient(circle at 30% 30%, ${props => props.colorStart || '#9fdfff'}, ${props => props.colorEnd || '#6aa8ff'});
  width: ${props => props.size || 240}px;
  height: ${props => props.size || 240}px;
  left: ${props => props.left || '10%'};
  top: ${props => props.top || '10%'};
  animation: float ${props => props.duration || 18}s ease-in-out infinite;
  @keyframes float {
    0% { transform: translate3d(0,0,0) scale(1); }
    50% { transform: translate3d(0,-18px,0) scale(1.05); }
    100% { transform: translate3d(0,0,0) scale(1); }
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const ContentHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  @media (max-width: 576px) {
    margin-bottom: 20px;
  }
`;

const CategoryBadge = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.accent || '#1677ff'};
  background: ${props => (props.accent ? `${props.accent}16` : '#e6f4ff')};
  border: 1px solid ${props => (props.accent ? `${props.accent}44` : '#91caff')};
  padding: 4px 8px;
  border-radius: 999px;
  margin-bottom: 8px;
`;

const growthTips = [
  { title: "Niche Focus", category: "content", description: "Choose a specific niche you're passionate about and that has a target audience. Stick to content within this niche to build a dedicated community.", icon: <AimOutlined /> },
  { title: "Quality Content", category: "content", description: "Invest in good video quality (HD resolution, clear audio) and edit videos to keep them engaging. Consistency in content quality is key.", icon: <VideoCameraOutlined /> },
  { title: "Keyword Optimization", category: "seo", description: "Use relevant keywords in your video titles, descriptions, and tags. Do keyword research using tools like TubeBuddy or VidIQ to find what people are searching for.", icon: <SearchOutlined /> },
  { title: "Catchy Thumbnails and Titles", category: "design", description: "Design custom, attractive thumbnails that catch attention and create curiosity. Titles should be clear, keyword-rich, and click-worthy.", icon: <PictureOutlined /> },
  { title: "Consistency", category: "content", description: "Upload regularly and stick to a content schedule (e.g., 2–3 times a week). Consistency helps keep your audience engaged and signals YouTube's algorithm.", icon: <ScheduleOutlined /> },
  { title: "Audience Engagement", category: "engagement", description: "Respond to comments, ask questions, and encourage viewers to like, comment, and subscribe. Building a community increases viewer loyalty.", icon: <CommentOutlined /> },
  { title: "Collaborate with Others", category: "engagement", description: "Collaborate with other YouTubers in your niche. This exposes your channel to a wider audience.", icon: <TeamOutlined /> },
  { title: "Use Playlists", category: "content", description: "Group your videos into playlists based on topics to keep viewers on your channel for longer. This increases watch time, which is important for YouTube's algorithm.", icon: <UnorderedListOutlined /> },
  { title: "Leverage Social Media", category: "engagement", description: "Promote your videos on other social platforms (Instagram, Twitter, TikTok) to drive traffic to your channel.", icon: <GlobalOutlined /> },
  { title: "Analyze and Adapt", category: "analytics", description: "Use YouTube Analytics to monitor what's working and what's not. Adjust your content strategy based on viewer preferences and trends.", icon: <BarChartOutlined /> },
  { title: "Hook in First 30 Seconds", category: "content", description: "The first 30 seconds of your video are crucial. Hook the audience with something engaging right at the start to reduce drop-offs.", icon: <RocketOutlined /> },
  { title: "Call to Action (CTA)", category: "engagement", description: "Always include a CTA in your videos. Ask viewers to subscribe, like, and comment directly.", icon: <LikeOutlined /> },
];

const categoryAccentMap = {
  content: '#1677ff',
  seo: '#52c41a',
  design: '#faad14',
  engagement: '#f5222d',
  analytics: '#722ed1',
};

const GrowChannelTimeline = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [score, setScore] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);
  const containerRef = useRef(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setScore(null);
  };

  const onFinish = (values) => {
    const totalScore = Object.values(values).reduce((acc, value) => {
      switch (value) {
        case 'stronglyAgree': return acc + 1;
        case 'agree': return acc + 0.75;
        case 'neutral': return acc + 0.5;
        case 'disagree': return acc + 0.25;
        default: return acc;
      }
    }, 0);
    const percentage = (totalScore / growthTips.length) * 100;
    setScore(percentage);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "+919423523291"; // Replace with your actual WhatsApp number
    const message = `Hi, I'd like to improve my YouTube channel growth score of ${Math.round(score)}%. Can you help me?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setActiveIndex((prev) => (idx > prev ? idx : idx));
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0.1,
      }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e, index) => {
    const card = itemRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${mx}%`);
    card.style.setProperty('--my', `${my}%`);
  };

  const scrollToIndex = (i) => {
    const node = itemRefs.current[i];
    if (!node) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const sidebarItems = useMemo(() => {
    return growthTips.map((t, i) => ({
      title: t.title,
      accent: categoryAccentMap[t.category] || '#1677ff',
      index: i,
    }));
  }, []);

  return (
    <PageWrapper>
      <ParallaxLayer size={360} left="5%" top="12%" colorStart="#b5d6ff" colorEnd="#8fb5ff" opacity={0.25} duration={22} />
      <ParallaxLayer size={240} left="78%" top="20%" colorStart="#ffd6e7" colorEnd="#ff9fc0" opacity={0.22} duration={18} />
      <ParallaxLayer size={300} left="72%" top="68%" colorStart="#c6fff2" colorEnd="#8ef5e4" opacity={0.22} duration={26} />
      <ParallaxLayer size={200} left="14%" top="70%" colorStart="#efe6ff" colorEnd="#cdb8ff" opacity={0.2} duration={20} />
      <Container ref={containerRef}>
        <Sidebar>
          <Title level={4} style={{ marginTop: 0, marginBottom: 10 }}>Roadmap</Title>
          {sidebarItems.map((s, i) => (
            <NavItem
              key={s.title}
              onClick={() => scrollToIndex(i)}
              active={i === activeIndex}
              accent={s.accent}
            >
              <span style={{ fontWeight: 700, color: s.accent, marginRight: 8 }}>{i + 1}</span>
              {s.title}
            </NavItem>
          ))}
          <div style={{ height: 12 }} />
        
        </Sidebar>
        <div>
          <ContentHeader>
            <Title className='mt-16' level={2} style={{ color: '#1f1f1f', marginBottom: 8 }}>
              Grow Your Channel
            </Title>
            <Paragraph style={{ color: '#595959', margin: 0 }}>
              Follow the interactive roadmap. Sections light up as you progress.
            </Paragraph>
          </ContentHeader>
          <Roadmap>
            <Timeline style={{ marginLeft: 0 }}>
              {growthTips.map((tip, index) => {
                const accent = categoryAccentMap[tip.category] || '#1677ff';
                const isActive = index <= activeIndex;
                return (
                  <Timeline.Item
                    key={index}
                    dot={<StepNumber accent={accent}>{index + 1}</StepNumber>}
                  >
                    <div
                      data-index={index}
                      ref={(el) => (itemRefs.current[index] = el)}
                      className={`roadmap-item ${isActive ? 'active' : ''}`}
                      onMouseMove={(e) => handleMouseMove(e, index)}
                    >
                      <StepContent accent={accent} bodyStyle={{ padding: 16 }}>
                        <CategoryBadge accent={accent}>{tip.category}</CategoryBadge>
                        <IconWrapper accent={accent}>{tip.icon}</IconWrapper>
                        <Title level={4} style={{ marginBottom: 6 }}>{tip.title}</Title>
                        <Paragraph style={{ marginBottom: 0 }}>{tip.description}</Paragraph>
                      </StepContent>
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </Roadmap>
          
        </div>
      </Container>
      <Modal
        title={<Title level={3}>Channel Growth Strategy Assessment</Title>}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        style={{ maxWidth: '95vw' }}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Calculate Score
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          {growthTips.map((tip, index) => (
            <Form.Item
              key={index}
              name={`step${index}`}
              label={<strong>{tip.title}</strong>}
              rules={[{ required: true, message: 'Please select an option' }]}
            >
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="stronglyAgree"><CheckCircleOutlined /> Strongly Implement</Radio.Button>
                <Radio.Button value="agree"><CheckCircleOutlined /> Implement</Radio.Button>
                <Radio.Button value="neutral"><QuestionCircleOutlined /> Partially Implement</Radio.Button>
                <Radio.Button value="disagree"><CloseCircleOutlined /> Don't Implement</Radio.Button>
              </Radio.Group>
            </Form.Item>
          ))}
        </Form>
        {score !== null && (
          <>
            <ScoreCard>
              <Row align="middle" gutter={16}>
                <Col span={8}>
                  <Title level={2} style={{ color: 'white', margin: 0 }}>Your Score</Title>
                  <Title level={1} style={{ color: 'white', margin: 0 }}>{Math.round(score)}%</Title>
                </Col>
                <Col span={16}>
                  <ProgressWrapper>
                    <Progress percent={Math.round(score)} showInfo={false} strokeWidth={15} />
                  </ProgressWrapper>
                  <Paragraph style={{ color: 'white', marginTop: 10 }}>
                    {score < 50 && "There's significant room to enhance your channel's growth strategies!"}
                    {score >= 50 && score < 80 && "You're on the right track, but there's potential to further optimize your channel!"}
                    {score >= 80 && "Excellent! Your channel is well-optimized for growth. Keep up the great work!"}
                  </Paragraph>
                </Col>
              </Row>
            </ScoreCard>
            <WhatsAppButton 
              type="primary" 
              icon={<WhatsAppOutlined />} 
              size="large" 
              block
              onClick={handleWhatsAppClick}
            >
              Get Personalized Advice on WhatsApp
            </WhatsAppButton>
          </>
        )}
      </Modal>
    </PageWrapper>
  );
};

export default GrowChannelTimeline;