import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    key: '1',
    question: 'Is it safe to buy a YouTube channel on SocialSwap?',
    answer: "Absolutely. SocialSwap uses a strict Escrow process. Your payment is held securely until you receive the channel credentials and verify ownership. Only then is the payment released to the seller.",
  },
  {
    key: '2',
    question: 'How long does the channel transfer take?',
    answer: "Typically, a channel transfer takes between 24 to 72 hours. Our team guides you through the process of changing the primary owner securely, which requires a 7-day waiting period by YouTube, but you get manager access immediately.",
  },
  {
    key: '3',
    question: 'Are the channels organically grown?',
    answer: "Yes, every channel listed on SocialSwap goes through a rigorous verification process. We check the analytics, subscriber growth history, and community strikes to ensure the channel's audience is organic and authentic.",
  },
  {
    key: '4',
    question: 'What happens if a seller tries to scam me?',
    answer: "With our Escrow protection, scams are practically impossible. If a seller fails to provide the channel or tries to recover it during the transfer, your payment is fully refunded.",
  },
  {
    key: '5',
    question: 'Can I negotiate the price of a channel?',
    answer: "Yes! If a channel supports negotiations, you can use our built-in chat feature to make an offer directly to the seller or through our admin mediators.",
  },
];

const FAQItem = ({ faq, isOpen, onToggle, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
      className="group"
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(217,70,239,0.04) 100%)'
            : 'var(--bg-card)',
          border: isOpen
            ? '1.5px solid rgba(124,58,237,0.35)'
            : '1.5px solid var(--border)',
          boxShadow: isOpen
            ? '0 8px 32px rgba(124,58,237,0.12), 0 0 0 4px rgba(124,58,237,0.04)'
            : '0 2px 12px rgba(0,0,0,0.04)',
        }}
      >
        {/* Question Row */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer select-none"
          style={{ background: 'transparent', border: 'none' }}
          aria-expanded={isOpen}
        >
          <span
            className="font-semibold text-base md:text-lg transition-colors duration-300"
            style={{ color: isOpen ? 'var(--purple-primary)' : 'var(--text-primary)' }}
          >
            {faq.question}
          </span>

          {/* Animated icon — morphs from + to × */}
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? 'var(--purple-primary)' : 'var(--bg-secondary)' }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          >
            <motion.span
              className="relative block"
              style={{ width: '14px', height: '14px' }}
            >
              {/* Horizontal bar */}
              <span
                className="absolute block rounded-full transition-colors duration-300"
                style={{
                  top: '50%', left: 0,
                  width: '100%', height: '2px',
                  background: isOpen ? '#fff' : 'var(--text-primary)',
                  transform: 'translateY(-50%)',
                }}
              />
              {/* Vertical bar */}
              <motion.span
                animate={{ scaleY: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                className="absolute block rounded-full"
                style={{
                  top: 0, left: '50%',
                  width: '2px', height: '100%',
                  background: 'var(--text-primary)',
                  transform: 'translateX(-50%)',
                  transformOrigin: 'center',
                }}
              />
            </motion.span>
          </motion.div>
        </button>

        {/* Answer — smooth height animation via AnimatePresence */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { type: 'spring', stiffness: 300, damping: 32, mass: 0.8 },
                opacity: { duration: 0.25, ease: 'easeInOut' },
              }}
              style={{ overflow: 'hidden' }}
            >
              <motion.div
                initial={{ y: -8 }}
                animate={{ y: 0 }}
                exit={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="px-6 pb-6 pt-0"
              >
                {/* Subtle divider */}
                <div
                  className="mb-4 h-px w-full"
                  style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.3) 0%, transparent 100%)' }}
                />
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const FAQSection = () => {
  const [openKey, setOpenKey] = useState(null);

  const handleToggle = (key) => {
    setOpenKey(prev => (prev === key ? null : key));
  };

  return (
    <section className="py-20 bg-bg-primary relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none blur-[120px]"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)' }}
      />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
            }}
            className="inline-block py-1 px-4 rounded-full font-semibold text-sm mb-4 border tracking-widest uppercase"
            style={{
              background: 'rgba(124,58,237,0.08)',
              color: 'var(--purple-primary)',
              borderColor: 'rgba(124,58,237,0.2)',
            }}
          >
            Got Questions?
          </motion.span>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
            }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Frequently Asked{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--btn-gradient, linear-gradient(135deg,#7C3AED,#D946EF))' }}
            >
              Questions
            </span>
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
            }}
            className="text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            Everything you need to know about buying and selling on SocialSwap.
          </motion.p>
        </motion.div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.key}
              faq={faq}
              index={index}
              isOpen={openKey === faq.key}
              onToggle={() => handleToggle(faq.key)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
