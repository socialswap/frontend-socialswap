import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Table, Tag, Button, Descriptions } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import axiosInstance from '../../API/api';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get('/admin/transactions')  
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
      render: (amount, record) => `${amount} ${record.currency}`,
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

  const TransactionDetails = ({ transaction }) => (
    <div className="">
      <Button 
        type="link" 
        onClick={() => setSelectedTransaction(null)}
        icon={<LeftOutlined />}
      >
        Back to all transactions
      </Button>

      <Card title="Transaction Overview" className="w-full">
        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Transaction ID">{transaction.transactionId}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(transaction.status)}>{transaction.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Amount">{transaction.amount} {transaction.currency}</Descriptions.Item>
          <Descriptions.Item label="Payment Method">{transaction.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label="Created At">{formatDate(transaction.createdAt)}</Descriptions.Item>
          <Descriptions.Item label="Updated At">{formatDate(transaction.updatedAt)}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="User Details" className="w-full">
        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Name">{transaction.user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{transaction.user.email}</Descriptions.Item>
          <Descriptions.Item label="Mobile">{transaction.user.mobile}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Cart Items" className="w-full">
        <Table 
          dataSource={transaction.metadata.cartItems}
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
              render: (price) => `${price} ${transaction.currency}`,
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
        <Card title="PhonePe Response" className="w-full">
          <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Merchant ID">
              {transaction.phonepeResponse.data.merchantId}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction ID">
              {transaction.phonepeResponse.data.transactionId}
            </Descriptions.Item>
            <Descriptions.Item label="State">
              {transaction.phonepeResponse.data.state}
            </Descriptions.Item>
            <Descriptions.Item label="Response Code">
              {transaction.phonepeResponse.data.responseCode}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-4">
            <h4 className="text-lg font-medium mb-4">Payment Instrument</h4>
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
              <Descriptions.Item label="Type">
                {transaction.phonepeResponse.data.paymentInstrument.type}
              </Descriptions.Item>
              <Descriptions.Item label="UTR">
                {transaction.phonepeResponse.data.paymentInstrument.utr}
              </Descriptions.Item>
              <Descriptions.Item label="UPI Transaction ID">
                {transaction.phonepeResponse.data.paymentInstrument.upiTransactionId}
              </Descriptions.Item>
              <Descriptions.Item label="Account Type">
                {transaction.phonepeResponse.data.paymentInstrument.accountType}
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
    <div >
        <br />
        <hr />
        <br />
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      
      {selectedTransaction ? (
        <TransactionDetails transaction={selectedTransaction} />
      ) : (
        <Card>
          <Table 
            columns={columns} 
            dataSource={transactions}
            rowKey="transactionId"
            scroll={{ x: true }}
          />
        </Card>
      )}
    </div>
  );
};

export default AdminTransactions;