import React from 'react';
import { Steps, Typography, Card, Button } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined, CreditCardOutlined, CheckCircleOutlined, MailOutlined, WhatsAppOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const PurchaseSteps = () => {
  const steps = [
    {
      title: 'Browse and Select Channels',
      description: 'Explore the available YouTube channels on our website. Click on "Add to Cart" for each channel you wish to purchase.',
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Review Your Cart',
      description: 'Navigate to your cart by clicking the cart icon in the top-right corner of the website. Ensure all selected channels are listed correctly.',
      icon: <ShoppingOutlined />
    },
    {
      title: 'Proceed to Checkout',
      description: 'Click on the "Buy" button to initiate the checkout process.',
      icon: <CreditCardOutlined />
    },
    {
      title: 'Choose Payment Method',
      description: 'You will be directed to the payment gateway. We offer a variety of payment options to accommodate both Indian and foreign customers:',
      icon: <CheckCircleOutlined />
    },
    {
      title: 'Receive Access Details',
      description: 'Once your payment is successful, you will receive an email containing the unique email ID and password for the channel. These details are specific to the channel you have purchased.',
      icon: <MailOutlined />
    },
    {
      title: 'Channel Transfer Process',
      description: (
        <>
          You will see a sticker on the confirmation page with the message: "We are redirecting you to our official dealer for the channel transfer process." Click on the "Go" button in the sticker. This will redirect you to our business WhatsApp number.
          <br /><br />
          <a href="https://wa.me/919423523291" target="_blank" style={{ backgroundColor: '#25D366', borderColor: '#25D366',color:'white', padding:'0.5rem', borderRadius:'0.5rem' }} rel="noopener noreferrer"  aria-label="Open WhatsApp to continue transfer">
            Go to WhatsApp
          </a>
        </>
      ),
      icon: <WhatsAppOutlined />
    },
    {
      title: 'Contact Us on WhatsApp',
      description: (
        <>
          After being redirected, you will receive an auto-generated message on WhatsApp. Please respond with the following details:
          <Text strong style={{ display: 'block', margin: '10px 0', color: 'rgb(22, 101, 52)' }}>
            "Hey team SocialSwap. I have done payment for the channel with channel ID ________ and transaction ID ________. Help me further to login and get full access to the channel."
          </Text>
        </>
      ),
      icon: <CustomerServiceOutlined />
    }
  ];

  const paymentMethods = ['Razorpay'];

  return (
    <Card  className="rounded-3xl bg-white/70 backdrop-blur border border-white/70 shadow-xl relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-100/60 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-100/60 blur-3xl rounded-full" />
      </div>
      <Title
        level={2}
        style={{
          textAlign: 'center',
          marginBottom: 22,
          backgroundImage: 'linear-gradient(90deg, rgb(248,55,88), rgb(255,159,64))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 800,
          letterSpacing: -0.5
        }}
      >
        Welcome to our platform!
      </Title>
      <Paragraph style={{ fontSize: 16, marginBottom: 24, textAlign: 'center', color: '#374151' }}>
        Follow these simple steps to buy a YouTube channel seamlessly.
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
              {index === 3 && (
                <ul style={{ paddingLeft: 0, display: 'grid', gap: 8 }}>
                  {paymentMethods.map((method, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: 'fit-content',
                        padding: '6px 10px',
                        borderRadius: 12,
                        backgroundColor: 'rgba(248,55,88,0.08)',
                        color: 'rgb(248,55,88)',
                        fontWeight: 600
                      }}
                    >
                      {method}
                    </li>
                  ))}
                </ul>
              )}
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
        Receive Further Assistance: Our team will review your message and assist you with the channel transfer process.
      </Paragraph>
      <Paragraph style={{ marginTop: 6, textAlign: 'center', color: '#4B5563' }}>
        Thank you for choosing our platform. If you have any questions or need further assistance, feel free to contact us!
      </Paragraph>
      <div className="w-full flex items-center justify-center mt-4">
        <a
          href="https://wa.me/919423523291"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-white font-semibold bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02]"
          aria-label="Open WhatsApp to continue transfer"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
          Go to WhatsApp for Transfer
        </a>
      </div>
    </Card>
  );
};

export default PurchaseSteps;