import React, { useEffect, useState } from 'react';
import axiosInstance from '../../API/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    axiosInstance.get('/cart')
      .then(res => { if (mounted) setCartItems(res?.data || []); })
      .catch(err => { console.warn('Cart fetch failed (stub):', err?.message || err); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading cart...</div>;

  return (
    <div style={{ padding: 12 }}>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item?.id || Math.random()}>
              {item?.name || 'Unnamed item'} — ${item?.price ?? 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
