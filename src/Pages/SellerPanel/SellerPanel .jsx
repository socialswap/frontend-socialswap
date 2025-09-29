import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Button, 
  Table, 
  message, 
  DatePicker, 
  Switch, 
  Modal, 
  Popconfirm, 
  Upload, 
  Row, 
  Col, 
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  DollarOutlined, 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import axiosInstance, { api, url } from '../../API/api';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const API_BASE_URL = api;

const SellerPanel = () => {
  // States
  const [channels, setChannels] = useState([]);
  const [soldChannels, setSoldChannels] = useState([]);
  const [form] = Form.useForm();
  const [editingChannel, setEditingChannel] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initial fetch
  useEffect(() => {
    fetchChannels();
  }, []);

  // File normalization helper
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e?.fileList) {
      return e.fileList;
    }
    return [];
  };

  // Initial form values
  const initialValues = {
    name: 'fdsaf',
    description: 'fdsa',
    subscriberCount: 100,
    viewCount: 100,
    videoCount: 100,
    estimatedEarnings: 100,
    category: undefined,
    joinedDate: null,
    country: 'in',
    averageViewsPerVideo: 100,
    language: 'mar',
    channelType: undefined,
    recentViews: 100,
    copyrightStrike: '3',
    // communityStrike: '',
    monetized: false,
    watchTimeHours: 100,
    organicGrowth: false,
    banner: null,
    images: [],
     userEmail: 'prede@fmail.com',
  contactNumber: '5555555555'
  };

  // Upload configuration for banner
  const bannerUploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      
      return false;
    },
    maxCount: 1,
    accept: 'image/*',
    listType: "picture-card",
    onRemove: (file) => {
      if (!editingChannel) return true;
      
      const bannerFiles = form.getFieldValue('banner');
      if (bannerFiles?.length === 1 && !file.originFileObj) {
        message.error('Banner image is required');
        return false;
      }
      return true;
    }
  };

  // Upload configuration for channel images
  const imagesUploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      
      return false;
    },
    maxCount: 4,
    accept: 'image/*',
    listType: "picture-card",
    multiple: true,
    onRemove: (file) => {
      if (!editingChannel) return true;
      
      const imageFiles = form.getFieldValue('images');
      const remainingFiles = imageFiles.filter(f => f.uid !== file.uid);
      
      if (remainingFiles.length < 2) {
        message.error('Minimum 2 images required');
        return false;
      }
      return true;
    }
  };

// Fetch channels
const fetchChannels = async () => {
  setLoading(true);
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/my-channels`);
    
    const allChannels = response?.data?.data?.channels;
    setChannels(allChannels.filter(channel => channel.status !== 'Sold'));
    setSoldChannels(allChannels.filter(channel => channel.status === 'Sold'));
  } catch (error) {
    message.error('Failed to fetch channels');
  }
  setLoading(false);
};

// Add new channel
const addChannel = async (values) => {
  try {
    const formData = new FormData();
    
    // Handle banner upload
    if (values.banner?.[0]?.originFileObj) {
      formData.append('banner', values.banner[0].originFileObj);
    }

    // Handle multiple images upload
    if (values.images?.length) {
      // Validate minimum image requirement
      if (values.images.length < 2) {
        message.error('Please upload at least 2 images');
        return;
      }
      if (values.images.length > 4) {
        message.error('Maximum 4 images allowed');
        return;
      }
      values.images.forEach((file, index) => {
        formData.append('images', file.originFileObj);
      });
    }

    // Add all other form values
    Object.keys(values).forEach(key => {
      if (key !== 'banner' && key !== 'images' && key !== 'joinedDate' && values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    });

    // Handle date separately
    if (values.joinedDate) {
      formData.append('joinedDate', moment(values.joinedDate).format('YYYY-MM-DD'));
    }

    formData.append('status', 'Available');

    await axiosInstance.post(`${API_BASE_URL}/channels`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data"
      },
    });

    message.success('Channel added successfully');
    form.resetFields();
    fetchChannels();
  } catch (error) {
    console.error('Error adding channel:', error);
    message.error(error?.response?.data?.message || 'Failed to add channel');
  }
};

// Edit channel
const editChannel = async (values) => {
  try {
    const formData = new FormData();
    
    // Handle banner upload
    if (values.banner?.[0]?.originFileObj) {
      formData.append('banner', values.banner[0].originFileObj);
    } else if (values.banner?.[0]?.url) {
      // If keeping existing banner, send the URL
      formData.append('bannerUrl', values.banner[0].url.replace(url, ''));
    }

    // Handle multiple images upload
    if (values.images?.length) {
      if (values.images.length < 2) {
        message.error('Please upload at least 2 images');
        return;
      }
      if (values.images.length > 4) {
        message.error('Maximum 4 images allowed');
        return;
      }

      // Track how many existing images we're keeping
      const existingImages = values.images
        .filter(file => file.url)
        .map(file => file.url.replace(url, ''));

      // Append existing image URLs
      if (existingImages.length > 0) {
        formData.append('existingImageUrls', JSON.stringify(existingImages));
      }

      // Append new image files
      const newImages = values.images.filter(file => file.originFileObj);
      newImages.forEach((file) => {
        formData.append('images', file.originFileObj);
      });

      // Validate total number of images
      const totalImages = existingImages.length + newImages.length;
      if (totalImages < 2) {
        message.error('Please maintain at least 2 images');
        return;
      }
      if (totalImages > 4) {
        message.error('Maximum 4 images allowed');
        return;
      }
    }

    // Add all other form values
    Object.keys(values).forEach(key => {
      if (key !== 'banner' && key !== 'images' && key !== 'joinedDate' && values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    });

    // Handle date separately
    if (values.joinedDate) {
      formData.append('joinedDate', moment(values.joinedDate).format('YYYY-MM-DD'));
    }

    await axiosInstance.put(
      `${API_BASE_URL}/channels/${editingChannel._id}`, 
      formData,
      {
        headers: { 
          "Content-Type": "multipart/form-data"
        },
      }
    );

    message.success('Channel updated successfully');
    setIsModalVisible(false);
    setEditingChannel(null);
    form.resetFields();
    fetchChannels();
  } catch (error) {
    console.error('Error updating channel:', error);
    message.error('Failed to update channel');
  }
};

// Delete channel
const deleteChannel = async (id) => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/channels/${id}`);
    message.success('Channel deleted successfully');
    fetchChannels();
  } catch (error) {
    message.error('Failed to delete channel');
  }
};

// Show edit modal
const showEditModal = (channel) => {
  setEditingChannel(channel);
  setIsModalVisible(true);
  
  const initialValues = {
    ...channel,
    joinedDate: channel.joinedDate ? moment(channel.joinedDate) : null,
    banner: channel.bannerUrl ? [
      {
        uid: '-1',
        name: 'banner.png',
        status: 'done',
        url:channel.bannerUrl,
      },
    ] : undefined,
    images: channel.imageUrls ? channel.imageUrls.map((imageUrl, index) => ({
      uid: `-${index + 1}`,
      name: `image-${index + 1}.png`,
      status: 'done',
      url: imageUrl,
    })) : undefined
  };
  
  form.setFieldsValue(initialValues);
};

// Columns configuration for active channels
const channelsColumns = [
  { 
    title: 'Name', 
    dataIndex: 'name', 
    key: 'name',
    width: 150,
    fixed: 'left'
  },
  { 
    title: 'Category', 
    dataIndex: 'category', 
    key: 'category',
    width: 120
  },
  { 
    title: 'Subscribers', 
    dataIndex: 'subscriberCount', 
    key: 'subscriberCount',
    width: 120,
    sorter: (a, b) => a.subscriberCount - b.subscriberCount,
    render: (value) => value.toLocaleString()
  },
  { 
    title: 'Total Views', 
    dataIndex: 'viewCount', 
    key: 'viewCount',
    width: 120,
    sorter: (a, b) => a.viewCount - b.viewCount,
    render: (value) => value.toLocaleString()
  },
  { 
    title: 'Video Count', 
    dataIndex: 'videoCount', 
    key: 'videoCount',
    width: 120,
    sorter: (a, b) => a.videoCount - b.videoCount,
    render: (value) => value.toLocaleString()
  },
  { 
    title: 'Estimated Earnings', 
    dataIndex: 'estimatedEarnings', 
    key: 'estimatedEarnings',
    width: 150,
    render: (value) => `$${value.toLocaleString()}`,
    sorter: (a, b) => a.estimatedEarnings - b.estimatedEarnings
  },
  { 
    title: 'Price', 
    dataIndex: 'price', 
    key: 'price',
    width: 120,
    render: (value) => `$${value?.toLocaleString() ?? '0'}`,
    sorter: (a, b) => (a.price || 0) - (b.price || 0)
  },
  { 
    title: 'Joined Date', 
    dataIndex: 'joinedDate', 
    key: 'joinedDate',
    width: 120,
    render: (date) => date ? moment(date).format('YYYY-MM-DD') : 'N/A',
    sorter: (a, b) => moment(a.joinedDate).unix() - moment(b.joinedDate).unix()
  },
  { 
    title: 'Language', 
    dataIndex: 'language', 
    key: 'language',
    width: 100,
    filters: [
      { text: 'English', value: 'English' },
      { text: 'Spanish', value: 'Spanish' },
      { text: 'Hindi', value: 'Hindi' }
    ],
    onFilter: (value, record) => record.language === value
  },
  { 
    title: 'Channel Type', 
    dataIndex: 'channelType', 
    key: 'channelType',
    width: 120,
    filters: [
      { text: 'Long Videos', value: 'Long Videos' },
      { text: 'Short Videos', value: 'Short Videos' },
      { text: 'Both Long & Short Videos', value: 'Both Long & Short Videos' }
    ],
    onFilter: (value, record) => record.channelType === value
  },
  { 
    title: 'Monetized', 
    dataIndex: 'monetized', 
    key: 'monetized',
    width: 100,
    render: (value) => value ? 'Yes' : 'No',
    filters: [
      { text: 'Yes', value: true },
      { text: 'No', value: false }
    ],
    onFilter: (value, record) => record.monetized === value
  },
  { 
    title: 'Status', 
    dataIndex: 'status', 
    key: 'status',
    width: 100,
    render: (status) => (
      <Tag color={status === 'Available' ? 'green' : 'red'}>
        {status}
      </Tag>
    )
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 120,
    render: (_, record) => (
      <span>
        <Button 
          icon={<EditOutlined />} 
          onClick={() => showEditModal(record)}
          size="small"
          className="mr-2"
        />
        <Popconfirm 
          title="Are you sure you want to delete this channel?" 
          onConfirm={() => deleteChannel(record._id)}
          okText="Yes"
          cancelText="No"
          placement="left"
        >
          <Button 
            icon={<DeleteOutlined />} 
            size="small"
            danger
          />
        </Popconfirm>
      </span>
    ),
  },
];

// Columns configuration for sold channels
const soldChannelsColumns = [
  { 
    title: 'Name', 
    dataIndex: 'name', 
    key: 'name',
    width: 150,
    fixed: 'left'
  },
  { 
    title: 'Category', 
    dataIndex: 'category', 
    key: 'category',
    width: 120
  },
  { 
    title: 'Subscribers', 
    dataIndex: 'subscriberCount', 
    key: 'subscriberCount',
    width: 120,
    sorter: (a, b) => a.subscriberCount - b.subscriberCount,
    render: (value) => value.toLocaleString()
  },
  { 
    title: 'Total Views', 
    dataIndex: 'viewCount', 
    key: 'viewCount',
    width: 120,
    sorter: (a, b) => a.viewCount - b.viewCount,
    render: (value) => value.toLocaleString()
  },
  { 
    title: 'Video Count', 
    dataIndex: 'videoCount', 
    key: 'videoCount',
    width: 120,
    sorter: (a, b) => a.videoCount - b.videoCount,
    render: (value) => value.toLocaleString()
  },
  { 
    title: 'Sold Price', 
    dataIndex: 'soldPrice', 
    key: 'soldPrice',
    width: 150,
    render: (value) => `$${value?.toLocaleString() ?? '0'}`,
    sorter: (a, b) => (a.soldPrice || 0) - (b.soldPrice || 0)
  },
  { 
    title: 'Joined Date', 
    dataIndex: 'joinedDate', 
    key: 'joinedDate',
    width: 120,
    render: (date) => date ? moment(date).format('YYYY-MM-DD') : 'N/A',
    sorter: (a, b) => moment(a.joinedDate).unix() - moment(b.joinedDate).unix()
  },
  { 
    title: 'Language', 
    dataIndex: 'language', 
    key: 'language',
    width: 100
  },
  { 
    title: 'Channel Type', 
    dataIndex: 'channelType', 
    key: 'channelType',
    width: 120
  },
  { 
    title: 'Monetized', 
    dataIndex: 'monetized', 
    key: 'monetized',
    width: 100,
    render: (value) => value ? 'Yes' : 'No'
  },
  { 
    title: 'Buyer Email', 
    dataIndex: 'buyer', 
    key: 'buyer',
    width: 150
  },
  {
    title: 'Sold Date',
    dataIndex: 'soldDate',
    key: 'soldDate',
    width: 120,
    render: (date) => date ? moment(date).format('YYYY-MM-DD') : 'N/A',
    sorter: (a, b) => moment(a.soldDate).unix() - moment(b.soldDate).unix()
  }
];

const renderForm = (initialValues) => (
  <Form 
    form={form} 
    onFinish={editingChannel ? editChannel : addChannel} 
    layout="vertical" 
    initialValues={initialValues}
    className="channel-form"
  >
    {/* Basic Information */}
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Basic Information</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            name="name" 
            label="Channel Name" 
            rules={[{ required: true, message: 'Please enter channel name' }]}
          >
            <Input placeholder="Enter channel name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="price" 
            label="Channel Price (₹
)" 
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0}
              placeholder="Enter price"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            name="customUrl" 
            label="Custom URL" 
            rules={[
              { required: true, message: 'Please enter custom URL' },
            ]}
          >
            <Input placeholder="Enter custom URL" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="category" 
            label="Category" 
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category">
  <Option value="Gaming">Gaming</Option>
  <Option value="Podcast">Podcast</Option>
  <Option value="Music">Music</Option>
  <Option value="Entertainment">Entertainment</Option>
  <Option value="Tech">Tech</Option>
  <Option value="Facts">Facts</Option>
  <Option value="Finance">Finance</Option>
  <Option value="Comedy">Comedy</Option>
  <Option value="Animation">Animation</Option>
  <Option value="Lifestyle">Lifestyle</Option>
  <Option value="Travel">Travel</Option>
  <Option value="Fashion & Beauty">Fashion & Beauty</Option>
  <Option value="News">News</Option>
  <Option value="Education">Education</Option>
  <Option value="Cooking">Cooking</Option>
  <Option value="Movie Reviews">Movie Reviews</Option>
  <Option value="Business">Business</Option>
  <Option value="Motivational">Motivational</Option>
  <Option value="Art & Design">Art & Design</Option>
  <Option value="Science">Science</Option>
  <Option value="Home Decor">Home Decor</Option>
  <Option value="Challenges">Challenges</Option>
  <Option value="Reaction">Reaction</Option>
  <Option value="Real Estate">Real Estate</Option>
  <Option value="Other">Other</Option>

</Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item 
        name="description" 
        label="Description" 
        rules={[{ required: true, message: 'Please enter description' }]}
      >
        <TextArea 
          rows={4} 
          placeholder="Enter channel description"
          showCount
          maxLength={1000}
        />
      </Form.Item>
    </div>

    {/* Media Upload Section */}
    {
      !editingChannel &&
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Channel Media</h3>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item 
            name="banner" 
            label={
              <span>
                Banner Image 
                <span className="text-gray-400 text-sm ml-2">(1920x1080 recommended)</span>
              </span>
            }
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ 
              required: true,
              message: 'Please upload a banner image'
            }]}
            extra="Upload a high-quality banner image (Max: 2MB)"
          >
            <Upload {...bannerUploadProps}>
              {(!form.getFieldValue('banner') || form.getFieldValue('banner').length === 0) && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload Banner</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item 
            name="images" 
            label={
              <span>
                YT Studio Analytics Screenshots
                <span className="text-gray-400 text-sm ml-2">(2-4 images required)</span>
              </span>
            }
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ 
              required: true,
              validator: (_, value) => {
                if (!value || value.length < 2) {
                  return Promise.reject('Please upload at least 2 images');
                }
                if (value.length > 4) {
                  return Promise.reject('You can upload maximum 4 images');
                }
                return Promise.resolve();
              }
            }]}
            extra="Upload 2-4 high-quality channel images (Max: 2MB each)"
          >
            <Upload {...imagesUploadProps}>
              {(!form.getFieldValue('images') || form.getFieldValue('images').length < 4) && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload Images</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </div>
    }

    {/* Channel Statistics */}
    <div className="bg-gray-50 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Channel Statistics</h3>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item 
            name="subscriberCount" 
            label="Subscriber Count" 
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            name="viewCount" 
            label="Total View Count" 
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            name="videoCount" 
            label="Video Count" 
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            name="estimatedEarnings" 
            label="Estimated Monthly Earnings ($)" 
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber 
              min={0} 
              step={0.01} 
              style={{ width: '100%' }} 
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="channelType" 
            label="Channel Type" 
            rules={[{ required: true, message: 'Please select channel type' }]}
          >
            <Select placeholder="Select channel type">
              <Option value="Long Videos">Long Videos</Option>
              <Option value="Short Videos">Short Videos</Option>
              <Option value="Both Long & Short Videos">Both Long & Short Videos</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item 
            name="averageViewsPerVideo" 
            label="Average Views Per Video" 
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            name="recentViews" 
            label="Recent Views (Last 28 Days)" 
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            name="watchTimeHours" 
            label="Watch Time (Hours)" 
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </div>

    {/* Channel Details */}
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Channel Details</h3>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item 
            name="joinedDate" 
            label="Joined Date" 
            rules={[{ required: true, message: 'Please select joined date' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current > moment().endOf('day')}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            name="country" 
            label="Country" 
            rules={[{ required: true, message: 'Please enter country' }]}
          >
            <Input placeholder="Enter country" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            name="my_language" 
            label="Language" 
            rules={[{ required: true, message: 'Please enter language' }]}
          >
            <Input placeholder="Enter language" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            name="copyrightStrike" 
            label="Copyright Strike" 
            rules={[{ required: true, message: 'Please enter copyright strike status' }]}
          >
            <Input placeholder="Enter copyright strike details" />
          </Form.Item>
        </Col>
        {/* <Col span={12}>
          <Form.Item 
            name="communityStrike" 
            label="Community Strike" 
            rules={[{ required: true, message: 'Please enter community strike status' }]}
          >
            <Input placeholder="Enter community strike details" />
          </Form.Item>
        </Col> */}
      </Row>
      <Row gutter={16}>
    <Col span={12}>
      <Form.Item 
        name="userEmail" 
        label="Email Address" 
        rules={[
          { required: true, message: 'Please enter email address' },
          { type: 'email', message: 'Please enter a valid email address' }
        ]}
      >
        <Input placeholder="Enter email address" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item 
        name="contactNumber" 
        label="Contact Number" 
        rules={[
          { required: true, message: 'Please enter contact number' },
          { pattern: /^[+]?[\d\s-]+$/, message: 'Please enter a valid phone number' }
        ]}
      >
        <Input placeholder="Enter contact number (e.g., +1 234 567 8900)" />
      </Form.Item>
    </Col>
  </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            name="monetized" 
            label="Monetized" 
            valuePropName="checked"
            extra="Is this channel monetized?"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="organicGrowth" 
            label="Organic Growth" 
            valuePropName="checked"
            extra="Has this channel grown organically?"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
    </div>

    {/* Submit Button */}
    <Form.Item>
      <Button 
        type="primary" 
        htmlType="submit" 
        size="large"
        className="w-full md:w-auto"
      >
        {editingChannel ? 'Update Channel' : 'Add Channel'}
      </Button>
    </Form.Item>
  </Form>
);


return (
  <div className="max-w-7xl my-24 mx-auto sm:p-6 lg:p-8">
    <div className="bg-white rounded-lg shadow">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 px-4">Seller Panel</h1>
        
        <Tabs 
          defaultActiveKey="1"
          className="channel-tabs"
          type="card"
        >
          {/* Add Channel Tab */}
          <TabPane 
            tab={
              <span className="px-2">
                <PlusOutlined className="mr-2" />
                Add Channel
              </span>
            } 
            key="1"
          >
            <div className="bg-white p-4">
              {renderForm(initialValues)}
            </div>
          </TabPane>

          {/* Channels for Sale Tab */}
          <TabPane 
            tab={
              <span className="px-2">
                <DollarOutlined className="mr-2" />
                Channels for Sale
              </span>
            } 
            key="2"
          >
            <div className="bg-white p-4">
              <Table 
                columns={channelsColumns} 
                dataSource={channels} 
                rowKey="_id" 
                scroll={{ x: true }}
                loading={loading}
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} channels`,
                }}
                className="channel-table"
              />
            </div>
          </TabPane>

          {/* Sold Channels Tab */}
          <TabPane 
            tab={
              <span className="px-2">
                <UserOutlined className="mr-2" />
                Sold Channels
              </span>
            } 
            key="3"
          >
            <div className="bg-white p-4">
              <Table 
                columns={soldChannelsColumns} 
                dataSource={soldChannels} 
                rowKey="_id" 
                scroll={{ x: true }}
                loading={loading}
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} channels`,
                }}
                className="channel-table"
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>

    {/* Edit Modal */}
    <Modal 
      title={
        <div className="flex items-center">
          <EditOutlined className="mr-2 text-blue-500" />
          <span>Edit Channel</span>
        </div>
      }
      visible={isModalVisible} 
      onCancel={() => {
        setIsModalVisible(false);
        setEditingChannel(null);
        form.resetFields();
      }}
      footer={null}
      width={800}
      destroyOnClose
      className="channel-edit-modal"
    >
      {editingChannel && renderForm({
        ...editingChannel,
        joinedDate: editingChannel.joinedDate ? moment(editingChannel.joinedDate) : null,
        banner: editingChannel.bannerUrl ? [
          {
            uid: '-1',
            name: 'banner.png',
            status: 'done',
            url:  editingChannel.bannerUrl,
          },
        ] : undefined,
        images: editingChannel.imageUrls ? editingChannel.imageUrls.map((imageUrl, index) => ({
          uid: `-${index + 1}`,
          name: `image-${index + 1}.png`,
          status: 'done',
          url: imageUrl,
        })) : undefined
      })}
    </Modal>

    {/* Global Styles */}
    <style jsx global>{`
      .channel-tabs .ant-tabs-nav {
        margin-bottom: 1rem;
      }

      .channel-form .ant-form-item {
        margin-bottom: 1.5rem;
      }

      .channel-table .ant-table-thead > tr > th {
        background-color: #f9fafb;
        font-weight: 600;
      }

      .channel-edit-modal .ant-modal-body {
        max-height: calc(100vh - 200px);
        overflow-y: auto;
      }

      .ant-upload-list-picture-card-container {
        width: 150px;
        height: 150px;
      }

      .ant-upload.ant-upload-select-picture-card {
        width: 150px;
        height: 150px;
      }

      .ant-form-item-extra {
        font-size: 12px;
        color: #6b7280;
      }

      /* Custom scrollbar for tables */
      .ant-table-body::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .ant-table-body::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }

      .ant-table-body::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
      }

      .ant-table-body::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `}</style>
  </div>
);
};

export default SellerPanel;