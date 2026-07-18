import React, { useState, useEffect } from 'react';
import { Spin, Result } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
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

  useEffect(() => {
    fetchChannelDetails();
  }, [username]);

  const fetchChannelDetails = async () => {
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
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#FF4D4D' }} />} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Result
          status="error"
          title="Failed to Load Channel"
          subTitle={error}
          extra={[
            <button
              key="retry"
              onClick={fetchChannelDetails}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg mr-4 transition-colors"
            >
              Try Again
            </button>,
            <button
              key="back"
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Result
          status="404"
          title="Channel Not Found"
          subTitle="Sorry, the channel you're looking for doesn't exist."
          extra={
            <button
              onClick={() => navigate('/channels')}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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