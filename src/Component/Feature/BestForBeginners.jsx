import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance, { api as API_BASE_URL, cachedGet, apiCache } from '../../API/api';
import Carousel from './Carousel';
import ChannelCard, { ChannelCardSkeleton } from '../ChannelCard';

const BFB_URL = `${API_BASE_URL}/channels?limit=8&mostDemanding=false`;

const getSortedBeginnersFromCache = () => {
  const cached = apiCache.get(BFB_URL);
  if (!cached) return [];
  const payload = cached?.data ?? {};
  return (payload.channels || [])
    .filter(ch => ch.status === 'Available' && ch.price)
    .sort((a, b) => {
      const pA = parseFloat((a.price || '0').replace(/[^0-9.-]+/g, ''));
      const pB = parseFloat((b.price || '0').replace(/[^0-9.-]+/g, ''));
      return pA - pB;
    });
};

const BestForBeginners = () => {
  const [beginnerChannels, setBeginnerChannels] = useState(() => getSortedBeginnersFromCache());
  const [loading, setLoading] = useState(() => !apiCache.has(BFB_URL));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await cachedGet(BFB_URL);
        const payload = response?.data ?? {};
        
        // Sort by price ascending for "Beginners"
        const sortedList = (payload.channels || [])
          .filter(ch => ch.status === 'Available' && ch.price)
          .sort((a, b) => {
            const priceA = parseFloat((a.price || '0').replace(/[^0-9.-]+/g, ''));
            const priceB = parseFloat((b.price || '0').replace(/[^0-9.-]+/g, ''));
            return priceA - priceB;
          });

        setBeginnerChannels(sortedList);
        setLoading(false);
      } catch (err) {
        setError('Unable to load channels right now.');
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return (
    <section className="relative py-8 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent text-text-primary transition-all duration-300">
      <div className="relative z-10 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="text-center mb-10"
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-4"
            style={{
              background: 'rgba(16, 185, 129, 0.1)', // Emerald green hint for beginners
              color: '#10B981',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            Start Your Journey
          </motion.span>
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
            className="text-3xl sm:text-4xl font-bold text-text-primary mb-3"
          >
            Best For Beginners
          </motion.h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-6 overflow-hidden"
            >
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="mx-3">
                  <ChannelCardSkeleton />
                </div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-error font-medium"
            >
              {error}
            </motion.div>
          ) : beginnerChannels.length > 0 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Carousel direction="left" speed={1.0}>
                {beginnerChannels.map((channel) => (
                  <ChannelCard key={channel?._id} channel={channel} />
                ))}
              </Carousel>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-text-secondary py-12"
            >
              No beginner channels are available right now.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BestForBeginners;
