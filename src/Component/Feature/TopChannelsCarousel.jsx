import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance, { api as API_BASE_URL, cachedGet, apiCache } from '../../API/api';
import Carousel from './Carousel';
import ChannelCard, { ChannelCardSkeleton } from '../ChannelCard';

const CHANNELS_URL = `${API_BASE_URL}/channels/demanding?limit=8`;

const getInitialChannels = () => {
  const cached = apiCache.get(CHANNELS_URL);
  if (!cached) return [];
  const payload = cached?.data ?? {};
  const list = Array.isArray(payload?.channels) ? payload.channels
    : Array.isArray(payload) ? payload : [];
  return list;
};

const TopChannelsCarousel = () => {
  const [topChannels, setTopChannels] = useState(() => getInitialChannels());
  const [loading, setLoading] = useState(() => !apiCache.has(CHANNELS_URL));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopChannels = async () => {
      try {
        const response = await cachedGet(CHANNELS_URL);
        const payload = response?.data ?? {};
        const list = Array.isArray(payload?.channels)
          ? payload.channels
          : Array.isArray(payload)
          ? payload
          : [];
        setTopChannels(list);
        setLoading(false);
      } catch (err) {
        setError('Unable to load channels right now.');
        setLoading(false);
      }
    };

    fetchTopChannels();
  }, []);

  return (
    <section
      className="relative py-8 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent text-text-primary transition-all duration-300"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -right-10 w-72 h-72 bg-purple-primary/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-accent-pink/10 blur-3xl rounded-full" />
      </div>

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
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            Curated Selection
          </motion.span>
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
            className="text-3xl sm:text-4xl font-bold text-text-primary mb-3"
          >
            Highly Valuable / Top Rated Channels
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
          ) : topChannels.length > 0 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Carousel direction="right" speed={1.0}>
                {topChannels.map((channel) => (
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
              No channels are available right now. Please check back shortly.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TopChannelsCarousel;
