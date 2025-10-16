import React, { useState } from 'react';
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

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const StepContent = styled(Card)`
  margin-bottom: 16px;
  background-color: ${props => props.background};
`;

const StepNumber = styled.span`
  background-color: #1890ff;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const IconWrapper = styled.div`
  font-size: 24px;
  color: #1890ff;
  margin-bottom: 8px;
`;

const ScoreCard = styled(Card)`
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  color: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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
`;

const growthTips = [
  { title: "Niche Focus", description: "Choose a specific niche you're passionate about and that has a target audience. Stick to content within this niche to build a dedicated community.", icon: <AimOutlined />, background: '#f0f2f5' },
  { title: "Quality Content", description: "Invest in good video quality (HD resolution, clear audio) and edit videos to keep them engaging. Consistency in content quality is key.", icon: <VideoCameraOutlined />, background: '#e6f7ff' },
  { title: "Keyword Optimization", description: "Use relevant keywords in your video titles, descriptions, and tags. Do keyword research using tools like TubeBuddy or VidIQ to find what people are searching for.", icon: <SearchOutlined />, background: '#f6ffed' },
  { title: "Catchy Thumbnails and Titles", description: "Design custom, attractive thumbnails that catch attention and create curiosity. Titles should be clear, keyword-rich, and click-worthy.", icon: <PictureOutlined />, background: '#fff7e6' },
  { title: "Consistency", description: "Upload regularly and stick to a content schedule (e.g., 2–3 times a week). Consistency helps keep your audience engaged and signals YouTube's algorithm.", icon: <ScheduleOutlined />, background: '#f5f0ff' },
  { title: "Audience Engagement", description: "Respond to comments, ask questions, and encourage viewers to like, comment, and subscribe. Building a community increases viewer loyalty.", icon: <CommentOutlined />, background: '#fff0f6' },
  { title: "Collaborate with Others", description: "Collaborate with other YouTubers in your niche. This exposes your channel to a wider audience.", icon: <TeamOutlined />, background: '#f0f5ff' },
  { title: "Use Playlists", description: "Group your videos into playlists based on topics to keep viewers on your channel for longer. This increases watch time, which is important for YouTube's algorithm.", icon: <UnorderedListOutlined />, background: '#fcffe6' },
  { title: "Leverage Social Media", description: "Promote your videos on other social platforms (Instagram, Twitter, TikTok) to drive traffic to your channel.", icon: <GlobalOutlined />, background: '#e6fffb' },
  { title: "Analyze and Adapt", description: "Use YouTube Analytics to monitor what's working and what's not. Adjust your content strategy based on viewer preferences and trends.", icon: <BarChartOutlined />, background: '#fff2e8' },
  { title: "Hook in First 30 Seconds", description: "The first 30 seconds of your video are crucial. Hook the audience with something engaging right at the start to reduce drop-offs.", icon: <RocketOutlined />, background: '#fafafa' },
  { title: "Call to Action (CTA)", description: "Always include a CTA in your videos. Ask viewers to subscribe, like, and comment directly.", icon: <LikeOutlined />, background: '#f0fff0' },
];

const GrowChannelTimeline = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [score, setScore] = useState(null);

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

  return (
    <Container >
    
    <Title className='mt-16' level={2} style={{ color: '#333', textAlign: 'center', marginBottom: 30 }}>
        Grow Your Channel!
      </Title>
      <Timeline>
        {growthTips.map((tip, index) => (
          <Timeline.Item
            key={index}
            dot={<StepNumber>{index + 1}</StepNumber>}
          >
            <StepContent background={tip.background}>
              <IconWrapper>{tip.icon}</IconWrapper>
              <Title level={4}>{tip.title}</Title>
              <Paragraph>{tip.description}</Paragraph>
            </StepContent>
          </Timeline.Item>
        ))}
      </Timeline>
      <Button color="ghost" onClick={showModal} size="large" style={{ marginBottom: 20 }}>
        Assess My Channel Growth Strategies
      </Button>
      <Modal
        title={<Title level={3}>Channel Growth Strategy Assessment</Title>}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
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
    </Container>
  );
};

export default GrowChannelTimeline;