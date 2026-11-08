import React, { Suspense, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation, useNavigationType } from 'react-router-dom';
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

// Static skeleton fallback — only shown during initial JS chunk download
const SectionShell = ({ height = '60vh' }) => (
  <div className="w-full" style={{ minHeight: height }}>
    <div className="w-full h-full mx-auto px-4 py-10">
      <div className="w-48 h-6 bg-white/10 dark:bg-white/5 rounded-full mx-auto mb-6 animate-pulse" />
      <div className="flex gap-4 overflow-hidden">
        {[1,2,3].map(i => (
          <div key={i} className="flex-1 min-h-[300px] bg-white/10 dark:bg-white/5 rounded-[24px] animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

// Renders a section, and fetches its data, only as it nears the screen. Once shown
// it stays mounted. Returning with the back button shows everything straight away
// so the saved scroll position lands in the right place.
const LazySection = ({ height, children }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '500px 0px' });

  const isRestoringScroll =
    navigationType === 'POP' && Number(sessionStorage.getItem(`scroll_${location.key}`)) > 0;

  if (!inView && !isRestoringScroll) {
    return <div ref={ref}><SectionShell height={height} /></div>;
  }

  return <Suspense fallback={<SectionShell height={height} />}>{children}</Suspense>;
};

const HomePage = () => {
  // Pre-fetch all JS chunks in background shortly after first render
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
    }, 3000);
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
          '/homelogos/gaming (1).webp',
          '/homelogos/education (1).webp'
        ]}
      />
      
      {/* 1. Niche Carousel Hero — always rendered immediately */}
      <NicheCarousel />

      <div className="max-w-[100%] mx-auto w-full">
        
        {/* All sections are permanently mounted once loaded.
            Suspense fallback only shows during initial JS chunk download.
            Components self-manage loading states via apiCache. */}

        <LazySection height="70vh"><HeroVideo /></LazySection>
        <LazySection height="60vh"><TopChannelsCarousel /></LazySection>
        <LazySection height="60vh"><BestForBeginners /></LazySection>
        <LazySection height="40vh"><CategoryMarquee /></LazySection>
        <LazySection height="60vh"><ServicesSlider /></LazySection>
        <LazySection height="50vh"><Testimonials /></LazySection>
        <LazySection height="80vh"><ContactForm /></LazySection>
        <LazySection height="60vh"><FAQSection /></LazySection>
        
        {/* 10. Footer is already rendered in App.js at the bottom of routes */}
      </div>
    </div>
  );
};

export default HomePage;
