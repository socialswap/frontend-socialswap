import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';

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

const MarqueeRow = ({ items, direction = 'left' }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const x = useMotionValue(0);

  // Measure single set width robustly using ResizeObserver
  const hasMeasured = useRef(false);
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.target.scrollWidth / 4;
        setContentWidth(width);
        if (!hasMeasured.current && width > 0) {
          x.set(-width);
          hasMeasured.current = true;
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [x]);

  // Framer motion animation loop for marquee
  useAnimationFrame((t, delta) => {
    if (contentWidth === 0) return;
    const safeDelta = Math.min(delta, 50);
    const speed = 0.8; // px per frame
    let currentX = x.get();

    if (!isDragging && !isHovered) {
      if (direction === 'left') {
        currentX -= speed * (safeDelta / 16);
      } else {
        currentX += speed * (safeDelta / 16);
      }
    }

    // Wrap around boundaries
    while (currentX <= -contentWidth * 2) {
      currentX += contentWidth;
    }
    while (currentX >= -contentWidth) {
      currentX -= contentWidth;
    }

    x.set(currentX);
  });

  // Duplicate items 4 times for infinite drag buffer
  const scrollItems = [...items, ...items, ...items, ...items];

  return (
    <div
      className="flex overflow-hidden whitespace-nowrap mb-4 py-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={containerRef}
        className="flex gap-4 md:gap-6 px-2 items-center w-max cursor-grab active:cursor-grabbing"
        style={{ x, touchAction: 'pan-y' }}
        drag="x"
        dragConstraints={{ left: -contentWidth * 3, right: 0 }}
        dragElastic={0}
        dragMomentum={true}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {scrollItems.map((cat, idx) => (
          <div
            key={`${cat.name}-${idx}`}
            onClick={() => {
              if (!isDragging) navigate(`/channels?category=${cat.name}`);
            }}
            className="flex flex-shrink-0 w-max items-center gap-3 bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] border border-white/40 dark:border-white/10 shadow-sm px-5 py-2.5 rounded-full hover:border-purple-primary hover:shadow-[0_0_15px_rgba(110,75,255,0.3)] transition-colors duration-200 select-none"
          >
            <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-cover rounded-full bg-black/5 dark:bg-white/10 p-0.5 shadow-sm pointer-events-none" />
            <span className="text-sm md:text-base font-bold text-text-primary whitespace-nowrap pointer-events-none">{cat.name}</span>
          </div>
        ))}
      </motion.div>
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
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-4 bg-emerald-100/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-[#10B981] border border-emerald-200/80 dark:border-emerald-900/30 shadow-sm"
        >
          Find Your Niche
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
          Explore Categories
        </h2>
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
