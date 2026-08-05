import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Select,
  Tag,
  Tooltip,
  Space,
  Badge,
  Popconfirm,
  message,
  Tabs,
  Card,
  Statistic,
  Row,
  Col,
  Typography,
  Divider,
  Empty,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  StopOutlined,
  StarOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import axiosInstance, { api } from '../../API/api';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { TextArea } = Input;
const { Title } = Typography;
const { TabPane } = Tabs;

const CATEGORIES = [
  'General',
  'Tutorial',
  'Case Study',
  'News',
  'Tips & Tricks',
  'YouTube Growth',
  'Monetization',
  'Channel Buying',
  'Channel Selling',
  'SEO',
];

const AdminBlogs = ({ isEmbedded = false }) => {
  const [form] = Form.useForm();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [saving, setSaving] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [, setDummy] = useState(0);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${api}/admin/blogs`);
      setBlogs(res?.data?.blogs || []);
    } catch {
      message.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      published: true,
      featured: false,
      noIndex: false,
      author: 'SocialSwap Team',
      faq: [],
    });
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    form.setFieldsValue({
      ...row,
      tags: Array.isArray(row.tags) ? row.tags.join(', ') : row.tags,
    });
    setModalOpen(true);
  };

  const openPreview = (row) => {
    setPreviewBlog(row);
    setPreviewOpen(true);
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        tags: values.tags
          ? values.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };
      if (editing) {
        await axiosInstance.put(`${api}/admin/blogs/${editing._id}`, payload);
        message.success('✅ Blog updated successfully!');
      } else {
        await axiosInstance.post(`${api}/admin/blogs`, payload);
        message.success('✅ Blog published successfully!');
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      fetchBlogs();
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    try {
      await axiosInstance.delete(`${api}/admin/blogs/${row._id}`);
      message.success('Blog deleted');
      fetchBlogs();
    } catch {
      message.error('Failed to delete blog');
    }
  };

  const handleTogglePublish = async (row) => {
    try {
      await axiosInstance.put(`${api}/admin/blogs/${row._id}`, {
        published: !row.published,
      });
      message.success(`Blog ${row.published ? 'unpublished' : 'published'}`);
      fetchBlogs();
    } catch {
      message.error('Failed to update');
    }
  };

  const handleToggleFeatured = async (row) => {
    try {
      await axiosInstance.put(`${api}/admin/blogs/${row._id}`, {
        featured: !row.featured,
      });
      message.success(`Blog ${row.featured ? 'unfeatured' : 'featured'}`);
      fetchBlogs();
    } catch {
      message.error('Failed to update');
    }
  };

  const handleImageUpload = async (file, field) => {
    try {
      const options = {
        maxSizeMB: 0.2, // Compress under 200KB
        maxWidthOrHeight: 1280, // Max width for standard HD web viewing
        useWebWorker: true,
        fileType: 'image/webp',
      };
      message.loading({ content: 'Compressing & uploading...', key: 'upload' });
      const compressedFile = await imageCompression(file, options);
      
      const formData = new FormData();
      formData.append('image', compressedFile, compressedFile.name.replace(/\.[^/.]+$/, "") + ".webp");
      
      const res = await axiosInstance.post(`${api}/admin/blogs/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (res.data.success) {
        form.setFieldsValue({ [field]: res.data.url });
        message.success({ content: 'Image uploaded successfully!', key: 'upload' });
        // Force re-render of form to show image immediately
        setDummy(d => d + 1);
      }
    } catch (err) {
      message.error({ content: 'Failed to upload image', key: 'upload' });
    }
  };

  const handleImageRemove = async (field) => {
    try {
      const imageUrl = form.getFieldValue(field);
      if (imageUrl) {
        message.loading({ content: 'Deleting image...', key: 'delete' });
        await axiosInstance.delete(`${api}/admin/blogs/delete-image?imageUrl=${encodeURIComponent(imageUrl)}`);
        form.setFieldsValue({ [field]: '' });
        message.success({ content: 'Image removed from server', key: 'delete' });
        setDummy(d => d + 1);
      }
    } catch (err) {
      message.error({ content: 'Failed to remove image', key: 'delete' });
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchSearch =
      !search ||
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'published') return matchSearch && b.published;
    if (activeTab === 'draft') return matchSearch && !b.published;
    if (activeTab === 'featured') return matchSearch && b.featured;
    return matchSearch;
  });

  // Stats
  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.published).length;
  const draftBlogs = blogs.filter((b) => !b.published).length;
  const featuredBlogs = blogs.filter((b) => b.featured).length;

  const columns = [
    {
      title: '',
      key: 'image',
      width: 60,
      render: (_, row) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {row.imageUrl ? (
            <img
              src={row.imageUrl}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FileTextOutlined style={{ fontSize: 18 }} />
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Title & Meta',
      dataIndex: 'title',
      key: 'title',
      render: (title, row) => (
        <div>
          <div className="font-semibold text-gray-900 line-clamp-1">{title}</div>
          {row.metaDescription && (
            <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">
              {row.metaDescription}
            </div>
          )}
          {row.slug && (
            <div className="text-xs text-blue-400 mt-0.5 font-mono">
              /blogs/{row.slug}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 130,
      render: (v) =>
        v ? <Tag color="blue">{v}</Tag> : <Tag>General</Tag>,
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, row) => (
        <Space direction="vertical" size={2}>
          <Badge
            status={row.published ? 'success' : 'default'}
            text={
              <span className="text-xs">
                {row.published ? 'Published' : 'Draft'}
              </span>
            }
          />
          {row.featured && (
            <Badge
              status="warning"
              text={<span className="text-xs">Featured</span>}
            />
          )}
        </Space>
      ),
    },
    {
      title: 'Stats',
      key: 'stats',
      width: 120,
      render: (_, row) => (
        <Space direction="vertical" size={2}>
          <span className="text-xs text-gray-500">
            <ClockCircleOutlined /> {row.readTime || 1}m read
          </span>
          <span className="text-xs text-gray-500">
            <EyeOutlined /> {row.viewCount || 0} views
          </span>
        </Space>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: 120,
      render: (v) => <span className="text-sm text-gray-600">{v || '—'}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (v) => (
        <span className="text-xs text-gray-500">
          {new Date(v).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 170,
      render: (_, row) => (
        <Space size={4}>
          <Tooltip title="Preview">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => openPreview(row)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              type="primary"
              ghost
              onClick={() => openEdit(row)}
            />
          </Tooltip>
          <Tooltip title={row.published ? 'Unpublish' : 'Publish'}>
            <Button
              size="small"
              icon={
                row.published ? <StopOutlined /> : <CheckCircleOutlined />
              }
              onClick={() => handleTogglePublish(row)}
              style={{
                color: row.published ? '#f97316' : '#22c55e',
                borderColor: row.published ? '#f97316' : '#22c55e',
              }}
            />
          </Tooltip>
          <Tooltip title={row.featured ? 'Unfeature' : 'Feature'}>
            <Button
              size="small"
              icon={<StarOutlined />}
              onClick={() => handleToggleFeatured(row)}
              style={{
                color: row.featured ? '#eab308' : '#9ca3af',
                borderColor: row.featured ? '#eab308' : '#9ca3af',
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this blog?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(row)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button size="small" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={`${isEmbedded ? 'bg-transparent' : 'min-h-screen bg-gray-50 mt-[3rem]'}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-500 text-sm mt-1">
              Create and manage SEO-optimized blog posts
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={openCreate}
            style={{
              background: 'linear-gradient(135deg, #FF4D4D, #ff9f40)',
              border: 'none',
            }}
          >
            Write New Blog
          </Button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={12} sm={6}>
              <Card
                className="text-center shadow-sm border-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #667eea22, #764ba222)' }}
              >
                <Statistic
                  title="Total"
                  value={totalBlogs}
                  prefix={<FileTextOutlined style={{ color: '#667eea' }} />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card
                className="text-center shadow-sm border-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #22c55e22, #16a34a22)' }}
              >
                <Statistic
                  title="Published"
                  value={publishedBlogs}
                  prefix={<CheckCircleOutlined style={{ color: '#22c55e' }} />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card
                className="text-center shadow-sm border-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #f9731622, #ea580c22)' }}
              >
                <Statistic
                  title="Drafts"
                  value={draftBlogs}
                  prefix={<StopOutlined style={{ color: '#f97316' }} />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card
                className="text-center shadow-sm border-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #eab30822, #ca8a0422)' }}
              >
                <Statistic
                  title="Featured"
                  value={featuredBlogs}
                  prefix={<StarOutlined style={{ color: '#eab308' }} />}
                />
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Search + Tabs */}
        <div className="bg-white dark:bg-[#171127] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input
              placeholder="Search blogs by title or author..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
              size="large"
              allowClear
            />
          </div>
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="small">
            <TabPane tab={`All (${totalBlogs})`} key="all" />
            <TabPane
              tab={
                <span className="text-green-600">
                  Published ({publishedBlogs})
                </span>
              }
              key="published"
            />
            <TabPane
              tab={
                <span className="text-orange-500">Drafts ({draftBlogs})</span>
              }
              key="draft"
            />
            <TabPane
              tab={
                <span className="text-yellow-500">
                  Featured ({featuredBlogs})
                </span>
              }
              key="featured"
            />
          </Tabs>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#171127] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden"
        >
          <Table
            dataSource={filteredBlogs}
            columns={columns}
            rowKey="_id"
            loading={loading}
            scroll={{ x: 900 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${total} blogs`,
            }}
            locale={{
              emptyText: (
                <Empty
                  description="No blogs found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </motion.div>
      </div>

      {/* ── Create / Edit Modal ── */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center">
              <FileTextOutlined style={{ color: 'white', fontSize: 14 }} />
            </div>
            <span>{editing ? 'Edit Blog Post' : 'Create New Blog Post'}</span>
          </div>
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={820}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
          <Tabs defaultActiveKey="content">
            {/* ── Content Tab ── */}
            <TabPane tab={<span><FileTextOutlined /> Content</span>} key="content">
              <Form.Item
                name="title"
                label="Blog Title"
                rules={[{ required: true, message: 'Title is required' }]}
              >
                <Input
                  placeholder="How to Buy a YouTube Channel Safely in India"
                  size="large"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="author" label="Author">
                    <Input placeholder="SocialSwap Team" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="category" label="Category">
                    <Select placeholder="Select category" allowClear>
                      {CATEGORIES.map((c) => (
                        <Select.Option key={c} value={c}>
                          {c}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="excerpt"
                label="Excerpt / Summary"
                rules={[{ required: true, message: 'Excerpt is required' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="A brief summary of the blog post (shown in listings)..."
                  showCount
                  maxLength={300}
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Full Content</span>
                <div className="flex gap-3 items-center">
                  <Button 
                    size="small" 
                    onClick={() => {
                      let val = form.getFieldValue('content') || '';
                      val = val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
                      // Quill wraps pasted lines in <p></p> tags. If we unescape, we might get <p><h3>...</h3></p>
                      // We can just set the unescaped value and let HTML mode show it cleanly.
                      form.setFieldsValue({ content: val });
                      message.success('Escaped HTML fixed! Please review it.');
                    }}
                  >
                    Fix Garbled Text
                  </Button>
                  <Switch 
                    checked={isHtmlMode} 
                    onChange={setIsHtmlMode} 
                    checkedChildren="HTML Mode" 
                    unCheckedChildren="Visual Editor" 
                  />
                </div>
              </div>
              <Form.Item
                name="content"
                rules={[{ required: true, message: 'Content is required' }]}
              >
                {isHtmlMode ? (
                  <TextArea 
                    rows={15} 
                    className="font-mono text-sm" 
                    placeholder="<p>Write your raw HTML here...</p>" 
                  />
                ) : (
                  <ReactQuill theme="snow" style={{ height: '400px', marginBottom: '50px' }} />
                )}
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="tags" label="Tags (comma-separated)">
                    <Input placeholder="youtube, buy channel, monetization, india" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="readTime" label="Read Time (minutes)">
                    <Input type="number" min={1} placeholder="5" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="imageUrl" label="Cover Image URL">
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      showUploadList={false}
                      className="blog-image-uploader"
                      beforeUpload={(file) => {
                        handleImageUpload(file, 'imageUrl');
                        return false;
                      }}
                    >
                      {form.getFieldValue('imageUrl') ? (
                        <div className="relative w-full h-full p-1">
                          <img
                            src={form.getFieldValue('imageUrl')}
                            alt="cover"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            type="primary"
                            danger
                            size="small"
                            shape="circle"
                            className="absolute top-2 right-2 shadow-md"
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageRemove('imageUrl');
                            }}
                          />
                        </div>
                      ) : (
                        <div>
                          <UploadOutlined className="text-2xl text-gray-400" />
                          <div className="mt-2 text-sm text-gray-500">Upload Cover</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="ogImage"
                    label="OG Image URL (Social Share)"
                    extra="Leave empty to use cover image"
                  >
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      showUploadList={false}
                      className="blog-image-uploader"
                      beforeUpload={(file) => {
                        handleImageUpload(file, 'ogImage');
                        return false;
                      }}
                    >
                      {form.getFieldValue('ogImage') ? (
                        <div className="relative w-full h-full p-1">
                          <img
                            src={form.getFieldValue('ogImage')}
                            alt="og-cover"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            type="primary"
                            danger
                            size="small"
                            shape="circle"
                            className="absolute top-2 right-2 shadow-md"
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageRemove('ogImage');
                            }}
                          />
                        </div>
                      ) : (
                        <div>
                          <UploadOutlined className="text-2xl text-gray-400" />
                          <div className="mt-2 text-sm text-gray-500">Upload OG Image</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={12} sm={8}>
                  <Form.Item
                    name="published"
                    label="Status"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch
                      checkedChildren="Published"
                      unCheckedChildren="Draft"
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item
                    name="featured"
                    label="Featured"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Switch
                      checkedChildren="⭐ Featured"
                      unCheckedChildren="Normal"
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item
                    name="noIndex"
                    label="Hide from Google"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Switch
                      checkedChildren="No Index"
                      unCheckedChildren="Indexed"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            {/* ── SEO Tab ── */}
            <TabPane
              tab={<span><GlobalOutlined /> SEO Settings</span>}
              key="seo"
            >
              <div className="p-3 bg-blue-50 rounded-xl mb-4 border border-blue-100">
                <p className="text-sm text-blue-700">
                  🎯 These fields directly control how your blog appears in Google search results.
                </p>
              </div>

              <Form.Item
                name="metaTitle"
                label="Meta Title (Google Title)"
                extra="Max 60 characters. Leave blank to use blog title."
              >
                <Input
                  placeholder="How to Buy a YouTube Channel Safely | SocialSwap"
                  showCount
                  maxLength={60}
                />
              </Form.Item>

              <Form.Item
                name="metaDescription"
                label="Meta Description (Google Snippet)"
                extra="Max 160 characters. This appears below your title in Google search results."
              >
                <TextArea
                  rows={3}
                  placeholder="Learn the complete step-by-step process to safely buy a verified YouTube channel in India with escrow protection..."
                  showCount
                  maxLength={160}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="focusKeyword"
                    label="Focus Keyword"
                    extra="The primary keyword you want this post to rank for."
                  >
                    <Input placeholder="buy youtube channel india" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="slug"
                    label="Custom URL Slug"
                    extra="Auto-generated from title if left blank."
                  >
                    <Input
                      placeholder="how-to-buy-youtube-channel-india"
                      addonBefore="/blogs/"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="canonicalUrl"
                label="Canonical URL"
                extra="Only set if this is a duplicate/mirror page. Leave blank for auto."
              >
                <Input placeholder="https://www.socialswap.in/blogs/your-slug" />
              </Form.Item>

              {/* Live SEO Preview */}
              <Form.Item shouldUpdate>
                {() => (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      📊 Google Search Preview
                    </p>
                    <div className="space-y-1">
                      <p className="text-blue-600 text-base font-medium line-clamp-1">
                        {form.getFieldValue('metaTitle') ||
                          form.getFieldValue('title') ||
                          'Your Blog Title | SocialSwap'}
                      </p>
                      <p className="text-green-600 text-xs">
                        https://www.socialswap.in/blogs/
                        {form.getFieldValue('slug') || 'auto-generated-slug'}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {form.getFieldValue('metaDescription') ||
                          form.getFieldValue('excerpt') ||
                          'Your meta description will appear here in Google search results...'}
                      </p>
                    </div>
                  </div>
                )}
              </Form.Item>
            </TabPane>

            {/* ── FAQ Tab ── */}
            <TabPane tab={<span><FileTextOutlined /> FAQs</span>} key="faq">
              <div className="p-3 bg-purple-50 rounded-xl mb-4 border border-purple-100">
                <p className="text-sm text-purple-700">
                  ❓ Add Frequently Asked Questions to feature in Google's "People Also Ask" section.
                </p>
              </div>
              <Form.List name="faq">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className="flex gap-2 items-start mb-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                        <div className="flex-1 space-y-3">
                          <Form.Item
                            {...restField}
                            name={[name, 'question']}
                            rules={[{ required: true, message: 'Missing question' }]}
                            className="mb-0"
                          >
                            <Input placeholder="Question" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'answer']}
                            rules={[{ required: true, message: 'Missing answer' }]}
                            className="mb-0"
                          >
                            <TextArea placeholder="Answer" rows={2} />
                          </Form.Item>
                        </div>
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                      </div>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add FAQ
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </TabPane>
          </Tabs>

          <Divider />
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                setModalOpen(false);
                setEditing(null);
              }}
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              loading={saving}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #FF4D4D, #ff9f40)',
                border: 'none',
              }}
            >
              {saving
                ? 'Saving...'
                : editing
                ? '💾 Update Blog'
                : '🚀 Publish Blog'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ── Preview Modal ── */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EyeOutlined style={{ color: '#FF4D4D' }} />
            <span>Blog Preview</span>
          </div>
        }
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewOpen(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setPreviewOpen(false);
              openEdit(previewBlog);
            }}
            style={{
              background: 'linear-gradient(135deg, #FF4D4D, #ff9f40)',
              border: 'none',
            }}
          >
            Edit Blog
          </Button>,
        ]}
        width={760}
        style={{ top: 20 }}
      >
        {previewBlog && (
          <div className="py-2">
            {/* SEO info bar */}
            <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                SEO Summary
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700">Meta Title: </span>
                <span className="text-gray-600">
                  {previewBlog.metaTitle || previewBlog.title}
                </span>
              </p>
              {previewBlog.metaDescription && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700">
                    Meta Description:{' '}
                  </span>
                  <span className="text-gray-600">
                    {previewBlog.metaDescription}
                  </span>
                </p>
              )}
              {previewBlog.slug && (
                <p className="text-sm font-mono text-blue-500">
                  /blogs/{previewBlog.slug}
                </p>
              )}
              <div className="flex gap-2 flex-wrap pt-1">
                <Badge
                  status={previewBlog.published ? 'success' : 'default'}
                  text={previewBlog.published ? 'Published' : 'Draft'}
                />
                {previewBlog.featured && (
                  <Badge status="warning" text="Featured" />
                )}
                {previewBlog.noIndex && (
                  <Badge status="error" text="No-Index" />
                )}
              </div>
            </div>

            {previewBlog.imageUrl && (
              <img
                src={previewBlog.imageUrl}
                alt={previewBlog.title}
                className="w-full h-56 object-cover rounded-xl mb-4"
              />
            )}

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {previewBlog.category && (
                <Tag color="red">{previewBlog.category}</Tag>
              )}
              {previewBlog.author && (
                <span className="text-sm text-gray-500">
                  By {previewBlog.author}
                </span>
              )}
              {previewBlog.readTime && (
                <span className="text-sm text-gray-400">
                  · {previewBlog.readTime} min read
                </span>
              )}
              <span className="text-sm text-gray-400 ml-auto">
                {new Date(previewBlog.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <Title level={3} style={{ marginBottom: 8 }}>
              {previewBlog.title}
            </Title>

            {previewBlog.excerpt && (
              <p className="text-gray-500 italic mb-4 border-l-4 border-red-300 pl-3">
                {previewBlog.excerpt}
              </p>
            )}

            <div
              className="text-gray-700 text-sm whitespace-pre-line leading-relaxed line-clamp-[20]"
              style={{ maxHeight: 280, overflow: 'auto' }}
            >
              {previewBlog.content}
            </div>

            {previewBlog.tags && previewBlog.tags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                {previewBlog.tags.map((t, i) => (
                  <Tag key={i} color="default">
                    #{t}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBlogs;
