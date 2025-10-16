import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessful = ({ 
  onBackToHome = () => {} 
}) => {

    const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden text-center p-8">
        <div className="flex items-center justify-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful
        </h2>

        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully.
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={()=>navigate('/')} 
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessful;