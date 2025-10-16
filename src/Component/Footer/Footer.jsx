import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaPinterestP, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const handleMakeOffer = () => {
    const message = encodeURIComponent(`Hello, I'm interested in buying the YouTube channel. Can we discuss the details?`);
    const whatsappUrl = `https://wa.me/+919423523291?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };
  return (
    <footer className="bg-gray-100 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 hover:text-blue-600 transition-colors">
                SocialSwap
              </h2>
            </Link>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <FaMapMarkerAlt className="flex-shrink-0" />
                <p>Baner, Pune</p>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FaPhone className="flex-shrink-0" />
                <p>+91 9423523291</p>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FaEnvelope className="flex-shrink-0" />
                <div>
                  <p>4spalkarbusiness@gmail.com</p>
                  <p>shubham@socialswap.in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">COMPANY</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</Link>
              </li>
              <li>
                <div onClick={handleMakeOffer} className="text-gray-600 hover:text-blue-600 transition-colors">Contact</div>
              </li>
              <li>
                {/* <Link to="/shipping-return" className="text-gray-600 hover:text-blue-600 transition-colors">Shipping & Return</Link> */}
              </li>
              <li>
                {/* <Link to="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</Link> */}
              </li>
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">INFORMATION</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">My Account</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-blue-600 transition-colors">My Cart</Link>
              </li>
              <li>
                {/* <Link to="/wishlist" className="text-gray-600 hover:text-blue-600 transition-colors">Wishlist</Link> */}
              </li>
              
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/channels" className="text-gray-600 hover:text-blue-600 transition-colors">All Channels</Link>
              </li>
              <li>
                <Link to="/seller-dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Sell Channel</Link>
              </li>
              <li>
                <Link to="/how-to" className="text-gray-600 hover:text-blue-600 transition-colors">How To</Link>
              </li>
              <li>
                <Link to="/grow" className="text-gray-600 hover:text-blue-600 transition-colors">Grow Your Channels</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">&copy; Shubham Palkar {new Date().getFullYear()}</p>
            
            {/* Social Media Links */}
            <div className="flex space-x-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterestP className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;