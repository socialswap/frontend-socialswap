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
    <div className="relative min-h-screen bg-white dark:bg-[#120a27] text-gray-900 dark:text-white pt-24 pb-16 px-4 overflow-hidden transition-colors duration-300">
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
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold mb-4 border border-red-100 dark:border-red-500/20">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              SocialSwap Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              YouTube Channel Insights
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg max-w-2xl mx-auto mb-8">
              Expert guides on buying, selling and growing YouTube channels
            </p>
            <div className="max-w-xl mx-auto flex items-center bg-white dark:bg-[#1a113a] rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm p-1.5 overflow-hidden transition-shadow focus-within:border-gray-400 dark:focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-100 dark:focus-within:ring-gray-800 focus-within:shadow-md">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 text-gray-700 dark:text-gray-200 bg-transparent outline-none border-none placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button className="px-6 py-2.5 bg-[#262626] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white text-sm font-semibold rounded-lg transition-colors ml-2">
                Search
              </button>
            </div>
            
            {searchQuery && (
              <div className="mt-8 text-lg font-medium text-gray-700 dark:text-gray-300">
                Search Results for: <span className="font-bold text-gray-900 dark:text-white">{searchQuery}</span>
              </div>
            )}
          </motion.div>

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
                className="group flex flex-col bg-white dark:bg-[#1a113a] rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/blogs/${item.slug || item._id}`)}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                {/* Image Section */}
                <div className="relative h-[220px] w-full overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/600x400?text=Blog+Image'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Category Badge - Overlaid */}
                  {item.category && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 dark:bg-[#120a27]/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-100 rounded-sm shadow-sm">
                      {item.category}
                    </span>
                  )}
                  {/* Read Time - Overlaid */}
                  <span className="absolute top-4 right-4 px-3 py-1 bg-black/60 dark:bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold rounded-full flex items-center gap-1.5 shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {item.readTime || '5'} Min Read
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[13px] font-medium text-gray-900 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                    {item.author || 'SocialSwap Team'} 
                    <span className="text-gray-400 dark:text-gray-500 font-normal">on {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <h2 className="text-[20px] font-bold text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                  
                  <div className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed line-clamp-2 mb-4 flex-grow">
                    {item.excerpt}
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