import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';
import { Spin } from 'antd';

const PromotionalBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axiosInstance.get(`${api}/banners`);
        setBanners(response.data.data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Handle window resize for responsive images
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    if (isHovered || banners.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isHovered, banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleImageLoad = (index) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
        <Spin size="large" />
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full h-96 overflow-hidden rounded-lg shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner._id || index}
            className={`absolute w-full h-full transition-all duration-500 ease-in-out ${
              !imagesLoaded[index] ? 'bg-gray-200' : ''
            }`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
              opacity: imagesLoaded[index] ? 1 : 0,
            }}
          >
            <div className="relative w-full h-full">
              <img 
                src={isMobile ? banner.mobileImageUrl : banner.desktopImageUrl}
                alt={banner.title}
                className="w-full h-full object-cover transition-opacity duration-300"
                onLoad={() => handleImageLoad(index)}
              />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
                <div className="flex flex-col items-center justify-center h-full text-white px-4 md:px-12">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center">{banner.title}</h2>
                  {banner.description && (
                    <p className="text-sm md:text-lg mb-4 md:mb-6 text-center max-w-2xl">{banner.description}</p>
                  )}
                  <button 
                    className="px-6 py-2 md:px-8 md:py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors font-semibold"
                    onClick={() => navigate(banner.buttonLink || '/channels')}
                  >
                    {banner.buttonText || 'Shop Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionalBanner;
