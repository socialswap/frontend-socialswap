import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Upload, 
  message, 
  Select, 
  InputNumber,
  Popconfirm,
  Avatar,
  Space
} from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import axiosInstance, { api } from '../../API/api';
import { compressAndConvertToWebP } from '../../Utils/imageHelper';

const { Option } = Select;
const { TextArea } = Input;

const AdminTestimonials = ({ isEmbedded = false }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${api}/admin/testimonials`);
      setTestimonials(response.data.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      message.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    form.setFieldsValue({
      name: testimonial.name,
      title: testimonial.title,
      headline: testimonial.headline || '',
      text: testimonial.text,
      rating: testimonial.rating,
      category: testimonial.category
    });
    
    if (testimonial.avatar) {
      setFileList([{
        uid: '-1',
        name: 'avatar.png',
        status: 'done',
        url: testimonial.avatar
      }]);
    } else {
      setFileList([]);
    }
    
    setModalVisible(true);
  };

  const handleUploadImage = async (options) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    
    try {
      const compressedFile = await compressAndConvertToWebP(file, 0.8);
      formData.append('image', compressedFile);
      
      const res = await axiosInstance.post(`${api}/admin/testimonials/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSuccess(res.data.url);
      message.success('Image compressed and uploaded successfully');
    } catch (err) {
      console.error("Upload error:", err);
      onError({ err });
      message.error('Image upload failed');
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      let avatarUrl = '';
      
      if (fileList.length > 0) {
        if (fileList[0].status === 'done') {
          avatarUrl = fileList[0].url || fileList[0].response;
        }
      }

      const payload = {
        ...values,
        avatar: avatarUrl
      };

      if (editingTestimonial) {
        await axiosInstance.put(`${api}/admin/testimonials/${editingTestimonial._id}`, payload);
        message.success('Testimonial updated successfully');
      } else {
        await axiosInstance.post(`${api}/admin/testimonials`, payload);
        message.success('Testimonial created successfully');
      }

      setModalVisible(false);
      fetchTestimonials();
    } catch (error) {
      console.error('Submit error:', error);
      message.error(`Failed to ${editingTestimonial ? 'update' : 'create'} testimonial`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${api}/admin/testimonials/${id}`);
      message.success('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error) {
      message.error('Failed to delete testimonial');
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar) => avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Title / Location',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Headline',
      dataIndex: 'headline',
      key: 'headline',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category) => <span style={{ textTransform: 'capitalize' }}>{category}</span>
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this testimonial?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={!isEmbedded ? "p-6" : ""}>
      <div className="flex justify-between items-center mb-6">
        {!isEmbedded && <h2 className="text-2xl font-bold">Manage Testimonials</h2>}
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
        >
          Add Testimonial
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={testimonials} 
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            rating: 5,
            category: 'buyer'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Title / Location"
            >
              <Input placeholder="Graphic Designer / USA" />
            </Form.Item>

            <Form.Item
              name="headline"
              label="Review Headline"
              rules={[{ required: true, message: 'Please enter a headline' }]}
            >
              <Input placeholder="AMAZING CUSTOMER SERVICE" />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating (1-5)"
              rules={[{ required: true, message: 'Rating is required' }]}
            >
              <InputNumber min={1} max={5} className="w-full" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Category is required' }]}
            >
              <Select>
                <Option value="buyer">Buyer</Option>
                <Option value="seller">Seller</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="text"
            label="Testimonial Text"
            rules={[{ required: true, message: 'Please enter the testimonial text' }]}
          >
            <TextArea rows={4} placeholder="Their review..." />
          </Form.Item>

          <Form.Item label="Avatar Image (Optional)">
            <Upload
              customRequest={handleUploadImage}
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {editingTestimonial ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTestimonials;
