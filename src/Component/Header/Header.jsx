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
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../API/api';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
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
                else navigate('/user/chat');
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
      setIsMobile(window.innerWidth < 1024);
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
    { label: 'Home', path: '/' },
    { label: 'Monetized Channels', type: 'dropdown', monetized: 'monetized' },
    { label: 'Non-Monetized Channels', type: 'dropdown', monetized: 'non-monetized' },
    { label: 'Sell Channel', path: '/user/upload-channel' },
    { label: 'Services', path: '/services' }
  ];

  const moreOptions = [
    { label: 'Blogs', path: '/blogs' },
    { label: 'About', path: '/about' },
    { label: 'How to', path: '/how-to' },
    { label: 'Grow your channel', path: '/grow' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Term and condition', path: '/terms-and-conditions' },
    { label: 'Refund Policy', path: '/refund-policy' }
  ];

  if (isLoggedIn) {
    moreOptions.unshift({ label: 'Chat', path: '/user/chat' });
    if (isAdmin) {
      moreOptions.unshift({ label: 'Admin Dashboard', path: '/admin-dashboard' });
    }
  }

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

  // Determine colors based on scroll and theme
  // We want to force white text on top of the hero video (dark mode home) only when not scrolled
  const isTransparentHero = !isScrolled && location.pathname === '/' && theme === 'dark';
  const textColor = isTransparentHero ? '#FFFFFF' : 'var(--text-primary)';
  const textMutedColor = isTransparentHero ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)';

  return (
    <header 
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300 pt-2 pointer-events-none"
    >
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-4 relative">
          
          {/* ── Left: Logo ── */}
          <div className="flex-1 flex justify-start z-10 pointer-events-auto">
            <Link to="/" className="flex items-center gap-2 group" aria-label="SocialSwap Home">
              <img src="/images/logo.png" alt="SocialSwap logo" style={{ height: '2.25rem' }} className="transition-transform duration-300 group-hover:scale-105" />
              <span className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: textColor }}>
                SocialSwap
              </span>
            </Link>
          </div>

          {/* ── Center: Pill Navigation (Desktop) ── */}
          <nav 
            className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 px-1.5 py-1.5 rounded-full backdrop-blur-md shadow-sm border transition-all duration-300 z-20 pointer-events-auto"
            style={{
              backgroundColor: isTransparentHero ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-secondary)',
              borderColor: isTransparentHero ? 'rgba(255, 255, 255, 0.2)' : 'var(--border)'
            }}
          >
            {menuItems.map((item) => {
              if (item.type === 'dropdown') {
                const options = [
                  { label: 'Under ₹15,000', price: 15000 },
                  { label: 'Under ₹20,000', price: 20000 },
                  { label: 'Under ₹50,000', price: 50000 },
                  { label: 'Under ₹100,000', price: 100000 },
                ];
                
                return (
                  <div className="relative group" key={item.label}>
                    <div 
                      className="relative px-4 py-2 rounded-full text-[13px] font-bold tracking-wide uppercase transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1 cursor-pointer"
                      style={{ color: textMutedColor }}
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-180" />
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-[100] transform origin-top group-hover:translate-y-0 translate-y-2">
                      <div 
                        className="flex flex-col w-48 py-2 rounded-2xl shadow-xl backdrop-blur-2xl border overflow-hidden bg-white/90 dark:bg-[#110C1D]/90"
                        style={{
                          borderColor: 'var(--border)',
                          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)'
                        }}
                      >
                        {options.map((opt, idx) => (
                          <Link 
                            key={idx} 
                            to={`/channels?monetization=${item.monetized}&maxPrice=${opt.price}`} 
                            className="px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-between group/item"
                            style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                          >
                            {opt.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              const active = isActiveRoute(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-full text-[13px] font-bold tracking-wide uppercase transition-all duration-200 ${
                    !active ? 'hover:bg-black/5 dark:hover:bg-white/10' : ''
                  }`}
                  style={{ 
                    color: active ? '#FFFFFF' : textMutedColor
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-full shadow-md shadow-purple-500/20"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label}
                    {item.hot && (
                      <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm">
                        HOT
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}

            {/* More Options Dropdown */}
            <div className="relative group">
              <button 
                className="relative px-4 py-2 rounded-full text-[13px] font-bold tracking-wide uppercase transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1 cursor-pointer"
                style={{ color: textMutedColor }}
              >
                More Option
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-180" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-[100] transform origin-top group-hover:translate-y-0 translate-y-2">
                <div 
                  className="flex flex-col w-56 py-2 rounded-2xl shadow-xl backdrop-blur-2xl border overflow-hidden bg-white/90 dark:bg-[#110C1D]/90"
                  style={{
                    borderColor: 'var(--border)',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)'
                  }}
                >
                  {moreOptions.map((item, idx) => (
                    <Link 
                      key={item.path} 
                      to={item.path} 
                      className="px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-between group/item"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                    >
                      {item.label}
                      <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0 text-purple-500">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* ── Right: Auth / Icons ── */}
          <div className="flex-1 flex justify-end items-center gap-3 z-10 pointer-events-auto">
            {/* Theme Toggle */}
            <button
              type="button"
              aria-label="Toggle theme"
              className="inline-flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 hover:scale-110"
              style={{ 
                backgroundColor: isTransparentHero ? 'rgba(255,255,255,0.1)' : 'var(--bg-secondary)',
                color: textColor 
              }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <SunOutlined className="w-4 h-4 text-yellow-400 hover:rotate-45 transition-transform" />
              ) : (
                <MoonOutlined className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Search */}
            <button
              type="button"
              aria-label="Search channels"
              className="hidden md:inline-flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 hover:scale-110"
              style={{ 
                backgroundColor: isTransparentHero ? 'rgba(255,255,255,0.1)' : 'var(--bg-secondary)',
                color: textColor 
              }}
              onClick={() => navigate('/channels')}
            >
              <SearchOutlined className="w-4 h-4" />
            </button>

            {isLoggedIn ? (
              <>
                <Badge count={cartCount} size="small" className={`hidden md:block ${cartPulse ? 'animate-bounce' : ''}`}>
                  <button
                    type="button"
                    aria-label="Open cart"
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 hover:scale-110"
                    style={{ 
                      backgroundColor: isTransparentHero ? 'rgba(255,255,255,0.1)' : 'var(--bg-secondary)',
                      color: textColor 
                    }}
                    onClick={() => navigate('/user/cart')}
                  >
                    <ShoppingCartOutlined className="w-4 h-4" />
                  </button>
                </Badge>
                
                <button
                  type="button"
                  className="hidden md:flex items-center transition-all duration-200 hover:scale-105 ml-1"
                  aria-label="Open profile"
                  onClick={() => navigate('/user/profile')}
                >
                  <img src="/images/userImg.jpg" alt="User avatar" className="w-10 h-10 rounded-full ring-2 ring-purple-500/50 shadow-sm" />
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3 ml-2">
                <Link
                  to="/login"
                  className="text-sm font-bold tracking-wide transition-all duration-200 px-3 hover:opacity-80"
                  style={{ color: textColor }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-bold tracking-wide px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 shadow-md flex items-center gap-1"
                  style={{ 
                    backgroundColor: theme === 'dark' ? '#FFFFFF' : '#1A1830',
                    color: theme === 'dark' ? '#000000' : '#FFFFFF',
                  }}
                >
                  Sign up
                </Link>
              </div>
            )}

            {isMobile && (
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex lg:hidden items-center justify-center h-10 w-10 rounded-full transition-transform duration-200 active:scale-95 ml-2"
                style={{ 
                  backgroundColor: isTransparentHero ? 'rgba(255,255,255,0.1)' : 'var(--bg-secondary)',
                  color: textColor 
                }}
                onClick={showDrawer}
              >
                <MenuOutlined className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="SocialSwap logo" style={{ height: '1.75rem' }} />
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Menu</span>
          </div>
        }
        placement="right"
        onClose={onClose}
        open={visible}
        width={280}
        styles={{ body: { padding: 0 } }}
        className="bg-bg-primary"
        style={{ color: 'var(--text-primary)' }}
      >
        <div className="flex flex-col h-full">
          <nav className="flex flex-col flex-1 p-4 overflow-y-auto">
            <div className="text-xs font-bold uppercase tracking-wider mb-2 ml-2" style={{ color: 'var(--text-muted)' }}>Main</div>
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`text-left py-3 px-4 rounded-xl w-full transition-all flex items-center justify-between mb-1 ${
                  isActiveRoute(item.path) ? 'bg-bg-secondary font-bold shadow-sm' : 'hover:bg-bg-secondary/50 font-medium'
                }`}
                style={{ color: isActiveRoute(item.path) ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                {item.label}
                {item.hot && (
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                    HOT
                  </span>
                )}
              </button>
            ))}

            <div className="text-xs font-bold uppercase tracking-wider mt-6 mb-2 ml-2" style={{ color: 'var(--text-muted)' }}>More Options</div>
            {moreOptions.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="text-left py-2.5 px-4 rounded-xl w-full transition-all hover:bg-bg-secondary/50 font-medium mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-border mt-auto">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 rounded-xl font-bold transition-all bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center gap-2"
              >
                <LogoutOutlined className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl font-bold transition-all text-center border border-border hover:bg-bg-secondary"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl font-bold transition-all text-center shadow-lg"
                  style={{ 
                    background: 'var(--btn-gradient)',
                    color: '#FFF'
                  }}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;