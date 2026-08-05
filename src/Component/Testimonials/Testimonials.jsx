import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';
import axiosInstance, { api, cachedGet } from '../../API/api';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="px-2 py-4">
      {/* Outer Card Wrapper with Brand Purple/Dark Theme Color */}
      <div className="w-full max-w-[450px] h-[360px] rounded-[32px] p-1.5 bg-gradient-to-br from-[#3B1F8C] via-[#2A1568] to-[#1A0C48] dark:from-[#231252] dark:to-[#12082E] mx-auto relative shadow-2xl border border-white/10">
        
        {/* Inner White Glass Border Container */}
        <div className="w-full h-full border-2 border-white/70 dark:border-white/20 rounded-[24px] p-5 flex relative overflow-hidden backdrop-blur-md">
          
          {/* Left Avatar Section */}
          <div className="w-[30%] flex items-center relative z-10">
            {/* Brand Stylized Quotation Mark Art Pills */}
            <div className="absolute -left-2 top-4 flex gap-1.5 pointer-events-none">
              <div className="w-4 h-12 bg-gradient-to-b from-[#8A6CFF] to-[#F4B6D2] rounded-full shadow-sm"></div>
              <div className="w-4 h-48 bg-gradient-to-b from-[#6E4BFF] via-[#8A6CFF] to-[#F4B6D2] rounded-full shadow-sm"></div>
            </div>
            
            {/* Brand Circle Background */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#6E4BFF] to-[#3B1F8C] absolute left-6 flex items-center justify-center shadow-lg border border-white/20">
              {/* White-bordered circular avatar */}
              <div className="w-24 h-24 rounded-full border-2 border-white overflow-hidden bg-[#6E4BFF] flex items-center justify-center shadow-inner">
                {testimonial.avatar ? (
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-3xl text-white font-bold">{testimonial.name?.charAt(0)}</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="w-[70%] pl-8 pr-2 flex flex-col justify-center relative z-10 text-white">
            {/* Top Quotes */}
            <div className="mb-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#C6B4FF" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11H7V7h3v4zm5 0h-3V7h3v4zm-5 2H7v4c0 1.65 1.35 3 3 3v-2c-.55 0-1-.45-1-1v-4zm5 0h-3v4c0 1.65 1.35 3 3 3v-2c-.55 0-1-.45-1-1v-4z"/>
              </svg>
            </div>
            
            {/* Name and Stars */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full mb-1.5 gap-1">
              <div className="text-sm sm:text-base">
                <span className="font-bold text-white block sm:inline">{testimonial.name}</span>
                {testimonial.title && (
                  <span className="text-purple-200 text-xs sm:text-sm sm:ml-1 font-normal">- {testimonial.title}</span>
                )}
              </div>
              <div className="flex text-[#ffca28] text-sm gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarFilled key={i} className={i < (testimonial.rating || 5) ? 'text-[#ffca28]' : 'text-white/20'} />
                ))}
              </div>
            </div>

            {/* Headline */}
            {testimonial.headline && (
              <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wide mb-2 leading-tight line-clamp-1">
                {testimonial.headline}
              </h3>
            )}

            {/* Review Text */}
            <p className="text-purple-100 text-xs sm:text-[14px] leading-relaxed overflow-hidden font-normal text-justify" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' }}>
              {testimonial.text}
            </p>
          </div>

          {/* Bottom Quotes */}
          <div className="absolute bottom-5 right-5 pointer-events-none z-10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#C6B4FF" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 11h-3V7h3v4zm-5 0H6V7h3v4zm5 2h-3v4c0 1.65 1.35 3 3 3v-2c-.55 0-1-.45-1-1v-4zm-5 0H6v4c0 1.65 1.35 3 3 3v-2c-.55 0-1-.45-1-1v-4z"/>
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
};

const TestimonialSkeleton = () => (
  <div className="px-2 py-4">
    <div className="w-full max-w-[450px] h-[360px] rounded-[32px] p-1.5 bg-gray-200/20 dark:bg-[#231252]/50 mx-auto animate-pulse">
      <div className="w-full h-full border-2 border-gray-300/20 rounded-[24px] p-5 flex relative overflow-hidden backdrop-blur-md">
        <div className="w-[30%] flex items-center justify-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-gray-300/50 dark:bg-gray-700/50"></div>
        </div>
        <div className="w-[70%] pl-8 pr-2 flex flex-col justify-center relative z-10 space-y-4">
          <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300/50 dark:bg-gray-700/50 rounded w-3/4"></div>
          <div className="space-y-2 mt-4">
             <div className="h-3 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
             <div className="h-3 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
             <div className="h-3 bg-gray-300/50 dark:bg-gray-700/50 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await cachedGet(`${api}/testimonials?limit=10`);
        setTestimonials(response.data.data);
      } catch (error) {
        console.error('Failed to fetch testimonials', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const carouselSettings = {
    dots: true, // Show dots for navigation in card-by-card mode
    infinite: true,
    speed: 600, // Snap transition speed (0.6 seconds)
    autoplaySpeed: 1500, // Auto slides every 1.5 seconds
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    draggable: true,
    swipeToSlide: true,
    touchMove: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <section className="py-10 md:py-20 relative overflow-hidden bg-transparent">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-text-primary text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-primary to-fuchsia-500">Users Say</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-purple-primary to-fuchsia-500 mx-auto rounded-full"></div>
        </motion.div>
      </div>

      {/* Draggable Carousel Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 testimonials-carousel">
        {loading ? (
          <div className="flex gap-4 overflow-hidden justify-center">
            {[1, 2, 3].map(i => <TestimonialSkeleton key={i} />)}
          </div>
        ) : testimonials.length > 0 ? (
          <Carousel {...carouselSettings}>
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial._id} testimonial={testimonial} />
            ))}
          </Carousel>
        ) : null}
      </div>
    </section>
  );
};

export default Testimonials;