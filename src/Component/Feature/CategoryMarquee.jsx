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

  // Measure single set width on mount
  useEffect(() => {
    if (containerRef.current) {
      // Divide by 4 because we render 4 copies for seamless drag
      setContentWidth(containerRef.current.scrollWidth / 4);
      // Start in the middle safe zone
      x.set(-(containerRef.current.scrollWidth / 4));
    }
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
