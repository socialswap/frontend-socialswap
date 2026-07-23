import React from 'react';
import { motion } from 'framer-motion';
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
    // Duplicate items to ensure smooth infinite scrolling
    const scrollItems = [...items, ...items, ...items];
    return (
      <div className="flex overflow-hidden whitespace-nowrap mb-6 py-4">
        <motion.div
          className="flex gap-8 px-4 items-center"
          animate={{
            x: direction === 'left' ? ['0%', '-33.33%'] : ['-33.33%', '0%'],
          }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 20, // Adjust speed here
          }}
        >
          {scrollItems.map((cat, idx) => (
            <div
              key={`${cat.name}-${idx}`}
              onClick={() => navigate(`/channels?category=${cat.name}`)}
              className="flex items-center gap-4 bg-bg-card border border-border-color shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.2)] px-6 py-3 rounded-full cursor-pointer hover:border-purple-primary hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <img src={cat.icon} alt={cat.name} className="w-10 h-10 object-contain drop-shadow-md" />
              <span className="text-lg font-bold text-text-primary whitespace-nowrap">{cat.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-bg-secondary overflow-hidden">
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
          className="inline-block py-1 px-3 rounded-full bg-accent-pink/10 text-accent-pink font-semibold text-sm mb-4 border border-accent-pink/20"
        >
          Find Your Niche
        </motion.span>
        <motion.h2 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4 } }
          }}
          className="text-3xl sm:text-4xl font-bold text-text-primary mb-3"
        >
          Explore Categories
        </motion.h2>
        <motion.p 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
          }}
          className="text-text-secondary text-lg max-w-2xl mx-auto"
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
