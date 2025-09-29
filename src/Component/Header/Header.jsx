import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Drawer, Badge, Avatar, Dropdown, Menu } from 'antd';
import { MenuOutlined, ShoppingCartOutlined, UserOutlined, HeartOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import axiosInstance from '../../API/api';
import { menuitem } from 'framer-motion/client';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      if (isLoggedIn && localStorage.getItem('token')) {
        try {
          const response = await axiosInstance.get('/cart');
          setCartCount(response.data.channelCount);
        } catch (error) {
          console.error('Error fetching cart count:', error);
        }
      } else {
        setCartCount(0);
      }
    }
    fetchCart();
    setWishlistCount(3);
  }, [isLoggedIn, location?.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('resize', handleResize);
    checkLoginStatus();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Buy Channel', path: '/channels', hot: true },
    { label: 'How To', path: '/how-to' },
    { label: 'Grow Channel', path: '/grow' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'About', path: '/about' },
    { label: 'Seller-Panel', path: '/seller-dashboard' },
    { label: 'Login', path: '/login' }
  ];


  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole('');
    setCartCount(0);
    navigate('/');
  };

  const isActiveRoute = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 w-[100vw] z-50">
      <div className="container px-4">
        <div className="flex items-center justify-between py-4 w-[100vw] pr-16">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="" style={{ height: '2rem' }} />
            <Link to="/" className="text-2xl font-bold text-">  SocialSwap</Link>
          </div>

          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-gray-700 hover:text-gray-900 ${isActiveRoute(item.path) ? 'font-semibold' : ''}`}
              >
                {item.label}
                {item.hot && <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded">HOT</span>}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Only show search on desktop */}
            <SearchOutlined className="hidden md:block text-gray-600 text-xl cursor-pointer" onClick={() => navigate('/channels')} />

            {/* Only show heart/cart/profile icons on desktop */}
            {isLoggedIn ? (
              <>
                <Badge count={cartCount} size="small" className="hidden md:block">
                  <ShoppingCartOutlined className="text-gray-600 text-xl cursor-pointer" onClick={() => navigate('/cart')} />
                </Badge>
                <div className="hidden md:block" key="profile" onClick={() => navigate('/profile')}>
                  {/* <Avatar icon={<UserOutlined />} className="cursor-pointer bg-gray-200" /> */}
                  <img src="/images/userImg.jpg" alt="" style={{height:'35px'}}/>
                </div>
                <div key="logout" className='cursor-pointer hidden md:block' onClick={handleLogout}>
                  <LogoutOutlined />
                </div>
              </>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900 hidden md:block">
                  <img src="/images/userImg.jpg" alt="" style={{height:'35px'}}/>
                  </Link>
            )}

            {/* Always show hamburger menu on mobile */}
        
            {/* Profile and Cart options for mobile */}
            {isMobile && isLoggedIn && (
              <>
                <Badge count={cartCount} size="small">
                  <ShoppingCartOutlined
                    className="text-gray-600 text-xl cursor-pointer"
                    onClick={() => navigate('/cart')}
                  />
                </Badge>
                <div onClick={() => navigate('/profile')}>
                <img src="/images/userImg.jpg" alt="" style={{height:'35px'}}/>
                </div>
              </>
            )}

            {/* Only show login for mobile if not logged in */}
            {isMobile && !isLoggedIn && (
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  <img src="/images/userImg.jpg" alt="" style={{height:'35px'}}/>
                  </Link>
            )}
                {isMobile && (
              <MenuOutlined className="text-gray-600 text-xl cursor-pointer md:hidden" onClick={showDrawer} />
            )}
          </div>
        </div>
      </div>

      <Drawer
        title="Menu"
        placement="right"
        onClose={onClose}
        open={visible}
        width={250}
      >
        <nav className="flex flex-col space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`text-left py-2 px-4 rounded w-full ${isActiveRoute(item.path)
                  ? 'bg-gray-100 text-gray-900'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                }`}
            >
              {item.label}
              {item.hot && <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded">HOT</span>}
            </button>
          ))}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-left py-2 px-4 hover:bg-gray-50 rounded w-full text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          )}
        </nav>
      </Drawer>
    </header>
  );
};

export default Header;