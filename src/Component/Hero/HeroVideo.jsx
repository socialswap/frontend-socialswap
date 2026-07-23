import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const HeroVideo = () => {
  const navigate = useNavigate();

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
    <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-bg-primary text-text-primary">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          {/* Using a placeholder stock video; replace with actual info video later */}
          <source src="https://cdn.pixabay.com/video/2020/05/21/40049-423528892_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/50 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col md:flex-row items-center gap-8 py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex-1 text-center md:text-left"
        >
          <motion.span 
            variants={itemVariants}
            className="inline-block py-1 px-3 rounded-full bg-purple-primary/20 text-purple-primary font-semibold text-sm mb-4 border border-purple-primary/30 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
          >
            India's #1 Marketplace
          </motion.span>
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-text-primary"
          >
            Turn Your Channel <br />
            Into <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--btn-gradient)' }}>Real Value</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-text-secondary mb-8 max-w-lg mx-auto md:mx-0"
          >
            SocialSwap offers the safest, fastest, and most reliable way to buy and sell monetized YouTube channels with 100% Escrow Protection.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Button 
              size="large" 
              type="primary" 
              className="h-12 px-8 rounded-full font-bold text-white shadow-[0_4px_15px_rgba(124,58,237,0.4)] border-none hover:scale-105 transition-transform"
              style={{ background: 'var(--btn-gradient)' }}
              onClick={() => navigate('/channels')}
            >
              Explore Channels
            </Button>
            <Button 
              size="large" 
              ghost 
              className="h-12 px-8 rounded-full font-bold border-2 border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white hover:scale-105 transition-transform"
              onClick={() => navigate('/how-to')}
            >
              <PlayCircleOutlined /> How it Works
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.3)] border border-border-color"
        >
          {/* Main Info Video Focus */}
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ"
            title="SocialSwap Info Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroVideo;
