import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Form, Input, InputNumber, Select, Button, Table, message, DatePicker, Switch, Modal, Popconfirm } from 'antd';
import { PlusOutlined, DollarOutlined, UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { api } from '../../API/api';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const API_BASE_URL = api;

const AdminPanel = () => {
  const [channels, setChannels] = useState([]);
  const [soldChannels, setSoldChannels] = useState([]);
  const [form] = Form.useForm();
  const [editingChannel, setEditingChannel] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/channels`);
      const allChannels = response.data;
      setChannels(allChannels.filter(channel => channel.status !== 'Sold'));
      setSoldChannels(allChannels.filter(channel => channel.status === 'Sold'));
    } catch (error) {
      message.error('Failed to fetch channels');
    }
    setLoading(false);
  };

  const addChannel = async (values) => {
    try {
      await axios.post(`${API_BASE_URL}/channels`, {
        ...values,
        joinedDate: values.joinedDate.format('YYYY-MM-DD'),
        status: 'Available'
      });
      message.success('Channel added successfully');
      form.resetFields();
      fetchChannels();
    } catch (error) {
      message.error('Failed to add channel');
    }
  };

  const editChannel = async (values) => {
    try {
      await axios.patch(`${API_BASE_URL}/channels/${editingChannel._id}`, {
        ...values,
        joinedDate: values.joinedDate.format('YYYY-MM-DD')
      });
      message.success('Channel updated successfully');
      setIsModalVisible(false);
      setEditingChannel(null);
      fetchChannels();
    } catch (error) {
      message.error('Failed to update channel');
    }
  };

  const deleteChannel = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/channels/${id}`);
      message.success('Channel deleted successfully');
      fetchChannels();
    } catch (error) {
      message.error('Failed to delete channel');
    }
  };

  const showEditModal = (channel) => {
    setEditingChannel(channel);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...channel,
      joinedDate: moment(channel.joinedDate)
    });
  };

  const channelsColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Custom URL', dataIndex: 'customUrl', key: 'customUrl' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Subscribers', dataIndex: 'subscriberCount', key: 'subscriberCount', sorter: (a, b) => a.subscriberCount - b.subscriberCount },
    { title: 'Total Views', dataIndex: 'viewCount', key: 'viewCount', sorter: (a, b) => a.viewCount - b.viewCount },
    { title: 'Video Count', dataIndex: 'videoCount', key: 'videoCount', sorter: (a, b) => a.videoCount - b.videoCount },
    { 
      title: 'Estimated Earnings', 
      dataIndex: 'estimatedEarnings', 
      key: 'estimatedEarnings',
      render: (value) => `$${value}`,
      sorter: (a, b) => a.estimatedEarnings - b.estimatedEarnings
    },
    { title: 'Joined Date', dataIndex: 'joinedDate', key: 'joinedDate', render: (date) => moment(date).format('YYYY-MM-DD') },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'Channel Type', dataIndex: 'channelType', key: 'channelType' },
    { title: 'Monetized', dataIndex: 'monetized', key: 'monetized', render: (value) => value ? 'Yes' : 'No' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Popconfirm title="Are you sure you want to delete this channel?" onConfirm={() => deleteChannel(record._id)}>
            <Button icon={<DeleteOutlined />} style={{ marginLeft: 8 }} />
          </Popconfirm>
        </span>
      ),
    },
  ];

  const soldChannelsColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Custom URL', dataIndex: 'customUrl', key: 'customUrl' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Subscribers', dataIndex: 'subscriberCount', key: 'subscriberCount', sorter: (a, b) => a.subscriberCount - b.subscriberCount },
    { title: 'Total Views', dataIndex: 'viewCount', key: 'viewCount', sorter: (a, b) => a.viewCount - b.viewCount },
    { title: 'Video Count', dataIndex: 'videoCount', key: 'videoCount', sorter: (a, b) => a.videoCount - b.videoCount },
    { 
      title: 'Sold Price', 
      dataIndex: 'soldPrice', 
      key: 'soldPrice',
      render: (value) => `$${value}`,
      sorter: (a, b) => a.soldPrice - b.soldPrice
    },
    { title: 'Joined Date', dataIndex: 'joinedDate', key: 'joinedDate', render: (date) => moment(date).format('YYYY-MM-DD') },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'Channel Type', dataIndex: 'channelType', key: 'channelType' },
    { title: 'Monetized', dataIndex: 'monetized', key: 'monetized', render: (value) => value ? 'Yes' : 'No' },
    { title: 'Buyer Email', dataIndex: 'buyer', key: 'buyer' },
  ];

  const renderForm = (initialValues = {}) => (
    <Form form={form} onFinish={editingChannel ? editChannel : addChannel} layout="vertical" initialValues={initialValues}>
      <Form.Item name="name" label="Channel Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="customUrl" label="Custom URL" rules={[{ required: true }]}>
        <Input addonBefore="@" />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item name="bannerUrl" label="Banner URL">
        <Input />
      </Form.Item>
      <Form.Item name="avatarUrl" label="Avatar URL">
        <Input />
      </Form.Item>
      <Form.Item name="subscriberCount" label="Subscriber Count" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="viewCount" label="Total View Count" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="videoCount" label="Video Count" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="estimatedEarnings" label="Estimated Monthly Earnings ($)" rules={[{ required: true }]}>
        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select>
          <Option value="Pets">Pets</Option>
          <Option value="Technology">Technology</Option>
          <Option value="Gaming">Gaming</Option>
          <Option value="Food">Food</Option>
          <Option value="Health">Health</Option>
        </Select>
      </Form.Item>
      <Form.Item name="joinedDate" label="Joined Date" rules={[{ required: true }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="country" label="Country" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="uploadFrequency" label="Upload Frequency" rules={[{ required: true }]}>
        <Select>
          <Option value="Daily">Daily</Option>
          <Option value="Weekly">Weekly</Option>
          <Option value="Bi-weekly">Bi-weekly</Option>
          <Option value="Monthly">Monthly</Option>
          <Option value="Regular">Regular</Option>
        </Select>
      </Form.Item>
      <Form.Item name="averageViewsPerVideo" label="Average Views Per Video" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="engagementRate" label="Engagement Rate" rules={[{ required: true }]}>
        <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="language" label="Language" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="channelType" label="Channel Type" rules={[{ required: true }]}>
        <Select>
          <Option value="Long Videos">Long Videos</Option>
          <Option value="Short Videos">Short Videos</Option>
          <Option value="Both Long & Short Videos">Both Long & Short Videos</Option>
        </Select>
      </Form.Item>
      <Form.Item name="contentType" label="Content Type" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="recentViews" label="Recent Views (Last 28 Days)" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="copyrightStrike" label="Copyright Strike" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="communityStrike" label="Community Strike" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="monetized" label="Monetized" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="watchTimeHours" label="Watch Time (Hours)" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {editingChannel ? 'Update Channel' : 'Add Channel'}
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><PlusOutlined />Add Channel</span>} key="1">
          {renderForm()}
        </TabPane>
        <TabPane tab={<span><DollarOutlined />Channels for Sale</span>} key="2">
          <Table 
            columns={channelsColumns} 
            dataSource={channels} 
            rowKey="_id" 
            scroll={{ x: true }}
            loading={loading}
          />
        </TabPane>
        <TabPane tab={<span><UserOutlined />Sold Channels</span>} key="3">
          <Table 
            columns={soldChannelsColumns} 
            dataSource={soldChannels} 
            rowKey="_id" 
            scroll={{ x: true }}
            loading={loading}
          />
        </TabPane>
      </Tabs>

      <Modal 
        title="Edit Channel" 
        visible={isModalVisible} 
        onCancel={() => {
          setIsModalVisible(false);
          setEditingChannel(null);
        }}
        footer={null}
      >
        {renderForm(editingChannel)}
      </Modal>
    </div>
  );
};

export default AdminPanel;