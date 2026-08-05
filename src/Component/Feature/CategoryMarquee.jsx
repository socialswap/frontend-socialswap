import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Gaming', icon: '/images/gaming.PNG' },
  { name: 'Podcast', icon: '/images/mike.PNG' },
  { name: 'Music', icon: '/images/headphone.PNG' },
  { name: 'Entertainment', icon: '/images/entertainment.PNG' },
  { name: 'Tech', icon: '/images/tech.PNG' },
  { name: 'Facts', icon: '/images/loude.PNG' },
  { name: 'Finance', icon: '/images/dollor.PNG' },
  { name: 'Comedy', icon: '/images/mask.PNG' },
  { name: 'Animation', icon: '/images/animation.PNG' },
  { name: 'Lifestyle', icon: '/images/gym.PNG' },
  { name: 'Travel', icon: '/images/travel.PNG' },
  { name: 'Fashion & Beauty', icon: '/images/cream.PNG' },
  { name: 'News', icon: '/images/mike_2.PNG' },
  { name: 'Education', icon: '/images/books.PNG' },
  { name: 'Cooking', icon: '/images/pan.PNG' },
  { name: 'Movie Reviews', icon: '/images/entertainment.PNG' },
  { name: 'Business', icon: '/images/bag.png' },
  { name: 'Motivational', icon: '/images/aim.png' },
  { name: 'Art & Design', icon: '/images/paint.PNG' },
  { name: 'Science', icon: '/images/flask.PNG' },
  { name: 'Home Decor', icon: '/images/lamp.PNG' },
  { name: 'Challenges', icon: '/images/win.PNG' },
  { name: 'Reaction', icon: '/images/loude.PNG' },
  { name: 'Real Estate', icon: '/images/home.PNG' },
];

// Pure CSS marquee row — no JS animation loop, GPU-composited via translate3d
const MarqueeRow = ({ items, direction = 'left' }) => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const offsetRef = useRef(0);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const animPausedRef = useRef(false);

  // Scroll items duplicated for seamless loop
  const scrollItems = [...items, ...items];

  // For drag: pause CSS animation and manually control translate
  const pauseCSS = useCallback(() => {
    if (!trackRef.current || animPausedRef.current) return;
    const style = window.getComputedStyle(trackRef.current);
    const matrix = new DOMMatrix(style.transform);
    offsetRef.current = matrix.m41; // current translateX
    trackRef.current.style.animationPlayState = 'paused';
    trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    animPausedRef.current = true;
  }, []);

  const resumeCSS = useCallback(() => {
    if (!trackRef.current || !animPausedRef.current) return;
    trackRef.current.style.transform = '';
    trackRef.current.style.animationPlayState = 'running';
    animPausedRef.current = false;
  }, []);

  const onMouseEnter = () => { setIsPaused(true); pauseCSS(); };
  const onMouseLeave = () => { if (!isDragging) { setIsPaused(false); resumeCSS(); } };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pauseCSS();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartOffset.current = offsetRef.current;
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX.current;
    const newOffset = dragStartOffset.current + delta;
    offsetRef.current = newOffset;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${newOffset}px, 0, 0)`;
    }
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!isPaused) resumeCSS();
  };

  const handleClick = (catName) => {
    // Only navigate if not a drag
    if (Math.abs(offsetRef.current - dragStartOffset.current) < 5) {
      navigate(`/channels?category=${catName}`);
    }
  };

  const animName = direction === 'left' ? 'marquee-left' : 'marquee-right';
  const duration = `${items.length * 3}s`;

  return (
    <div
      className="flex overflow-hidden whitespace-nowrap mb-4 py-2 touch-pan-y"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <style>{`
        @keyframes marquee-left {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-right {
          from { transform: translate3d(-50%, 0, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
      `}</style>
      <div
        ref={trackRef}
        className="flex gap-4 md:gap-6 px-2 items-center w-max"
        style={{
          animation: `${animName} ${duration} linear infinite`,
          willChange: 'transform',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {scrollItems.map((cat, idx) => (
          <div
            key={`${cat.name}-${idx}`}
            onPointerUp={() => handleClick(cat.name)}
            className="flex flex-shrink-0 w-max items-center gap-3 bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] border border-white/40 dark:border-white/10 shadow-sm px-5 py-2.5 rounded-full hover:border-purple-primary hover:shadow-[0_0_15px_rgba(110,75,255,0.3)] transition-colors duration-200 select-none"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-cover rounded-full bg-black/5 dark:bg-white/10 p-0.5 shadow-sm" />
            <span className="text-sm md:text-base font-bold text-text-primary whitespace-nowrap">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryMarquee = () => {
  const half = Math.ceil(categories.length / 2);
  const topCategories = categories.slice(0, half);
  const bottomCategories = categories.slice(half);

  return (
    <section className="py-8 md:py-16 bg-transparent overflow-hidden">
      <div className="text-center mb-10 px-4">
        <span
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-4 border shadow-sm"
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            borderColor: 'rgba(16, 185, 129, 0.2)',
          }}
        >
          Find Your Niche
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
          Explore Categories
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
          From gaming and tech to lifestyle and finance, we have thousands of verified YouTube channels categorized just for you.
        </p>
      </div>

      <div className="relative z-10 max-w-[100vw] mx-auto">
        {/* Left-to-right mask gradients for smooth fade out at edges */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-bg-secondary to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-bg-secondary to-transparent z-10 pointer-events-none" />
        
        <MarqueeRow items={topCategories} direction="left" />
        <MarqueeRow items={bottomCategories} direction="right" />
      </div>
    </section>
  );
};

export default CategoryMarquee;
