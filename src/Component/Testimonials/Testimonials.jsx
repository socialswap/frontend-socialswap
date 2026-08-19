import React, { useState, useEffect } from 'react';
import { Carousel, Modal } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';
import axiosInstance, { api, cachedGet, apiCache } from '../../API/api';

const TESTIMONIALS_URL = `${api}/testimonials?limit=10`;

const TestimonialCard = ({ testimonial, onReadMore }) => {
  const rating = testimonial.rating || 5;

  // Option for read more based on content length
  const isTextLong = testimonial.text && testimonial.text.length > 110;
  const isHeadlineLong = testimonial.headline && testimonial.headline.length > 25;
  const needsReadMore = isTextLong || isHeadlineLong;

  return (
    <div className="px-2 py-4">
      {/* Outer Card Wrapper with Brand Purple/Dark Theme Color */}
      <div className="w-full max-w-[450px] h-[340px] rounded-[24px] p-1.5 bg-gradient-to-br from-[#3B1F8C] via-[#2A1568] to-[#1A0C48] dark:from-[#231252] dark:to-[#12082E] mx-auto relative shadow-2xl border border-white/10">
        
        {/* Inner White Glass Border Container */}
        <div className="w-full h-full border border-white/30 dark:border-white/10 rounded-[20px] p-6 flex relative overflow-hidden backdrop-blur-md">
          
          <div className="flex gap-5 w-full items-start">
            {/* Left Avatar Column */}
            <div className="w-[72px] flex-shrink-0 flex justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden bg-[#6E4BFF] flex items-center justify-center shadow-lg">
                {testimonial.avatar ? (
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-2xl text-white font-bold">{testimonial.name?.charAt(0)}</div>
                )}
              </div>
            </div>

            {/* Right Content Column */}
            <div className="flex-1 flex flex-col min-w-0 text-white">
              {/* Name & Location (Same Line) */}
              <div className="text-base font-bold leading-snug text-white flex flex-wrap items-baseline gap-x-2">
                <span>{testimonial.name}</span>
                {testimonial.title && (
                  <span className="text-purple-300 text-xs font-normal">
                    - {testimonial.title}
                  </span>
                )}
              </div>

              {/* Stars placed below Name */}
              <div className="flex text-[#ffca28] text-xs gap-0.5 mt-1.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarFilled key={i} className={i < rating ? 'text-[#ffca28]' : 'text-white/20'} />
                ))}
              </div>

              {/* Headline */}
              {testimonial.headline && (
                <h3 className="text-base font-extrabold text-white uppercase tracking-wide mb-2 leading-tight line-clamp-1">
                  {testimonial.headline}
                </h3>
              )}

              {/* Review Text */}
              <p className="text-purple-100 text-xs sm:text-sm leading-relaxed overflow-hidden font-normal text-justify line-clamp-4">
                {testimonial.text}
              </p>

              {/* Read More button */}
              {needsReadMore && (
                <button
                  onClick={() => onReadMore(testimonial)}
                  className="text-xs text-[#C6B4FF] hover:text-white transition-colors underline mt-3 font-semibold text-left self-start cursor-pointer focus:outline-none"
                >
                  Read More
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const TestimonialSkeleton = () => (
  <div className="px-2 py-4">
    <div className="w-full max-w-[450px] h-[340px] rounded-[24px] p-1.5 bg-gray-200/20 dark:bg-[#231252]/50 mx-auto animate-pulse">
      <div className="w-full h-full border border-gray-300/20 rounded-[20px] p-6 flex relative overflow-hidden backdrop-blur-md">
        <div className="w-[72px] flex-shrink-0 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-300/50 dark:bg-gray-700/50"></div>
        </div>
        <div className="flex-1 pl-5 flex flex-col justify-start space-y-3">
          <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300/50 dark:bg-gray-700/50 rounded w-1/4"></div>
          <div className="h-6 bg-gray-300/50 dark:bg-gray-700/50 rounded w-3/4 mt-2"></div>
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
  const [testimonials, setTestimonials] = useState(() => {
    const cached = apiCache.get(TESTIMONIALS_URL);
    return cached?.data?.data || [];
  });
  const [loading, setLoading] = useState(() => !apiCache.has(TESTIMONIALS_URL));
  const [activeTestimonial, setActiveTestimonial] = useState(null);

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
              <TestimonialCard 
                key={testimonial._id} 
                testimonial={testimonial} 
                onReadMore={setActiveTestimonial}
              />
            ))}
          </Carousel>
        ) : null}
      </div>

      {/* Read More Modal */}
      <Modal
        open={!!activeTestimonial}
        onCancel={() => setActiveTestimonial(null)}
        footer={null}
        centered
        width={500}
        title={null}
        bodyStyle={{
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          borderRadius: '16px',
          padding: '24px'
        }}
        styles={{
          content: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderRadius: '16px'
          }
        }}
      >
        {activeTestimonial && (
          <div>
            {/* Custom Header inside body */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10 dark:border-white/5">
              <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden bg-purple-primary flex items-center justify-center shrink-0">
                {activeTestimonial.avatar ? (
                  <img src={activeTestimonial.avatar} alt={activeTestimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white font-bold text-lg">{activeTestimonial.name?.charAt(0)}</div>
                )}
              </div>
              <div>
                <h4 className="text-base font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {activeTestimonial.name}
                  {activeTestimonial.title && (
                    <span className="font-normal text-xs md:text-sm ml-1.5" style={{ color: 'var(--text-secondary)' }}>
                      - {activeTestimonial.title}
                    </span>
                  )}
                </h4>
                <div className="flex text-[#ffca28] text-xs gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <StarFilled key={i} className={i < (activeTestimonial.rating || 5) ? 'text-[#ffca28]' : 'text-white/20'} />
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Body */}
            <div>
              {activeTestimonial.headline && (
                <h3 className="text-lg font-extrabold mb-3 leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {activeTestimonial.headline}
                </h3>
              )}
              <p className="text-sm leading-relaxed text-justify whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                {activeTestimonial.text}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Testimonials;