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

      <div className="relative max-w-7xl mx-auto">
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
          <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
            Expert guides on buying, selling and growing YouTube channels
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="py-16">
            <Empty description="No blogs yet" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((item) => (
              <motion.article
                key={item._id}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white/80 backdrop-blur shadow-sm transition-all duration-300 hover:shadow-xl"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -6 }}
              >
                <div className="relative">
                  <motion.img
                    src={item.imageUrl || '/images/yt3.png'}
                    alt={item.title}
                    width="400"
                    height="200"
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 text-xs rounded-full bg-[#FF4D4D] text-white shadow-md">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    {item.category && (
                      <span className="px-3 py-1 text-xs rounded-full bg-black/60 text-white shadow-md">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold tracking-tight line-clamp-2 mb-2 text-gray-900 transition-colors group-hover:text-red-600">
                    {item.title}
                  </h2>
                  <Paragraph style={{ color: '#6B7280', marginBottom: 14 }}>
                    {item.excerpt?.length > 140
                      ? `${item.excerpt.slice(0, 140)}...`
                      : item.excerpt}
                  </Paragraph>
                  <div className="flex items-center justify-between">
                    {item.readTime && (
                      <span className="text-xs text-gray-400">
                        {item.readTime} min read
                      </span>
                    )}
                    <motion.button
                      onClick={() => navigate(`/blogs/${item.slug || item._id}`)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-white text-sm font-semibold bg-gradient-to-r from-[#FF4D4D] to-[#ff9f40] shadow-md hover:shadow-lg"
                    >
                      Read More <ArrowRightOutlined />
                    </motion.button>
                  </div>
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