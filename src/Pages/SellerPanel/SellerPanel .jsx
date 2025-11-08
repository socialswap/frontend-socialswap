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
  Tag,
  Steps,
  Card,
  Statistic,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  DollarOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ShoppingOutlined,
  EyeOutlined,
  TrophyOutlined,
  RocketOutlined,
  CloudUploadOutlined,
  BarChartOutlined,
  CheckCircleOutlined
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
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);

  // Initial fetch
  useEffect(() => {
    fetchChannels();
  }, []);

  // Initial form values
  const initialValues = {
    name: '',
    description: '',
    subscriberCount: undefined,
    viewCount: undefined,
    videoCount: undefined,
    estimatedEarnings: undefined,
    category: undefined,
    joinedDate: null,
    country: '',
    averageViewsPerVideo: undefined,
    my_language: '',
    channelType: undefined,
    recentViews: undefined,
    copyrightStrike: '',
    communityStrike: '',
    monetized: false,
    watchTimeHours: undefined,
    organicGrowth: false,
    images: [],
    userEmail: '',
    contactNumber: '',
    customUrl: '',
    price: undefined
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
    console.log('=== FORM SUBMISSION ===');
    
    // Get ALL form values directly from form (more reliable than values parameter)
    const allFormValues = form.getFieldsValue();
    const images = form.getFieldValue('images');
    
    console.log('Form values from parameter:', values);
    console.log('ALL form values from getFieldsValue:', allFormValues);
    console.log('Images from form.getFieldValue:', images);
    console.log('Images type:', typeof images);
    console.log('Is Array?:', Array.isArray(images));
    console.log('Images length:', images?.length);
    console.log('fileList state:', fileList);
    
    // Use allFormValues instead of values parameter
    const formValuesToUse = allFormValues;
    
    // Validate images exist
    if (!images || images.length === 0) {
      message.error('Please upload at least one image');
      return;
    }

    const formData = new FormData();

    // Handle multiple images upload
    let imageCount = 0;
    images.forEach((file, index) => {
      console.log(`Processing file ${index}:`, file);
      console.log('File has originFileObj?:', !!file.originFileObj);
      console.log('File is File?:', file instanceof File);
      
      // Check for both originFileObj and the file itself
      const fileToUpload = file.originFileObj || file;
      if (fileToUpload && fileToUpload instanceof File) {
        formData.append('images', fileToUpload);
        imageCount++;
        console.log(`Added file ${index} to formData:`, fileToUpload.name);
      } else {
        console.warn(`File ${index} could not be processed:`, file);
      }
    });

    console.log('Total images added to formData:', imageCount);

    // Check that at least one file was added
    if (imageCount === 0) {
      message.error('No valid image files found. Please try uploading again.');
      return;
    }

    // Add all other form values
    console.log('=== Adding form values to FormData ===');
    Object.keys(formValuesToUse).forEach(key => {
      if (key !== 'images' && key !== 'joinedDate') {
        if (formValuesToUse[key] !== undefined && formValuesToUse[key] !== null && formValuesToUse[key] !== '') {
          formData.append(key, formValuesToUse[key]);
          console.log(`✓ ${key}: ${formValuesToUse[key]}`);
        } else {
          console.warn(`✗ Skipping ${key}: value is`, formValuesToUse[key]);
        }
      }
    });

    // Handle date separately
    if (formValuesToUse.joinedDate) {
      const formattedDate = moment(formValuesToUse.joinedDate).format('YYYY-MM-DD');
      formData.append('joinedDate', formattedDate);
      console.log(`✓ joinedDate: ${formattedDate}`);
    } else {
      console.warn('✗ Skipping joinedDate: not provided');
    }

    formData.append('status', 'Available');
    console.log('✓ status: Available');

    await axiosInstance.post(`${API_BASE_URL}/channels`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data"
      },
    });

    message.success('Channel added successfully');
    form.resetFields();
    setFileList([]); // Clear upload list
    setCurrentStep(0); // Reset to first step
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
      if (key !== 'images' && key !== 'joinedDate' && values[key] !== undefined && values[key] !== null) {
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

// Step navigation handlers
const handleNext = async () => {
  try {
    // Get fields for current step
    const stepFields = getFieldsForStep(currentStep);
    
    // Validate current step fields before proceeding
    await form.validateFields(stepFields);
    
    // Move to next step (validation is handled by form.validateFields)
    setCurrentStep(currentStep + 1);
    
  } catch (error) {
    console.error('Validation error:', error);
    
    // Custom error messages based on step
    if (currentStep === 1) {
      message.error('Please upload images before proceeding to the next step');
    } else {
      message.error('Please fill in all required fields correctly');
    }
  }
};

const handlePrevious = () => {
  setCurrentStep(currentStep - 1);
};

// Get fields for each step for validation
const getFieldsForStep = (step) => {
  switch (step) {
    case 0:
      return ['name', 'price', 'customUrl', 'category', 'description'];
    case 1:
      return ['images'];
    case 2:
      return ['subscriberCount', 'viewCount', 'videoCount', 'estimatedEarnings', 'channelType', 'averageViewsPerVideo', 'recentViews', 'watchTimeHours'];
    case 3:
      return ['joinedDate', 'country', 'my_language', 'copyrightStrike', 'communityStrike', 'userEmail', 'contactNumber'];
    default:
      return [];
  }
};

// Calculate statistics
const totalChannels = channels.length;
const totalSold = soldChannels.length;
const totalRevenue = soldChannels.reduce((sum, channel) => sum + (channel.soldPrice || 0), 0);
const averagePrice = channels.length > 0 
  ? channels.reduce((sum, channel) => sum + (channel.price || 0), 0) / channels.length 
  : 0;

// Render Stats Cards
const renderStatsCards = () => (
  <Row gutter={[16, 16]} className="mb-6">
    <Col xs={24} sm={12} lg={8}>
      <Card className="stat-card stat-card-1" bordered={false}>
        <Statistic
          title={<span className="stat-title">Active Channels</span>}
          value={totalChannels}
          prefix={<ShoppingOutlined className="stat-icon" />}
          valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
        />
      </Card>
    </Col>
    <Col xs={24} sm={12} lg={8}>
      <Card className="stat-card stat-card-2" bordered={false}>
        <Statistic
          title={<span className="stat-title">Channels Sold</span>}
          value={totalSold}
          prefix={<TrophyOutlined className="stat-icon" />}
          valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
        />
      </Card>
    </Col>
    <Col xs={24} sm={12} lg={8}>
      <Card className="stat-card stat-card-3" bordered={false}>
        <Statistic
          title={<span className="stat-title">Total Revenue</span>}
          value={totalRevenue}
          prefix="$"
          suffix={<DollarOutlined style={{ fontSize: '16px' }} />}
          valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
          precision={2}
        />
      </Card>
    </Col>

  </Row>
);

// Render Step 1: Basic Information
const renderStep1 = () => (
  <div className="step-card">
    <div className="step-header">
      <RocketOutlined className="step-icon" />
      <h3 className="step-title">Basic Channel Information</h3>
      <p className="step-description">Enter the fundamental details about your channel</p>
    </div>
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
          label="Channel Price (₹)" 
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
            <Option value="Tech">Tech</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Artificial intelligence">Artificial intelligence</Option>
            <Option value="Business & Entrepreneurship">Business & Entrepreneurship</Option>
            <Option value="Education">Education</Option>
            <Option value="Health & Fitness">Health & Fitness</Option>
            <Option value="Food">Food</Option>
            <Option value="Infotainment">Infotainment</Option>
            <Option value="Vlogging">Vlogging</Option>
            <Option value="Sports">Sports</Option>
            <Option value="Commentary">Commentary</Option>
            <Option value="Entertainment">Entertainment</Option>
            <Option value="Music">Music</Option>
            <Option value="Motivation & Self-Improvement">Motivation & Self-Improvement</Option>
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
);

// Render Step 2: Media Upload
const renderStep2 = () => {
  const handleChange = ({ fileList: newFileList }) => {
    console.log('=== Upload onChange ===');
    console.log('New fileList:', newFileList);
    console.log('FileList length:', newFileList.length);
    
    setFileList(newFileList);
    form.setFieldsValue({ images: newFileList }); // ✅ sync to form
    
    // Verify it was set
    setTimeout(() => {
      const formImages = form.getFieldValue('images');
      console.log('Verified form images after set:', formImages);
      console.log('Verified form images length:', formImages?.length);
    }, 0);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return Upload.LIST_IGNORE;
    }

    message.success(`${file.name} added successfully!`);
    return false; // prevent auto upload
  };

  return (
    <div className="step-card">
      <div className="step-header">
        <CloudUploadOutlined className="step-icon" />
        <h3 className="step-title">Channel Media & Assets</h3>
        <p className="step-description">
          Upload high-quality YT Studio Analytics screenshots to showcase your channel
        </p>
      </div>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="images"
            label={
              <span>
                YT Studio Analytics Screenshots
                <span className="text-gray-400 text-sm ml-2">(Upload channel images)</span>
              </span>
            }
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
            rules={[
              {
                required: true,
                message: 'Please upload at least one image',
              },
            ]}
            extra="Upload high-quality channel images (Max: 2MB each)"
          >
            <Upload
              listType="picture-card"
              multiple
              accept="image/*"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={beforeUpload}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

// Render Step 3: Channel Statistics
const renderStep3 = () => (
  <div className="step-card">
    <div className="step-header">
      <BarChartOutlined className="step-icon" />
      <h3 className="step-title">Channel Performance Metrics</h3>
      <p className="step-description">Provide accurate statistics about your channel's performance</p>
    </div>
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
);

// Render Step 4: Channel Details
const renderStep4 = () => (
  <div className="step-card">
    <div className="step-header">
      <CheckCircleOutlined className="step-icon" />
      <h3 className="step-title">Additional Channel Details</h3>
      <p className="step-description">Complete your channel listing with final details and contact information</p>
    </div>
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
          <Input placeholder="e.g., 0 or None" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item 
          name="communityStrike" 
          label="Community Strike" 
          rules={[{ required: true, message: 'Please enter community strike status' }]}
        >
          <Input placeholder="e.g., 0 or None" />
        </Form.Item>
      </Col>
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
);

const renderAddChannelStepForm = (initialValues) => (
  <Form 
    form={form} 
    onFinish={addChannel} 
    layout="vertical" 
    initialValues={initialValues}
    className="channel-form"
  >
    {/* Step Indicator */}
    <div className="steps-wrapper">
      <Steps current={currentStep} className="custom-steps">
        <Steps.Step 
          title="Basic Info" 
          description="Channel details" 
          icon={<RocketOutlined />}
        />
        <Steps.Step 
          title="Media" 
          description="Images & banner" 
          icon={<CloudUploadOutlined />}
        />
        <Steps.Step 
          title="Statistics" 
          description="Channel stats" 
          icon={<BarChartOutlined />}
        />
        <Steps.Step 
          title="Details" 
          description="Additional info" 
          icon={<CheckCircleOutlined />}
        />
      </Steps>
    </div>

    {/* Step Content - Render all steps but hide inactive ones */}
    <div className="step-content-wrapper">
      <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
        {renderStep1()}
      </div>
      <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
        {renderStep2()}
      </div>
      <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
        {renderStep3()}
      </div>
      <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
        {renderStep4()}
      </div>
    </div>

    {/* Navigation Buttons */}
    <div className="step-navigation">
      <Button
        size="large"
        onClick={handlePrevious}
        disabled={currentStep === 0}
        className="nav-button"
      >
        Previous
      </Button>
      
      <Button
        onClick={() => {
          const allValues = form.getFieldsValue();
          console.log('=== DEBUG: All Form Values ===', allValues);
          console.log('Images specifically:', allValues.images);
          message.info('Check console for form values');
        }}
        style={{ margin: '0 10px' }}
      >
        Debug Form
      </Button>
      
      {currentStep < 3 ? (
        <Button
          type="primary"
          size="large"
          onClick={handleNext}
          className="nav-button nav-button-primary"
          icon={<RocketOutlined />}
        >
          Next Step
        </Button>
      ) : (
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="nav-button nav-button-success"
          icon={<CheckCircleOutlined />}
        >
          Add Channel
        </Button>
      )}
    </div>
  </Form>
);

const renderEditChannelForm = (initialValues) => (
  <Form 
    form={form} 
    onFinish={editChannel} 
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
            label="Channel Price (₹)" 
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
              <Option value="Tech">Tech</Option>
              <Option value="Finance">Finance</Option>
              <Option value="Artificial intelligence">Artificial intelligence</Option>
              <Option value="Business & Entrepreneurship">Business & Entrepreneurship</Option>
              <Option value="Education">Education</Option>
              <Option value="Health & Fitness">Health & Fitness</Option>
              <Option value="Food">Food</Option>
              <Option value="Infotainment">Infotainment</Option>
              <Option value="Vlogging">Vlogging</Option>
              <Option value="Sports">Sports</Option>
              <Option value="Commentary">Commentary</Option>
              <Option value="Entertainment">Entertainment</Option>
              <Option value="Music">Music</Option>
              <Option value="Motivation & Self-Improvement">Motivation & Self-Improvement</Option>
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

    {/* Channel Statistics */}
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
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
        Update Channel
      </Button>
    </Form.Item>
  </Form>
);


return (
  <div className="seller-panel-container">
    <div className="seller-panel-header">
      <div className="header-content">
        <div className="header-title-section">
          <h1 className="header-title">
            <TrophyOutlined className="header-icon" />
            Seller Dashboard
          </h1>
          <p className="header-subtitle">Manage your channel listings and track your sales performance</p>
        </div>
      </div>
    </div>

    <div className="seller-panel-content">
      {/* Statistics Cards */}
      {renderStatsCards()}

      {/* Main Content Card */}
      <Card className="main-content-card" bordered={false}>
        <Tabs 
          defaultActiveKey="1"
          className="channel-tabs"
          type="card"
          size="large"
        >
          {/* Add Channel Tab */}
          <TabPane 
            tab={
              <span className="tab-label">
                <PlusOutlined />
                <span>Add New Channel</span>
              </span>
            } 
            key="1"
          >
            <div className="tab-content">
              {renderAddChannelStepForm(initialValues)}
            </div>
          </TabPane>

          {/* Channels for Sale Tab */}
          <TabPane 
            tab={
              <span className="tab-label">
                <ShoppingOutlined />
                <span>For Sale</span>
                <Badge count={totalChannels} className="tab-badge" />
              </span>
            } 
            key="2"
          >
            <div className="tab-content">
              <div className="table-header">
                <h3 className="table-title">
                  <EyeOutlined /> Active Channel Listings
                </h3>
                <p className="table-subtitle">Manage and monitor your channels that are currently for sale</p>
              </div>
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
                    `Showing ${range[0]}-${range[1]} of ${total} channels`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
                className="modern-table"
              />
            </div>
          </TabPane>

          {/* Sold Channels Tab */}
          <TabPane 
            tab={
              <span className="tab-label">
                <TrophyOutlined />
                <span>Sold</span>
                <Badge count={totalSold} className="tab-badge success-badge" />
              </span>
            } 
            key="3"
          >
            <div className="tab-content">
              <div className="table-header">
                <h3 className="table-title">
                  <TrophyOutlined /> Successfully Sold Channels
                </h3>
                <p className="table-subtitle">View your sales history and track completed transactions</p>
              </div>
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
                    `Showing ${range[0]}-${range[1]} of ${total} channels`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
                className="modern-table"
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>
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
      {editingChannel && renderEditChannelForm({
        ...editingChannel,
        joinedDate: editingChannel.joinedDate ? moment(editingChannel.joinedDate) : null,
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
      /* Main Container Styles */
      .seller-panel-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        padding-top: 100px;
      }

      /* Header Section */
      .seller-panel-header {
        max-width: 1400px;
        margin: 0 auto 30px;
      }

      .header-content {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 30px 40px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      }

      .header-title-section {
        text-align: center;
      }

      .header-title {
        font-size: 36px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0 0 10px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
      }

      .header-icon {
        font-size: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .header-subtitle {
        color: #6b7280;
        font-size: 16px;
        margin: 0;
      }

      /* Content Area */
      .seller-panel-content {
        max-width: 1400px;
        margin: 0 auto;
      }

      /* Statistics Cards */
      .stat-card {
        border-radius: 16px;
        transition: all 0.3s ease;
        overflow: hidden;
        position: relative;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      }

      .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      }

      .stat-card-1::before {
        background: linear-gradient(90deg, #1890ff 0%, #36cfc9 100%);
      }

      .stat-card-2::before {
        background: linear-gradient(90deg, #52c41a 0%, #95de64 100%);
      }

      .stat-card-3::before {
        background: linear-gradient(90deg, #faad14 0%, #ffd666 100%);
      }

      .stat-card-4::before {
        background: linear-gradient(90deg, #722ed1 0%, #b37feb 100%);
      }

      .stat-title {
        color: #8c8c8c;
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .stat-icon {
        font-size: 20px;
        margin-right: 8px;
      }

      /* Main Content Card */
      .main-content-card {
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .main-content-card .ant-card-body {
        padding: 0;
      }

      /* Tabs Styling */
      .channel-tabs {
        background: white;
      }

      .channel-tabs .ant-tabs-nav {
        margin: 0;
        padding: 20px 20px 0;
        background: linear-gradient(to bottom, #f8f9fa 0%, white 100%);
      }

      .channel-tabs .ant-tabs-tab {
        border-radius: 12px 12px 0 0;
        border: none;
        background: white;
        margin-right: 8px;
        padding: 12px 24px;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .channel-tabs .ant-tabs-tab:hover {
        background: #f0f5ff;
      }

      .channel-tabs .ant-tabs-tab-active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .channel-tabs .ant-tabs-tab-active .tab-label,
      .channel-tabs .ant-tabs-tab-active .tab-label span {
        color: black !important;
      }

      .tab-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
      }

      .tab-label .anticon {
        font-size: 18px;
      }

      .tab-badge {
        margin-left: 8px;
      }

      .success-badge .ant-badge-count {
        background-color: #52c41a;
      }

      /* Tab Content */
      .tab-content {
        padding: 30px;
        min-height: 500px;
      }

      /* Table Header */
      .table-header {
        margin-bottom: 24px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f0f0f0;
      }

      .table-title {
        font-size: 22px;
        font-weight: 600;
        color: #262626;
        margin: 0 0 8px 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .table-subtitle {
        color: #8c8c8c;
        margin: 0;
        font-size: 14px;
      }

      /* Modern Table Styling */
      .modern-table {
        border-radius: 12px;
        overflow: hidden;
      }

      .modern-table .ant-table {
        border-radius: 12px;
      }

      .modern-table .ant-table-thead > tr > th {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: 600;
        border: none;
        padding: 16px;
        font-size: 14px;
      }

      .modern-table .ant-table-tbody > tr {
        transition: all 0.3s ease;
      }

      .modern-table .ant-table-tbody > tr:hover {
        background: #f0f5ff;
        transform: scale(1.01);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
      }

      .modern-table .ant-table-tbody > tr > td {
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;
      }

      .modern-table .ant-tag {
        border-radius: 6px;
        padding: 4px 12px;
        font-weight: 500;
      }

      /* Steps Wrapper */
      .steps-wrapper {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 30px;
        border-radius: 16px;
        margin-bottom: 30px;
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .custom-steps .ant-steps-item-process .ant-steps-item-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
      }

      .custom-steps .ant-steps-item-finish .ant-steps-item-icon {
        background: #52c41a;
        border-color: #52c41a;
      }

      .custom-steps .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
        color: white;
      }

      .custom-steps .ant-steps-item-title {
        font-weight: 600 !important;
        font-size: 15px !important;
      }

      /* Step Content */
      .step-content-wrapper {
        min-height: 450px;
        padding: 20px 0;
      }

      .step-card {
        background: white;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        border: 2px solid #f0f0f0;
      }

      .step-header {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f0f0f0;
        text-align: center;
      }

      .step-icon {
        font-size: 48px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: block;
        margin-bottom: 15px;
      }

      .step-title {
        font-size: 24px;
        font-weight: 700;
        color: #262626;
        margin: 0 0 8px 0;
      }

      .step-description {
        color: #8c8c8c;
        font-size: 14px;
        margin: 0;
      }

      /* Form Styling */
      .channel-form .ant-form-item-label > label {
        font-weight: 600;
        color: #262626;
        font-size: 14px;
      }

      .channel-form .ant-input,
      .channel-form .ant-input-number,
      .channel-form .ant-select-selector,
      .channel-form .ant-picker {
        border-radius: 8px;
        border: 2px solid #e8e8e8;
        transition: all 0.3s ease;
      }

      .channel-form .ant-input:hover,
      .channel-form .ant-input-number:hover .ant-input-number-input,
      .channel-form .ant-select-selector:hover,
      .channel-form .ant-picker:hover {
        border-color: #667eea;
      }

      .channel-form .ant-input:focus,
      .channel-form .ant-input-number-focused .ant-input-number-input,
      .channel-form .ant-select-focused .ant-select-selector,
      .channel-form .ant-picker-focused {
        border-color: #667eea;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
      }

      .channel-form textarea.ant-input {
        border-radius: 8px;
      }

      /* Upload Styling */
      .ant-upload-list-picture-card-container {
        width: 180px;
        height: 180px;
      }

      .ant-upload.ant-upload-select-picture-card {
        width: 180px;
        height: 180px;
        border-radius: 12px;
        border: 2px dashed #d9d9d9;
        background: #fafafa;
        transition: all 0.3s ease;
      }

      .ant-upload.ant-upload-select-picture-card:hover {
        border-color: #667eea;
        background: #f0f5ff;
      }

      .ant-upload-list-picture-card .ant-upload-list-item {
        border-radius: 12px;
        border: 2px solid #d9d9d9;
      }

      /* Step Navigation */
      .step-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        padding-top: 30px;
        border-top: 2px solid #f0f0f0;
      }

      .nav-button {
        border-radius: 10px;
        height: 45px;
        padding: 0 30px;
        font-weight: 600;
        font-size: 15px;
        transition: all 0.3s ease;
      }

      .nav-button-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }

      .nav-button-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      .nav-button-success {
        background: linear-gradient(135deg, #52c41a 0%, #95de64 100%);
        border: none;
        box-shadow: 0 4px 15px rgba(82, 196, 26, 0.3);
      }

      .nav-button-success:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(82, 196, 26, 0.4);
      }

      /* Switch Styling */
      .ant-switch-checked {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      /* Modal Styling */
      .channel-edit-modal .ant-modal-content {
        border-radius: 16px;
        overflow: hidden;
      }

      .channel-edit-modal .ant-modal-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        padding: 20px 24px;
      }

      .channel-edit-modal .ant-modal-title {
        color: white;
        font-size: 20px;
        font-weight: 600;
      }

      .channel-edit-modal .ant-modal-body {
        max-height: calc(100vh - 200px);
        overflow-y: auto;
        padding: 30px;
      }

      .channel-edit-modal .ant-modal-close {
        color: white;
      }

      /* Action Buttons */
      .ant-btn-primary {
        border-radius: 8px;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
      }

      .ant-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
      }

      /* Custom scrollbar */
      .ant-table-body::-webkit-scrollbar,
      .channel-edit-modal .ant-modal-body::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .ant-table-body::-webkit-scrollbar-track,
      .channel-edit-modal .ant-modal-body::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      .ant-table-body::-webkit-scrollbar-thumb,
      .channel-edit-modal .ant-modal-body::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
      }

      .ant-table-body::-webkit-scrollbar-thumb:hover,
      .channel-edit-modal .ant-modal-body::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .seller-panel-container {
          padding: 10px;
          padding-top: 80px;
        }

        .header-title {
          font-size: 24px;
        }

        .tab-content {
          padding: 15px;
        }

        .step-card {
          padding: 20px;
        }

        .steps-wrapper {
          padding: 20px;
        }
      }

      /* Animations */
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .stat-card,
      .main-content-card {
        animation: fadeIn 0.5s ease-out;
      }
    `}</style>
  </div>
);
};

export default SellerPanel;