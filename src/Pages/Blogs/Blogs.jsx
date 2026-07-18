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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map((item) => (
              <motion.article
                key={item._id}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white/80 backdrop-blur shadow-sm transition-all duration-300 hover:shadow-xl flex flex-col-reverse sm:flex-row h-full"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -4 }}
              >
                {/* Left Side: Text and Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-red-50 text-red-600 border border-red-100 shadow-sm">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      {item.category && (
                        <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base md:text-lg font-bold tracking-tight line-clamp-2 mb-2 text-gray-900 transition-colors group-hover:text-red-600">
                      {item.title}
                    </h2>
                    <Paragraph style={{ color: '#6B7280', marginBottom: 14, fontSize: '13px' }}>
                      {item.excerpt?.length > 100
                        ? `${item.excerpt.slice(0, 100)}...`
                        : item.excerpt}
                    </Paragraph>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    {item.readTime && (
                      <span className="text-[11px] font-medium text-gray-500">
                        {item.readTime} min read
                      </span>
                    )}
                    <motion.button
                      onClick={() => navigate(`/blogs/${item.slug || item._id}`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-auto inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-red-600 text-[13px] font-bold hover:bg-red-50 transition-colors"
                    >
                      Read More <ArrowRightOutlined className="text-[11px]" />
                    </motion.button>
                  </div>
                </div>

                {/* Right Side: Image */}
                <div className="relative w-full sm:w-2/5 md:w-1/3 lg:w-2/5 shrink-0 overflow-hidden">
                  <motion.img
                    src={item.imageUrl || '/images/yt3.png'}
                    alt={item.title}
                    className="w-full h-48 sm:h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10 pointer-events-none" />
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