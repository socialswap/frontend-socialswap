import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import axiosInstance from '../../API/api';

const MobileFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check login status and fetch counts
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    const fetchCounts = async () => {
      if (isLoggedIn) {
        // Fetch cart count from your API
        try {
          const response = await axiosInstance.get('/cart');
          setCartCount(response.data.channelCount);
          setWishlistCount(3);
        } catch (error) {
          console.error('Error fetching cart count:', error);
        }
        // Set wishlist count (update this with your actual API call)
      } else {
        setCartCount(0);
        setWishlistCount(0);
      }
    };

    checkLoginStatus();
    fetchCounts();
  }, [isLoggedIn, location.pathname]);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid, label: 'Channels', path: '/channels' },
    // { 
    //   icon: Heart, 
    //   label: 'Wishlist', 
    //   path: '/wishlist', 
    //   badge: wishlistCount,
    //   requiresAuth: true 
    // },
    { 
      icon: ShoppingBag, 
      label: 'Cart', 
      path: '/cart', 
      badge: cartCount,
      requiresAuth: true 
    },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Grid, label: 'Manage', path: '/seller-dashboard' }
];



  const handleNavigation = (item) => {
    if (item.requiresAuth && !isLoggedIn) {
      navigate('/login');
    } else {
      navigate(item.path);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Only render on mobile
  if (!isMobile) return null;

  return (
    <div></div>
    // <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
    //   <div className="flex justify-between px-4 py-2">
    //     {navItems.map((item) => (
    //       <button
    //         key={item.label}
    //         onClick={() => handleNavigation(item)}
    //         className="flex flex-col items-center w-full py-1"
    //       >
    //         <div className="relative">
    //           <item.icon
    //             size={20}
    //             className={`${
    //               isActive(item.path) ? 'text-blue-600' : 'text-gray-600'
    //             }`}
    //           />
    //           {item.badge > 0 && isLoggedIn && (
    //             <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
    //               {item.badge}
    //             </span>
    //           )}
    //         </div>
    //         <span 
    //           className={`text-xs mt-1 ${
    //             isActive(item.path) ? 'text-blue-600' : 'text-gray-600'
    //           }`}
    //         >
    //           {item.label}
    //         </span>
    //       </button>
    //     ))}
    //   </div>
    // </div>
  );
  
};

export default MobileFooter;