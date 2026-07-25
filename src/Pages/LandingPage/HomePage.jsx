import React, { Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import SEOHead from '../../Component/SEO/SEOHead';
import NicheCarousel from '../../Component/Feature/NicheCarousel';

// Lazy loaded components
const HeroVideo = React.lazy(() => import('../../Component/Hero/HeroVideo'));
const TopChannelsCarousel = React.lazy(() => import('../../Component/Feature/TopChannelsCarousel'));
const BestForBeginners = React.lazy(() => import('../../Component/Feature/BestForBeginners'));
const CategoryMarquee = React.lazy(() => import('../../Component/Feature/CategoryMarquee'));
const ServicesSlider = React.lazy(() => import('../../Component/Services/ServicesSlider'));
const Testimonials = React.lazy(() => import('../../Component/Testimonials/Testimonials'));
const ContactForm = React.lazy(() => import('../../Component/Contact/ContactForm'));
const FAQSection = React.lazy(() => import('../../Component/FAQ/FAQSection'));

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

// LazyWrapper ensures components are only fetched/rendered when scrolled near them
const LazyWrapper = ({ children, minHeight = '50vh' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px', // Load 200px before scrolling into view
  });

  return (
    <div ref={ref} style={{ minHeight }} className="w-full relative transition-all duration-500">
      {inView ? (
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center p-10">
            <div className="w-12 h-12 border-4 border-purple-primary/20 border-t-purple-primary rounded-full animate-spin"></div>
          </div>
        }>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="bg-transparent text-text-primary min-h-screen transition-colors duration-300 overflow-hidden">
      <SEOHead
        title="Buy & Sell YouTube Channels - India's #1 Channel Marketplace"
        description="SocialSwap is India's most trusted marketplace to buy and sell verified YouTube channels. Browse 100+ monetized channels across Gaming, Tech, Finance & more with full escrow protection."
        keywords="buy youtube channel, sell youtube channel, youtube channel marketplace, monetized youtube channel india, buy youtube channel india"
        canonicalUrl="https://www.socialswap.in/"
        ogType="website"
        structuredData={[websiteSchema, orgSchema]}
      />
      
      {/* 1. Niche Carousel Hero (Loads immediately for LCP optimization) */}
      <NicheCarousel />

      <div className="max-w-[100%] mx-auto w-full">
        
        {/* 2. Hero with Information Video */}
        <LazyWrapper minHeight="70vh">
          <HeroVideo />
        </LazyWrapper>

        {/* 3. Highly Valuable / Top Rated channels */}
        <LazyWrapper minHeight="60vh">
          <TopChannelsCarousel />
        </LazyWrapper>

        {/* 4. Best for Beginners normal channels */}
        <LazyWrapper minHeight="60vh">
          <BestForBeginners />
        </LazyWrapper>

        {/* 5. Explore Channels Category (Dual Marquee) */}
        <LazyWrapper minHeight="40vh">
          <CategoryMarquee />
        </LazyWrapper>

        {/* 6. Explore Services */}
        <LazyWrapper minHeight="60vh">
          <ServicesSlider />
        </LazyWrapper>

        {/* 7. Testimonials */}
        <LazyWrapper minHeight="50vh">
          <Testimonials />
        </LazyWrapper>

        {/* 8. Contact Us / Custom Service Form */}
        <LazyWrapper minHeight="80vh">
          <ContactForm />
        </LazyWrapper>

        {/* 9. FAQ Section */}
        <LazyWrapper minHeight="60vh">
          <FAQSection />
        </LazyWrapper>
        
        {/* 10. Footer is already rendered in App.js at the bottom of routes */}
      </div>
    </div>
  );
};

export default HomePage;
