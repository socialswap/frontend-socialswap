import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import { motion, useDragControls, useMotionValue } from 'framer-motion';

const Carousel = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);
  const x = useMotionValue(0);
  const dragControls = useDragControls();
  const startX = useRef(0);

  const childCount = React.Children.count(children);
  const maxScroll = -(childCount - 4) * 288;

  // Detect mobile viewport
  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile, { passive: true });
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    let interval;
    
    // Reduce autoplay aggressiveness and disable on mobile for better UX
    if (!isPaused && !isDragging && !isMobile) {
      interval = setInterval(() => {
        if (!isScrolling && currentIndex < childCount - 4) {
          setCurrentIndex(prev => prev + 1);
        } else if (!isScrolling) {
          setCurrentIndex(0);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [currentIndex, isScrolling, children, isPaused, isDragging, childCount, isMobile]);

  const handleDragStart = (event, info) => {
    setIsDragging(true);
    setIsPaused(true);
    startX.current = x.get();
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const drag = info.offset.x;
    const targetIndex = Math.round((startX.current - drag) / 288);
    
    let newIndex = Math.max(0, Math.min(childCount - 4, targetIndex));
    setCurrentIndex(newIndex);
    
    setTimeout(() => setIsPaused(false), 1000);
  };

  const scrollLeft = () => {
    if (!isScrolling && currentIndex > 0) {
      setIsScrolling(true);
      setCurrentIndex(currentIndex - 1);
      setTimeout(() => setIsScrolling(false), 500);
    }
  };

  const scrollRight = () => {
    if (!isScrolling && currentIndex < childCount - 4) {
      setIsScrolling(true);
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => setIsScrolling(false), 500);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Native scroll for mobile to avoid vertical scroll being blocked by horizontal drag
  if (isMobile) {
    return (
      <div
        className="relative"
        style={{
          touchAction: 'pan-y',
        }}
      >
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1 hide-scrollbar"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* hide scrollbar for WebKit */}
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>
          {React.Children.map(children, (child, idx) => (
            <div
              key={idx}
              className="snap-start"
              style={{
                minWidth: 288,
                scrollSnapAlign: 'start',
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group md:touch-pan-x" ref={carouselRef} style={{ touchAction: 'pan-y' }}>
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
        disabled={currentIndex === 0}
      >
        <FaChevronLeft className="w-6 h-6" />
      </button>
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          drag="x"
          dragControls={dragControls}
          dragConstraints={{
            left: maxScroll,
            right: 0
          }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={{
            x: -currentIndex * 288
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 200
          }}
        >
          {children}
        </motion.div>
      </div>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
        disabled={currentIndex >= childCount - 4}
      >
        <FaChevronRight className="w-6 h-6" />
      </button>
      <button
        onClick={togglePause}
        className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
      >
        {isPaused ? <FaPlay className="w-4 h-4" /> : <FaPause className="w-4 h-4" />}
      </button>
      
      <div className="flex justify-center gap-1 mt-4 md:hidden">
        {Array.from({ length: Math.ceil(childCount / 4) }).map((_, i) => (
          <div
            key={i}
            className={`h-1 w-4 rounded-full transition-all duration-300 ${
              Math.floor(currentIndex / 4) === i ? 'bg-black' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;