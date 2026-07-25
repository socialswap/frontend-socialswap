import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Button } from 'antd';
import { ArrowRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import axiosInstance, { api } from '../../API/api';

// Custom Arrow Components for the Carousel
const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={"slick-prev slick-arrow absolute top-1/2 -left-4 z-10 -translate-y-1/2 w-10 h-10 rounded-full bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] border border-white/40 dark:border-white/10 shadow-lg flex items-center justify-center text-text-primary hover:text-purple-primary hover:border-purple-primary transition-all " + (currentSlide === 0 ? " opacity-50 cursor-not-allowed" : "")}
    aria-hidden="true"
    aria-disabled={currentSlide === 0}
    type="button"
  >
    <LeftOutlined />
  </button>
);

const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={"slick-next slick-arrow absolute top-1/2 -right-4 z-10 -translate-y-1/2 w-10 h-10 rounded-full bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] border border-white/40 dark:border-white/10 shadow-lg flex items-center justify-center text-text-primary hover:text-purple-primary hover:border-purple-primary transition-all " + (currentSlide === slideCount - 1 ? " opacity-50 cursor-not-allowed" : "")}
    aria-hidden="true"
    aria-disabled={currentSlide === slideCount - 1}
    type="button"
  >
    <RightOutlined />
  </button>
);

const ServicesSlider = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosInstance.get(`${api}/services`);
        if (res.data.success) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <section className="py-8 md:py-16 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.span 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
              }}
              className="inline-block py-1 px-3 rounded-full bg-purple-primary/10 text-purple-primary font-semibold text-sm mb-4 border border-purple-primary/20"
            >
              Premium Services
            </motion.span>
            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
              }}
              className="text-3xl sm:text-4xl font-bold text-text-primary mb-3"
            >
              Explore Our Services
            </motion.h2>
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
              }}
              className="text-text-secondary max-w-xl"
            >
              Professional assistance to boost your growth, ensure secure transactions, and manage your channels effortlessly.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/services">
              <Button type="default" size="large" className="rounded-full flex items-center gap-2 border-border-color text-text-primary hover:border-purple-primary hover:text-purple-primary">
                View All Services <ArrowRightOutlined />
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 20 }}
          className="relative px-2"
        >
          {loading ? (
            <div className="flex gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-1 h-[175px] bg-white/30 dark:bg-[#110C1F]/30 rounded-[24px] animate-pulse border border-white/20 dark:border-white/10" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-10 text-text-secondary">No services available right now.</div>
          ) : (
            <div className="services-carousel-wrapper">
              <style>{`
                .services-carousel-wrapper .slick-track {
                  display: flex !important;
                  gap: 16px;
                  padding: 20px 0 40px;
                }
                .services-carousel-wrapper .slick-slide {
                  height: inherit !important;
                  opacity: 0.8;
                  transition: all 0.3s ease;
                }
                .services-carousel-wrapper .slick-slide.slick-active {
                  opacity: 1;
                }
                .services-carousel-wrapper .slick-dots li button {
                  background: var(--border);
                }
                .services-carousel-wrapper .slick-dots li.slick-active button {
                  background: var(--purple-primary);
                }
              `}</style>
              <Carousel {...settings}>
                {services.map(svc => (
                  <div key={svc._id} className="h-full outline-none">
                    <Link
                      to={`/services/${svc.slug}`}
                      className="relative group flex items-center min-h-[175px] overflow-hidden rounded-[24px] bg-gradient-to-r from-white/60 to-white/30 dark:from-[#1A142E]/70 dark:to-[#0D081F]/70 backdrop-blur-[20px] border border-white/60 dark:border-white/10 hover:border-purple-500/40 dark:hover:border-purple-500/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)] dark:hover:shadow-[0_20px_50px_rgba(124,58,237,0.22)] hover:-translate-y-1.5 p-4 gap-4 sm:gap-6 w-full h-full text-left"
                    >
                      {/* Layered Colorful Wave Shapes Mockup Style */}
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 z-10 flex-shrink-0">
                        {/* Yellow Wave behind */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-[24px] rotate-[-6deg] opacity-70 group-hover:rotate-[-10deg] group-hover:scale-105 transition-all duration-500" />
                        {/* Blue/Cyan Wave middle */}
                        <div className="absolute inset-0 bg-gradient-to-bl from-teal-400 to-indigo-500 rounded-[24px] rotate-[5deg] opacity-65 group-hover:rotate-[8deg] group-hover:scale-105 transition-all duration-500" />
                        {/* Main front red-purple gradient container with circular image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#EF476F] via-[#EC4899] to-[#7C3AED] rounded-[24px] flex items-center justify-center shadow-lg group-hover:rotate-[-2deg] transition-all duration-500 overflow-hidden">
                          {svc.images?.[0] ? (
                            <img
                              src={svc.images[0]}
                              alt={svc.serviceName}
                              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white/20 shadow-md group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20 shadow-md">
                              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between py-1 min-w-0 h-full">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#7C3AED] dark:text-[#C6B4FF]">
                            {svc.category}
                          </span>
                          <h2 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg group-hover:text-[#7C3AED] dark:group-hover:text-[#A855F7] transition-colors leading-snug line-clamp-1 mt-1">
                            {svc.serviceName}
                          </h2>
                          {svc.description && (
                            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 mt-2">
                              {svc.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Starting from</span>
                            <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7] dark:from-[#A855F7] to-[#C6B4FF]">
                              ₹{svc.price.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-[#7C3AED] dark:text-[#C6B4FF] group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-300 shadow-purple-glow-soft">
                            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSlider;
