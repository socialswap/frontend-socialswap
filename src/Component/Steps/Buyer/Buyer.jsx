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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const accordionVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    },
    exit: { height: 0, opacity: 0, transition: { duration: 0.2 } },
  };

  const getStepId = (index) => `step${index + 1}`;

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
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          {/* <div className="h-7 w-7 rounded-sm bg-gradient-to-br from-[#ef4444] to-[#dc2626] shadow-sm"></div> */}
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Our Process
          </h2>
        </div>
        <div className="mx-auto mb-10 h-1.5 w-28 rounded-full bg-[#ef4444]/80"></div>
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 rounded-l-full font-medium border ${
              selectedCategory === 'buyers'
                ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white border-transparent'
                : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
            } transition-colors duration-300 shadow-sm`}
            onClick={() => handleCategoryChange('buyers')}
          >
            FOR BUYERS
          </button>
          <button
            className={`px-6 py-2 rounded-r-full font-medium border ${
              selectedCategory === 'sellers'
                ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white border-transparent'
                : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
            } transition-colors duration-300 shadow-sm`}
            onClick={() => handleCategoryChange('sellers')}
          >
            FOR SELLERS
          </button>
        </div>
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="pointer-events-none absolute left-5 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-[#fb7185]/70 via-[#f43f5e]/50 to-[#fda4af]/40" />
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
          {steps[selectedCategory].map((step, index) => {
            const id = getStepId(index);
            const open = isOpen[id];
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative pl-10 bg-white rounded-xl border overflow-hidden transition-all ${
                  open
                    ? 'shadow-lg border-[#fb7185]/30 translate-x-0.5 ring-1 ring-[#fb7185]/30'
                    : 'shadow-sm border-gray-200 hover:shadow-md'
                }`}
              >
                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0.6 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  animate={open ? { scale: 1.15, boxShadow: '0 0 0 6px rgba(251, 113, 133, 0.18)' } : { scale: 1, boxShadow: '0 0 0 0 rgba(0,0,0,0)' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  viewport={{ once: false, amount: 0.4 }}
                  className="absolute left-[13px] top-5 h-3 w-3 rounded-full bg-[#f43f5e] ring-4 ring-white"
                />
                <motion.button
                  className="w-full text-left px-6 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f43f5e] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  onClick={() => toggleStep(id)}
                  aria-expanded={open}
                  aria-controls={`${id}-content`}
                  whileTap={{ scale: 0.995 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#fb7185]/10 text-[#dc2626] font-semibold">
                        {index + 1}
                      </div>
                      <h3 className="text-[17px] font-semibold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <svg
                      className={`mt-0.5 w-6 h-6 text-gray-500 transition-transform duration-300 ${
                        open ? 'rotate-180 text-[#f43f5e]' : 'group-hover:text-gray-700'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </motion.button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key={`${id}-content`}
                      id={`${id}-content`}
                      variants={accordionVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="exit"
                      className="px-6 pb-5"
                    >
                      <p className="text-gray-700 leading-relaxed">
                        {step.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Process;