import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroContent from './HeroContent';
import useReducedMotion from './useReducedMotion';

/**
 * LightAuroraBackground — Premium animated aurora blob background for light mode.
 * Replaces the video background when the theme is set to 'light'.
 */
const LightAuroraBackground = ({ prefersReducedMotion }) => {
  return (
    <div
      className="absolute inset-0 z-[1] pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ background: 'linear-gradient(145deg, #F2EFFF 0%, #EEF0FF 35%, #F5F8FF 65%, #FAFAFC 100%)' }}
    >
      {/* ── Aurora Blob 1 — large lavender (top-left) ── */}
      <div
        className="absolute animate-aurora-1"
        style={{
          top: '-10%',
          left: '-8%',
          width: '65vw',
          height: '65vw',
          maxWidth: '900px',
          maxHeight: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, rgba(155, 114, 255, 0.28) 0%, rgba(124, 77, 255, 0.12) 45%, transparent 75%)',
          filter: 'blur(60px)',
          willChange: 'transform, opacity',
          ...(prefersReducedMotion ? { animation: 'none', opacity: 0.4 } : {}),
        }}
      />

      {/* ── Aurora Blob 2 — sky-blue (bottom-right) ── */}
      <div
        className="absolute animate-aurora-2"
        style={{
          bottom: '-15%',
          right: '-10%',
          width: '70vw',
          height: '70vw',
          maxWidth: '950px',
          maxHeight: '950px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 55% 55%, rgba(72, 174, 255, 0.24) 0%, rgba(91, 104, 255, 0.10) 50%, transparent 75%)',
          filter: 'blur(70px)',
          willChange: 'transform, opacity',
          ...(prefersReducedMotion ? { animation: 'none', opacity: 0.35 } : {}),
        }}
      />

      {/* ── Aurora Blob 3 — soft indigo (center-right) ── */}
      <div
        className="absolute animate-aurora-3"
        style={{
          top: '20%',
          right: '5%',
          width: '45vw',
          height: '45vw',
          maxWidth: '600px',
          maxHeight: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(124, 77, 255, 0.18) 0%, rgba(155, 114, 255, 0.08) 55%, transparent 80%)',
          filter: 'blur(50px)',
          willChange: 'transform, opacity',
          ...(prefersReducedMotion ? { animation: 'none', opacity: 0.25 } : {}),
        }}
      />

      {/* ── Aurora Blob 4 — pale pink (bottom-left) ── */}
      <div
        className="absolute animate-aurora-4"
        style={{
          bottom: '5%',
          left: '10%',
          width: '40vw',
          height: '40vw',
          maxWidth: '520px',
          maxHeight: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(198, 167, 255, 0.20) 0%, rgba(72, 174, 255, 0.07) 60%, transparent 80%)',
          filter: 'blur(55px)',
          willChange: 'transform, opacity',
          ...(prefersReducedMotion ? { animation: 'none', opacity: 0.22 } : {}),
        }}
      />

      {/* ── Micro Dot Mesh Texture ── */}
      <div
        className="absolute inset-0 animate-mesh-shimmer"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(124, 77, 255, 0.025) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
          ...(prefersReducedMotion ? { animation: 'none', opacity: 0.02 } : {}),
        }}
      />

      {/* ── Soft Edge Vignette — keeps content area clean ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, rgba(250, 250, 252, 0.55) 100%)',
        }}
      />
    </div>
  );
};

const DarkAuroraBackground = ({ prefersReducedMotion }) => {
  return (
    <div
      className="absolute inset-0 z-[1] pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ background: '#070312' }}
    >
      {/* ── Aurora Blob 1 — Deep Purple ── */}
      <div
        className="absolute animate-aurora-1"
        style={{
          top: '-10%',
          left: '-8%',
          width: '65vw',
          height: '65vw',
          maxWidth: '900px',
          maxHeight: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, rgba(124, 77, 255, 0.15) 0%, rgba(88, 28, 135, 0.05) 45%, transparent 75%)',
          filter: 'blur(60px)',
          willChange: 'transform, opacity',
          ...(prefersReducedMotion ? { animation: 'none', opacity: 0.4 } : {}),
        }}
      />

      {/* ── Aurora Blob 2 — Neon Blue ── */}
      <div
        className="absolute animate-aurora-2"
        style={{
          bottom: '-15%',
          right: '-10%',
          width: '70vw',
          height: '70vw',
          maxWidth: '950px',
          maxHeight: '950px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 55% 55%, rgba(56, 189, 248, 0.12) 0%, rgba(29, 78, 216, 0.05) 50%, transparent 75%)',
          filter: 'blur(70px)',
          willChange: 'transform, opacity',
          ...(prefersReducedMotion ? { animation: 'none', opacity: 0.35 } : {}),
        }}
      />
      
      {/* ── Micro Dot Mesh Texture ── */}
      <div
        className="absolute inset-0 animate-mesh-shimmer"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
          ...(prefersReducedMotion ? { animation: 'none', opacity: 0.02 } : {}),
        }}
      />
    </div>
  );
};

/**
 * HeroNew — Premium futuristic Hero section.
 * Adapts background automatically to current theme:
 *   - dark  → looping video (original experience)
 *   - light → animated CSS aurora blob background
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

  // Track current theme to switch between video and aurora
  const [isLightMode, setIsLightMode] = useState(
    document.documentElement.classList.contains('light') ||
    document.documentElement.getAttribute('data-theme') === 'light'
  );

  useEffect(() => {
    const observe = () => {
      const root = document.documentElement;
      setIsLightMode(
        root.classList.contains('light') ||
        root.getAttribute('data-theme') === 'light'
      );
    };

    // MutationObserver to react to theme class/attribute changes
    const observer = new MutationObserver(observe);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => observer.disconnect();
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
      className="relative w-full min-h-[100svh] sm:min-h-screen overflow-hidden flex items-start sm:items-center justify-center pt-[100px] pb-8"
      style={{ background: isLightMode ? 'var(--bg-hero)' : 'var(--bg-primary)' }}
      onMouseMove={handleMouseMove}
      aria-label="Hero section – Buy and Sell YouTube Channels"
    >
      {/* ── Background — aurora blobs ── */}
      {isLightMode ? (
        <LightAuroraBackground prefersReducedMotion={prefersReducedMotion} />
      ) : (
        <DarkAuroraBackground prefersReducedMotion={prefersReducedMotion} />
      )}

      {/* ── Text + CTA overlay ── */}
      <HeroContent prefersReducedMotion={prefersReducedMotion} isLightMode={isLightMode} />

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[0.7rem] tracking-[0.15em] uppercase font-sans animate-hero-bounce max-sm:bottom-[1.25rem]"
        style={{ color: 'var(--text-muted)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <span>Scroll</span>
        <div
          className="w-[1px] h-8 rounded-[1px]"
          style={{ background: 'linear-gradient(to bottom, var(--primary), transparent)' }}
        />
      </motion.div>
    </section>
  );
};

export default HeroNew;