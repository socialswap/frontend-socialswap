import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
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

const CategoryMarquee = () => {
  const navigate = useNavigate();

  const half = Math.ceil(categories.length / 2);
  const topCategories = categories.slice(0, half);
  const bottomCategories = categories.slice(half);

  const MarqueeRow = ({ items, direction = 'left' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef(null);
    const [setWidth, setSetWidth] = useState(0);

    // Duplicate 4 times to ensure a massive safe scroll buffer for dragging
    const scrollItems = [...items, ...items, ...items, ...items];
    const x = useMotionValue(0);

    useEffect(() => {
      if (containerRef.current) {
        const singleW = containerRef.current.scrollWidth / 4;
        setSetWidth(singleW);
        x.set(-singleW * 2); // Start in the safe middle zone
      }
    }, [items, x]);

    useAnimationFrame((t, delta) => {
      if (setWidth === 0) return;
      let currentX = x.get();
      
      // Auto scroll when not interacting
      if (!isDragging && !isHovered) {
        currentX += direction === 'left' ? -(delta / 16) * 1.2 : (delta / 16) * 1.2;
      }
      
      // Infinite wrapping logic
      if (currentX <= -setWidth * 3) {
        currentX += setWidth;
      } else if (currentX >= -setWidth) {
        currentX -= setWidth;
      }
      
      x.set(currentX);
    });

    return (
      <div 
        className="flex overflow-hidden whitespace-nowrap mb-4 py-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          ref={containerRef}
          className="flex gap-4 md:gap-6 px-2 items-center w-max cursor-grab active:cursor-grabbing"
          style={{ x, touchAction: 'pan-y', willChange: 'transform' }}
          drag="x"
          dragConstraints={{ left: -setWidth * 3, right: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          {scrollItems.map((cat, idx) => (
            <div
              key={`${cat.name}-${idx}`}
              onClick={() => navigate(`/channels?category=${cat.name}`)}
              className="flex flex-shrink-0 w-max items-center gap-3 bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] border border-white/40 dark:border-white/10 shadow-sm px-5 py-2.5 rounded-full cursor-pointer hover:border-purple-primary hover:shadow-[0_0_15px_rgba(110,75,255,0.3)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-cover rounded-full bg-black/5 dark:bg-white/10 p-0.5 shadow-sm" />
              <span className="text-sm md:text-base font-bold text-text-primary whitespace-nowrap">{cat.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <section className="py-8 md:py-16 bg-transparent overflow-hidden">
      <motion.div 
        className="text-center mb-10 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } }
        }}
      >
        <motion.span
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.5 } }
          }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-4 border shadow-sm"
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            borderColor: 'rgba(16, 185, 129, 0.2)',
          }}
        >
          Find Your Niche
        </motion.span>
        <motion.h2 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4 } }
          }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight"
        >
          Explore Categories
        </motion.h2>
        <motion.p 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
          }}
          className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
        >
          From gaming and tech to lifestyle and finance, we have thousands of verified YouTube channels categorized just for you.
        </motion.p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-[100vw] mx-auto group"
      >
        {/* Left-to-right mask gradients for smooth fade out at edges */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-bg-secondary to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-bg-secondary to-transparent z-10 pointer-events-none" />
        
        <MarqueeRow items={topCategories} direction="left" />
        <MarqueeRow items={bottomCategories} direction="right" />
      </motion.div>
    </section>
  );
};

export default CategoryMarquee;
