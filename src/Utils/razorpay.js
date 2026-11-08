import { message } from 'antd';
import axiosInstance, { api } from '../API/api';

const CHECKOUT_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

let scriptPromise = null;

// Loaded on demand so buyers who never pay don't download it.
const loadCheckoutScript = () => {
  if (window.Razorpay) return Promise.resolve();

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = CHECKOUT_SCRIPT_URL;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => {
        script.remove();
        scriptPromise = null;
        reject(new Error('Could not load Razorpay Checkout'));
      };
      document.body.appendChild(script);
    });
  }

  return scriptPromise;
};

/**
 * Opens Razorpay Checkout for an order returned by POST /create-order.
 * After a successful payment it moves to the confirmation page, and that page
 * confirms the final status with the backend. The promise resolves if the
 * buyer closes the popup without paying.
 */
export const openRazorpayCheckout = async (order, { description = 'SocialSwap purchase' } = {}) => {
  await loadCheckoutScript();

  return new Promise((resolve) => {
    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: 'SocialSwap',
      description,
      image: `${window.location.origin}/images/fav.jpg`,
      prefill: order.prefill,
      theme: { color: '#7C3AED' },
      modal: { ondismiss: () => resolve() },
      handler: async (response) => {
        try {
          await axiosInstance.post(`${api}/verify-payment`, {
            transactionId: order.transactionId,
            ...response,
          });
        } catch (error) {
          // The confirmation page re-checks with Razorpay, so a failed call here
          // can't lose a payment. Only a rejected signature is shown as an error.
          console.error('Payment verification request failed:', error);
          if (error.response?.status === 400) {
            message.error('We could not verify this payment. Please contact support.');
          }
        }
        window.location.href = `/confirmation/${order.transactionId}`;
      },
    });

    checkout.on('payment.failed', (response) => {
      // Checkout stays open and lets the buyer retry.
      console.error('Razorpay payment failed:', response?.error?.description);
    });

    checkout.open();
  });
};
