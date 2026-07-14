import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Drawer, Badge, notification } from 'antd';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { 
  MenuOutlined, 
  ShoppingCartOutlined, 
  SearchOutlined, 
  LogoutOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import axiosInstance from '../../API/api';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

  // ── Theme State & Logic ────────────────────────────────────
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ── Global Chat Notifications ───────────────────────────────
  useEffect(() => {
    if (isLoggedIn && localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (e) {}
      
      if (decoded) {
        const currentUserId = decoded.userId || decoded._id || decoded.id;
        const role = decoded.role;
        const socket = io(SOCKET_URL);
        
        socket.emit('global_connect', { userId: currentUserId, role });
        
        socket.on('global_notification', (data) => {
          // Do not show popup if already on the chat page
          const isChatActive = window.location.pathname.includes('/chat');
          if (!isChatActive) {
            notification.info({
              message: `New Message from ${data.message.sender?.name || (role === 'admin' ? 'User' : 'Escrow Agent')}`,
              description: data.message.text || 'You received a new attachment or Escrow Deal.',
              placement: 'topRight',
              duration: 6,
              style: { cursor: 'pointer', borderRadius: '12px', border: '1px solid #e9d5ff' },
              onClick: () => {
                if (role === 'admin') navigate('/admin/chats');
                else navigate('/chat');
              }
            });
          }
        });
        
        return () => socket.close();
      }
    }
  }, [isLoggedIn, navigate]);

  // ── Window Resize & Scroll Listeners ───────────────────────
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
    };
    fetchCart();
  }, [isLoggedIn, location?.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      setIsLoggedIn(!!token);
      setIsAdmin(role === 'admin');
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
    { label: 'Buy Channel', path: '/channels', hot: true },
    { label: 'About', path: '/about' },
    { label: 'Chat', path: '/chat' },
    ...(isAdmin ? [{ label: 'Dashboard', path: '/admin-dashboard' }] : []),
    ...(location.pathname !== '/blogs' && location.pathname !== '/blogs/' ? [{ label: 'Blogs', path: '/blogs' }] : []),
    ...(!isLoggedIn ? [{ label: 'Login', path: '/login' }] : [])
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setIsAdmin(false);
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
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        isScrolled ? 'backdrop-blur-md shadow-sm' : ''
      }`}
      style={{
        backgroundColor: isScrolled ? 'var(--bg-glass)' : 'transparent',
        borderBottomColor: isScrolled ? 'var(--border)' : 'transparent'
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group" aria-label="SocialSwap Home">
              <img src="/images/logo.png" alt="SocialSwap logo" style={{ height: '2rem' }} className="transition-transform duration-300 group-hover:scale-105" />
              <span className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: (!isScrolled && location.pathname === '/') ? '#FFFFFF' : 'var(--text-primary)' }}>
                SocialSwap
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActiveRoute(item.path) ? 'bg-bg-secondary/60' : 'hover:bg-bg-secondary/35'
                }`}
                style={{ 
                  color: (!isScrolled && location.pathname === '/') 
                    ? (isActiveRoute(item.path) ? '#FFFFFF' : '#E2DFEE') 
                    : (isActiveRoute(item.path) ? 'var(--text-primary)' : 'var(--text-secondary)') 
                }}
                aria-current={isActiveRoute(item.path) ? 'page' : undefined}
              >
                <span>{item.label}</span>
                {item.hot && (
                  <span className="ml-2 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold bg-purple-primary text-white">
                    HOT
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* ── Theme Toggle Button ── */}
            <button
              type="button"
              aria-label="Toggle theme"
              className="inline-flex items-center justify-center h-9 w-9 rounded-full transition-all duration-200 hover:scale-110 bg-bg-secondary"
              style={{ color: (!isScrolled && location.pathname === '/') ? '#FFFFFF' : 'var(--primary)' }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <SunOutlined className="text-base text-yellow-500 hover:rotate-45 transition-transform" />
              ) : (
                <MoonOutlined className="text-base text-indigo-600" />
              )}
            </button>

            {/* ── Search Button ── */}
            <button
              type="button"
              aria-label="Search channels"
              className="inline-flex items-center justify-center h-9 w-9 rounded-full transition-all duration-200 hover:scale-110"
              style={{ color: (!isScrolled && location.pathname === '/') ? '#FFFFFF' : 'var(--primary)' }}
              onClick={() => navigate('/channels')}
            >
              <SearchOutlined className="text-lg" />
            </button>

            {isLoggedIn ? (
              <>
                <Badge count={cartCount} size="small" className={`${cartPulse ? 'animate-bounce' : ''}`}>
                  <button
                    type="button"
                    aria-label="Open cart"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-full transition-all duration-200 hover:scale-110"
                    style={{ color: (!isScrolled && location.pathname === '/') ? '#FFFFFF' : 'var(--primary)' }}
                    onClick={() => navigate('/cart')}
                  >
                    <ShoppingCartOutlined className="text-lg" />
                  </button>
                </Badge>
                
                <button
                  type="button"
                  className="flex items-center transition-all duration-200 hover:scale-105"
                  aria-label="Open profile"
                  onClick={() => navigate('/profile')}
                >
                  <img src="/images/userImg.jpg" alt="User avatar" style={{height:'36px', width:'36px'}} className="rounded-full ring-2 ring-purple-primary/30" />
                </button>

                <button
                  type="button"
                  aria-label="Logout"
                  className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-full transition-all duration-200 hover:scale-110"
                  style={{ color: (!isScrolled && location.pathname === '/') ? '#FFFFFF' : 'var(--primary)' }}
                  onClick={handleLogout}
                >
                  <LogoutOutlined className="text-lg" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center h-9 px-5 rounded-full transition-all duration-200 shadow-sm"
                style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
              >
                Sign in
              </Link>
            )}

            {isMobile && isLoggedIn && (
              <>
                <Badge count={cartCount} size="small">
                  <ShoppingCartOutlined
                    className="text-2xl cursor-pointer transition-transform duration-200 hover:scale-110"
                    style={{ color: (!isScrolled && location.pathname === '/') ? '#FFFFFF' : 'var(--primary)' }}
                    onClick={() => navigate('/cart')}
                  />
                </Badge>
                <button type="button" onClick={() => navigate('/profile')} aria-label="Open profile">
                  <img src="/images/userImg.jpg" alt="User avatar" style={{height:'35px', width:'35px'}} className="rounded-full ring-2 ring-purple-primary/20" />
                </button>
              </>
            )}

            {isMobile && !isLoggedIn && (
              <Link to="/login" aria-label="Sign in" className="text-text-secondary">
                <img src="/images/userImg.jpg" alt="User avatar" style={{height:'35px', width:'35px'}} className="rounded-full ring-2 ring-purple-primary/20" />
              </Link>
            )}

            {isMobile && (
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-full transition-transform duration-200 active:scale-95"
                style={{ color: (!isScrolled && location.pathname === '/') ? '#FFFFFF' : 'var(--primary)' }}
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
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Menu</span>
          </div>
        }
        placement="right"
        onClose={onClose}
        open={visible}
        width={250}
        className="bg-bg-card"
        style={{ color: 'var(--text-primary)' }}
      >
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`text-left py-2.5 px-4 rounded-md w-full transition-all ${
                isActiveRoute(item.path) ? 'bg-bg-secondary font-medium' : 'hover:bg-bg-secondary/40'
              }`}
              style={{ color: isActiveRoute(item.path) ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {item.label}
              {item.hot && (
                <span className="ml-2 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold bg-purple-primary text-white">
                  HOT
                </span>
              )}
            </button>
          ))}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-left py-2 px-4 hover:bg-bg-secondary/40 rounded-md w-full text-text-secondary"
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