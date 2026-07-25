import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    key: '1',
    question: 'How does the buying and selling process work?',
    answer: "SocialSwap acts as a secure escrow. The buyer sends funds to us, the seller transfers the channel ownership, and once the buyer verifies access and control, we release the funds to the seller.",
  },
  {
    key: '2',
    question: 'Are the channels genuine and monetized?',
    answer: "Yes, every channel undergoes a rigorous verification process by our expert team to ensure organic growth, authentic engagement, and active monetization status before it is listed.",
  },
  {
    key: '3',
    question: 'Is there a fee or commission?',
    answer: "We charge a platform fee to cover the secure escrow service, channel verification, and dedicated support, ensuring a completely safe transaction for both parties.",
  },
  {
    key: '4',
    question: 'How do I transfer ownership of a YouTube channel?',
    answer: "Once a deal is secured, the seller invites the buyer as a Primary Owner in YouTube Studio. After a 7-day wait period mandated by YouTube, the buyer can safely remove the seller from the channel.",
  },
  {
    key: '5',
    question: 'Can I negotiate the price with the seller?',
    answer: "Yes! Buyers can submit offers directly on listings. Sellers can choose to accept, reject, or counter your offer through our secure messaging system.",
  },
  {
    key: '6',
    question: 'What happens if a channel gets demonetized right after purchase?',
    answer: "We guarantee that the channel meets all monetization policies at the time of transfer. Post-transfer, it is the buyer's responsibility to adhere to YouTube's guidelines, but our support team is available for guidance.",
  },
];

const FAQSection = () => {
  const [openKey, setOpenKey] = useState(null);

  const handleToggle = (key) => {
    setOpenKey(prev => (prev === key ? null : key));
  };

  return (
    <section className="py-12 md:py-24 bg-transparent flex justify-center w-full">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex flex-col md:flex-row border border-white/40 dark:border-white/10 rounded-card overflow-hidden bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[20px] shadow-card">
          
          {/* Left Column (Header) */}
          <div className="md:w-[35%] p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/30 dark:border-white/10 flex flex-col justify-start bg-white/20 dark:bg-white/[0.02]">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight tracking-tight sticky top-8">
              Frequently<br className="hidden md:block" />
              <span className="md:hidden"> </span>Asked<br className="hidden md:block" />
              <span className="md:hidden"> </span>Questions
            </h2>
          </div>

          {/* Right Column (Questions) */}
          <div className="md:w-[65%] flex flex-col bg-transparent">
            {faqs.map((faq, index) => {
              const isOpen = openKey === faq.key;
              return (
                <div 
                  key={faq.key} 
                  className={`border-white/30 dark:border-white/10 ${index !== faqs.length - 1 ? 'border-b' : ''}`}
                >
                  <button
                    onClick={() => handleToggle(faq.key)}
                    className="w-full flex items-center justify-between p-6 md:px-8 md:py-7 text-left hover:bg-white/40 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <span className="text-[16px] md:text-[17px] font-semibold text-text-primary group-hover:text-purple-primary transition-colors pr-4">
                      {faq.question}
                    </span>
                    <motion.svg 
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className={`w-5 h-5 transition-colors flex-shrink-0 ${isOpen ? 'text-purple-primary' : 'text-text-secondary group-hover:text-purple-primary'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-6 md:pb-7 pt-0 text-[15px] md:text-[16px] text-text-secondary leading-relaxed max-w-[95%] font-normal">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;
