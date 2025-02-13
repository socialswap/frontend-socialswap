import React, { useState, useEffect } from 'react';
import { Card, Tag, Space, Typography, Spin, Empty, message, Button, Modal } from 'antd';
import { SyncOutlined, WhatsAppOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import { api } from '../../API/api';
import moment from 'moment';

const { Text, Title } = Typography;

const StyledTransactionCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const TransactionAmount = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.status === 'SUCCESS' ? '#52c41a' : 
    props.status === 'FAILED' ? '#f5222d' : '#1890ff'};
`;

const CartItemsContainer = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const RefreshButton = styled(Button)`
  padding: 4px 8px;
  height: auto;
  font-size: 12px;
`;

const TransactionsPanel = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${api}/transactions`, {
        headers: { 'x-auth-token': token }
      });
      setTransactions(response.data.data);
    } catch (error) {
      message.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusRefresh = async (transactionId) => {
    try {
      setRefreshing(prev => ({ ...prev, [transactionId]: true }));
      const token = localStorage.getItem('token');
      const response = await axios.get(`${api}/status/${transactionId}`, {
        headers: { 'x-auth-token': token }
      });
      
      if (response.data.success) {
        // Update the specific transaction in the list
        setTransactions(prevTransactions => 
          prevTransactions.map(transaction => 
            transaction.transactionId === transactionId 
              ? { ...transaction, status: response.data.data.status }
              : transaction
          )
        );
        message.success('Status updated successfully');
      }
    } catch (error) {
      message.error('Failed to refresh status');
    } finally {
      setRefreshing(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  const handleWhatsAppSupport = () => {
    // Replace with your actual WhatsApp business number
    const whatsappNumber = '+919423523291'; // Format: country code + number
    window.open(`https://wa.me/${whatsappNumber}?text=Hi, I need help with my transaction`, '_blank');
  };

  const statusColors = {
    SUCCESS: 'success',
    FAILED: 'error',
    PENDING: 'processing',
    INITIATED: 'warning'
  };

  const renderTransactionCard = (transaction) => (
    <StyledTransactionCard key={transaction.transactionId}>
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Space justify="space-between" style={{ width: '100%' }}>
          <Text strong>Transaction ID: {transaction.transactionId}</Text>
          <Space>
            <Tag color={statusColors[transaction.status]}>
              {transaction.status}
            </Tag>
            {['PENDING', 'INITIATED'].includes(transaction.status) && (
              <RefreshButton 
                type="link" 
                icon={<SyncOutlined spin={refreshing[transaction.transactionId]} />}
                onClick={() => handleStatusRefresh(transaction.transactionId)}
                loading={refreshing[transaction.transactionId]}
              >
                Refresh Status
              </RefreshButton>
            )}
          </Space>
        </Space>
        
        <Space justify="space-between" style={{ width: '100%' }}>
          <TransactionAmount status={transaction.status}>
            ₹{transaction.amount.toFixed(2)}
          </TransactionAmount>
          <Text type="secondary">
            {moment(transaction.createdAt).format('MMM DD, YYYY HH:mm')}
          </Text>
        </Space>

        {transaction.cartItems && transaction.cartItems.length > 0 && (
          <CartItemsContainer>
            <Text strong>Items:</Text>
            {transaction.cartItems.map((item, index) => (
              <div key={index} style={{ marginTop: 8 }}>
                <Text>{item.name} x {item.quantity}</Text>
                <Text type="secondary" style={{ float: 'right' }}>
                  ₹{item.price}
                </Text>
              </div>
            ))}
          </CartItemsContainer>
        )}
      </Space>
    </StyledTransactionCard>
  );

  // Update the menuItems array for WhatsApp support
  const menuItems = [
    // ... other menu items ...
    {
      title: 'Help & Support',
      icon: <WhatsAppOutlined style={{ color: '#25D366' }} />,
      onClick: handleWhatsAppSupport
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px',margin:'4rem 0' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Title level={4}>Transaction History</Title>
        <Button 
          type="primary" 
          icon={<WhatsAppOutlined />}
          onClick={handleWhatsAppSupport}
        >
          Need Help?
        </Button>
      </Space>
      
      {transactions.length === 0 ? (
        <Empty description="No transactions found" />
      ) : (
        transactions.map(transaction => renderTransactionCard(transaction))
      )}
    </div>
  );
};

export default TransactionsPanel;   