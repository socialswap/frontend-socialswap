import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Process = () => {
  const [isOpen, setIsOpen] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
    step7: false,
  });

  const [selectedCategory, setSelectedCategory] = useState('buyers');

  const toggleStep = (step) => {
    setIsOpen({ ...isOpen, [step]: !isOpen[step] });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsOpen({
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false,
      step6: false,
      step7: false,
    });
  };

  const steps = {
    buyers: [
      { title: "Browse and Select Channels", content: "Explore the available YouTube channels on our website. Click on 'Add to Cart' for each channel you wish to purchase." },
      { title: "Review Your Cart", content: "Navigate to your cart by clicking the cart icon in the top-right corner of the website. Ensure all selected channels are listed correctly." },
      { title: "Proceed to Checkout", content: "Click on the 'Buy' button to initiate the checkout process." },
      { title: "Choose Payment Method", content: "You will be directed to the payment gateway. We offer a variety of payment options including UPI QR Code, PayPal, Binance, and Credit/Debit Card." },
      { title: "Receive Access Details", content: "Once your payment is successful, you will receive an email containing the unique email ID and password for the channel." },
      { title: "Channel Transfer Process", content: "You will see a sticker on the confirmation page with the message: 'We are redirecting you to our official dealer for the channel transfer process.' Click on the 'Go' button in the sticker." },
      { title: "Contact Us on WhatsApp", content: "After being redirected, you will receive an auto-generated message on WhatsApp. Respond with the provided template message including your channel ID and transaction ID." },
    ],
    sellers: [
      { title: "Submit the Form", content: "Click the 'Submit' button to send your completed form to us." },
      { title: "Receive Auto-Generated Message", content: "After submitting the form, you will receive an auto-generated message with your channel ID." },
      { title: "Copy the Auto-Generated Message", content: "Copy the text of the auto-generated message for your reference." },
      { title: "Proceed to Our Channel Dealers", content: "Click the 'Continue' button, which will redirect you to our official channel dealers page." },
      { title: "Paste the Auto-Generated Message", content: "On the official channel dealers page, paste the auto-generated message you copied earlier." },
      { title: "We'll Take It From Here", content: "Once you've pasted the message, our team will handle the rest of the process manually and guide you through the next steps." },
    ],
  };

  return (
    <div className="bg- py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Process</h2>
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 rounded-l-full font-medium br  ${
              selectedCategory === 'buyers' ? 'bg-[#333] text-white' : 'bg-white text-gray-700'
            } transition-colors duration-300`}
            onClick={() => handleCategoryChange('buyers')}
          >
            FOR BUYERS
          </button>
          <button
            className={`px-6 py-2 rounded-r-full font-medium ${
              selectedCategory === 'sellers' ? 'bg-[#333] text-white' : 'bg-white text-gray-700'
            } transition-colors duration-300`}
            onClick={() => handleCategoryChange('sellers')}
          >
            FOR SELLERS
          </button>
        </div>
        <div className="space-y-4">
          {steps[selectedCategory].map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 focus:outline-none"
                onClick={() => toggleStep(`step${index + 1}`)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Step {index + 1}: {step.title}
                  </h3>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      isOpen[`step${index + 1}`] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <AnimatePresence>
                {isOpen[`step${index + 1}`] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600">{step.content}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Process;