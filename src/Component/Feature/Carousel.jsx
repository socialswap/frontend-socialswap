import React, { useState } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';

const Carousel = ({ children, direction = 'left', speed = 1.0 }) => {
  const childCount = React.Children.count(children);
  const ITEM_WIDTH = 312; // 288 card + 24 gap
  const singleSetWidth = childCount * ITEM_WIDTH;
  
  // Duplicate 4 times for a massive safe scroll buffer
  const repeatedChildren = [
    ...React.Children.toArray(children),
    ...React.Children.toArray(children),
    ...React.Children.toArray(children),
    ...React.Children.toArray(children)
  ];

  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Start precisely in the middle safe zone (Set 2)
  const x = useMotionValue(-singleSetWidth);

  useAnimationFrame((t, delta) => {
    if (singleSetWidth === 0) return;
    
    // Cap delta to prevent massive jumps when tab resumes or scroll unpauses
    const safeDelta = Math.min(delta, 50);
    let currentX = x.get();
    
    // Auto scroll when not interacting
    if (!isDragging && !isHovered) {
      if (direction === 'right') {
        currentX += speed * (safeDelta / 16);
      } else {
        currentX -= speed * (safeDelta / 16);
      }
    }
    
    // Always wrap if out of bounds (handles drag overshoots too)
    // Safely wrap with while loop in case of multiple set overshoots
    while (currentX <= -singleSetWidth * 2) {
      currentX += singleSetWidth;
    }
    while (currentX >= -singleSetWidth) {
      currentX -= singleSetWidth;
    }

    x.set(currentX);
  });

  if (childCount === 0) return null;

  return (
    <div 
      className="overflow-hidden relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex gap-6 w-max cursor-grab active:cursor-grabbing py-4"
        style={{ x, touchAction: 'pan-y', willChange: 'transform' }}
        drag="x"
        dragConstraints={{ left: -singleSetWidth * 3, right: 0 }} 
        dragElastic={0}
        dragMomentum={true}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {repeatedChildren.map((child, idx) => (
          <div key={idx} style={{ minWidth: 288, width: 288 }}>
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Carousel;