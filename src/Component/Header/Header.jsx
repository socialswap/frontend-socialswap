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
import useChatSounds from '../../Utils/useChatSounds';

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
  
  // ── Global Toast Notifications ──────────────────────────────
  const [liveToasts, setLiveToasts] = useState([]);
  const { playNotificationSound } = useChatSounds();

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
          const isChatActive = window.location.pathname.includes('/chat');
          if (!isChatActive) {
            playNotificationSound();
            
            const msg = data.message || {};
            const senderName = msg.sender?.name || (role === 'admin' ? 'User' : 'Escrow Agent');
            const preview = msg.text
              ? msg.text.slice(0, 60) + (msg.text.length > 60 ? '…' : '')
              : msg.mediaUrl ? '📷 Image'
              : '📋 Update';
              
            const toastId = Date.now();
            setLiveToasts(prev => [
              ...prev,
              { id: toastId, senderName, preview, role }
            ]);
            
            // Auto-dismiss after 6 seconds
            setTimeout(() => {
              setLiveToasts(prev => prev.filter(t => t.id !== toastId));
            }, 6000);
          }
        });
        
        return () => socket.close();
      }
    }
  }, [isLoggedIn, navigate]);

  const [userAvatar, setUserAvatar] = useState(null);

  // ── Window Resize & Scroll Listeners ───────────────────────
  useEffect(() => {
    const fetchCartAndProfile = async () => {
      if (isLoggedIn && localStorage.getItem('token')) {
        try {
          const cartRes = await axiosInstance.get('/cart');
          setCartCount(cartRes.data.channelCount);
          
          const profileRes = await axiosInstance.get('/profile');
          if (profileRes.data && profileRes.data.avatar) {
            setUserAvatar(profileRes.data.avatar);
          }
        } catch (error) {
          console.error('Error fetching header data:', error);
        }
      } else {
        setCartCount(0);
        setUserAvatar(null);
      }
    };
    fetchCartAndProfile();
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
    { label: 'Buy Channel', path: '/channels', hot: true },
    { label: 'Monetized', type: 'dropdown', monetized: 'monetized' },
    { label: 'Non-Monetized', type: 'dropdown', monetized: 'non-monetized' },
    { label: 'Sell Channel', path: '/user/upload-channel' },
    { label: 'Services', path: '/services' },
    { label: 'Tools', path: '/tools' }
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
      moreOptions.unshift({ label: 'Admin Dashboard', path: '/admin/dashboard' });
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

  const isOverDarkHero = !isScrolled && location.pathname === '/';

  const logoColor = isOverDarkHero ? '#FFFFFF' : 'var(--text-primary)';
  const navTextColor = isOverDarkHero ? 'rgba(255,255,255,0.9)' : (theme === 'dark' ? '#FFFFFF' : '#312E4A');

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 h-20 flex items-center pointer-events-auto ${
        isScrolled 
          ? 'bg-white/80 dark:bg-[#0B0713]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 w-full">
        <div className="flex items-center justify-between relative">
          
          {/* ── Left: Logo ── */}
          <div className="flex-1 flex justify-start z-10 pointer-events-auto">
            <Link to="/" className="flex items-center gap-2 group" aria-label="SocialSwap Home">
              <img src="/images/logo.webp" alt="SocialSwap logo" style={{ height: '2.25rem' }} className="transition-transform duration-300 group-hover:scale-105" />
              
              <div className="relative flex items-center pr-2">
                <span 
                  className="text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap"
                  style={{ color: logoColor, display: 'inline-block' }}
                >
                  SocialSwap
                </span>
              </div>
            </Link>
          </div>

          {/* ── Center: Pill Navigation (Desktop) ── */}
          <nav 
            className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 px-2 py-1.5 rounded-full backdrop-blur-xl border transition-all duration-300 z-20 pointer-events-auto shadow-sm ${
              isOverDarkHero 
                ? 'bg-white/10 border-white/20' 
                : 'bg-white/80 dark:bg-white/10 border-gray-200/80 dark:border-white/15'
            }`}
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
                      className="relative px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      style={{ color: navTextColor }}
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-180" />
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-[100] transform origin-top group-hover:translate-y-0 translate-y-2">
                      <div className="flex flex-col w-52 p-1.5 rounded-2xl shadow-2xl backdrop-blur-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden bg-white/95 dark:bg-[#120B24]/95">
                        {options.map((opt, idx) => (
                          <Link 
                            key={idx} 
                            to={`/channels?monetization=${item.monetized}&maxPrice=${opt.price}`} 
                            className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:bg-[#6E4BFF]/10 dark:hover:bg-white/10 text-[#2D2A4A] dark:text-gray-200 hover:text-[#6E4BFF] dark:hover:text-purple-300 flex items-center justify-between group/item"
                          >
                            <span>{opt.label}</span>
                            <span className="opacity-0 -translate-x-2 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0 text-[#6E4BFF] dark:text-purple-300">
                              →
                            </span>
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
                  className={`relative px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all duration-200 whitespace-nowrap ${
                    !active ? 'hover:bg-black/5 dark:hover:bg-white/10' : ''
                  }`}
                  style={{ 
                    color: active ? '#FFFFFF' : navTextColor
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-btn-gradient rounded-full shadow-md shadow-purple-500/20"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label}
                    {item.hot && (
                      <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-extrabold bg-gradient-to-r from-[#6E4BFF] to-[#F4B6D2] text-white shadow-sm">
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
                className="relative px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                style={{ color: navTextColor }}
              >
                More Option
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-180" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-[100] transform origin-top group-hover:translate-y-0 translate-y-2">
                <div className="flex flex-col w-56 p-1.5 rounded-2xl shadow-2xl backdrop-blur-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden bg-white/95 dark:bg-[#120B24]/95">
                  {moreOptions.map((item, idx) => {
                    const isItemActive = location.pathname === item.path;
                    return (
                      <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-between group/item ${
                          isItemActive 
                            ? 'bg-[#6E4BFF]/15 text-[#6E4BFF] dark:text-purple-300' 
                            : 'hover:bg-[#6E4BFF]/10 dark:hover:bg-white/10 text-[#2D2A4A] dark:text-gray-200 hover:text-[#6E4BFF] dark:hover:text-purple-300'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="opacity-0 -translate-x-2 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0 text-[#6E4BFF] dark:text-purple-300 font-bold">
                          →
                        </span>
                      </Link>
                    );
                  })}
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
              className={`relative inline-flex items-center justify-between w-[68px] h-[34px] rounded-full p-1 cursor-pointer transition-all duration-300 border ${
                isOverDarkHero 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/80 dark:bg-white/10 border-gray-200/80 dark:border-white/15'
              }`}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {/* Sliding background thumb */}
              <motion.div
                className="absolute top-1 bottom-1 w-[26px] rounded-full shadow-sm"
                style={{ 
                  backgroundColor: isOverDarkHero ? 'rgba(255,255,255,0.25)' : (theme === 'dark' ? '#332b4d' : '#FFFFFF'),
                }}
                initial={false}
                animate={{ x: theme === 'light' ? 0 : 34 }}
                transition={{ type: "spring", stiffness: 600, damping: 30 }}
              />
              
              {/* Sun Icon */}
              <div className="relative z-10 w-[26px] h-full flex items-center justify-center pointer-events-none">
                <SunOutlined 
                  style={{ 
                    fontSize: '14px',
                    color: isOverDarkHero ? '#FFFFFF' : (theme === 'light' ? '#1F2937' : '#9CA3AF'),
                    transition: 'color 0.3s'
                  }} 
                />
              </div>
              
              {/* Moon Icon */}
              <div className="relative z-10 w-[26px] h-full flex items-center justify-center pointer-events-none">
                <MoonOutlined 
                  style={{ 
                    fontSize: '14px',
                    color: isOverDarkHero ? '#FFFFFF' : (theme === 'dark' ? '#FFFFFF' : '#9CA3AF'),
                    transition: 'color 0.3s'
                  }} 
                />
              </div>
            </button>

            {/* Search */}
            <button
              type="button"
              aria-label="Search channels"
              className={`hidden md:inline-flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 hover:scale-110 border backdrop-blur-md shadow-sm ${
                isOverDarkHero 
                  ? 'bg-white/10 border-white/20 text-white' 
                  : 'bg-white/80 dark:bg-white/10 border-gray-200/80 dark:border-white/15 text-text-primary'
              }`}
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
                    className={`inline-flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 hover:scale-110 border backdrop-blur-md shadow-sm ${
                      isOverDarkHero 
                        ? 'bg-white/10 border-white/20 text-white' 
                        : 'bg-white/80 dark:bg-white/10 border-gray-200/80 dark:border-white/15 text-text-primary'
                    }`}
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
                  <img src={userAvatar || "/images/userImg.jpg"} alt="User avatar" className="w-10 h-10 rounded-full ring-2 ring-purple-500/50 shadow-sm object-cover" />
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3 ml-2">
                <Link
                  to="/login"
                  className="text-sm font-bold tracking-wide transition-all duration-200 px-3 hover:opacity-80"
                  style={{ color: logoColor }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-bold tracking-wide px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 shadow-md flex items-center gap-1 bg-btn-gradient text-white"
                >
                  Sign up
                </Link>
              </div>
            )}

            {isMobile && (
              <button
                type="button"
                aria-label="Open menu"
                className={`inline-flex lg:hidden items-center justify-center h-10 w-10 rounded-full transition-transform duration-200 active:scale-95 ml-2 border ${
                  isOverDarkHero 
                    ? 'bg-white/10 border-white/20 text-white' 
                    : 'bg-white/80 dark:bg-white/10 border-gray-200/80 dark:border-white/15 text-text-primary'
                }`}
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
            <img src="/images/logo.webp" alt="SocialSwap logo" style={{ height: '1.75rem' }} />
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Menu</span>
          </div>
        }
        placement="right"
        onClose={onClose}
        open={visible}
        width={280}
        styles={{ 
          body: { padding: 0 },
          content: { 
            borderRadius: '24px 0 0 24px', 
            overflow: 'hidden',
            background: theme === 'dark' ? 'rgba(17, 12, 31, 0.75)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderLeft: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)'
          },
          header: {
            background: 'transparent',
            borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
          }
        }}
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

      {/* ── Global Live in-app notification toasts ──────────────────────────
          Fires on all pages EXCEPT the chat pages, so admin/users get alerts
          even when browsing the Dashboard or Channels. */}
      <div style={{
        position: 'fixed', top: 80, right: 20,
        zIndex: 99999, display: 'flex', flexDirection: 'column', gap: 10,
        pointerEvents: 'none'
      }}>
        {liveToasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => {
              // Navigate to the correct chat page when clicked
              if (toast.role === 'admin') navigate('/admin/chats');
              else navigate('/user/chat');
              setLiveToasts(prev => prev.filter(t => t.id !== toast.id));
            }}
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            className="flex items-start gap-3 bg-[#1e1040] border border-purple-700/60 text-white
                       rounded-2xl shadow-2xl px-4 py-3 max-w-[300px] w-[300px]
                       animate-fade-in hover:bg-[#2a1860] transition-colors"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center
                            font-bold text-sm shrink-0 uppercase shadow-md">
              {toast.senderName.charAt(0)}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-semibold text-sm text-purple-200 truncate">
                  {toast.senderName}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setLiveToasts(prev => prev.filter(t => t.id !== toast.id));
                  }}
                  className="ml-2 text-gray-500 hover:text-white text-xs shrink-0"
                  aria-label="Dismiss notification"
                >✕</button>
              </div>
              <p className="text-xs text-gray-300 truncate">{toast.preview}</p>
              <p className="text-[10px] text-purple-400 mt-1 font-medium">Tap to open chat →</p>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;