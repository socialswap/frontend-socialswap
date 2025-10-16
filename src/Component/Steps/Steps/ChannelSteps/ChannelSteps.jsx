import React, { useState } from 'react';
import { Card, Radio, Space } from 'antd';
import { ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import PurchaseSteps from '../Steps';
import SellChannelSteps from '../SellChannel';

const ChannelTransactionSteps = () => {
  const [transactionType, setTransactionType] = useState('buy');

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
  };

  return (
    <Card style={{ maxWidth: 800, margin: '8rem auto' }} className='mt-40'>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Radio.Group
          onChange={handleTransactionTypeChange}
          value={transactionType}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Radio.Button value="buy" style={{ 
            backgroundColor: transactionType === 'buy' ? 'rgb(248, 55, 88)' : 'white',
            color: transactionType === 'buy' ? 'white' : 'rgb(248, 55, 88)',
            borderColor: 'rgb(248, 55, 88)'
          }}>
            <ShoppingCartOutlined /> Buy Channel
          </Radio.Button>
          <Radio.Button value="sell" style={{ 
            backgroundColor: transactionType === 'sell' ? 'rgb(248, 55, 88)' : 'white',
            color: transactionType === 'sell' ? 'white' : 'rgb(248, 55, 88)',
            borderColor: 'rgb(248, 55, 88)'
          }}>
            <DollarOutlined /> Sell Channel
          </Radio.Button>
        </Radio.Group>

        {transactionType === 'buy' ? <PurchaseSteps /> : <SellChannelSteps />}
      </Space>
    </Card>
  );
};

export default ChannelTransactionSteps;