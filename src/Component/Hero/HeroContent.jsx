import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

const SCROLLER_WORDS = [
  "Escrow Protection",
  "Online Support" ,
  "Instant Transfers",
  "Secure Payment",
  "Easy Support",
  "Verified Sellers",
  "Trusted Platform"
];

/**
 * BlurTextScroller — Vertical rolling wheel with real-time blur and depth animation.
 */
const BlurTextScroller = ({ prefersReducedMotion }) => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SCROLLER_WORDS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  const gapY = isMobile ? 45 : 60;
  const initY = isMobile ? 50 : 65;
  const curveZ = isMobile ? 40 : 60;
  const topOffset = isMobile ? 'calc(50% - 12px)' : 'calc(50% - 24px)';

  // Return visible window of 5 items
  const getVisibleItems = () => {
    const items = [];
    for (let i = -2; i <= 2; i++) {
      const itemIndex = (index + i + SCROLLER_WORDS.length) % SCROLLER_WORDS.length;
      items.push({
        word: SCROLLER_WORDS[itemIndex],
        offset: i,
        key: `${SCROLLER_WORDS[itemIndex]}-${index + i}`
      });
    }
    return items;
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative w-full h-[100px] md:h-[120px] flex items-center justify-center bg-transparent border-none overflow-visible">
        {/* Flex positioned indicator arrow to stay left of text wheel */}
        <motion.div 
          key={index}
          className="flex items-center justify-center z-[5] mr-3 md:mr-10" 
          style={{ zIndex: 10, willChange: 'transform, opacity' }}
          initial={prefersReducedMotion ? { x: 0, y: 0, opacity: 1 } : { y: 15, x: -10, opacity: 0.6 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.8 }}
        >
          <ArrowRight className="text-white w-6 h-6 md:w-[54px] md:h-[54px] opacity-90 animate-scroller-arrow-bounce" />
        </motion.div>
        <div 
          className="relative w-[200px] md:w-[450px] h-full flex items-center justify-start"
          style={{ position: 'relative', width: isMobile ? '180px' : '420px', justifyContent: 'flex-start', perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          <AnimatePresence initial={false}>
            {getVisibleItems().map(({ word, offset, key }) => {
              const isActive = offset === 0;
              const isNear = Math.abs(offset) === 1;

              // Angle and X/Y shift for curved path
              const angleMultiplier = isMobile ? 3 : 5;
              const xShiftMultiplier = isMobile ? 12 : 20;

              const yVal = offset * gapY - (offset < 0 ? (isMobile ? 8 : 12) : 0);
              const zVal = Math.abs(offset) * -curveZ;
              const rZVal = offset * angleMultiplier;
              const xVal = Math.abs(offset) * xShiftMultiplier;
              
              return (
                <motion.div
                  key={key}
                  initial={{
                    opacity: 0,
                    x: Math.abs(offset) * xShiftMultiplier,
                    y: offset * initY,
                    rotateX: offset * 30,
                    rotate: offset * angleMultiplier,
                    z: zVal,
                    filter: 'blur(8px)',
                    scale: 0.8
                  }}
                  animate={{
                    opacity: isActive ? 1 : isNear ? 0.6 : 0.25,
                    x: xVal,
                    y: yVal,
                    rotateX: offset * 28,
                    rotate: rZVal,
                    z: zVal,
                    filter: isActive ? 'blur(0px)' : isNear ? 'blur(2.5px)' : 'blur(5px)',
                    scale: isActive ? 1 : isNear ? 0.9 : 0.8,
                  }}
                  exit={{
                    opacity: 0,
                    x: Math.abs(offset - 1) * xShiftMultiplier,
                    y: (offset - 1) * initY,
                    rotateX: (offset - 1) * 30,
                    rotate: (offset - 1) * angleMultiplier,
                    z: Math.abs(offset - 1) * -curveZ,
                    filter: 'blur(8px)',
                    scale: 0.8
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 80,
                    damping: 24,
                    mass: 0.8,
                  }}
                  className={`font-sans text-2xl md:text-[4rem] font-black tracking-[-0.05em] pointer-events-none whitespace-nowrap ${isActive ? 'text-white' : 'text-[#9C96B8]'}`}
                  style={{
                    position: 'absolute',
                    top: topOffset,
                    left: 0, // Left-aligned within the wheel
                    transformOrigin: 'left center',
                    zIndex: 5 - Math.abs(offset),
                    willChange: 'transform, opacity',
                  }}
                >
                  {word}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/**
 * HeroContent — the text overlay rendered on top of the background.
 * Keeps the existing heading and subtitle, adds glassmorphism CTA cards.
 */
const HeroContent = ({ prefersReducedMotion }) => {
  const navigate = useNavigate();

  // Premium Apple/Stripe-style entrance animations
  const slideUp = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } };

  const transition = (delay = 0) =>
    prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className="flex flex-col items-center text-center w-full z-10 px-4 pt-[4.75rem] pb-[1.5rem] sm:px-5 sm:py-8 sm:max-w-[800px] lg:max-w-[850px] lg:p-0">
      {/* ── Heading ──────────────────────────────────────────── */}
      <motion.h1
        className="font-sans font-extrabold text-[1.45rem] sm:text-[clamp(2rem,4vw,3rem)] leading-[1.2] sm:leading-[1.15] text-white mt-0 mb-3 tracking-[-0.02em] order-1"
        {...slideUp}
        transition={transition(0.15)}
      >
        The Most Trusted Platform to{' '}
        <span className="bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#D946EF] bg-clip-text text-transparent">Buy &amp; Sell</span> Established YouTube Channels
      </motion.h1>

      {/* ── Subtitle ─────────────────────────────────────────── */}
      <motion.p
        className="font-sans text-[0.825rem] sm:text-[clamp(0.95rem,1.8vw,1.1rem)] text-[#E2DFEE] mb-[5.5rem] sm:mb-6 max-w-[600px] leading-[1.5] sm:leading-[1.6] order-2"
        {...slideUp}
        transition={transition(0.3)}
      >
        Securely exchange monetised channels with verified sellers,
        escrow protection, and instant transfers — all in one place.
      </motion.p>

      {/* ── Text Scroller Feature (Center) ──────────────────────── */}
      <motion.div
        {...slideUp}
        transition={transition(0.4)}
        className="relative w-full mt-6 mb-10 flex justify-center pointer-events-none order-5 lg:order-3"
      >
        <BlurTextScroller prefersReducedMotion={prefersReducedMotion} />
      </motion.div>

      {/* ── Buy / Sell Cards ─────────────────────────────────── */}
      <motion.div
        className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-full sm:max-w-[480px] mb-4 order-3 lg:order-4"
        {...slideUp}
        transition={transition(0.45)}
      >
        {/* Buy Channel */}
        <motion.div
          className="group relative flex flex-row items-center justify-start gap-2 sm:gap-[0.85rem] p-2 sm:px-5 sm:py-[0.85rem] h-[54px] sm:h-[72px] bg-bg-glass backdrop-blur-[20px] border border-[rgba(124,58,237,0.3)] hover:border-[#8B5CF6] hover:shadow-[0_8px_40px_rgba(124,58,237,0.35)] active:shadow-[0_4px_16px_rgba(124,58,237,0.2)] rounded-[12px] sm:rounded-[16px] text-text-primary cursor-pointer no-underline overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] font-sans before:content-[''] before:absolute before:inset-0 before:rounded-[12px] sm:before:rounded-[16px] before:bg-gradient-to-br before:from-[rgba(124,58,237,0.15)] before:to-[rgba(168,85,247,0.08)] before:opacity-0 hover:before:opacity-100 active:before:opacity-100 before:transition-opacity before:duration-[350ms] motion-reduce:transition-none motion-reduce:hover:transform-none"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/channels')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/channels')}
          whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.01 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 transition-all duration-300 ease z-[2] bg-[rgba(124,58,237,0.15)] group-hover:scale-105 group-hover:bg-[rgba(124,58,237,0.25)]">
            <ShoppingCart className="z-[2] text-purple-primary w-4 h-4 sm:w-5 sm:h-5" size={20} />
          </div>
          <div className="flex flex-col items-start text-left z-[2]">
            <span className="font-bold text-[0.825rem] sm:text-[0.95rem] tracking-[0.02em]">Buy Channel</span>
            <span className="text-[0.625rem] sm:text-[0.75rem] text-text-muted mt-0 sm:mt-[0.15rem]">Browse listings</span>
          </div>
        </motion.div>

        {/* Sell Channel */}
        <motion.div
          className="group relative flex flex-row items-center justify-start gap-2 sm:gap-[0.85rem] p-2 sm:px-5 sm:py-[0.85rem] h-[54px] sm:h-[72px] bg-bg-glass backdrop-blur-[20px] border border-[rgba(217,70,239,0.3)] hover:border-[#D946EF] hover:shadow-[0_8px_40px_rgba(217,70,239,0.35)] active:shadow-[0_4px_16px_rgba(124,58,237,0.2)] rounded-[12px] sm:rounded-[16px] text-text-primary cursor-pointer no-underline overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] font-sans before:content-[''] before:absolute before:inset-0 before:rounded-[12px] sm:before:rounded-[16px] before:bg-gradient-to-br before:from-[rgba(124,58,237,0.15)] before:to-[rgba(168,85,247,0.08)] before:opacity-0 hover:before:opacity-100 active:before:opacity-100 before:transition-opacity before:duration-[350ms] motion-reduce:transition-none motion-reduce:hover:transform-none"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/seller-dashboard')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/seller-dashboard')}
          whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.01 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 transition-all duration-300 ease z-[2] bg-[rgba(217,70,239,0.15)] group-hover:scale-105 group-hover:bg-[rgba(217,70,239,0.25)]">
            <TrendingUp className="z-[2] text-accent-pink w-4 h-4 sm:w-5 sm:h-5" size={20} />
          </div>
          <div className="flex flex-col items-start text-left z-[2]">
            <span className="font-bold text-[0.825rem] sm:text-[0.95rem] tracking-[0.02em]">Sell Channel</span>
            <span className="text-[0.625rem] sm:text-[0.75rem] text-text-muted mt-0 sm:mt-[0.15rem]">List yours now</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── What is SocialSwap? ──────────────────────────────── */}
      <motion.div
        className="group w-full max-w-full sm:max-w-[480px] flex items-center justify-center gap-3 p-[0.65rem_1rem] sm:p-[0.85rem_1.5rem] bg-bg-glass backdrop-blur-[16px] border border-border-glow rounded-[12px] sm:rounded-[16px] text-text-secondary cursor-pointer font-sans font-semibold text-[0.85rem] sm:text-[0.95rem] transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-bg-card hover:border-primary hover:text-text-primary hover:shadow-[0_4px_20px_rgba(124,58,237,0.2)] order-4 lg:order-5 motion-reduce:transition-none"
        role="button"
        tabIndex={0}
        onClick={() => navigate('/about')}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/about')}
        {...slideUp}
        transition={transition(0.7)}
        whileHover={prefersReducedMotion ? {} : { y: -3, scale: 1.005 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        <Sparkles className="flex-shrink-0 w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] text-accent-blue animate-pulse" size={18} />
        <span>What is SocialSwap?</span>
        <ArrowRight className="ml-auto opacity-60 transition-all duration-300 w-[14px] h-[14px] sm:w-4 sm:h-4 group-hover:translate-x-1 group-hover:opacity-100" size={16} />
      </motion.div>
    </div>
  );
};

export default HeroContent;
