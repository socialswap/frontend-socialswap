import React from 'react';
import Routes  from './Routing/Routes';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Header from './Component/Header/Header';
import MobileFooter from './Component/Header/MobileFooter';
import { WhatsappIcon } from 'react-share';
import Footer from './Component/Footer/Footer';

const AppContent = () => {
  const location = useLocation();
  const isBlogPage = location.pathname.startsWith('/blogs');

  const handleMakeOffer = () => {
    const message = encodeURIComponent(`Hello, I'm interested in buying the YouTube channel. Can we discuss the details?`);
    const whatsappUrl = `https://wa.me/+919423523291?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Header/>
      <Routes/>
      <MobileFooter/>
      <WhatsappIcon onClick={handleMakeOffer} size={40} round style={{position:'fixed',bottom:'2rem',right:'2rem', cursor:'pointer' }}/>
      {!isBlogPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
   <Router>
     <AppContent />
   </Router>
  );
}

export default App;
