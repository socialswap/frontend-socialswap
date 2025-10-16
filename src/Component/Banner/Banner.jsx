import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const banners = [
  {
    title: "Summer Sale!",
    description: "Get 50% off on all channels this summer",
    buttonText: "Shop Now",
    buttonLink: "/channels",
    img: '/IMG_9788.PNG'
  },
  {
    title: "New Channels Added",
    description: "Explore our latest additions to find your perfect match",
    buttonText: "Explore More",
    buttonLink: "/channels",
    img: '/IMG_9787.PNG'
  },
  {
    title: "Limited Time Offer",
    description: "Buy one channel, get another 50% off",
    buttonText: "Get Offer",
    buttonLink: "/channels",
    img: '/IMG_9786.PNG'
  }
];

const PromotionalBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const navigate = useNavigate()
  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isHovered]);

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

  return (
    <div 
      className="relative w-full h-96 overflow-hidden rounded-lg shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={index}
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
                src={banner.img}
                alt={banner.title}
                className="w-full h-full object-cover transition-opacity duration-300"
                onLoad={() => handleImageLoad(index)}
              />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
                <div className="flex align-center justify-center absolute bottom-40 md:left-[47%] left-44 md:bottm-80">
                  {/* <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
                  <p className="text-lg mb-6">{banner.description}</p> */}
                  <button 
                    className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                    onClick={() => navigate(`${banner.buttonLink}`)}
                  >
                    {banner.buttonText}
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
