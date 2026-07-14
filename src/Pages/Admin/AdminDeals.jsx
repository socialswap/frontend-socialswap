import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Select, message, Descriptions, Space, Form, InputNumber } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance, { api } from '../../API/api';

const { Option } = Select;

const AdminDeals = () => {
  const [deals, setDeals] = useState([]);
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [form] = Form.useForm();
  
  const selectedSellerId = Form.useWatch('sellerId', form);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${api}/admin/deals`);
      if (response.data.success) {
        setDeals(response.data.deals);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      message.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`${api}/users`);
      if (response.data) setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    const fetchSellerChannels = async () => {
      if (!selectedSellerId) {
        setChannels([]);
        return;
      }
      try {
        const response = await axiosInstance.get(`${api}/admin/users/${selectedSellerId}/channels`);
        if (response.data?.success) {
          setChannels(response.data.channels || []);
        }
      } catch (error) {
        console.error('Error fetching seller channels:', error);
        message.error('Failed to load seller channels');
      }
    };
    fetchSellerChannels();
  }, [selectedSellerId]);

  const openCreateModal = () => {
    fetchUsers();
    form.resetFields();
    setChannels([]);
    setCreateModalVisible(true);
  };

  const handleChannelChange = (channelId) => {
    const channel = channels.find(c => c._id === channelId);
    if (channel) {
      form.setFieldsValue({ dealPrice: channel.price });
    }
  };

  const handleCreateDeal = async (values) => {
    try {
      const response = await axiosInstance.post(`${api}/admin/deals`, {
        channelId: values.channelId,
        buyerId: values.buyerId,
        dealPrice: values.dealPrice
      });
      if (response.data.success) {
        message.success('Escrow Deal created and dispatched successfully!');
        setCreateModalVisible(false);
        fetchDeals();
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      message.error(error.response?.data?.message || 'Failed to create deal');
    }
  };

  const handleViewDetails = (deal) => {
    setSelectedDeal(deal);
    setModalVisible(true);
  };

  const handlePaymentOverride = async (dealId, paymentStatus) => {
    try {
      const response = await axiosInstance.patch(`${api}/admin/deals/${dealId}/payment`, { payment: paymentStatus });
      if (response.data.success) {
        message.success(`Payment status updated to ${paymentStatus.toUpperCase()}`);
        setSelectedDeal({ ...selectedDeal, payment: paymentStatus });
        fetchDeals();
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      message.error('Failed to update payment status');
    }
  };

  const columns = [
    {
      title: 'Channel',
      dataIndex: ['channel', 'name'],
      key: 'channelName',
      render: (text) => <span className="font-semibold">{text || 'N/A'}</span>,
    },
    {
      title: 'Buyer',
      dataIndex: ['buyer', 'name'],
      key: 'buyerName',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text || 'N/A'}</div>
          <div className="text-xs text-gray-500">{record.buyer?.email}</div>
        </div>
      ),
    },
    {
      title: 'Deal Price',
      dataIndex: 'dealPrice',
      key: 'dealPrice',
      render: (price) => <span className="text-purple-600 font-bold">${price}</span>,
    },
    {
      title: 'Deal Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'gold';
        if (status === 'accepted') color = 'green';
        if (status === 'rejected') color = 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      key: 'payment',
      render: (payment) => {
        return <Tag color={payment === 'paid' ? 'green' : 'default'}>{payment ? payment.toUpperCase() : 'NOT PAID'}</Tag>;
      },
    },
    {
      title: 'Date Issued',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewDetails(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const filteredChannels = channels;

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Escrow Deals Management</h2>
          <p className="text-gray-500 text-sm">View and manage all escrow transactions across the platform.</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={openCreateModal}
          size="large"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', border: 'none' }}
        >
          Create New Deal
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={deals}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} deals`,
        }}
        bordered
      />

      {/* View Deal Modal */}
      <Modal
        title={
          <div className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg> 
            Escrow Deal Details
          </div>
        }
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedDeal(null);
        }}
        footer={null}
        width={750}
      >
        {selectedDeal && (
          <div className="mt-4">
            <Descriptions bordered column={2} size="small" layout="vertical">
              <Descriptions.Item label="Deal Status">
                <Tag color={selectedDeal.status === 'accepted' ? 'green' : selectedDeal.status === 'rejected' ? 'red' : 'gold'}>
                  {selectedDeal.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color={selectedDeal.payment === 'paid' ? 'green' : 'default'}>
                  {selectedDeal.payment ? selectedDeal.payment.toUpperCase() : 'NOT PAID'}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Created On">
                {new Date(selectedDeal.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(selectedDeal.updatedAt).toLocaleString()}
              </Descriptions.Item>

              <Descriptions.Item label="Actual Price (Channel Price)">
                <span className="text-gray-500 line-through mr-2">${selectedDeal.originalPrice || selectedDeal.channel?.price || 0}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Negotiated Deal Price">
                <span className="text-purple-600 font-bold text-lg">${selectedDeal.dealPrice}</span>
              </Descriptions.Item>
              
              <Descriptions.Item label="Buyer Info" span={1}>
                <div className="font-semibold">{selectedDeal.buyer?.name || 'N/A'}</div>
                <div className="text-sm text-gray-500">{selectedDeal.buyer?.email}</div>
                <div className="text-xs text-gray-400 mt-1">ID: {selectedDeal.buyer?._id}</div>
              </Descriptions.Item>

              <Descriptions.Item label="Seller Info" span={1}>
                <div className="font-semibold">{selectedDeal.seller?.name || 'N/A'}</div>
                <div className="text-sm text-gray-500">{selectedDeal.seller?.email}</div>
                <div className="text-xs text-gray-400 mt-1">ID: {selectedDeal.seller?._id}</div>
              </Descriptions.Item>

              <Descriptions.Item label="Target Channel" span={2}>
                <div className="font-semibold text-blue-600">{selectedDeal.channel?.name || 'Unknown Channel'}</div>
                <div className="text-xs text-gray-400">ID: {selectedDeal.channel?._id}</div>
              </Descriptions.Item>
            </Descriptions>

            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mt-6">
              <h4 className="font-bold text-purple-900 mb-2">Admin Controls</h4>
              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold text-purple-700">Override Payment Status:</div>
                <Select
                  value={selectedDeal.payment || 'notpaid'}
                  onChange={(value) => handlePaymentOverride(selectedDeal._id, value)}
                  style={{ width: 150 }}
                >
                  <Option value="notpaid">NOT PAID</Option>
                  <Option value="pending">PENDING</Option>
                  <Option value="paid">PAID</Option>
                </Select>
              </div>
              <p className="text-[11px] text-purple-500 mt-2">
                This immediately updates the transaction state. If changed to PAID, the backend will treat this deal as fully funded.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Deal Modal */}
      <Modal
        title="Create New Escrow Deal"
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleCreateDeal}
          className="mt-4"
        >
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <p className="text-sm text-blue-800">
              This wizard will dispatch a deal card to both the Buyer's and Seller's chat threads.
            </p>
          </div>

          <Form.Item 
            name="sellerId" 
            label="1. Select Seller" 
            rules={[{ required: true, message: 'Please select a seller' }]}
          >
            <Select 
              showSearch
              placeholder="Search and select seller..."
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={users.map(u => ({ value: u._id, label: `${u.name} (${u.email})` }))}
              onChange={() => {
                form.setFieldsValue({ channelId: undefined, dealPrice: undefined });
              }}
            />
          </Form.Item>

          <Form.Item 
            name="channelId" 
            label="2. Select Channel" 
            rules={[{ required: true, message: 'Please select a channel' }]}
            tooltip="Only channels owned by the selected Seller are shown."
          >
            <Select 
              showSearch
              placeholder="Search and select channel..."
              disabled={!selectedSellerId}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={filteredChannels.map(c => ({ value: c._id, label: `${c.name} - $${c.price}` }))}
              onChange={handleChannelChange}
            />
          </Form.Item>

          <Form.Item 
            name="buyerId" 
            label="3. Select Buyer" 
            rules={[{ required: true, message: 'Please select a buyer' }]}
          >
            <Select 
              showSearch
              placeholder="Search and select buyer..."
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={users.filter(u => u._id !== selectedSellerId).map(u => ({ value: u._id, label: `${u.name} (${u.email})` }))}
            />
          </Form.Item>

          <Form.Item 
            name="dealPrice" 
            label="4. Negotiated Deal Price ($)" 
            rules={[{ required: true, message: 'Please enter the deal price' }]}
          >
            <InputNumber 
              className="w-full"
              placeholder="0.00"
              prefix="$"
              min={0}
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full" 
              size="large"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', border: 'none' }}
            >
              Dispatch Escrow Deal
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDeals;
