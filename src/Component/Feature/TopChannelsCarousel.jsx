import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance, { api as API_BASE_URL } from '../../API/api';
import Carousel from './Carousel';
import { ChannelCard } from './Feature';

const TopChannelsCarousel = () => {
  const [topChannels, setTopChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopChannels = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/channels`);
        const payload = response?.data ?? {};
        const list = Array.isArray(payload?.channels)
          ? payload.channels
          : Array.isArray(payload)
          ? payload
          : [];
        setTopChannels(list.slice(0, 20));
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
      className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #fdf3f5 50%, #ffffff 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -right-10 w-72 h-72 bg-rose-100/60 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-100/50 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-4"
            style={{
              background: 'rgba(248, 55, 88, 0.1)',
              color: '#F83758',
              border: '1px solid rgba(248, 55, 88, 0.2)',
            }}
          >
            Curated Selection
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Explore 20 Handpicked Channels
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fresh inventory updated daily — discover vetted channels ready for acquisition, presented in the same immersive carousel experience as our Most Demanding list.
          </p>
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
                <div
                  key={i}
                  className="animate-pulse rounded-2xl min-w-[300px] h-96"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(240, 240, 240, 0.8))',
                  }}
                />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-red-500 font-medium"
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
              <Carousel>
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
              className="text-center text-gray-500 py-12"
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

