import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:translate-y-[-20px] duration-100 w-[75%] m-auto">
    <div className="text-center mb-4">
      <div className="w-16 h-16 mx-auto text-[#F83758]">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-semibold text-center mb-2 text-[#333]">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const WhySocialSwap = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Verified Listings",
      description: "At SocialSwap, we take the authenticity and reliability of the properties we list for sale seriously. Our team thoroughly examines and verifies all YouTube channels before they are made available on our marketplace."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Safe & Secure Deals",
      description: "For us, the trust of our customers is our utmost priority and we take it very seriously. We use all possible means to make each and every deal smooth and fully secured for both the buyer and seller."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Easy Process",
      description: "At SocialSwap, we make the process of buying and selling as seamless as possible. Our user-friendly platform and dedicated support team are always on hand to assist you every step of the way."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Free Valuation",
      description: "Maximize the value of your channel with the help of our expert team. With years of experience and expertise, our team is dedicated to providing you with the best possible valuation of your channel. We consider all important factors while evaluating your channel."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: "Proven Track Record",
      description: "Experience the power of a proven platform. With over 2000 content creators having already made successful deals on our marketplace, you can trust that our platform has a solid track record of facilitating safe and secure transactions."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "Help Desk",
      description: "Our expert customer support team is dedicated to helping you navigate the buying and selling process. Available to assist you with any queries, our team is committed to providing you with the best possible service by making your journey smoother."
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why SocialSwap?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default WhySocialSwap;
