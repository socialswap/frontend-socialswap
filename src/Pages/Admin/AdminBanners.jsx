import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Upload, 
  message, 
  Switch, 
  InputNumber,
  Image,
  Popconfirm,
  Space,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  DesktopOutlined,
  MobileOutlined
} from '@ant-design/icons';
import axiosInstance, { api } from '../../API/api';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form] = Form.useForm();
  const [desktopFileList, setDesktopFileList] = useState([]);
  const [mobileFileList, setMobileFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${api}/admin/banners`);
      setBanners(response.data.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      message.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = () => {
    setEditingBanner(null);
    form.resetFields();
    setDesktopFileList([]);
    setMobileFileList([]);
    setModalVisible(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    form.setFieldsValue({
      title: banner.title,
      description: banner.description,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      order: banner.order,
      isActive: banner.isActive
    });
    
    // Set existing images
    if (banner.desktopImageUrl) {
      setDesktopFileList([{
        uid: '-1',
        name: 'desktop-image.png',
        status: 'done',
        url: banner.desktopImageUrl
      }]);
    }
    
    if (banner.mobileImageUrl) {
      setMobileFileList([{
        uid: '-1',
        name: 'mobile-image.png',
        status: 'done',
        url: banner.mobileImageUrl
      }]);
    }
    
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title || '');
      formData.append('description', values.description || '');
      formData.append('buttonText', values.buttonText || 'Shop Now');
      formData.append('buttonLink', values.buttonLink || '/channels');
      formData.append('order', values.order || 0);
      
      if (editingBanner) {
        formData.append('isActive', values.isActive !== undefined ? values.isActive : true);
      }

      // Handle desktop image
      if (desktopFileList.length > 0 && desktopFileList[0].originFileObj) {
        formData.append('desktopImage', desktopFileList[0].originFileObj);
      }

      // Handle mobile image
      if (mobileFileList.length > 0 && mobileFileList[0].originFileObj) {
        formData.append('mobileImage', mobileFileList[0].originFileObj);
      }

      if (editingBanner) {
        // Update
        await axiosInstance.put(`${api}/admin/banners/${editingBanner._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Banner updated successfully');
      } else {
        // Create - both images required
        if (!desktopFileList.length || !mobileFileList.length) {
          message.error('Both desktop and mobile images are required');
          setSubmitting(false);
          return;
        }
        
        await axiosInstance.post(`${api}/admin/banners`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Banner created successfully');
      }

      setModalVisible(false);
      fetchBanners();
      form.resetFields();
      setDesktopFileList([]);
      setMobileFileList([]);
    } catch (error) {
      console.error('Error saving banner:', error);
      message.error(error.response?.data?.message || 'Failed to save banner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${api}/admin/banners/${id}`);
      message.success('Banner deleted successfully');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      message.error('Failed to delete banner');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axiosInstance.patch(`${api}/admin/banners/${id}/toggle`);
      message.success('Banner status updated');
      fetchBanners();
    } catch (error) {
      console.error('Error toggling status:', error);
      message.error('Failed to update banner status');
    }
  };

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const columns = [
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Desktop Image',
      dataIndex: 'desktopImageUrl',
      key: 'desktopImageUrl',
      width: 150,
      render: (url) => (
        <div className="flex items-center gap-2">
          <Image
            src={url}
            alt="Desktop"
            width={100}
            height={50}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
          />
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(url)}
          />
        </div>
      ),
    },
    {
      title: 'Mobile Image',
      dataIndex: 'mobileImageUrl',
      key: 'mobileImageUrl',
      width: 150,
      render: (url) => (
        <div className="flex items-center gap-2">
          <Image
            src={url}
            alt="Mobile"
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
          />
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(url)}
          />
        </div>
      ),
    },
    {
      title: 'Button Text',
      dataIndex: 'buttonText',
      key: 'buttonText',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStatus(record._id)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditBanner(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this banner?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }
    return false; // Prevent auto upload
  };

  return (
    <div className="p-6 mt-[5rem]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddBanner}
          size="large"
        >
          Add New Banner
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={banners}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Total ${total} banners`,
        }}
      />

      <Modal
        title={editingBanner ? 'Edit Banner' : 'Add New Banner'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setDesktopFileList([]);
          setMobileFileList([]);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            buttonText: 'Shop Now',
            buttonLink: '/channels',
            order: 0,
            isActive: true
          }}
        >
          <Form.Item
            name="title"
            label="Banner Title (Optional)"
          >
            <Input placeholder="Enter banner title (optional)" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={2} placeholder="Enter banner description (optional)" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="buttonText"
              label="Button Text"
            >
              <Input placeholder="Shop Now" />
            </Form.Item>

            <Form.Item
              name="buttonLink"
              label="Button Link"
            >
              <Input placeholder="/channels" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="order"
              label="Display Order"
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>

            {editingBanner && (
              <Form.Item
                name="isActive"
                label="Active Status"
                valuePropName="checked"
              >
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={
                <span className="flex items-center gap-2">
                  <DesktopOutlined /> Desktop Image (Wide - 1920x400px recommended)
                </span>
              }
              required={!editingBanner}
            >
              <Upload
                listType="picture-card"
                fileList={desktopFileList}
                onChange={({ fileList }) => setDesktopFileList(fileList)}
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                {desktopFileList.length === 0 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload Desktop</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              label={
                <span className="flex items-center gap-2">
                  <MobileOutlined /> Mobile Image (Square - 800x800px recommended)
                </span>
              }
              required={!editingBanner}
            >
              <Upload
                listType="picture-card"
                fileList={mobileFileList}
                onChange={({ fileList }) => setMobileFileList(fileList)}
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                {mobileFileList.length === 0 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload Mobile</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Button
              onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setDesktopFileList([]);
                setMobileFileList([]);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={submitting}
              disabled={submitting}
            >
              {editingBanner ? 'Update Banner' : 'Create Banner'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={1000}
      >
        <img src={previewImage} alt="Preview" style={{ width: '100%' }} />
      </Modal>
    </div>
  );
};

export default AdminBanners;

