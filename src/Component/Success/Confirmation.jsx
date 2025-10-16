import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCw, AlertCircle } from 'lucide-react';
import { api } from '../../API/api';
import { notification } from 'antd';

const POLLING_INTERVAL = 3000;
const MAX_RETRIES = 10;

const PaymentStatus = {
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILED: 'failed',
  ERROR: 'error',
};
const WHATSAPP_REDIRECT_DELAY = 3000; // 5 seconds

const formatWhatsAppMessage = (channelId, transactionId) => {
  const message = `Hey team SocialSwap. I have done payment for the channel with channel ID ${channelId} and transaction ID ${transactionId}. Help me further to login and get full access to the channel.`;
  return `https://wa.me/+919423523291?text=${encodeURIComponent(message)}`; // Replace with your actual WhatsApp number
};

const statusConfigs = {
  loading: {
    icon: () => <RotateCw className="h-12 w-12 text-blue-500 animate-spin" />,
    title: 'Processing Payment',
    description: 'Please wait while we confirm your payment...',
    containerClass: 'bg-blue-50 border-blue-200',
    titleClass: 'text-blue-800',
    descriptionClass: 'text-blue-600'
  },
  success: {
    icon: () => <CheckCircle className="h-12 w-12 text-green-500" />,
    title: 'Payment Successful',
    description: 'Thank you! Your payment has been processed successfully.',
    containerClass: 'bg-green-50 border-green-200',
    titleClass: 'text-green-800',
    descriptionClass: 'text-green-600'
  },
  failed: {
    icon: () => <XCircle className="h-12 w-12 text-red-500" />,
    title: 'Payment Failed',
    description: 'Sorry, your payment could not be processed. Please try again.',
    containerClass: 'bg-red-50 border-red-200',
    titleClass: 'text-red-800',
    descriptionClass: 'text-red-600'
  },
  error: {
    icon: () => <AlertCircle className="h-12 w-12 text-yellow-500" />,
    title: 'Status Check Failed',
    description: 'We could not verify your payment status. Please contact support if the issue persists.',
    containerClass: 'bg-yellow-50 border-yellow-200',
    titleClass: 'text-yellow-800',
    descriptionClass: 'text-yellow-600'
  }
};

const PaymentDetails = ({ details, status }) => {
  if (!details) return null;
  
  const paymentData = details.details?.data || {};
  const instrument = paymentData.paymentInstrument || {};

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-500">Transaction ID</span>
          <span className="font-medium text-gray-900">
            {paymentData.merchantTransactionId}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-500">Amount</span>
          <span className="font-medium text-gray-900">
            ₹{((paymentData.amount || 0) / 100).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-medium text-gray-900">
            {instrument.type || 'N/A'}
          </span>
        </div>
        {instrument.utr && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">UTR Number</span>
            <span className="font-medium text-gray-900">{instrument.utr}</span>
          </div>
        )}
        {instrument.upiTransactionId && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">UPI Transaction ID</span>
            <span className="font-medium text-gray-900">{instrument.upiTransactionId}</span>
          </div>
        )}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500">Status</span>
          <span className={`font-medium ${
            status === PaymentStatus.SUCCESS ? 'text-green-600' : 
            status === PaymentStatus.FAILED ? 'text-red-600' : 'text-gray-900'
          }`}>
            {details.details?.code || status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

const PaymentConfirmation = () => {
  const [status, setStatus] = useState(PaymentStatus.LOADING);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let pollingInterval;
    let isSubscribed = true;
    let redirectTimeout;

    const checkPaymentStatus = async () => {
      try {
        const transactionId = window.location.pathname.split('/').pop();
        
        const response = await fetch(`${api}/status/${transactionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!isSubscribed) return;

        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }

        const data = await response.json();
        
        if (data.success) {
          setPaymentDetails(data.data);
          const paymentStatus = data.data.details?.code === 'PAYMENT_SUCCESS' ? 'success' : 'failed';
          setStatus(paymentStatus);
          
          if (paymentStatus === 'success') {
            clearInterval(pollingInterval);
            notification.success({placement:'top',message:"Redirecting you to whatsapp for further process!"})
            // Set timeout for WhatsApp redirect
            redirectTimeout = setTimeout(() => {
              const channelId = data.data.channelId || 'N/A'; // Adjust based on your API response
              const transactionId = data.data.details?.data?.merchantTransactionId || 'N/A';
              window.location.href = formatWhatsAppMessage(channelId, transactionId);
            }, WHATSAPP_REDIRECT_DELAY);
          }
          
          if (paymentStatus === 'failed') {
            clearInterval(pollingInterval);
          }
        } else {
          throw new Error(data.message || 'Payment verification failed');
        }
      } catch (err) {
        setRetryCount(prev => prev + 1);
        
        if (retryCount >= MAX_RETRIES) {
          clearInterval(pollingInterval);
          setStatus(PaymentStatus.ERROR);
          setError(err.message);
        }
      }
    };

    pollingInterval = setInterval(checkPaymentStatus, POLLING_INTERVAL);
    checkPaymentStatus();

    return () => {
      isSubscribed = false;
      clearInterval(pollingInterval);
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [retryCount]);

  const currentStatus = statusConfigs[status];
  const Icon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className={`rounded-lg border p-6 ${currentStatus.containerClass}`}>
          <div className="flex flex-col items-center text-center space-y-4">
            <Icon />
            <h2 className={`text-xl font-semibold ${currentStatus.titleClass}`}>
              {currentStatus.title}
            </h2>
            <p className={currentStatus.descriptionClass}>
              {currentStatus.description}
            </p>
          </div>
        </div>

        {paymentDetails && (
          <PaymentDetails details={paymentDetails} status={status} />
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <h4 className="text-red-800 font-medium mb-1">Error</h4>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Back to Home
          </button>
          {status === PaymentStatus.FAILED && (
            <button
              onClick={() => window.location.href = '/checkout'}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation; 