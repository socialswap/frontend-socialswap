import React, { Suspense, useEffect } from 'react';
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
    }, 800);
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
      
      {/* 1. Niche Carousel Hero — always rendered immediately */}
      <NicheCarousel />

      <div className="max-w-[100%] mx-auto w-full">
        
        {/* All sections are permanently mounted once loaded.
            Suspense fallback only shows during initial JS chunk download.
            Components self-manage loading states via apiCache. */}

        <Suspense fallback={<SectionShell height="70vh" />}>
          <HeroVideo />
        </Suspense>

        <Suspense fallback={<SectionShell height="60vh" />}>
          <TopChannelsCarousel />
        </Suspense>

        <Suspense fallback={<SectionShell height="60vh" />}>
          <BestForBeginners />
        </Suspense>

        <Suspense fallback={<SectionShell height="40vh" />}>
          <CategoryMarquee />
        </Suspense>

        <Suspense fallback={<SectionShell height="60vh" />}>
          <ServicesSlider />
        </Suspense>

        <Suspense fallback={<SectionShell height="50vh" />}>
          <Testimonials />
        </Suspense>

        <Suspense fallback={<SectionShell height="80vh" />}>
          <ContactForm />
        </Suspense>

        <Suspense fallback={<SectionShell height="60vh" />}>
          <FAQSection />
        </Suspense>
        
        {/* 10. Footer is already rendered in App.js at the bottom of routes */}
      </div>
    </div>
  );
};

export default HomePage;
