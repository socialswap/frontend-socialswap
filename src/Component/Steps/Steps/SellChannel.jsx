import React from 'react';
import { Steps, Typography, Card, Button, Input } from 'antd';
import { FormOutlined, MessageOutlined, CopyOutlined, ArrowRightOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const SellChannelSteps = () => {
  const steps = [
    {
      title: 'Submit the Form',
      description: 'Click the "Submit" button to send your completed form to us.',
      icon: <FormOutlined />
    },
    {
      title: 'Receive Auto-Generated Message',
      description: (
        <>
          After submitting the form, you will receive an auto-generated message that reads:
          <TextArea
            value="Hey team SocialSwap, I have submitted my channel with the channel ID _________. Guide me further to sell my channel."
            readOnly
            style={{ margin: '10px 0', backgroundColor: 'rgb(22, 101, 52, 0.1)' }}
            rows={3}
          />
        </>
      ),
      icon: <MessageOutlined />
    },
    {
      title: 'Copy the Auto-Generated Message',
      description: 'Copy the text of the auto-generated message for your reference.',
      icon: <CopyOutlined />
    },
    {
      title: 'Proceed to Our Channel Dealers',
      description: (
        <>
          Click the "Continue" button, which will redirect you to our official channel dealers page.
          <br /><br />
          <Button type="primary" icon={<ArrowRightOutlined />} style={{ backgroundColor: 'rgb(248, 55, 88)', borderColor: 'rgb(248, 55, 88)' }}>
            Continue to Channel Dealers
          </Button>
        </>
      ),
      icon: <ArrowRightOutlined />
    },
    {
      title: 'Paste the Auto-Generated Message',
      description: 'On the official channel dealers page, paste the auto-generated message you copied earlier.',
      icon: <FileTextOutlined />
    },
    {
      title: "We'll Take It From Here",
      description: "Once you've pasted the message, our team will handle the rest of the process manually and guide you through the next steps.",
      icon: <TeamOutlined />
    }
  ];

  // ... rest of the component remains the same

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto', marginTop: 20 }}>
      <Title level={2} style={{ color: 'rgb(248, 55, 88)', textAlign: 'center', marginBottom: 30 }}>
        Sell Your YouTube Channel
      </Title>
      <Paragraph style={{ fontSize: 16, marginBottom: 30, textAlign: 'center' }}>
        Follow these simple steps to sell your YouTube channel on our platform.
      </Paragraph>
      <Steps
        direction="vertical"
        items={steps.map((step, index) => ({
          title: <span style={{ color: '#1677ff', fontWeight: 'bold' }}>{step.title}</span>,
          description: (
            <div>
              <Paragraph>{step.description}</Paragraph>
            </div>
          ),
          icon: React.cloneElement(step.icon, { style: { color: 'rgb(248, 55, 88)' } })
        }))}
      />
      <Paragraph style={{ marginTop: 20, textAlign: 'center', color: '#1677ff' }}>
        Thank you for choosing our platform to sell your YouTube channel. If you have any questions or need assistance during the process, please don't hesitate to contact us.
      </Paragraph>
    </Card>
  );
};

export default SellChannelSteps;