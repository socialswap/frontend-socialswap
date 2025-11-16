import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Drawer, Badge } from 'antd';
import { MenuOutlined, ShoppingCartOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import axiosInstance from '../../API/api';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

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
  }, [isLoggedIn, location?.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    checkLoginStatus();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (cartCount > 0) {
      setCartPulse(true);
      const t = setTimeout(() => setCartPulse(false), 500);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

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
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm' : 'bg-white/70 backdrop-blur border-b border-transparent'}`}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group" aria-label="SocialSwap Home">
              <img src="/images/logo.png" alt="SocialSwap logo" style={{ height: '2rem' }} className="transition-transform duration-300 group-hover:scale-105" />
              <span className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">SocialSwap</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActiveRoute(item.path)
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                aria-current={isActiveRoute(item.path) ? 'page' : undefined}
              >
                <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-gray-900 after:transition-all after:duration-300 hover:after:w-full">
                  {item.label}
                </span>
                {item.hot && <span className="ml-2 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white ae">HOT</span>}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search channels"
              className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-full transition-transform duration-200 text-red-600 hover:text-red-700 drop-shadow-md hover:drop-shadow-lg hover:scale-110"
              onClick={() => navigate('/channels')}
            >
              <SearchOutlined className="text-lg" />
            </button>

            {isLoggedIn ? (
              <>
                <Badge count={cartCount} size="small" className={`hidden md:block ${cartPulse ? 'animate-bounce' : ''}`}>
                  <button
                    type="button"
                    aria-label="Open cart"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-full transition-transform duration-200 text-red-600 hover:text-red-700 drop-shadow-md hover:drop-shadow-lg hover:scale-110"
                    onClick={() => navigate('/cart')}
                  >
                    <ShoppingCartOutlined className="text-lg" />
                  </button>
                </Badge>
                <button
                  type="button"
                  className="hidden md:flex items-center"
                  aria-label="Open profile"
                  onClick={() => navigate('/profile')}
                >
                  <img src="/images/userImg.jpg" alt="User avatar" style={{height:'36px', width:'36px'}} className="rounded-full ring-1 ring-gray-200 transition-transform duration-300 hover:scale-105" />
                </button>
                <button
                  type="button"
                  aria-label="Logout"
                  className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-full transition-transform duration-200 text-red-600 hover:text-red-700 drop-shadow-md hover:drop-shadow-lg hover:scale-110"
                  onClick={handleLogout}
                >
                  <LogoutOutlined className="text-lg" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center h-9 px-5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition shadow-sm hover:shadow"
              >
                Sign in
              </Link>
            )}

            {isMobile && isLoggedIn && (
              <>
                <Badge count={cartCount} size="small">
                  <ShoppingCartOutlined
                    className="text-red-600 text-2xl cursor-pointer transition-transform duration-200 drop-shadow-md hover:drop-shadow-lg hover:text-red-700 hover:scale-110"
                    onClick={() => navigate('/cart')}
                  />
                </Badge>
                <button type="button" onClick={() => navigate('/profile')} aria-label="Open profile">
                  <img src="/images/userImg.jpg" alt="User avatar" style={{height:'35px', width:'35px'}} className="rounded-full ring-1 ring-gray-200" />
                </button>
              </>
            )}

            {isMobile && !isLoggedIn && (
              <Link to="/login" aria-label="Sign in" className="text-gray-600 hover:text-gray-900">
                <img src="/images/userImg.jpg" alt="User avatar" style={{height:'35px', width:'35px'}} className="rounded-full ring-1 ring-gray-200" />
              </Link>
            )}
            {isMobile && (
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-full transition-transform duration-200 text-red-600 hover:text-red-700 drop-shadow-md hover:drop-shadow-lg active:scale-95"
                onClick={showDrawer}
              >
                <MenuOutlined className="text-lg" />
              </button>
            )}
          </div>
        </div>
      </div>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="SocialSwap logo" style={{ height: '1.5rem' }} />
            <span className="font-semibold">Menu</span>
          </div>
        }
        placement="right"
        onClose={onClose}
        open={visible}
        width={250}
      >
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`text-left py-2.5 px-4 rounded-md w-full transition-all ${isActiveRoute(item.path)
                  ? 'bg-gray-100 text-gray-900'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                }`}
            >
              {item.label}
              {item.hot && <span className="ml-2 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white">HOT</span>}
            </button>
          ))}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-left py-2 px-4 hover:bg-gray-50 rounded-md w-full text-gray-600 hover:text-gray-900"
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