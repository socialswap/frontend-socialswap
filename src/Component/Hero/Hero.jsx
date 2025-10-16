import React from 'react';
// import youtubeImage from './youtube-image.png'; // Add your YouTube-related image

const Hero = () => (
  <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-12 bg-cyan-600 text-white">
    <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        The Most Trusted Platform to
        <br className="hidden md:inline" />
        <span className="text-slate-800">Buy & Sell</span> Established
        <br className="hidden md:inline" />
        Youtube Channel
      </h1>
      <div className="space-y-4 md:space-y-0 md:space-x-4">
        <button className="w-full md:w-auto bg-slate-50 text-black px-6 py-2 rounded mb-4 md:mb-0">BUY CHANNEL</button>
        <button className="w-full md:w-auto bg-slate-50 text-black px-6 py-2 rounded">SELL CHANNEL</button>
      </div>
    </div>
    <div className="w-full md:w-1/2 mt-8 md:mt-0">
      <img src='images/hero.png' alt="YouTube Channel Illustration" className="w-full max-w-md mx-auto md:max-w-full" />
    </div>
  </div>
);

export default Hero;