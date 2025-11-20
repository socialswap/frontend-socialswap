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
        className="absolute -top-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap shadow-xl z-20"
      >
        Explore {name}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
      </motion.div>

      {/* Pastel Ring Glow */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          // background: 'radial-gradient(circle, rgba(248, 55, 88, 0.15) 0%, transparent 70%)',
          // filter: 'blur(20px)',
          // transform: 'scale(1.3)',
        }}
      />

      {/* Glass Card with Gradient Border */}
      <motion.div
        className="relative w-32 h-32 rounded-full flex items-center justify-center mb-4 overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}
        whileHover={{
          boxShadow: '0 12px 40px rgba(248, 55, 88, 0.2), 0 0 0 3px rgba(248, 55, 88, 0.1)',
        }}
      >
        {/* Gradient Border Ring */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(248, 55, 88, 0.3), rgba(255, 107, 107, 0.2), rgba(255, 159, 64, 0.2))',
            padding: '3px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Icon Container */}
        <motion.div
          className="relative z-10 w-full h-full rounded-full flex items-center justify-center"
          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={icon}
            alt={name}
            className="rounded-full w-24 h-24 object-cover"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))',
            }}
          />
        </motion.div>

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
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
          className="m-0 text-center font-semibold text-gray-800 group-hover:text-[#F83758] transition-colors duration-300"
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
    
    // Determine if this is a horizontal or vertical gesture
    // Only treat as horizontal if horizontal movement is significantly greater
    if (!isHorizontalDrag) {
      if (deltaX > deltaY && deltaX > 15) {
        setIsHorizontalDrag(true);
      } else if (deltaY > deltaX && deltaY > 15) {
        // It's a vertical scroll, stop handling and let it pass through
        setIsDragging(false);
        return;
      } else {
        // Not enough movement yet, wait for more
        return;
      }
    }
    
    // Only prevent default and scroll horizontally if it's confirmed as a horizontal drag
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
    const tolerance = 1; // Small value to account for precision errors
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

  // Inject CSS to hide webkit scrollbar
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
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-100"
              onClick={() => scroll('left')}
            >
              <FaChevronLeft className="text-gray-600" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-100"
              onClick={() => scroll('right')}
            >
              <FaChevronRight className="text-gray-600" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-4 bottom-4 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-100"
              onClick={togglePause}
            >
              {isPaused ? <FaPlay className="text-gray-600" /> : <FaPause className="text-gray-600" />}
            </motion.button>
          </>
        )}
      </AnimatePresence>
      <div
        ref={containerRef}
        className="flex overflow-x-auto scroll-smooth pt-[6rem] carousel-container"
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
    <div
      className="py-1 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f8 25%, #ffffff 50%, #f0f9ff 75%, #fef5ff 100%)',
      }}
    >
      {/* Subtle Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-red-100/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl" />
      <div className='d-flex '>
      <Button
        className="mx-auto flex items-center justify-center mt-4 mb-4 px-8 py-6 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
        style={{
          background: 'linear-gradient(135deg, #F83758 0%, #FF6B6B 50%, #FF9F40 100%)',
          border: 'none',
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
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block mb-4 px-6 py-2 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 24px rgba(248, 55, 88, 0.1)',
              border: '1px solid rgba(248, 55, 88, 0.1)',
            }}
          >
            <span className="text-sm font-semibold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              ✨ Featured Categories
            </span>
          </motion.div>

          <Title
            level={2}
            className="text-center mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
            style={{ fontSize: '2.5rem', fontWeight: '700' }}
          >
            Explore Popular Categories
          </Title>

          <Paragraph className="text-center text-gray-600 text-base leading-relaxed">
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