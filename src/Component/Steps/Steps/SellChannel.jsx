import React from 'react';
import { Steps, Typography, Card, Button, Input } from 'antd';
import { FormOutlined, MessageOutlined, CopyOutlined, ArrowRightOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
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
            style={{ margin: '10px 0', backgroundColor: 'rgba(248,55,88,0.06)', borderRadius: 12 }}
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
          <a
          href="https://wa.me/919423523291" target="_blank" style={{ backgroundColor: '#25D366', borderColor: '#25D366',color:'white', padding:'0.5rem', borderRadius:'0.5rem' }} rel="noopener noreferrer"  aria-label="Open WhatsApp to continue transfer"
            type="primary"
            icon={<ArrowRightOutlined />}
            style={{
              backgroundImage: 'linear-gradient(90deg, rgb(248,55,88), rgb(255,159,64))',
              border: 'none',
              boxShadow: '0 12px 30px rgba(248,55,88,0.25)'
            }}
          >
            Continue to Channel Dealers
          </a>
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
    <Card style={{ maxWidth: 800, margin: '0 auto', marginTop: 20 }} className="rounded-3xl bg-white/70 backdrop-blur border border-white/70 shadow-xl relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-100/60 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-100/60 blur-3xl rounded-full" />
      </div>
      <Title
        level={2}
        style={{
          textAlign: 'center',
          marginBottom: 24,
          backgroundImage: 'linear-gradient(90deg, rgb(248,55,88), rgb(255,159,64))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 800,
          letterSpacing: -0.5
        }}
      >
        Sell Your YouTube Channel
      </Title>
      <Paragraph style={{ fontSize: 16, marginBottom: 24, textAlign: 'center', color: '#374151' }}>
        Follow these simple steps to sell your YouTube channel on our platform.
      </Paragraph>
      <Steps
        direction="vertical"
        items={steps.map((step, index) => ({
          title: (
            <span
              style={{
                fontWeight: 700,
                backgroundImage: 'linear-gradient(90deg, #111827, #374151)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              {step.title}
            </span>
          ),
          description: (
            <div>
              <Paragraph style={{ marginBottom: 8, color: '#4B5563' }}>{step.description}</Paragraph>
            </div>
          ),
          icon: React.cloneElement(step.icon, {
            style: {
              color: 'rgb(248, 55, 88)',
              filter: 'drop-shadow(0 6px 14px rgba(248,55,88,0.35))',
              transform: 'translateZ(0)'
            }
          })
        }))}
      />
      <Paragraph style={{ marginTop: 20, textAlign: 'center', color: '#111827', fontWeight: 600 }}>
        Thank you for choosing our platform to sell your YouTube channel. If you have any questions or need assistance during the process, please don't hesitate to contact us.
      </Paragraph>
    </Card>
  );
};

export default SellChannelSteps;