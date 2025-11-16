import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Skeleton, Button } from 'antd';
import axiosInstance, { api } from '../../API/api';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get(`${api}/blogs/${id}`);
        setBlog(res?.data?.blog);
      } catch (err) {
        setError('Blog not found');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

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
        <Button onClick={() => navigate('/blogs')} type="primary" style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}>Back to Blogs</Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 pt-24 pb-16 px-4 overflow-hidden">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute -top-24 -right-20 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,77,77,0.12), rgba(255,159,64,0.12))' }}
          animate={{ y: [0, -12, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.1))' }}
          animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_12px_3px_rgba(239,68,68,0.5)]" />
            <span className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <motion.button
            onClick={() => navigate('/blogs')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white text-sm font-semibold bg-gradient-to-r from-[#FF4D4D] to-[#ff9f40] shadow-md hover:shadow-lg"
          >
            Back to Blogs
          </motion.button>
        </div>

        <motion.h1
          className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {blog.title}
        </motion.h1>

        {blog.imageUrl && (
          <motion.div
            className="rounded-2xl overflow-hidden mb-8 shadow-[0_10px_40px_rgba(255,0,0,0.12)] bg-white/70 backdrop-blur border border-white/70"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="relative">
              <motion.img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-72 md:h-[28rem] object-cover"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        )}

        <Paragraph style={{ color: '#374151', fontSize: 17, lineHeight: 1.85, whiteSpace: 'pre-line' }}>
          {blog.content}
        </Paragraph>
      </div>
    </div>
  );
};

export default BlogDetail;

