import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroContent from './HeroContent';
import useReducedMotion from './useReducedMotion';

/**
 * HeroNew — Premium futuristic Hero section.
 */
const HeroNew = () => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 500], [1, 1.2]);

  // Detect mobile once at mount synchronously
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Track normalised mouse position for parallax (-1 … 1)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e) => {
      if (isMobile || prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePosition({ x, y });
    },
    [isMobile, prefersReducedMotion],
  );

  return (
    <section
      className="relative w-full min-h-[100svh] sm:min-h-screen overflow-hidden bg-bg-primary flex items-start sm:items-center justify-center pt-[100px] pb-8"
      onMouseMove={handleMouseMove}
      aria-label="Hero section – Buy and Sell YouTube Channels"
    >
      {/* background — looping video */}
      <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true" style={{ background: '#070312', overflow: 'hidden' }}>
        <motion.video
          key={isMobile ? 'mobile-video' : 'desktop-video'}
          src={isMobile ? "/video/phone.webm" : "/video/desktop.webm"}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.6,
            scale: prefersReducedMotion ? 1 : scale,
            transformOrigin: 'center center'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 50%, #070312 95%)',
          }}
        />
      </div>

      {/* Text + CTA overlay */}
      <HeroContent prefersReducedMotion={prefersReducedMotion} />

      {/* ── Scroll indicator (Positioned relative to screen) ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-text-muted text-[0.7rem] tracking-[0.15em] uppercase font-sans animate-hero-bounce max-sm:bottom-[1.25rem]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <span>Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#7C3AED] to-transparent rounded-[1px]" />
      </motion.div>
    </section>
  );
};

export default HeroNew;