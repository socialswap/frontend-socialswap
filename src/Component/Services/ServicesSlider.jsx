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
                <div key={i} className="flex-1 h-96 bg-white/30 dark:bg-[#110C1F]/30 rounded-card animate-pulse border border-white/20 dark:border-white/10" />
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
                      className="block h-full group bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-card shadow-card border border-white/40 dark:border-white/10 overflow-hidden hover:shadow-purple-glow-soft hover:border-[#8A6CFF]/50 transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="relative h-48 overflow-hidden bg-white/20 dark:bg-black/20">
                        {svc.images?.[0] ? (
                          <img
                            src={svc.images[0]}
                            alt={svc.serviceName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-purple-primary/5 text-purple-primary text-4xl font-bold">
                            {svc.serviceName.charAt(0)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-black/80 text-xs font-bold text-purple-primary rounded-full backdrop-blur-md shadow-sm">
                          {svc.category}
                        </span>
                      </div>
                      
                      <div className="p-6 flex flex-col justify-between h-[calc(100%-12rem)]">
                        <div>
                          <h3 className="font-bold text-xl text-text-primary mb-2 group-hover:text-purple-primary transition-colors line-clamp-1">
                            {svc.serviceName}
                          </h3>
                          <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-4">
                            {svc.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-color/50">
                          <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-primary to-accent-pink">
                            ₹{svc.price.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-purple-primary group-hover:gap-2 transition-all">
                            View <ArrowRightOutlined className="text-xs" />
                          </span>
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
