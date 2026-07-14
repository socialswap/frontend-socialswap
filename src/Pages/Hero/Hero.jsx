import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import { ShopOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

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
  { name: 'Fashion & Beaty', icon: '/images/cream.PNG' },
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

const CategoryItem = ({ name, icon }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer mx-4 group relative"
      onClick={() => navigate(`/channels?category=${name}`)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.08, y: -8 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? -15 : 10 }}
        transition={{ duration: 0.2 }}
        className="absolute -top-12 bg-bg-secondary text-text-primary border border-border-color px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap shadow-xl z-20"
      >
        Explore {name}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-bg-secondary border-r border-b border-border-color"></div>
      </motion.div>

      {/* Pastel Ring Glow */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, var(--glow-hero) 0%, transparent 70%)',
          filter: 'blur(20px)',
          transform: 'scale(1.3)',
        }}
      />

      {/* Glass Card with Gradient Border */}
      <motion.div
        className="relative w-32 h-32 rounded-full flex items-center justify-center mb-4 overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}
        whileHover={{
          boxShadow: 'var(--purple-glow)',
        }}
      >
        {/* Gradient Border Ring */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'var(--btn-gradient)',
            padding: '3px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Icon Container */}
        <motion.div
          className="relative z-10 w-full h-full rounded-full flex items-center justify-center p-4 bg-bg-secondary/20"
          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={icon}
            alt={name}
            className="rounded-full w-20 h-20 object-cover"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
            }}
          />
        </motion.div>

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          }}
          animate={{
            x: isHovered ? [-200, 200] : 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Category Name */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Title
          level={5}
          className="m-0 text-center font-semibold text-text-primary group-hover:text-purple-secondary transition-colors duration-300"
        >
          {name}
        </Title>
      </motion.div>
    </motion.div>
  );
};

const Carousel = ({ children }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHorizontalDrag, setIsHorizontalDrag] = useState(false);
  const containerRef = useRef(null);
  const autoScrollRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setStartY(e.touches[0].pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setIsHorizontalDrag(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const currentX = touch.pageX - containerRef.current.offsetLeft;
    const currentY = touch.pageY - containerRef.current.offsetTop;
    const deltaX = Math.abs(currentX - startX);
    const deltaY = Math.abs(currentY - startY);
    
    if (!isHorizontalDrag) {
      if (deltaX > deltaY && deltaX > 15) {
        setIsHorizontalDrag(true);
      } else if (deltaY > deltaX && deltaY > 15) {
        setIsDragging(false);
        return;
      } else {
        return;
      }
    }
    
    if (isHorizontalDrag) {
      e.preventDefault();
      e.stopPropagation();
      const walk = (currentX - startX) * 2;
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsHorizontalDrag(false);
  };

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const autoScroll = React.useCallback(() => {
    if (!containerRef.current || isPaused) return;

    const container = containerRef.current;
    const tolerance = 1;
    const isAtEnd =
      container.scrollLeft + container.offsetWidth >= container.scrollWidth - tolerance;

    if (isAtEnd) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }, [isPaused]);

  useEffect(() => {
    autoScrollRef.current = setInterval(autoScroll, 2000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused, autoScroll]);

  useEffect(() => {
    const styleId = 'carousel-scrollbar-hide';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .carousel-container::-webkit-scrollbar {
          display: none;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => {
        setShowButtons(false);
        setIsDragging(false);
      }}
    >
      <AnimatePresence>
        {showButtons && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-bg-card hover:bg-bg-secondary text-text-primary border border-border-color/30 p-3 rounded-full shadow-lg z-10"
              onClick={() => scroll('left')}
            >
              <FaChevronLeft />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-bg-card hover:bg-bg-secondary text-text-primary border border-border-color/30 p-3 rounded-full shadow-lg z-10"
              onClick={() => scroll('right')}
            >
              <FaChevronRight />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-4 bottom-4 bg-bg-card hover:bg-bg-secondary text-text-primary border border-border-color/30 p-3 rounded-full shadow-lg z-10"
              onClick={togglePause}
            >
              {isPaused ? <FaPlay /> : <FaPause />}
            </motion.button>
          </>
        )}
      </AnimatePresence>
      <div
        ref={containerRef}
        className="flex overflow-x-auto scroll-smooth pt-[3rem] pb-[1.5rem] carousel-container animate--fade-in"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y pinch-zoom',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
      >
        {children}
      </div>
    </div>
  );
};

const FeaturedCategories = () => {
  const navigate = useNavigate();
  return (
    <div className="py-8 relative overflow-hidden bg-bg-primary text-text-primary transition-all duration-300">
      {/* Subtle Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-accent-pink/10 to-transparent rounded-full blur-3xl" />
      
      <div className='flex justify-center'>
        <Button
          className="mx-auto flex items-center justify-center mt-4 mb-4 px-8 py-6 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl focus:outline-none transition-all duration-300 transform hover:-translate-y-1"
          style={{
            background: 'var(--btn-gradient)',
            border: 'none',
            boxShadow: 'var(--purple-glow)',
          }}
          onClick={() => navigate('/seller-dashboard')}
        >
          <ShopOutlined className="mr-2 text-xl" />
          Sell Your Channel
        </Button>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 max-w-3xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block mb-4 px-6 py-2 rounded-full bg-bg-card border border-border-color/30 shadow-sm"
          >
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-primary to-accent-pink bg-clip-text text-transparent">
              ✨ Featured Categories
            </span>
          </motion.div>

          <Title
            level={2}
            className="text-center mb-3 text-text-primary"
            style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)' }}
          >
            Explore Popular Categories
          </Title>

          <Paragraph className="text-center text-text-secondary text-base leading-relaxed">
            Discover trending channels across various niches—where content meets passion.
          </Paragraph>
        </motion.div>

        {/* Categories Carousel */}
        <div className="pb-8">
          <Carousel>
            {categories.map((category, index) => (
              <CategoryItem key={index} {...category} />
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;