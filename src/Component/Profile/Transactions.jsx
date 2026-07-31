import React, { useState, useEffect } from 'react';
import { Card, Tag, Space, Typography, Spin, Empty, message, Button, Tabs } from 'antd';
import { SyncOutlined, WhatsAppOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import { api } from '../../API/api';
import moment from 'moment';
import SEOHead from '../SEO/SEOHead';

const { Text, Title } = Typography;

const StyledTransactionCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 12px;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  
  .ant-typography, .ant-space-item {
    color: var(--text-primary) !important;
  }
  .ant-typography-secondary {
    color: var(--text-secondary) !important;
  }
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
  border-top: 1px solid var(--border);
`;

const StyledTabsContainer = styled.div`
  .ant-tabs-tab {
    color: var(--text-secondary) !important;
  }
  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--primary) !important;
    text-shadow: 0 0 0.25px currentcolor;
  }
  .ant-tabs-ink-bar {
    background: var(--primary) !important;
  }
`;

const RefreshButton = styled(Button)`
  padding: 4px 8px;
  height: auto;
  font-size: 12px;
`;

const DealsList = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${api}/deals`, {
        headers: { 'x-auth-token': token }
      });
      setDeals(response.data.deals);
    } catch (error) {
      message.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    accepted: 'success',
    pending: 'processing',
    rejected: 'error'
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {deals.length === 0 ? (
        <Empty description="No deals found" />
      ) : (
        deals.map(deal => (
          <StyledTransactionCard key={deal._id}>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Space justify="space-between" style={{ width: '100%' }}>
                <Text strong>Deal ID: {deal._id}</Text>
                <Space>
                  <Tag color={statusColors[deal.status] || 'default'}>{deal.status?.toUpperCase()}</Tag>
                  <Tag color={deal.payment === 'paid' ? 'success' : 'warning'}>
                    PAYMENT: {deal.payment?.toUpperCase()}
                  </Tag>
                </Space>
              </Space>
              <Space justify="space-between" style={{ width: '100%' }}>
                <TransactionAmount status={deal.payment === 'paid' ? 'SUCCESS' : 'PENDING'}>
                  ₹{deal.dealPrice?.toFixed(2)}
                </TransactionAmount>
                <Text type="secondary">
                  {moment(deal.createdAt).format('MMM DD, YYYY HH:mm')}
                </Text>
              </Space>
              <CartItemsContainer>
                <Text strong>Channel: </Text>
                <Text>{deal.channel?.name || 'N/A'}</Text>
                <br />
                <Text type="secondary">Seller: {deal.seller?.name || 'N/A'} | Buyer: {deal.buyer?.name || 'N/A'}</Text>
              </CartItemsContainer>
            </Space>
          </StyledTransactionCard>
        ))
      )}
    </div>
  );
};

const TransactionsList = () => {
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {transactions.length === 0 ? (
        <Empty description="No transactions found" />
      ) : (
        transactions.map(transaction => renderTransactionCard(transaction))
      )}
    </div>
  );
};

const TransactionsPanel = () => {
  const handleWhatsAppSupport = () => {
    const whatsappNumber = '+919423523291';
    window.open(`https://wa.me/${whatsappNumber}?text=Hi, I need help with my deals/transactions`, '_blank');
  };

  const tabItems = [
    {
      key: 'deals',
      label: 'My Deals',
      children: <DealsList />
    },
    {
      key: 'transactions',
      label: 'Transaction History',
      children: <TransactionsList />
    }
  ];

  return (
    <div style={{ padding: '20px', margin: '4rem 0' }}>
      <SEOHead title="Transactions | SocialSwap" noIndex={true} />
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Title level={4} style={{ color: 'var(--text-primary)', margin: 0 }}>My Activity</Title>
        <Button 
          type="primary" 
          icon={<WhatsAppOutlined />}
          onClick={handleWhatsAppSupport}
          style={{ background: 'var(--btn-gradient)', border: 'none' }}
        >
          Need Help?
        </Button>
      </Space>
      
      <StyledTabsContainer>
        <Tabs defaultActiveKey="deals" items={tabItems} />
      </StyledTabsContainer>
    </div>
  );
};

export default TransactionsPanel;   