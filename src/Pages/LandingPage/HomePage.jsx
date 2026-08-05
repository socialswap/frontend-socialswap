import React, { Suspense, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Lenis from 'lenis';
import SEOHead from '../../Component/SEO/SEOHead';
import NicheCarousel from '../../Component/Feature/NicheCarousel';

// Helper for lazy loading with programmatic preload support
const preloadComponent = (importFunc) => {
  const Component = React.lazy(importFunc);
  Component.preload = importFunc;
  return Component;
};

// Lazy loaded components
const HeroVideo = preloadComponent(() => import('../../Component/Hero/HeroVideo'));
const TopChannelsCarousel = preloadComponent(() => import('../../Component/Feature/TopChannelsCarousel'));
const BestForBeginners = preloadComponent(() => import('../../Component/Feature/BestForBeginners'));
const CategoryMarquee = preloadComponent(() => import('../../Component/Feature/CategoryMarquee'));
const ServicesSlider = preloadComponent(() => import('../../Component/Services/ServicesSlider'));
const Testimonials = preloadComponent(() => import('../../Component/Testimonials/Testimonials'));
const ContactForm = preloadComponent(() => import('../../Component/Contact/ContactForm'));
const FAQSection = preloadComponent(() => import('../../Component/FAQ/FAQSection'));

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SocialSwap',
  url: 'https://www.socialswap.in',
  description: "India's most trusted marketplace to buy and sell verified YouTube channels.",
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.socialswap.in/channels?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SocialSwap',
  url: 'https://www.socialswap.in',
  logo: 'https://www.socialswap.in/images/fav.jpg',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['English', 'Hindi'],
  },
};

// LazyWrapper ensures components are fetched/rendered efficiently
const LazyWrapper = ({ children, minHeight = '50vh', index = 0 }) => {
  const [forceLoad, setForceLoad] = React.useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '800px 0px',
  });

  React.useEffect(() => {
    // Automatically load in the background, staggered to prevent freezing
    const timer = setTimeout(() => {
      setForceLoad(true);
    }, 1000 + (index * 600)); 
    return () => clearTimeout(timer);
  }, [index]);

  const shouldLoad = inView || forceLoad;

  return (
    <div ref={ref} style={{ minHeight }} className="w-full relative">
      {shouldLoad ? (
        <Suspense fallback={
          <div className="w-full h-full p-4 flex items-center justify-center">
             <div className="w-full max-w-7xl h-[calc(100%-2rem)] min-h-[400px] bg-white/10 dark:bg-white/5 rounded-[32px] animate-pulse"></div>
          </div>
        }>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
};

const HomePage = () => {
  useEffect(() => {
    // Lenis smooth scroll — disabled on mobile (native scroll is faster)
    if (window.innerWidth < 768) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Pre-fetch below-the-fold components in the background
  useEffect(() => {
    const timer = setTimeout(() => {
      HeroVideo.preload();
      TopChannelsCarousel.preload();
      BestForBeginners.preload();
      CategoryMarquee.preload();
      ServicesSlider.preload();
      Testimonials.preload();
      ContactForm.preload();
      FAQSection.preload();
    }, 1500); // Wait 1.5s so initial load isn't affected
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-transparent text-text-primary min-h-screen transition-colors duration-300 overflow-hidden">
      <SEOHead
        title="Buy & Sell YouTube Channels - India's #1 Channel Marketplace"
        description="SocialSwap is India's most trusted marketplace to buy and sell verified YouTube channels. Browse 100+ monetized channels across Gaming, Tech, Finance & more with full escrow protection."
        keywords="buy youtube channel, sell youtube channel, youtube channel marketplace, monetized youtube channel india, buy youtube channel india"
        canonicalUrl="https://www.socialswap.in/"
        ogType="website"
        structuredData={[websiteSchema, orgSchema]}
        preloadImages={[
          '/homelogos/DiamandPlayButton.webp',
          '/homelogos/mobileBG (1).webp',
          '/homelogos/backgroundLogo (1).webp',
          '/homelogos/gaming (1).webp',
          '/homelogos/education (1).webp'
        ]}
      />
      
      {/* 1. Niche Carousel Hero (Loads immediately for LCP optimization) */}
      <NicheCarousel />

      <div className="max-w-[100%] mx-auto w-full">
        
        {/* 2. Hero with Information Video */}
        <LazyWrapper minHeight="70vh" index={1}>
          <HeroVideo />
        </LazyWrapper>

        {/* 3. Highly Valuable / Top Rated channels */}
        <LazyWrapper minHeight="60vh" index={2}>
          <TopChannelsCarousel />
        </LazyWrapper>

        {/* 4. Best for Beginners normal channels */}
        <LazyWrapper minHeight="60vh" index={3}>
          <BestForBeginners />
        </LazyWrapper>

        {/* 5. Explore Channels Category (Dual Marquee) */}
        <LazyWrapper minHeight="40vh" index={4}>
          <CategoryMarquee />
        </LazyWrapper>

        {/* 6. Explore Services */}
        <LazyWrapper minHeight="60vh" index={5}>
          <ServicesSlider />
        </LazyWrapper>

        {/* 7. Testimonials */}
        <LazyWrapper minHeight="50vh" index={6}>
          <Testimonials />
        </LazyWrapper>

        {/* 8. Contact Us / Custom Service Form */}
        <LazyWrapper minHeight="80vh" index={7}>
          <ContactForm />
        </LazyWrapper>

        {/* 9. FAQ Section */}
        <LazyWrapper minHeight="60vh" index={8}>
          <FAQSection />
        </LazyWrapper>
        
        {/* 10. Footer is already rendered in App.js at the bottom of routes */}
      </div>
    </div>
  );
};

export default HomePage;
