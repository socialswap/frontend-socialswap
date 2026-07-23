import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Progress dot — hooks must live at component top level ── */
const ProgressDot = ({ scrollYProgress, index, total, color }) => {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0.3, 1, 1, 0.3]
  );
  const scale = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0.7, 1.3, 1.3, 0.7]
  );
  return (
    <motion.div
      className="rounded-full"
      style={{ width: '8px', height: '8px', background: color, opacity, scale }}
    />
  );
};

/**
 * HorizontalScrollFeatures
 *
 * As the user scrolls VERTICALLY through the 400vh section, the inner
 * content slides HORIZONTALLY — making the scroll feel cinematic and alive.
 * Uses only unitless numbers in useTransform (fixes the previous vh bug).
 */

const features = [
  {
    number: '01',
    title: 'Verified Channels Only',
    description:
      'Every channel passes a strict manual review. We check subscriber growth, monetization status, and strike history — no fakes, ever.',
    icon: '✅',
    accentColor: '#7C3AED',
    bg: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(59,130,246,0.08) 100%)',
    border: 'rgba(124,58,237,0.25)',
    stat: '100%',
    statLabel: 'Verified',
  },
  {
    number: '02',
    title: 'Full Escrow Protection',
    description:
      'Money goes into escrow — not to the seller. It releases only after you confirm ownership transfer. Zero risk for the buyer.',
    icon: '🔒',
    accentColor: '#D946EF',
    bg: 'linear-gradient(135deg, rgba(217,70,239,0.12) 0%, rgba(124,58,237,0.08) 100%)',
    border: 'rgba(217,70,239,0.25)',
    stat: '₹0',
    statLabel: 'Fraud risk',
  },
  {
    number: '03',
    title: 'Instant Ownership Transfer',
    description:
      'Our team handles the entire process — credentials, primary owner change, and verification — within 24–72 hours.',
    icon: '⚡',
    accentColor: '#F59E0B',
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.08) 100%)',
    border: 'rgba(245,158,11,0.25)',
    stat: '72h',
    statLabel: 'Max transfer time',
  },
  {
    number: '04',
    title: '24/7 Expert Support',
    description:
      'Our team is always on — from browsing channels to closing a deal. No bots, just real humans who know the platform inside-out.',
    icon: '💬',
    accentColor: '#10B981',
    bg: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 100%)',
    border: 'rgba(16,185,129,0.25)',
    stat: '24/7',
    statLabel: 'Support',
  },
];

const HorizontalScrollFeatures = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Slides from 0% to -75% (4 panels × 25% each)
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  // Fade the section header out as user starts scrolling
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -40]);

  // Dots wrapper fades in after first scroll
  const dotsOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '400vh' }}
    >
      {/* ── Sticky viewport ── */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100vh', background: 'var(--bg-primary)' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Section label — fades out as user scrolls */}
        <motion.div
          className="absolute top-0 left-0 right-0 pt-10 text-center z-10 pointer-events-none"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <span
            className="inline-block py-1.5 px-5 rounded-full font-semibold text-sm border tracking-widest uppercase"
            style={{
              background: 'rgba(124,58,237,0.08)',
              color: 'var(--purple-primary)',
              borderColor: 'rgba(124,58,237,0.2)',
            }}
          >
            Why SocialSwap
          </span>
          <h2
            className="mt-4 font-extrabold"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            Trusted channels{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg,#7C3AED,#D946EF)',
              }}
            >
              you can count on.
            </span>
          </h2>
          <p
            className="mt-2 text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            Scroll to explore →
          </p>
        </motion.div>

        {/* ── Horizontal rail ── */}
        <div className="absolute inset-0 flex items-center">
          <motion.div
            className="flex"
            style={{
              x,
              width: `${features.length * 100}vw`,
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-center px-8 md:px-16"
                style={{ width: '100vw', height: '100vh' }}
              >
                {/* Card */}
                <motion.div
                  className="relative w-full max-w-lg rounded-[2.5rem] overflow-hidden"
                  style={{
                    background: 'var(--bg-card)',
                    border: `1.5px solid ${f.border}`,
                    boxShadow: `0 30px 80px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)`,
                  }}
                >
                  {/* Top gradient bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{ background: f.bg.replace('rgba', 'linear-gradient').includes('linear') ? `linear-gradient(90deg, ${f.accentColor}, transparent)` : f.bg }}
                  />
                  {/* Better: simple gradient bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${f.accentColor} 0%, transparent 100%)`,
                    }}
                  />

                  <div className="p-10">
                    {/* Number tag */}
                    <div className="flex items-center justify-between mb-8">
                      <span
                        className="text-xs font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
                        style={{
                          background: `${f.accentColor}18`,
                          color: f.accentColor,
                          border: `1px solid ${f.border}`,
                        }}
                      >
                        {f.number}
                      </span>
                      {/* Big stat */}
                      <div className="text-right">
                        <div
                          className="text-3xl font-extrabold leading-none"
                          style={{ color: f.accentColor }}
                        >
                          {f.stat}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {f.statLabel}
                        </div>
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6"
                      style={{
                        background: f.bg,
                        border: `1.5px solid ${f.border}`,
                      }}
                    >
                      {f.icon}
                    </div>

                    <h3
                      className="text-2xl md:text-3xl font-bold mb-4"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-base md:text-lg leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {f.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll progress dots */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2"
          style={{ opacity: dotsOpacity }}
        >
          {features.map((f, i) => (
            <ProgressDot
              key={i}
              scrollYProgress={scrollYProgress}
              index={i}
              total={features.length}
              color={f.accentColor}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalScrollFeatures;
