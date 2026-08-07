import React, { useMemo, useState } from 'react';
import { Space } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import SEOHead from '../../../../Component/SEO/SEOHead';
import styled from 'styled-components';

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
`;

const BackgroundShapes = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <motion.div
      className="absolute -top-24 -right-24 w-96 h-96 blur-3xl rounded-full opacity-60"
      style={{ backgroundColor: 'var(--glow-hero, rgba(110, 75, 255, 0.2))' }}
      animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
      transition={{ duration: 10, repeat: Infinity }}
    />
    <motion.div
      className="absolute -bottom-24 -left-24 w-96 h-96 blur-3xl rounded-full opacity-60"
      style={{ backgroundColor: 'var(--glow-pink, rgba(244, 182, 210, 0.15))' }}
      animate={{ y: [0, 12, 0], x: [0, -12, 0] }}
      transition={{ duration: 12, repeat: Infinity }}
    />
  </div>
);

const MagneticButton = ({ active, onClick, children }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl px-2 sm:px-5 py-2.5 sm:py-3 font-semibold transition-colors ${active ? 'text-white shadow-lg' : 'text-ss-secondary'}`}
      style={{ WebkitTapHighlightColor: 'transparent', flex: 1 }}
    >
      <span className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-xs sm:text-base whitespace-nowrap">
        {children}
      </span>
    </motion.button>
  );
};

const BuySellToggle = ({ value, onChange }) => {
  const isBuy = value === 'buy';
  return (
    <div className="relative w-full max-w-[600px] mx-auto rounded-3xl p-1.5 bg-ss-secondary border-ss shadow-[var(--shadow-card)]">
      <div className="flex relative w-full">
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-0 bottom-0 rounded-2xl"
          style={{ width: '50%', left: isBuy ? '0%' : '50%', background: 'var(--btn-gradient)' }}
        />
        <MagneticButton active={isBuy} onClick={() => onChange('buy')}>
          <span className={`inline-flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl ${isBuy ? 'bg-white/20 text-white' : 'bg-ss-hero text-ss-purple'}`}>
            <ShoppingCartOutlined className="text-sm sm:text-base" />
          </span>
          <span className={isBuy ? 'text-white' : 'text-ss-primary'}>Buy Channel</span>
        </MagneticButton>
        <MagneticButton active={!isBuy} onClick={() => onChange('sell')}>
          <span className={`inline-flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl ${!isBuy ? 'bg-white/20 text-white' : 'bg-ss-hero text-ss-purple'}`}>
            <DollarOutlined className="text-sm sm:text-base" />
          </span>
          <span className={!isBuy ? 'text-white' : 'text-ss-primary'}>Sell Channel</span>
        </MagneticButton>
      </div>
    </div>
  );
};

const TimelineItem = ({ index, title, desc, details, side = 'left' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`relative flex ${side === 'left' ? 'md:justify-end' : 'md:justify-start'} md:items-center w-full mb-8 md:mb-16`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6 w-full md:w-1/2 md:px-12 relative z-10 pl-12 md:pl-0">
        
        {/* Connection Line & Dot for mobile (desktop handled by parent) */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-ss-primary md:hidden" />
        <motion.div
          className="absolute left-2.5 top-6 md:hidden w-3.5 h-3.5 rounded-full"
          style={{ background: 'var(--primary)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />

        <div className="bg-ss-glass border-ss rounded-[24px] p-6 w-full hover:-translate-y-1 transition-transform duration-300 shadow-[var(--shadow-card)]" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
            <span className="inline-flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-xl text-white text-lg font-black shadow-[var(--shadow-purple)]" style={{ background: 'var(--btn-gradient)' }}>
              {index}
            </span>
            <div className="text-xl font-bold text-ss-primary">{title}</div>
          </div>
          <div className="text-ss-secondary font-medium mb-1">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
};

const PremiumTimeline = ({ steps }) => {
  return (
    <div className="relative py-10">
      {/* Central line for desktop */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2" style={{ background: 'var(--border)' }}>
        <motion.div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent, var(--primary), transparent)' }}
          animate={{ opacity: [0.3, 0.8, 0.3], y: ['-50%', '150%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      
      {/* Central dots for desktop */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none z-20">
        {steps.map((_, i) => (
          <div key={i} className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-ss-secondary" style={{ borderColor: 'var(--primary)', top: `calc(${(i / (steps.length - 1)) * 100}% - 8px)` }} />
        ))}
      </div>

      <div className="flex flex-col relative z-10 w-full">
        {steps.map((s, idx) => (
          <TimelineItem
            key={s.key}
            index={idx + 1}
            title={s.title}
            desc={s.desc}
            details={s.details}
            side={idx % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
    </div>
  );
};

const ChannelTransactionSteps = () => {
  const [transactionType, setTransactionType] = useState('buy');
  const whatsappLink = 'https://wa.me/919423523291';

  const buySteps = useMemo(() => ([
    {
      key: 'browse',
      title: 'Browse Verified YouTube Channels',
      desc: 'Explore hundreds of YouTube channels listed on the SocialSwap marketplace.',
      details: (
        <div className="space-y-2">
          <p className="mb-2">Use filters such as: Category, Subscriber Count, Price, Monetization Status, Country, Language, Content Type (Shorts, Long-form, Mixed)</p>
          <p>Open any listing to view detailed information including channel statistics, analytics screenshots, pricing, and other important details before making a decision.</p>
        </div>
      )
    },
    {
      key: 'choose_method',
      title: 'Choose Your Purchase Method',
      desc: 'Purchase immediately or negotiate with the seller via contract.',
      details: (
        <div className="space-y-2">
          <p className="mb-2"><strong>Buy Now:</strong> Purchase the channel immediately through our secure payment gateway. Ideal if you're satisfied with the listed price.</p>
          <p><strong>Make a Contract:</strong> If you'd like to negotiate the price or ask questions, click Make a Contract. This will automatically open a conversation with the SocialSwap team.</p>
        </div>
      )
    },
    {
      key: 'chat',
      title: 'Chat With the SocialSwap Team',
      desc: 'Communicate directly with SocialSwap to negotiate and verify details.',
      details: 'After opening a contract, you communicate directly with SocialSwap—not the seller. Negotiate the price, ask questions, request info, and discuss payment terms. Our team acts as a trusted mediator.'
    },
    {
      key: 'finalize',
      title: 'Finalize Your Agreement',
      desc: 'SocialSwap prepares the final deal once both parties agree.',
      details: 'Our team confirms: Final purchase price, Payment amount, Channel details, Transfer process, and Transaction terms. Everything is verified before any payment or ownership transfer begins.'
    },
    {
      key: 'payment',
      title: 'Complete Your Payment',
      desc: 'Complete your purchase securely using our integrated payment gateway.',
      details: 'Your payment is securely held by SocialSwap during the transaction and is not released until the ownership transfer process has been successfully verified.'
    },
    {
      key: 'contact_seller',
      title: 'SocialSwap Contacts the Seller',
      desc: 'We begin the ownership transfer process with the seller.',
      details: 'The seller provides complete access to the YouTube channel, including all required ownership credentials or permissions, directly to SocialSwap. The buyer never needs to coordinate directly with the seller.'
    },
    {
      key: 'verify',
      title: 'Verification & Ownership Transfer',
      desc: 'Our team verifies the transfer is ready for delivery.',
      details: 'Before releasing the channel, our team carefully verifies that complete channel ownership has been transferred, account access is working correctly, and required permissions have been received.'
    },
    {
      key: 'receive',
      title: 'Receive Your YouTube Channel',
      desc: 'SocialSwap securely transfers the channel to your account.',
      details: 'Once verification is complete, our team will guide you through the ownership transfer process and ensure that you receive complete control of your newly purchased YouTube channel.'
    },
    {
      key: 'complete',
      title: 'Transaction Completed',
      desc: 'You are now the new owner of your YouTube channel!',
      details: 'Your purchase is marked as completed. The seller receives their payment (after SocialSwap\'s service fee is deducted). The escrow transaction is closed. Congratulations!'
    }
  ]), []);

  const sellSteps = useMemo(() => ([
    {
      key: 'account',
      title: 'Create Your Seller Account',
      desc: 'Create your SocialSwap account and access your seller dashboard.',
      details: 'From your dashboard, you can: Upload YouTube channels, Manage all your listings, Track inquiries, Chat with the SocialSwap team, Update your channel information at any time.'
    },
    {
      key: 'add_channel',
      title: 'Add Your YouTube Channel',
      desc: 'Paste your channel link and let SocialSwap auto-fill details.',
      details: 'Navigate to the Sell Channel section. Paste your YouTube Channel Link, Channel ID, or @Channel Handle and click Fetch Information. SocialSwap automatically retrieves publicly available information.'
    },
    {
      key: 'details',
      title: 'Complete Your Listing Details',
      desc: 'Provide additional details like Asking Price, Category, and Views.',
      details: 'Provide accurate information such as: Asking Price, Channel Category, Country, Channel Language, Content Type, Recent Monthly Views, and Total Watch Hours to help buyers evaluate your channel.'
    },
    {
      key: 'screenshots',
      title: 'Upload Verification Screenshots',
      desc: 'Upload screenshots to showcase channel performance.',
      details: 'Recommended screenshots include: YouTube Studio Dashboard, Last 28 Days Analytics, Revenue/Earnings, Lifetime Views, Watch Time, and Realtime Analytics (Last 48 Hours).'
    },
    {
      key: 'publish',
      title: 'Publish Your Channel Listing',
      desc: 'Submit your listing to the SocialSwap marketplace.',
      details: 'Your channel will become available on the SocialSwap marketplace. Interested buyers can discover it through the homepage and Buy Channel section. You can continue managing your listing from your dashboard.'
    },
    {
      key: 'chat',
      title: 'Stay Connected Through Chat',
      desc: 'Communicate directly with the SocialSwap team through our chat.',
      details: 'Use chat to: Ask about buyer interest, Update your asking price, Modify listing details, Request listing updates, or Ask questions about the selling process. All communication is handled directly with SocialSwap.'
    },
    {
      key: 'negotiation',
      title: 'Buyer Interest & Negotiation',
      desc: 'SocialSwap manages all discussions and negotiations on your behalf.',
      details: 'When a buyer is interested, they may purchase directly or start a contract request. If they negotiate, our team communicates with both parties to reach a mutually acceptable agreement.'
    },
    {
      key: 'payment',
      title: 'Buyer Completes Payment',
      desc: 'The buyer completes the payment securely through SocialSwap.',
      details: 'The payment is securely held by SocialSwap while the ownership transfer process begins. This escrow process protects both the buyer and the seller throughout the transaction.'
    },
    {
      key: 'transfer',
      title: 'Transfer Channel Access',
      desc: 'Provide required ownership access so our team can verify.',
      details: 'After the buyer\'s payment is confirmed, SocialSwap contacts you to begin the transfer process. You will provide the required credentials so our team can verify and secure the channel.'
    },
    {
      key: 'receive_payment',
      title: 'Receive Your Payment',
      desc: 'Your agreed selling amount is paid after deduction of service commission.',
      details: 'Once SocialSwap has successfully verified ownership and completed the transfer process to the buyer, your payment is released and the transaction is marked as completed.'
    }
  ]), []);

  const currentSteps = transactionType === 'buy' ? buySteps : sellSteps;

  return (
    <PageWrapper className="relative mt-16 md:mt-24">
      <SEOHead title="How It Works | SocialSwap" description="Learn how to buy or sell a YouTube channel securely on SocialSwap." />
      <BackgroundShapes />
      
      <div className="relative z-10 flex flex-col items-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-center mb-6 text-ss-primary bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(90deg, var(--text-primary), var(--primary), var(--accent-pink), var(--text-primary))', WebkitBackgroundClip: 'text', color: 'transparent', backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite' }}
        >
          How It Works
        </motion.h1>
        
        <BuySellToggle value={transactionType} onChange={setTransactionType} />
        
        <motion.p 
          key={transactionType}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-4xl px-4 mt-8 text-lg text-ss-secondary font-medium leading-relaxed"
        >
          {transactionType === 'buy' 
            ? 'Buy verified YouTube channels securely. Our escrow team handles all communication and safely transfers ownership to ensure your payment is 100% protected.'
            : 'Sell your YouTube channel effortlessly. We manage buyer negotiations and secure your payment in escrow before any transfer begins.'
          }
        </motion.p>
      </div>

      <PremiumTimeline steps={currentSteps} />

      {transactionType === 'buy' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mt-12 relative z-10"
        >
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full px-8 py-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold text-lg shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:shadow-[0_15px_40px_rgba(34,197,94,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <ThunderboltOutlined />
            </span>
            Go to WhatsApp for Transfer
          </a>
        </motion.div>
      )}
    </PageWrapper>
  );
};

export default ChannelTransactionSteps;