import React, { useEffect, useState } from 'react';
import { Typography, Empty, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import axiosInstance, { api } from '../../API/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '../../Component/SEO/SEOHead';

const { Paragraph } = Typography;

const blogListSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'SocialSwap Blog',
  description: 'Expert guides on buying, selling and growing YouTube channels.',
  url: 'https://www.socialswap.in/blogs',
  publisher: {
    '@type': 'Organization',
    name: 'SocialSwap',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.socialswap.in/images/fav.jpg',
    },
  },
};

const BlogSection = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${api}/blogs`);
        setBlogs(res?.data?.blogs || []);
      } catch (err) {
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(b => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-900 pt-24 pb-16 px-4 overflow-hidden">
      <SEOHead
        title="YouTube Channel Tips, Guides & Insights"
        description="Read expert guides on how to buy, sell and grow YouTube channels. SocialSwap Blog covers monetization, channel valuation, and marketplace insights."
        keywords="buy youtube channel guide, sell youtube channel tips, youtube channel valuation, youtube monetization guide"
        canonicalUrl="https://www.socialswap.in/blogs"
        structuredData={blogListSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog' },
        ]}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute -top-20 -right-16 w-80 h-80 rounded-full blur-3xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,77,77,0.12), rgba(255,159,64,0.12))',
          }}
          animate={{ y: [0, -14, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full blur-3xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.08))',
          }}
          animate={{ y: [0, 12, 0], x: [0, -12, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
      </motion.div>

      <div className="relative max-w-6xl mx-auto">
        {searchQuery ? (
          <div className="mb-12 text-left">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-6">
              Search Results: <span className="text-gray-600 font-normal">{searchQuery}</span>
            </h1>
            <div className="max-w-xl flex items-center bg-white rounded-xl border border-gray-200 shadow-sm p-1.5 overflow-hidden transition-shadow focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 focus-within:shadow-md">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 text-gray-700 bg-transparent outline-none border-none placeholder-gray-400"
              />
              <button className="px-6 py-2.5 bg-[#262626] hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors ml-2">
                Search
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-4 border border-red-100">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              SocialSwap Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              YouTube Channel Insights
            </h1>
            <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto mb-8">
              Expert guides on buying, selling and growing YouTube channels
            </p>
            <div className="max-w-xl mx-auto flex items-center bg-white rounded-xl border border-gray-200 shadow-sm p-1.5 overflow-hidden transition-shadow focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 focus-within:shadow-md">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 text-gray-700 bg-transparent outline-none border-none placeholder-gray-400"
              />
              <button className="px-6 py-2.5 bg-[#262626] hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors ml-2">
                Search
              </button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-16 text-center">
            <Empty description="No blogs found" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
            {filteredBlogs.map((item) => (
              <motion.article
                key={item._id}
                onClick={() => navigate(`/blogs/${item.slug || item._id}`)}
                className="group cursor-pointer flex flex-col gap-4"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                {/* Image Section */}
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-transform duration-300 group-hover:shadow-md">
                  <img
                    src={item.imageUrl || '/images/yt3.png'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Badge */}
                  {item.category && (
                    <div className="absolute top-4 left-4 bg-white px-2.5 py-1 text-[10px] font-bold text-gray-900 tracking-widest uppercase rounded shadow-sm border border-gray-100/50">
                      {item.category}
                    </div>
                  )}
                  {/* Read Time Badge */}
                  {item.readTime && (
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur text-white px-2.5 py-1 text-[11px] font-semibold rounded-full flex items-center gap-1.5 shadow-sm">
                      <svg className="w-3.5 h-3.5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {item.readTime} Min Read
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex flex-col px-1">
                  <div className="text-[13px] text-gray-500 mb-2 font-medium">
                    <span className="text-gray-900">{item.author || 'SocialSwap'}</span> on{' '}
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <h2 className="text-[20px] md:text-[22px] leading-snug font-bold text-[#1a1a1a] mb-2.5 transition-colors line-clamp-2 group-hover:text-gray-700">
                    {item.title}
                  </h2>
                  <p className="text-[15px] leading-relaxed text-gray-500 line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSection;