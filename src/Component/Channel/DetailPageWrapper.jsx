import React, { useState, useEffect, useCallback } from 'react';
import { Result } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import DetailPage from './DetailPage';
import axiosInstance, { api } from '../../API/api';
import SEOHead from '../SEO/SEOHead';

const BASE_URL = 'https://www.socialswap.in';

const DetailPageWrapper = () => {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();  // changed from :id to :username
  const navigate = useNavigate();

  const fetchChannelDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the username endpoint — falls back to _id internally for old links
      const response = await axiosInstance.get(`${api}/channels/username/${username}`);
      setChannel(response?.data);
    } catch (err) {
      console.error('Error fetching channel details:', err);
      setError(err.response?.data?.message || 'Failed to load channel details');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchChannelDetails();
  }, [fetchChannelDetails]);

  // Build SEO metadata dynamically from channel data
  const buildChannelSEO = (ch) => {
    if (!ch) return {};
    const name = ch.name || 'YouTube Channel';

    const formatCount = (n) => {
      if (!n) return '0';
      if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
      if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
      return String(n);
    };

    const subscribers = formatCount(ch.subscriberCount);
    const price = ch.price ? `₹${Number(ch.price).toLocaleString('en-IN')}` : '';
    const monetized = ch.monetized ? 'Fully Monetized' : 'Non-Monetized';
    const channelSlug = ch.customUrl || ch._id;
    const canonicalPageUrl = `${BASE_URL}/channel/${channelSlug}`;

    const title =
      ch.metaTitle ||
      `${name} – ${subscribers} Subscribers ${ch.category || ''} YouTube Channel for Sale`;

    const description =
      ch.metaDescription ||
      `Buy ${name}, a ${ch.category || ''} YouTube channel with ${subscribers} subscribers and ${formatCount(ch.viewCount)} total views. ${monetized}. ${price ? `Listed at ${price}.` : ''} Buy safely on SocialSwap with escrow protection.`;

    const ogImage = ch.imageUrls?.[0] || ch.logoUrl || `${BASE_URL}/images/og-default.jpg`;

    const channelSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description,
      image: ogImage,
      url: canonicalPageUrl,
      brand: { '@type': 'Brand', name: 'SocialSwap' },
      offers: {
        '@type': 'Offer',
        price: ch.price,
        priceCurrency: 'INR',
        availability: ch.sold
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
        url: canonicalPageUrl,
        seller: { '@type': 'Organization', name: 'SocialSwap' },
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Subscribers', value: ch.subscriberCount },
        { '@type': 'PropertyValue', name: 'Total Views', value: ch.viewCount },
        { '@type': 'PropertyValue', name: 'Category', value: ch.category },
        { '@type': 'PropertyValue', name: 'Monetized', value: ch.monetized ? 'Yes' : 'No' },
        { '@type': 'PropertyValue', name: 'Channel Type', value: ch.channelType },
      ],
    };

    return { title, description, ogImage, canonicalPageUrl, channelSchema };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent pt-24 pb-8 font-sans transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Breadcrumb Skeleton */}
          <div className="w-48 h-4 bg-gray-200 dark:bg-gray-800 rounded mb-6 animate-pulse" />

          {/* Main Layout Columns */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN: MAIN CONTENT SKELETON */}
            <div className="flex-1 space-y-8 min-w-0">
              
              {/* Header Box Skeleton */}
              <div className="bg-white/65 dark:bg-[#110C1F]/65 backdrop-blur-[20px] rounded-card p-6 shadow-card border border-white/60 dark:border-white/15 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
                {/* Channel Icon/Logo Circle */}
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700/50 animate-pulse shrink-0" />
                
                {/* Title & Stats */}
                <div className="flex-1 min-w-0 space-y-3 w-full text-center md:text-left">
                  <div className="w-3/4 max-w-md h-8 bg-gray-200 dark:bg-gray-700/50 rounded mx-auto md:mx-0 animate-pulse" />
                  <div className="w-1/3 max-w-[150px] h-4 bg-gray-200 dark:bg-gray-700/50 rounded mx-auto md:mx-0 animate-pulse" />
                  
                  {/* Category and Verification Badges */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                    <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700/50 rounded-full animate-pulse" />
                    <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700/50 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Stats Grid Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white/65 dark:bg-[#110C1F]/65 p-4 rounded-xl border border-white/60 dark:border-white/15 flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700/50 animate-pulse" />
                    <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700/50 rounded animate-pulse" />
                    <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700/50 rounded animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Image Gallery Showcase Skeleton */}
              <div className="bg-white/65 dark:bg-[#110C1F]/65 rounded-card p-6 shadow-card border border-white/60 dark:border-white/15 space-y-4">
                <div className="w-full h-[300px] sm:h-[400px] bg-gray-200 dark:bg-gray-700/50 rounded-[20px] animate-pulse" />
                <div className="flex gap-2">
                  <div className="w-20 h-14 bg-gray-200 dark:bg-gray-700/50 rounded-lg animate-pulse" />
                  <div className="w-20 h-14 bg-gray-200 dark:bg-gray-700/50 rounded-lg animate-pulse" />
                  <div className="w-20 h-14 bg-gray-200 dark:bg-gray-700/50 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR SKELETON */}
            <div className="w-full lg:w-[380px] shrink-0 space-y-6">
              {/* Checkout / Buy Box */}
              <div className="bg-white/65 dark:bg-[#110C1F]/65 backdrop-blur-[20px] rounded-card p-6 shadow-card border border-white/60 dark:border-white/15 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700/50 rounded animate-pulse" />
                  <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700/50 rounded animate-pulse" />
                </div>
                
                <div className="space-y-3">
                  <div className="w-full h-11 bg-gray-200 dark:bg-gray-700/50 rounded-xl animate-pulse" />
                  <div className="w-full h-11 bg-gray-200 dark:bg-gray-700/50 rounded-xl animate-pulse" />
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700/50 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700/50 rounded animate-pulse" />
                    <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700/50 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Related/Other listings */}
              <div className="bg-white/65 dark:bg-[#110C1F]/65 rounded-card p-6 shadow-card border border-white/60 dark:border-white/15 space-y-4">
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700/50 rounded mb-4 animate-pulse" />
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-3 pt-3 border-t border-gray-100 dark:border-white/10 first:border-0 first:pt-0">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700/50 rounded-xl animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700/50 rounded animate-pulse" />
                      <div className="w-2/3 h-3 bg-gray-200 dark:bg-gray-700/50 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <Result
          status="error"
          title="Failed to Load Channel"
          subTitle={error}
          extra={[
            <button
              key="retry"
              onClick={fetchChannelDetails}
              className="bg-btn-gradient hover:shadow-purple-glow-soft text-white font-semibold py-2 px-6 rounded-button mr-4 transition-all"
            >
              Try Again
            </button>,
            <button
              key="back"
              onClick={() => navigate(-1)}
              className="bg-white/45 dark:bg-[#110C1F]/45 text-text-primary border border-white/40 font-semibold py-2 px-6 rounded-button transition-all"
            >
              Go Back
            </button>,
          ]}
        />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <Result
          status="404"
          title="Channel Not Found"
          subTitle="Sorry, the channel you're looking for doesn't exist."
          extra={
            <button
              onClick={() => navigate('/channels')}
              className="bg-btn-gradient hover:shadow-purple-glow-soft text-white font-semibold py-2 px-6 rounded-button transition-all"
            >
              Back to Channels
            </button>
          }
        />
      </div>
    );
  }

  const { title, description, ogImage, canonicalPageUrl, channelSchema } = buildChannelSEO(channel);

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead
        title={title}
        description={description}
        keywords={
          channel.seoKeywords?.join(', ') ||
          `${channel.category} youtube channel for sale, buy ${channel.category} channel india, ${channel.name} youtube channel`
        }
        ogImage={ogImage}
        ogType="product"
        canonicalUrl={canonicalPageUrl}
        noIndex={channel.noIndex}
        structuredData={channelSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Channels', url: '/channels' },
          { name: channel.name },
        ]}
      />
      <DetailPage channel={channel} refreshData={fetchChannelDetails} />
    </div>
  );
};

export default DetailPageWrapper;