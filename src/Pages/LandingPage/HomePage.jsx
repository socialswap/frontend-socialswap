import React from 'react';
import FeaturedListings from '../../Component/Feature/Feature';
import Stats from '../../Component/Stats/Stats';
import WhyChannelKart from '../../Component/WhyChannelCart/WhyChannelCard/WhyChannelCart';
import FeaturedCategories from '../Hero/Hero';
import Testimonials from '../../Component/Testimonials/Testimonials';
import Process from '../../Component/Steps/Buyer/Buyer';
import VideoSection from '../../Component/VideoSection/VideoSection';
import PromotionalBanner from '../../Component/Banner/Banner';
import AllChannels from '../../Component/Feature/AllChannels';
import TopChannelsCarousel from '../../Component/Feature/TopChannelsCarousel';
import HeroNew from '../../Component/Hero/Hero';
import SEOHead from '../../Component/SEO/SEOHead';

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

const HomePage = () => {
  return (
    <div className="bg-light-primary dark:bg-bg-primary text-text-light-primary dark:text-text-primary min-h-screen transition-colors duration-300">
      <SEOHead
        title="Buy & Sell YouTube Channels - India's #1 Channel Marketplace"
        description="SocialSwap is India's most trusted marketplace to buy and sell verified YouTube channels. Browse 100+ monetized channels across Gaming, Tech, Finance & more with full escrow protection."
        keywords="buy youtube channel, sell youtube channel, youtube channel marketplace, monetized youtube channel india, buy youtube channel india"
        canonicalUrl="https://www.socialswap.in/"
        ogType="website"
        structuredData={[websiteSchema, orgSchema]}
      />
      {/* ── Premium Hero Section ─── */}
      <HeroNew />

      <div className='max-w-[100%] mx-auto'>
        <div className='w-[100vw] max-w-[100vw] sm:max-w-[100vw] sm:w-[100vw] m-auto'>
          <FeaturedCategories />
          <Stats />
          <PromotionalBanner/>
          <VideoSection/>
        </div>
        <FeaturedListings />
        <TopChannelsCarousel />
        <AllChannels/>
        <Testimonials />
        <WhyChannelKart />
        <Process />
      </div>
    </div>
  );
};

export default HomePage;
