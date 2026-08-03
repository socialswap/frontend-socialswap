import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Skeleton, Button, message } from 'antd';
import axiosInstance, { api } from '../../API/api';
import { motion } from 'framer-motion';
import SEOHead from '../../Component/SEO/SEOHead';

const { Title, Paragraph } = Typography;
const BASE_URL = 'https://www.socialswap.in';

const BlogDetail = () => {
  const { id } = useParams(); // can be slug or _id
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [blogRes, recentRes] = await Promise.all([
          axiosInstance.get(`${api}/blogs/${id}`),
          axiosInstance.get(`${api}/blogs?limit=5`)
        ]);
        setBlog(blogRes?.data?.blog);
        const recent = (recentRes?.data?.blogs || [])
          .filter(b => b._id !== blogRes?.data?.blog?._id)
          .slice(0, 4);
        setRecentBlogs(recent);
      } catch (err) {
        setError('Blog not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(canonicalUrl);
    message.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 pt-24 px-4 text-center">
        <Title level={3} style={{ color: '#111827' }}>{error || 'Blog not found'}</Title>
        <Button
          onClick={() => navigate('/blogs')}
          type="primary"
          style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
        >
          Back to Blogs
        </Button>
      </div>
    );
  }

  const slug = blog.slug || blog._id;
  const canonicalUrl = `${BASE_URL}/blogs/${slug}`;
  const seoTitle = blog.metaTitle || blog.title;
  const seoDesc = blog.metaDescription || blog.excerpt;
  const seoImage = blog.ogImage || blog.imageUrl;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: seoImage,
    url: canonicalUrl,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    author: { '@type': 'Person', name: blog.author || 'SocialSwap Team' },
    publisher: {
      '@type': 'Organization',
      name: 'SocialSwap',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.socialswap.in/images/fav.jpg',
      },
    },
    keywords: blog.tags?.join(', '),
    articleSection: blog.category,
    wordCount: blog.content?.split(/\s+/).length,
  };

  const faqSchema = blog.faq?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: blog.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      }
    }))
  } : null;

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        keywords={blog.tags?.join(', ')}
        ogImage={seoImage}
        ogType="article"
        canonicalUrl={canonicalUrl}
        noIndex={blog.noIndex}
        article={{
          publishedTime: blog.createdAt,
          modifiedTime: blog.updatedAt,
          author: blog.author,
          tags: blog.tags,
        }}
        structuredData={articleSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blogs' },
          { name: blog.title },
        ]}
        faqSchema={faqSchema}
      />

      <div className="relative min-h-screen bg-gray-50 dark:bg-[#120a27] text-gray-900 dark:text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 overflow-x-hidden">
        {/* HEADER & COVER IMAGE (Full width top section) */}
        <div className="max-w-7xl mx-auto mb-16">
             {/* Header */}
             <div className="text-center mb-8 flex flex-col items-center">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-4">
                  {blog.author || 'SocialSwap Team'} <span className="text-gray-500 dark:text-gray-500 font-normal">on {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#111827] dark:text-white leading-[1.15] mb-6 tracking-tight">
                  {blog.title}
                </h1>
                {blog.category && (
                  <span className="px-4 py-1.5 bg-white dark:bg-white/10 border border-gray-100 dark:border-white/20 text-[11px] font-bold uppercase tracking-widest text-gray-700 dark:text-gray-200 rounded-full shadow-sm backdrop-blur-sm">
                    {blog.category}
                  </span>
                )}
             </div>

             {/* Image */}
             {blog.imageUrl && (
               <div className="w-full rounded-[24px] overflow-hidden shadow-sm">
                 <img src={blog.imageUrl} alt={blog.title} fetchpriority="high" className="w-full h-auto max-h-[600px] object-cover" />
               </div>
             )}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
          
          {/* LEFT SIDEBAR: Share & Read Time */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-28 flex flex-col items-center gap-6">
               <div 
                 className="w-24 h-24 rounded-full flex items-center justify-center shadow-sm"
                 style={{ background: `conic-gradient(#111827 ${scrollProgress}%, #f3f4f6 0)` }}
               >
                 <div className="w-[92px] h-[92px] bg-white dark:bg-[#18112e] rounded-full flex flex-col items-center justify-center text-center">
                   <span className="text-xl font-bold text-gray-900 dark:text-white leading-none mb-1">{blog.readTime || '5'}</span>
                   <span className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-tight">min<br/>read</span>
                 </div>
               </div>
               
               <div className="flex flex-col items-center gap-5 mt-4">
                  {/* Twitter / X */}
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(seoTitle)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition" aria-label="Share on X (Twitter)">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  {/* Facebook */}
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition" aria-label="Share on Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  {/* LinkedIn */}
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(canonicalUrl)}&title=${encodeURIComponent(seoTitle)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition" aria-label="Share on LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  {/* Copy Link */}
                  <button onClick={copyToClipboard} className="text-gray-500 hover:text-gray-900 transition" aria-label="Copy blog link to clipboard">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
                  </button>
               </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-7 pt-2">

             {/* Content */}
             <style>{`
               .blog-html-content * {
                 max-width: 100% !important;
                 overflow-x: hidden !important;
                 box-sizing: border-box !important;
               }
               .blog-html-content p,
               .blog-html-content li,
               .blog-html-content span,
               .blog-html-content div {
                 text-align: left !important;
                 word-break: break-word !important;
                 overflow-wrap: break-word !important;
                 white-space: normal !important;
               }
               .blog-html-content h1,
               .blog-html-content h2,
               .blog-html-content h3,
               .blog-html-content h4,
               .blog-html-content h5,
               .blog-html-content h6 {
                 text-align: left !important;
                 word-break: break-word !important;
               }
               .blog-html-content img {
                 max-width: 100% !important;
                 height: auto !important;
                 border-radius: 12px;
               }
               .blog-html-content table {
                 width: 100% !important;
                 display: block;
                 overflow-x: auto;
               }
               .blog-html-content pre,
               .blog-html-content code {
                 max-width: 100% !important;
                 overflow-x: auto !important;
                 white-space: pre-wrap !important;
                 word-break: break-word !important;
               }
               .blog-html-content iframe {
                 max-width: 100% !important;
               }
             `}</style>
             <div className="prose prose-lg max-w-none text-[#374151] dark:text-gray-300 prose-headings:font-bold prose-headings:text-[#111827] dark:prose-headings:text-white prose-a:text-red-500 hover:prose-a:text-red-600 prose-img:rounded-xl dark:prose-strong:text-white overflow-x-hidden">
               <div className="blog-html-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
             </div>

             {/* Tags */}
             {blog.tags && blog.tags.length > 0 && (
               <div className="mt-12 pt-8 border-t border-gray-100">
                 <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Tags</p>
                 <div className="flex flex-wrap gap-2">
                   {blog.tags.map((tag, i) => (
                     <span
                       key={i}
                       className="px-4 py-1.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-default"
                     >
                       #{tag}
                     </span>
                   ))}
                 </div>
               </div>
             )}

             {/* FAQs - Removed from UI per user request, only kept for JSON-LD */}
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-3">
             <div className="sticky top-28 flex flex-col gap-6">
                {/* Search Widget */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Search</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                         if(e.key === 'Enter' && searchQuery.trim()) {
                            navigate(`/blogs?search=${encodeURIComponent(searchQuery)}`);
                         }
                      }}
                    />
                    <button
        aria-label="Chat on WhatsApp" 
                      onClick={() => {
                         if(searchQuery.trim()) navigate(`/blogs?search=${encodeURIComponent(searchQuery)}`);
                      }}
                      className="px-4 py-2.5 bg-[#262626] hover:bg-black text-white rounded-lg text-sm font-semibold transition"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Recent Posts Widget */}
                {recentBlogs.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Recent Posts</h3>
                    <div className="flex flex-col gap-6">
                      {recentBlogs.map(rb => (
                        <Link key={rb._id} to={`/blogs/${rb.slug || rb._id}`} className="group flex flex-col gap-1.5">
                          <h4 className="text-[15px] font-bold text-[#111827] leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                            {rb.title}
                          </h4>
                          {rb.category && (
                            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mt-1">
                              {rb.category}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
