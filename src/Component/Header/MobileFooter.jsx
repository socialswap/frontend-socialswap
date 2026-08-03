import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Youtube, PlusSquare, Server, MessageSquare, LogIn, User } from 'lucide-react';

const MobileFooter = ({ unreadCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [location.pathname]);

  const navItems = [
    { icon: Youtube, label: 'Channels', path: '/channels' },
    { icon: PlusSquare, label: 'Sell', path: '/user/upload-channel' },
    { icon: Server, label: 'Services', path: '/services' },
    { icon: MessageSquare, label: 'Chats', path: '/user/chat' },
    isLoggedIn 
      ? { icon: User, label: 'Profile', path: '/user/profile' }
      : { icon: LogIn, label: 'Log in', path: '/login' }
  ];

  const handleNavigation = (item) => {
    navigate(item.path);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Only render on mobile
  if (!isMobile) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ 
        backgroundColor: 'var(--bg-primary)', 
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -8px 30px rgba(124,58,237,0.12)',
        transition: 'background-color 0.3s, border-color 0.3s'
      }}
    >
      <div className="flex justify-between items-center px-4 py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.label}
              onClick={() => handleNavigation(item)}
              className="flex flex-col items-center justify-center w-full transition-all duration-200 gap-1"
            >
              <div className="relative">
                <item.icon
                  size={22}
                  strokeWidth={active ? 2.5 : 2}
                  className="transition-all duration-200"
                  style={{ color: active ? 'var(--purple-primary)' : 'var(--text-secondary)' }}
                />
                {item.label === 'Chats' && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[var(--bg-primary)] animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span 
                className="text-[11px] font-medium tracking-wide transition-all duration-200"
                style={{ color: active ? 'var(--purple-primary)' : 'var(--text-secondary)' }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default MobileFooter;