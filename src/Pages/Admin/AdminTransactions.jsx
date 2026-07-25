import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Table, Tag, Button, Descriptions, DatePicker } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import axiosInstance from '../../API/api';

const { RangePicker } = DatePicker;

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get('/admin/transactions');
      setTransactions(response?.data?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'PENDING':
        return 'warning';
      default:
        return 'error';
    }
  };

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      ellipsis: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => `${amount} ${record.currency || 'INR'}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => setSelectedTransaction(record)}>
          View Details
        </Button>
      ),
    },
  ];

  const filteredTransactions = transactions.filter(t => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return true;
    const tDate = new Date(t.createdAt).getTime();
    const start = new Date(dateRange[0].valueOf()).setHours(0, 0, 0, 0);
    const end = new Date(dateRange[1].valueOf()).setHours(23, 59, 59, 999);
    return tDate >= start && tDate <= end;
  });

  const totalAmount = filteredTransactions.reduce((sum, t) => {
    if (t.status !== 'SUCCESS') return sum; // Optionally only sum successful transactions? Let's just sum all that match the filter, or maybe only SUCCESS. Let's sum only SUCCESS to be accurate for revenue.
    return sum + (parseFloat(t.amount) || 0);
  }, 0);

  const TransactionDetails = ({ transaction }) => (
    <div className="">
      <Button 
        type="link" 
        onClick={() => setSelectedTransaction(null)}
        icon={<LeftOutlined />}
      >
        Back to all transactions
      </Button>

      <Card title="Transaction Overview" className="w-full mt-4">
        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Transaction ID">{transaction.transactionId}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(transaction.status)}>{transaction.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Amount">{transaction.amount} {transaction.currency || 'INR'}</Descriptions.Item>
          <Descriptions.Item label="Payment Method">{transaction.paymentMethod || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Created At">{formatDate(transaction.createdAt)}</Descriptions.Item>
          <Descriptions.Item label="Updated At">{formatDate(transaction.updatedAt)}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="User Details" className="w-full mt-4">
        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Name">{transaction.user?.name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Email">{transaction.user?.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Mobile">{transaction.user?.mobile || 'N/A'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Cart Items" className="w-full mt-4">
        <Table 
          dataSource={transaction.metadata?.cartItems || []}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Item Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Price',
              dataIndex: 'price',
              key: 'price',
              render: (price) => `${price} ${transaction.currency || 'INR'}`,
            },
            {
              title: 'Quantity',
              dataIndex: 'quantity',
              key: 'quantity',
            },
          ]}
        />
      </Card>

      {transaction.phonepeResponse && (
        <Card title="PhonePe Response" className="w-full mt-4">
          <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Merchant ID">
              {transaction.phonepeResponse?.data?.merchantId || transaction.phonepeResponse?.statusResponse?.merchantId || transaction.phonepeResponse?.merchantId || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction ID">
              {transaction.phonepeResponse?.data?.transactionId || transaction.phonepeResponse?.statusResponse?.transactionId || transaction.phonepeResponse?.transactionId || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="State">
              {transaction.phonepeResponse?.data?.state || transaction.phonepeResponse?.statusResponse?.state || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Response Code">
              {transaction.phonepeResponse?.data?.responseCode || transaction.phonepeResponse?.statusResponse?.responseCode || 'N/A'}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-4">
            <h4 className="text-lg font-medium mb-4">Payment Instrument</h4>
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
              <Descriptions.Item label="Type">
                {transaction.phonepeResponse?.data?.paymentInstrument?.type || transaction.phonepeResponse?.statusResponse?.paymentInstrument?.type || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="UTR">
                {transaction.phonepeResponse?.data?.paymentInstrument?.utr || transaction.phonepeResponse?.statusResponse?.paymentInstrument?.utr || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="UPI Transaction ID">
                {transaction.phonepeResponse?.data?.paymentInstrument?.upiTransactionId || transaction.phonepeResponse?.statusResponse?.paymentInstrument?.upiTransactionId || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Account Type">
                {transaction.phonepeResponse?.data?.paymentInstrument?.accountType || transaction.phonepeResponse?.statusResponse?.paymentInstrument?.accountType || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Card>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        className="max-w-4xl mx-auto mt-4"
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-4 gap-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        
        {!selectedTransaction && (
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Filter by Date</span>
              <RangePicker 
                onChange={(dates) => setDateRange(dates)} 
                className="w-full md:w-[280px]"
              />
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200 dark:border-purple-800/50 px-5 py-2.5 rounded-xl shadow-sm flex items-center justify-between min-w-[200px]">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Total (Success)</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ₹ {totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 bg-white dark:bg-[#231542] rounded-full flex items-center justify-center shadow-inner ml-3">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {selectedTransaction ? (
        <TransactionDetails transaction={selectedTransaction} />
      ) : (
        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <Table 
            columns={columns} 
            dataSource={filteredTransactions}
            rowKey="transactionId"
            scroll={{ x: true }}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </div>
  );
};

export default AdminTransactions;