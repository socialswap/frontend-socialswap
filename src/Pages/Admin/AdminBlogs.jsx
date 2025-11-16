import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Table, Modal, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstance, { api } from '../../API/api';

const { TextArea } = Input;

const AdminBlogs = () => {
  const [form] = Form.useForm();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${api}/admin/blogs`);
      setBlogs(res?.data?.blogs || []);
    } catch (err) {
      message.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const onFinish = async (values) => {
    try {
      if (editing) {
        await axiosInstance.put(`${api}/admin/blogs/${editing._id}`, values);
        message.success('Blog updated');
      } else {
        await axiosInstance.post(`${api}/admin/blogs`, values);
        message.success('Blog created');
      }
      setIsModalOpen(false);
      setEditing(null);
      form.resetFields();
      fetchBlogs();
    } catch (err) {
      message.error(err?.response?.data?.message || 'Save failed');
    }
  };

  const handleEdit = (row) => {
    setEditing(row);
    form.setFieldsValue(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    try {
      await axiosInstance.delete(`${api}/admin/blogs/${row._id}`);
      message.success('Blog deleted');
      fetchBlogs();
    } catch {
      message.error('Delete failed');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: 'Published', dataIndex: 'published', key: 'published', render: (v)=> v ? 'Yes' : 'No' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (v)=> new Date(v).toLocaleDateString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button icon={<EditOutlined />} size="small" onClick={()=>handleEdit(row)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={()=>handleDelete(row)} />
        </div>
      )
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 mt-[3rem]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Manage Blogs</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setIsModalOpen(true); setEditing(null); form.resetFields(); }}>
          New Blog
        </Button>
      </div>

      <Table
        dataSource={blogs}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: true }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <Modal
        title={editing ? 'Edit Blog' : 'Create Blog'}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setEditing(null); }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter blog title" />
          </Form.Item>
          <Form.Item name="excerpt" label="Excerpt" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Short summary" />
          </Form.Item>
          <Form.Item name="imageUrl" label="Cover Image URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="author" label="Author">
            <Input placeholder="Admin" />
          </Form.Item>
          <Form.Item name="published" label="Published" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true }]}>
            <TextArea rows={8} placeholder="Full content" />
          </Form.Item>
          <div className="flex justify-end">
            <Button htmlType="submit" type="primary">
              {editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminBlogs;

