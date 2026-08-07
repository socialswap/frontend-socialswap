import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { api, cachedGet, apiCache } from '../../API/api';

const HOME_VIDEO_URL = `${api}/home-video`;

const HeroVideo = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState(() => {
    const cached = apiCache.get(HOME_VIDEO_URL);
    return cached?.data?.url || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ";
  });
  const [loading, setLoading] = useState(() => !apiCache.has(HOME_VIDEO_URL));

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await cachedGet(`${api}/home-video`);
        if (res.data.success && res.data.url) {
          setVideoUrl(res.data.url);
        }
      } catch (error) {
        console.error("Failed to fetch home video", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <section className="relative w-full py-8 md:py-24 px-4 flex justify-center bg-gradient-to-b from-[#110720] via-[#1A0E38]/50 to-transparent">
      
      {/* Top Gradient Connecting Blend */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#110720] to-transparent pointer-events-none z-0" />
      
      {/* Large Soft Ambient Purple Glow Behind Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[400px] bg-gradient-to-r from-[#6E4BFF]/20 via-[#8A6CFF]/25 to-[#C6B4FF]/15 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Floating Glass Card Container */}
      <div className="relative z-10 container mx-auto max-w-6xl rounded-[28px] p-4 sm:p-6 md:p-10 bg-white/50 dark:bg-[#110C1F]/50 backdrop-blur-[24px] border border-white/60 dark:border-white/10 shadow-[0_20px_50px_rgba(110,75,255,0.15)]">
        
        {/* Soft Ambient Purple Glow inside Card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-purple-primary/10 dark:bg-purple-600/15 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex-1 text-center md:text-left"
          >
            <motion.span 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 md:mb-4 border shadow-sm"
              style={{
                background: '#E6F8F1', // Solid light mint green (matches the look of the reference pill over white)
                color: '#059669', // Darker emerald green for perfect contrast
                borderColor: 'rgba(16, 185, 129, 0.3)',
              }}
            >
              India's #1 Marketplace
            </motion.span>
            <motion.h1 
              variants={itemVariants}
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 md:mb-6 leading-tight text-white drop-shadow-md tracking-tight"
            >
              Turn Your Channel <br />
              Into <span className="text-[#8A6CFF] font-black drop-shadow-sm">Real Value</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-sm md:text-lg text-white/90 drop-shadow-sm mb-6 md:mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed font-normal"
            >
              SocialSwap offers the safest, fastest, and most reliable way to buy and sell monetized YouTube channels with 100% Escrow Protection.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <button 
                className="h-12 px-8 rounded-button font-bold text-white bg-btn-gradient shadow-purple-glow-soft hover:shadow-purple-glow-hover hover:scale-[1.03] hover:translate-y-[-3px] transition-all text-sm cursor-pointer"
                onClick={() => navigate('/channels')}
              >
                Explore Channels
              </button>
              <button 
                className="h-12 px-8 rounded-button font-bold text-[#6E4BFF] dark:text-purple-300 bg-white/70 dark:bg-white/10 border border-[#C6B4FF] dark:border-white/20 hover:bg-white/90 dark:hover:bg-white/20 hover:scale-[1.03] hover:translate-y-[-3px] transition-all text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                onClick={() => navigate('/how-to')}
              >
                <PlayCircleOutlined /> How it Works
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative w-full max-w-lg aspect-video rounded-card overflow-hidden shadow-card border border-white/50 dark:border-white/10 bg-white/60 dark:bg-[#110C1F]/60 backdrop-blur-[20px] p-2 hover:shadow-purple-glow-soft transition-all"
          >
            {/* Main Info Video Focus */}
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner">
              {loading ? (
                <div className="w-full h-full bg-gray-200/50 dark:bg-gray-800/50 animate-pulse flex items-center justify-center">
                  <PlayCircleOutlined className="text-4xl text-gray-400 dark:text-gray-600" />
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={videoUrl}
                  title="SocialSwap Info Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroVideo;
