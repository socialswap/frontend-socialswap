import React, { useMemo, useState } from 'react';
import { Card, Space, Tooltip } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  RobotOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import PurchaseSteps from '../Steps';
import SellChannelSteps from '../SellChannel';

// Default fallback steps (used for Sell or general)
const defaultSteps = [
  { key: 'browse', title: 'Browse Channels', desc: 'Discover verified, high-quality listings' },
  { key: 'cart', title: 'Add to Cart', desc: 'Save shortlisted channels securely' },
  { key: 'checkout', title: 'Checkout', desc: 'Review details and proceed' },
  { key: 'payment', title: 'Payment', desc: 'Complete payment via secure gateway' },
  { key: 'access', title: 'Access Details', desc: 'Receive credentials and guide' },
  { key: 'transfer', title: 'Transfer', desc: 'Safe ownership handover' },
];

const springy = { type: 'spring', stiffness: 400, damping: 28, mass: 0.9 };
const fadeSlide = {
  hidden: { opacity: 0, y: 12 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.35 } }),
};

const glowBreath = {
  rest: { boxShadow: '0 10px 30px rgba(248,55,88,0.12)', transition: { duration: 2, repeat: Infinity, repeatType: 'reverse' } },
  hover: { boxShadow: '0 18px 50px rgba(248,55,88,0.25)' }
};

const MagneticButton = ({ active, onClick, children }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl px-4 py-2 font-semibold transition-colors ${active ? 'text-white' : 'text-gray-700'}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className={`absolute inset-0 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

const BuySellToggle = ({ value, onChange, dark }) => {
  const isBuy = value === 'buy';
  return (
    <div className={`relative w-full max-w-[560px] rounded-3xl p-1 ${dark ? 'bg-white/5 border border-white/10' : 'bg-white/60 backdrop-blur border border-white/70'} shadow-[0_8px_40px_rgba(16,16,22,0.06)]`}>
      <div className="grid grid-cols-2 relative">
        <motion.div
          layout
          transition={springy}
          className={`absolute top-1 bottom-1 rounded-2xl ${dark ? 'bg-white/10' : 'bg-white'} shadow-lg`}
          style={{ left: isBuy ? 4 : '50%', right: isBuy ? '50%' : 4 }}
        />
        <MagneticButton active={isBuy} onClick={() => onChange('buy')}>
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-xl ${isBuy ? 'bg-gradient-to-br from-rose-500 to-orange-400 text-white' : 'bg-rose-50 text-rose-500'}`}>
            <ShoppingCartOutlined />
          </span>
          <span className={`${isBuy ? 'text-gray-900' : 'text-gray-600'}`}>Buy Channel</span>
        </MagneticButton>
        <MagneticButton active={!isBuy} onClick={() => onChange('sell')}>
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-xl ${!isBuy ? 'bg-gradient-to-br from-rose-500 to-orange-400 text-white' : 'bg-rose-50 text-rose-500'}`}>
            <DollarOutlined />
          </span>
          <span className={`${!isBuy ? 'text-gray-900' : 'text-gray-600'}`}>Sell Channel</span>
        </MagneticButton>
      </div>
    </div>
  );
};

const ViewModeSwitch = ({ mode, onChange, dark }) => {
  const items = [
    // { key: 'list', label: 'List View', icon: <EyeOutlined /> },
    // { key: 'timeline', label: 'Timeline View', icon: <ThunderboltOutlined /> },
    // { key: 'visualizer', label: 'Visualizer View', icon: <ClusterOutlined /> },
  ];
  return (
    <div className={`relative w-full max-w-[640px] rounded-3xl ${dark ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-white/70'} p-1 backdrop-blur`}>
      <div className="relative grid grid-cols-3">
        <motion.div
          layout
          transition={springy}
          className={`absolute top-1 bottom-1 rounded-2xl ${dark ? 'bg-white/10' : 'bg-white'} shadow-lg`}
          style={{
            left: mode === 'list' ? 4 : mode === 'timeline' ? '33.3333%' : '66.6666%',
            right: mode === 'list' ? '66.6666%' : mode === 'timeline' ? '33.3333%' : 4
          }}
        />
        {items.map((it) => {
          const active = mode === it.key;
          return (
            <MagneticButton key={it.key} active={active} onClick={() => onChange(it.key)}>
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-xl ${active ? 'bg-gradient-to-br from-rose-500 to-orange-400 text-white' : 'bg-rose-50 text-rose-500'}`}>
                {it.icon}
              </span>
              <span className={`${active ? 'text-gray-900' : 'text-gray-600'}`}>{it.label}</span>
            </MagneticButton>
          );
        })}
      </div>
      <motion.div
        layout
        className="mt-2 h-1 w-full rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300"
          animate={{ width: mode === 'list' ? '33.3%' : mode === 'timeline' ? '66.6%' : '100%' }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </div>
  );
};

const AnimatedIcon = ({ index }) => {
  return (
    <motion.span
      initial={{ rotate: 0 }}
      whileHover={{ rotate: 8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 text-white font-extrabold shadow-md"
    >
      {index}
    </motion.span>
  );
};

const StepCard = ({ index, title, desc, details, dark }) => {
  return (
    <Tooltip title={details} placement="top" overlayInnerStyle={{ borderRadius: 14 }}>
      <motion.div
        variants={glowBreath}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.99 }}
        className={`group relative rounded-3xl p-5 border flex items-start gap-3 will-change-transform ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/70 backdrop-blur border-white/70 text-gray-900'} transition-shadow`}
        style={{
          backgroundImage: dark
            ? 'linear-gradient(180deg, rgba(16,16,22,0.55), rgba(16,16,22,0.35))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.75))'
        }}
      >
        <motion.div whileHover={{ y: -2, rotateZ: -2 }} transition={springy}>
          <AnimatedIcon index={index} />
        </motion.div>
        <div className="min-w-0">
          <div className="text-base font-bold tracking-tight">{title}</div>
          <div className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{desc}</div>
        </div>
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ border: '1px solid transparent' }}
          whileHover={{ boxShadow: 'inset 0 0 0 1px rgba(248,55,88,0.35)' }}
        />
      </motion.div>
    </Tooltip>
  );
};

const TimelineItem = ({ index, title, desc, details, side = 'left', dark }) => {
  return (
    <motion.div
      custom={index}
      variants={fadeSlide}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className={`relative flex ${side === 'left' ? 'md:justify-end' : 'md:justify-start'} md:items-start`}
    >
      <div className="flex items-start gap-3 w-full md:w-1/2 pl-10 md:pl-0">
        <motion.div
          className="absolute left-4 md:left-1/2 md:-translate-x-1/2 mt-2 w-4 h-4 rounded-full bg-gradient-to-br from-rose-500 to-orange-400 shadow-[0_0_0_4px_rgba(248,55,88,0.15)]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
        />
        <Tooltip title={details} placement="topLeft" overlayInnerStyle={{ borderRadius: 14 }}>
          <div className={`rounded-3xl p-5 border shadow-sm w-full ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/70 backdrop-blur border-white/70'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-orange-400 text-white text-xs font-extrabold">{index}</span>
                <div className="text-base font-bold">{title}</div>
              </div>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 72 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="h-1 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300"
              />
            </div>
            <div className={`mt-2 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{desc}</div>
          </div>
        </Tooltip>
      </div>
    </motion.div>
  );
};

const FlowVisualizerNode = ({ index, title, desc, details, dark }) => {
  return (
    <Tooltip title={details} placement="top" overlayInnerStyle={{ borderRadius: 14 }}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.22 }}
        className={`rounded-3xl p-5 border shadow-sm ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/70 backdrop-blur border-white/70'}`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 text-white text-xs font-extrabold">
            {index}
          </span>
          <div className="font-bold">{title}</div>
        </div>
        <div className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{desc}</div>
      </motion.div>
    </Tooltip>
  );
};

const ListView = ({ dark, steps }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {steps.map((s, idx) => (
        <StepCard key={s.key} index={idx + 1} title={s.title} desc={s.desc} details={s.details} dark={dark} />
      ))}
    </div>
  );
};

const TimelineView = ({ dark, steps }) => {
  return (
    <div className="relative">
      <div className={`absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[3px] ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(248,55,88,0.0), rgba(248,55,88,0.25), rgba(255,160,64,0.25), rgba(248,55,88,0.0))'
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
      <div className="space-y-6">
        {steps.map((s, idx) => (
          <TimelineItem
            key={s.key}
            index={idx + 1}
            title={s.title}
            desc={s.desc}
            details={s.details}
            side={idx % 2 ? 'right' : 'left'}
            dark={dark}
          />
        ))}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center pt-2"
        >
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold shadow-md">
            Journey Complete ✓
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const VisualizerView = ({ dark, steps }) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((s, idx) => (
          <FlowVisualizerNode key={s.key} index={idx + 1} title={s.title} desc={s.desc} details={s.details} dark={dark} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none"
      >
        <svg className="absolute inset-0 w-full h-full" style={{ filter: 'blur(0.25px)' }}>
          <defs>
            <linearGradient id="glow" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#F83758" />
              <stop offset="100%" stopColor="#ff9f40" />
            </linearGradient>
          </defs>
          <motion.line x1="10%" y1="18%" x2="45%" y2="32%" stroke="url(#glow)" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
          <motion.line x1="45%" y1="32%" x2="78%" y2="22%" stroke="url(#glow)" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.2 }} />
          <motion.line x1="20%" y1="58%" x2="50%" y2="72%" stroke="url(#glow)" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.4 }} />
          <motion.circle cx="10%" cy="18%" r="4" fill="#F83758" />
          <motion.circle cx="45%" cy="32%" r="4" fill="#ff6b6b" />
          <motion.circle cx="78%" cy="22%" r="4" fill="#ff9f40" />
          <motion.circle cx="20%" cy="58%" r="4" fill="#F83758" />
          <motion.circle cx="50%" cy="72%" r="4" fill="#ff9f40" />
        </svg>
      </motion.div>
    </div>
  );
};

const AssistantBubble = ({ text, dark }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed right-3 bottom-3 z-40 flex items-center gap-2 px-3 py-2 rounded-full shadow-xl ${dark ? 'bg-white/10 text-white border border-white/10 backdrop-blur' : 'bg-white text-gray-900 border border-gray-200'}`}
      style={{ pointerEvents: 'auto' }}
    >
      <RobotOutlined />
      <span className="text-sm font-semibold">{text}</span>
    </motion.div>
  );
};

const BackgroundShapes = ({ dark }) => {
  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        className={`absolute -top-24 -right-24 w-72 h-72 ${dark ? 'bg-rose-400/10' : 'bg-rose-100/60'} blur-3xl rounded-full`}
        animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className={`absolute -bottom-24 -left-24 w-72 h-72 ${dark ? 'bg-orange-400/10' : 'bg-orange-100/60'} blur-3xl rounded-full`}
        animate={{ y: [0, 12, 0], x: [0, -12, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className={`absolute left-1/3 top-1/3 w-40 h-40 ${dark ? 'bg-amber-400/10' : 'bg-amber-100/70'} rotate-45 blur-2xl rounded-3xl`}
        animate={{ rotate: [40, 50, 40] }}
        transition={{ duration: 14, repeat: Infinity }}
      />
    </div>
  );
};

const ChannelTransactionSteps = () => {
  const [transactionType, setTransactionType] = useState('buy');
  const [mode, setMode] = useState('list'); // default: list
  const [dark, setDark] = useState(false);
  const whatsappLink = 'https://wa.me/919423523291';

  const buySteps = useMemo(() => ([
    {
      key: 'browse',
      title: 'Browse & Select Channels',
      desc: 'Explore verified listings and add your picks to the cart.',
      details: 'Explore the available YouTube channels on our website. Click on "Add to Cart" for each channel you wish to purchase.'
    },
    {
      key: 'cart',
      title: 'Review Your Cart',
      desc: 'Open the cart from the top-right, confirm selections.',
      details: 'Navigate to your cart by clicking the cart icon in the top-right corner. Ensure all selected channels are listed correctly.'
    },
    {
      key: 'checkout',
      title: 'Proceed to Checkout',
      desc: 'Click "Buy" to initiate checkout.',
      details: 'Click on the "Buy" button to initiate the checkout process.'
    },
    {
      key: 'payment',
      title: 'Choose Payment Method',
      desc: 'Pay securely via UPI QR, PayPal, Binance, or Card.',
      details: 'We offer UPI QR Code, PayPal, Binance, and Credit/Debit Card options for Indian and international customers.'
    },
    {
      key: 'access',
      title: 'Receive Access Details',
      desc: 'Check email for unique login credentials.',
      details: 'Once payment is successful, you will receive an email containing the unique email ID and password for the purchased channel.'
    },
    {
      key: 'transfer',
      title: 'Channel Transfer Process',
      desc: 'Use the WhatsApp redirect to start secure transfer.',
      details: 'You will see a sticker: "We are redirecting you to our official dealer for the channel transfer process." Click "Go" to open our business WhatsApp.'
    },
    {
      key: 'whatsapp',
      title: 'Contact Us on WhatsApp',
      desc: 'Send the auto-generated message with IDs.',
      details: 'Send: "Hey team SocialSwap. I have done payment for the channel with channel ID ________ and transaction ID ________. Help me further to login and get full access to the channel."'
    },
    {
      key: 'assist',
      title: 'Receive Further Assistance',
      desc: 'Our team finalizes the transfer with you.',
      details: 'Our team will review your message and assist you with the full channel transfer process.'
    }
  ]), []);

  const currentSteps = transactionType === 'buy' ? buySteps : defaultSteps;

  const helperText = useMemo(() => {
    if (mode === 'list') return 'Tip: Tap any step to proceed.';
    if (mode === 'timeline') return 'Scroll the journey. Steps light up as you advance.';
    return 'Visualizer shows connected flow. Hover to explore.';
  }, [mode]);

  return (
    <div className="mt-24 md:mt-40">
      <Card style={{ maxWidth: 1100, margin: '0 auto' }} className={`${dark ? 'bg-[#0b0b10] border-white/10' : 'bg-transparent'} rounded-3xl overflow-visible`}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center justify-center gap-3">
              <BuySellToggle value={transactionType} onChange={setTransactionType} dark={dark} />
              <Tooltip title={dark ? 'Pro Mode: Neon Dark' : 'Light Mode'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDark((d) => !d)}
                  className={`ml-2 flex items-center gap-2 rounded-2xl px-3 py-2 ${dark ? 'bg-white/10 border border-white/10 text-white' : 'bg-white/70 border border-white/70'} backdrop-blur`}
                >
                  <BulbOutlined className={`${dark ? 'text-yellow-300' : 'text-rose-500'}`} />
                </motion.button>
              </Tooltip>
            </div>
            <ViewModeSwitch mode={mode} onChange={setMode} dark={dark} />
          </div>

          <div className={`relative rounded-3xl p-4 md:p-6 ${dark ? 'bg-[#0e0e14]/80 border border-white/10' : 'bg-gradient-to-b from-white to-[#fafafa] border border-white/70'} overflow-hidden`}>
            <BackgroundShapes dark={dark} />
            <div className="relative">
              {mode === 'list' && <ListView dark={dark} steps={currentSteps} />}
              {mode === 'timeline' && <TimelineView dark={dark} steps={currentSteps} />}
              {mode === 'visualizer' && <VisualizerView dark={dark} steps={currentSteps} />}
            </div>
          </div>

          {transactionType === 'buy' && (
            <div className="flex items-center justify-center">
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold shadow-lg hover:shadow-xl"
                aria-label="Open WhatsApp to continue transfer"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <ThunderboltOutlined />
                </span>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">Go to WhatsApp for Transfer</a>
              </motion.a>
            </div>
          )}

          <div className={`rounded-3xl overflow-hidden ${dark ? 'border border-white/10' : 'border border-gray-200'}`}>
            {transactionType === 'buy' ? <PurchaseSteps /> : <SellChannelSteps />}
          </div>
        </Space>
      </Card>
      <AssistantBubble text={helperText} dark={dark} />
    </div>
  );
};

export default ChannelTransactionSteps;