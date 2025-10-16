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
          <Button type="primary" icon={<WhatsAppOutlined />} style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}>
            Go to WhatsApp
          </Button>
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

  const paymentMethods = ['UPI QR Code', 'PayPal', 'Binance', 'Credit/Debit Card'];

  return (
    <Card style={{ maxWidth: 800 }} >
      <Title level={2} style={{ color: 'rgb(248, 55, 88)', textAlign: 'center', marginBottom: 30 }}>
        Welcome to our platform!
      </Title>
      <Paragraph style={{ fontSize: 16, marginBottom: 30, textAlign: 'center' }}>
        Follow these simple steps to buy a YouTube channel seamlessly.
      </Paragraph>
      <Steps
        direction="vertical"
        items={steps.map((step, index) => ({
          title: <span style={{ color: '#1677ff', fontWeight: 'bold' }}>{step.title}</span>,
          description: (
            <div>
              <Paragraph>{step.description}</Paragraph>
              {index === 3 && (
                <ul style={{ paddingLeft: 20 }}>
                  {paymentMethods.map((method, i) => (
                    <li key={i} style={{ color: 'rgb(22, 101, 52)' }}>{method}</li>
                  ))}
                </ul>
              )}
            </div>
          ),
          icon: React.cloneElement(step.icon, { style: { color: 'rgb(248, 55, 88)' } })
        }))}
      />
      <Paragraph style={{ marginTop: 20, textAlign: 'center', color: '#1677ff' }}>
        Receive Further Assistance: Our team will review your message and assist you with the channel transfer process.
      </Paragraph>
      <Paragraph style={{ marginTop: 10, textAlign: 'center' }}>
        Thank you for choosing our platform. If you have any questions or need further assistance, feel free to contact us!
      </Paragraph>
    </Card>
  );
};

export default PurchaseSteps;