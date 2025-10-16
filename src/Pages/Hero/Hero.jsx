import React, { useState, useEffect, useRef } from 'react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';

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
  return (
    <motion.div 
      className="flex flex-col items-center cursor-pointer mx-4"
      onClick={() => navigate(`/channels?category=${name}`)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4" style={
        {filter:'drop-shadow(black 1px 3px 3px)'}
      }>
        <span className="text-4xl text-[#F83758]">
          <img src={icon} alt={name} className="rounded-full" />
        </span>
      </div>
      <Title level={5} className="m-0 text-center">{name}</Title>
    </motion.div>
  );
};

const Carousel = ({ children }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
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
    setScrollLeft(containerRef.current.scrollLeft);
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
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const autoScroll = () => {
    if (!containerRef.current || isPaused) return;
  
    const container = containerRef.current;
    const tolerance = 1; // Small value to account for precision errors
    const isAtEnd =
      container.scrollLeft + container.offsetWidth >= container.scrollWidth - tolerance;
  
    console.log("isAtEnd:", isAtEnd);
  
    if (isAtEnd) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  

  useEffect(() => {
    autoScrollRef.current = setInterval(autoScroll, 2000);
    
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused]);

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
        className="flex overflow-x-hidden scroll-smooth touch-pan-x"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab'
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
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <Title level={2} className="text-center mb-2">
          Explore Popular Categories
        </Title>
        <Paragraph className="text-center text-gray-600 mb-8">
          Discover trending channels across various niches—where content meets passion.
        </Paragraph>
        <div className="pt-20">
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