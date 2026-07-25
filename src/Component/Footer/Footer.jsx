import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/blogs' || location.pathname === '/blogs/') {
    return null;
  }

  const handleMakeOffer = () => {
    const message = encodeURIComponent(
      `Hello, I'm interested in buying the YouTube channel. Can we discuss the details?`
    );
    const whatsappUrl = `https://wa.me/+919423523291?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const socialLinks = [
    { href: 'https://youtube.com/@shubhzlord?si=BiP10uT0YN3Zm0nq', Icon: FaYoutube, label: 'YouTube' },
    { href: 'https://www.instagram.com/socialswap.in?igsh=ZDhwNWtpczNjcDlp&utm_source=qr', Icon: FaInstagram, label: 'Instagram' },
    { href: 'https://wa.me/919423523291', Icon: FaWhatsapp, label: 'WhatsApp' },
    { href: 'https://twitter.com', Icon: FaXTwitter, label: 'X (Twitter)' },
  ];

  return (
    <footer className="bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[20px] text-text-secondary py-16 text-[13px] md:text-sm font-sans border-t border-white/40 dark:border-white/10 shadow-card relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Column 1: COMPANY */}
          <div>
            <h4 className="text-text-primary font-extrabold tracking-wider uppercase mb-6 text-[15px]">Company</h4>
            <ul className="space-y-2.5">
              <li className="flex justify-between items-center max-w-[200px]">
                <Link to="/about" className="hover:text-purple-primary transition-colors font-medium">About Us</Link>
                <span className="text-text-secondary/40 font-mono text-xs">......</span>
              </li>
              <li className="flex justify-between items-center max-w-[200px]">
                <button onClick={handleMakeOffer} className="hover:text-purple-primary transition-colors uppercase text-left font-medium cursor-pointer">Contact</button>
                <span className="text-text-secondary/40 font-mono text-xs">......</span>
              </li>
              <li className="flex justify-between items-center max-w-[200px]">
                <Link to="/privacy-policy" className="hover:text-purple-primary transition-colors font-medium">Privacy Policy</Link>
                <span className="text-text-secondary/40 font-mono text-xs">......</span>
              </li>
              <li className="flex justify-between items-center max-w-[200px]">
                <Link to="/terms-and-conditions" className="hover:text-purple-primary transition-colors font-medium">Terms</Link>
                <span className="text-text-secondary/40 font-mono text-xs">......</span>
              </li>
              <li className="flex justify-between items-center max-w-[200px]">
                <Link to="/refund-policy" className="hover:text-purple-primary transition-colors font-medium">Refund Policy</Link>
                <span className="text-text-secondary/40 font-mono text-xs">......</span>
              </li>
            </ul>
          </div>

          {/* Column 2: LOCATIONS */}
          <div>
            <h4 className="text-text-primary font-extrabold tracking-wider uppercase mb-6 text-[15px]">Locations</h4>
            <div className="space-y-5">
              <div>
                <p className="text-text-primary font-bold mb-1">Head Office:</p>
                <p className="text-text-secondary">Baner, Pune</p>
                <p className="text-text-secondary">Maharashtra, India</p>
              </div>
              <div>
                <p className="text-text-primary font-bold mb-1">Support:</p>
                <p className="text-text-secondary">Available Online</p>
                <p className="text-text-secondary">24/7 Assistance</p>
              </div>
            </div>
          </div>

          {/* Column 3: MENU */}
          <div>
            <h4 className="text-text-primary font-extrabold tracking-wider uppercase mb-6 text-[15px]">Menu</h4>
            <ul className="space-y-3 font-semibold">
              <li><Link to="/" className="text-text-primary hover:text-purple-primary transition-colors underline decoration-purple-primary/40 underline-offset-4">Home</Link></li>
              <li><Link to="/channels" className="text-text-primary hover:text-purple-primary transition-colors underline decoration-purple-primary/40 underline-offset-4">All Channels</Link></li>
              <li><Link to="/user/upload-channel" className="text-text-primary hover:text-purple-primary transition-colors underline decoration-purple-primary/40 underline-offset-4">Sell Channel</Link></li>
              <li><Link to="/how-to" className="text-text-primary hover:text-purple-primary transition-colors underline decoration-purple-primary/40 underline-offset-4">How To</Link></li>
              <li><Link to="/grow" className="text-text-primary hover:text-purple-primary transition-colors underline decoration-purple-primary/40 underline-offset-4">Grow Channels</Link></li>
            </ul>
          </div>

          {/* Column 4: CONTACT */}
          <div>
            <h4 className="text-text-primary font-extrabold tracking-wider uppercase mb-6 text-[15px]">Contact</h4>
            <div className="space-y-4">
              <p><span className="font-bold text-text-primary">PHONE:</span> +91 9423523291</p>
              <p><span className="font-bold text-text-primary">E-MAIL:</span> support@socialswap.in</p>
              
              <div className="pt-3">
                <p className="font-bold text-text-primary uppercase tracking-wider mb-3">On Social Media:</p>
                <div className="flex gap-2.5">
                  {socialLinks.map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10 text-text-primary hover:bg-btn-gradient hover:text-white transition-all rounded-xl w-9 h-9 flex items-center justify-center shadow-sm hover:scale-110"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="text-center pt-8 border-t border-white/20 dark:border-white/10">
          <h2 className="text-xl md:text-2xl font-extrabold text-text-primary mb-2 tracking-tight">SocialSwap</h2>
          <p className="text-text-secondary text-xs md:text-sm">
            © 2026 SocialSwap. Built for creators, powered by trust.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;