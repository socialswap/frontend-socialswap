import React, { useState, useEffect } from 'react';
import { Typography, Empty, message, Skeleton, Card, Button, Popconfirm, Modal } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';
import {jwtDecode} from 'jwt-decode';

const { Title, Text } = Typography;

// Function to decode JWT and extract user information
const decodeToken = () => {
  // Retrieve the JWT token from localStorage (or wherever it is stored)
  const token = localStorage.getItem('token'); 

  if (!token) {
    console.error('No token found in localStorage');
    return null; // If token doesn't exist
  }

  try {
    // Decode the token to access its payload (user data, etc.)
    const decoded = jwtDecode(token); 
    console.log('Decoded token:', decoded);

    // You can now access the decoded data, e.g., userId, roles, etc.
    const userId = decoded._id; // Assuming the user ID is in the payload
    return { decoded, userId };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// Example usage
const decodedData = decodeToken();
if (decodedData) {
  console.log('User ID from decoded token:', decodedData.userId);
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get('/cart');
        console.log(response);
        
        setCartItems(response.data.channels);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        message.error('Failed to load cart items.');
      } finally{
        setLoading(false);

      }
    };
    fetchCartItems();
    
  }, []);

  const removeFromCart = async (itemToRemove) => {
    try {
      await axiosInstance.delete(`/cart/remove/${itemToRemove._id}`);
      const updatedCart = cartItems.filter(item => item?._id !== itemToRemove?._id);
      setCartItems(updatedCart);
      message.success(`${itemToRemove.name} has been removed from your cart.`);
    } catch (error) {
      console.error('Error removing item:', error);
      message.error('Failed to remove item from cart.');
    }
  };

  const getTotalValue = () => {
    return cartItems?.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 1), 0);
  };

  const initiatePayment = async () => {
    const totalAmount = getTotalValue();
    
    if (totalAmount <= 0) {
      message.error('Cart is empty or total amount is invalid.');
      return;
    }
  
    setPaymentLoading(true);
  
    try {
      const user = decodeToken()
      // Create payment order with cart items
      const paymentResponse = await axiosInstance.post(`${api}/create-order`, { 
        amount: totalAmount,
        cartItems: cartItems.map(item => ({
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          
        })),
        user:decodeToken()?.decoded
      });
      
      if (paymentResponse.data.success) {
        const { data } = paymentResponse.data;
        
        // Store transaction details in local storage
        localStorage.setItem('currentTransaction', JSON.stringify({
          transactionId: data.transactionId,
          amount: totalAmount,
          cartItems: cartItems
        }));
  
        // Redirect to PhonePe payment page
        if (data.data.instrumentResponse?.redirectInfo?.url) {
          window.location.href = data.data.instrumentResponse.redirectInfo.url;
        } else {
          message.error('No redirect URL found. Payment initialization failed.');
        }
      } else {
        message.error('Failed to create payment order.');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      message.error('An error occurred while processing payment.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
  //       <Skeleton active />
  //     </div>
  //   );
  // }

  console.log(cartItems);
  
  return (
    <div style={{ maxWidth: '1200px', margin: '5rem auto', padding: '20px' }}>
      <Title level={2} style={{ marginBottom: '24px', textAlign: 'center' }}>Your Shopping Cart</Title>
      {cartItems.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              Your cart is empty. <Link to="/buy">Continue shopping</Link>
            </span>
          }
        />
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {cartItems.map(item => (
              <Card
                key={item._id}
                onClick={() => navigate(`/channel/${item?._id}`)}
                hoverable
                style={{ width: 300, marginBottom: '16px' }}
                cover={<img alt={item?.name} src={item?.bannerUrl || '/images/yt3.png'} style={{ height: 200, objectFit: 'cover' }} />}
                actions={[
                  <Popconfirm
                    title={`Are you sure you want to remove ${item.name}?`}
                    onConfirm={() => removeFromCart(item)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon={<DeleteOutlined />} danger>Remove</Button>
                  </Popconfirm>
                ]}
              >
                <Card.Meta
                  title={item?.name}
                  description={
                    <>
                      <Text>Category: {item?.category}</Text>
                      <br />
                      <Text>Price: ₹{item?.price}</Text>
                      <br />
                      <Text>Subtotal: ₹{item?.price * (item?.quantity || 1)}</Text>
                    </>
                  }
                />
              </Card>
            ))}
          </div>
          <Card style={{ marginTop: '24px',width:'55%', textAlign: 'center', margin:'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={3}>Total Value:</Title>
              <Title level={3}>₹{getTotalValue().toFixed(2)}</Title>
            </div>
            <Button 
              type="primary" 
              icon={<ShoppingCartOutlined />} 
              size="large" 
              block 
              onClick={initiatePayment}
              loading={paymentLoading}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </>
      )}
    </div>
  );
};

export default CartPage;