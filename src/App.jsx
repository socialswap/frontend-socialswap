import React from 'react';
import Routes  from './Routing/Routes';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Component/Header/Header';
import './App.scss'
import MobileFooter from './Component/Header/MobileFooter';
import { WhatsappIcon } from 'react-share';

const App = () => {
  const handleMakeOffer = () => {
    const message = encodeURIComponent(`Hello, I'm interested in buying the YouTube channel. Can we discuss the details?`);
    const whatsappUrl = `https://wa.me/+919423523291?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Router>
      <Header />
      <Routes />
      <MobileFooter />
      {/* fixed WhatsappIcon usage: proper style object and valid JSX */}
      <div
        onClick={handleMakeOffer}
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', cursor: 'pointer', zIndex: 9999 }}
        aria-hidden="true"
      >
        <WhatsappIcon size={40} round />
      </div>
    </Router>
  );
};

export default App;
