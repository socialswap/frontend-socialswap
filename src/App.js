import React from 'react';
import Routes  from './Routing/Routes';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import { MessageOutlined } from '@ant-design/icons';
import Header from './Component/Header/Header';
import MobileFooter from './Component/Header/MobileFooter';
import { FaWhatsapp } from 'react-icons/fa';
import Footer from './Component/Footer/Footer';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8090/api';
const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY;

// ── helpers ────────────────────────────────────────────────────────────────
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
  return output;
}

async function saveToBackend(subscription) {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ subscription }),
    });
    const data = await res.json();
    console.log('[Push] Backend:', data);
    return data.success;
  } catch (e) {
    console.error('[Push] Backend save failed:', e);
    return false;
  }
}

async function removeFromBackend(endpoint) {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    await fetch(`${API_BASE}/push/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ endpoint }),
    });
  } catch (e) {
    console.error('[Push] Unsubscribe failed:', e);
  }
}

// Exported so Profile.jsx can call it too
export async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('[Push] Not supported');
    return null;
  }
  if (!VAPID_PUBLIC_KEY) {
    console.error('[Push] REACT_APP_VAPID_PUBLIC_KEY is missing from .env!');
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    console.log('[Push] SW ready. VAPID key starts with:', VAPID_PUBLIC_KEY.substring(0, 10));

    const existing = await reg.pushManager.getSubscription();

    if (existing) {
      // ── Already subscribed: just re-sync the existing endpoint to the backend.
      // Do NOT unsubscribe — that would invalidate the endpoint stored in the DB
      // and cause a race where the next push hits a 410 Gone and deletes the record.
      console.log('[Push] Re-syncing existing subscription to backend...');
      await saveToBackend(existing);
      return existing;
    }

    // ── No existing subscription — create a new one
    const key = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    console.log('[Push] No existing subscription. Creating new one...');
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
    console.log('[Push] Subscription created:', sub.endpoint.substring(0, 60) + '...');
    await saveToBackend(sub);
    return sub;
  } catch (e) {
    console.error('[Push] Subscribe error:', e);
    return null;
  }
}


export async function unsubscribeFromPush() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await removeFromBackend(sub.endpoint);
      await sub.unsubscribe();
    }
  } catch (e) {
    console.error('[Push] Unsubscribe error:', e);
  }
}

// ── component ──────────────────────────────────────────────────────────────
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBlogPage = location.pathname.startsWith('/blogs');

  React.useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.error('[PWA] Service Worker registration failed:', err);
        });
    }
  }, []);

  const [showBanner, setShowBanner] = React.useState(false);
  const [showCookieBanner, setShowCookieBanner] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/chat/unread`, {
        method: 'GET',
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (data && data.success) {
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  React.useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [location.pathname]);

  React.useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleCookieAction = () => {
    // As requested: save cookies/consent even if declined, and hide banner
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieBanner(false);
  };

  const handleDismissNotification = () => {
    localStorage.setItem('pushConsentDismissed', 'true');
    setShowBanner(false);
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !('Notification' in window)) return;

    const perm = Notification.permission;
    console.log('[Push] Permission on load:', perm);

    if (perm === 'granted') {
      // Already granted — silently re-sync subscription to backend
      subscribeToPush().catch(console.error);
    } else if (perm === 'default' && !localStorage.getItem('pushConsentDismissed')) {
      // Not yet asked — show banner
      setShowBanner(true);
    }
    // 'denied' → nothing we can do silently
  }, []);

  const handleEnableClick = async () => {
    const perm = await Notification.requestPermission();
    console.log('[Push] Permission result:', perm);
    if (perm === 'granted') {
      setShowBanner(false);
      await subscribeToPush();
    } else {
      alert('Notification blocked. Go to browser Settings > Site Settings > Notifications and allow it for this site.');
    }
  };

  const handleMakeOffer = () => {
    const msg = encodeURIComponent(`Hello, I'm interested in buying the YouTube channel. Can we discuss the details?`);
    window.open(`https://wa.me/+919423523291?text=${msg}`, '_blank');
  };

  return (
    <div className="relative min-h-screen">
      {/* Global Floating Ambient Blobs — desktop only to prevent mobile GPU overdraw */}
      <div className="hidden md:block fixed top-[-100px] left-[-100px] w-[600px] h-[600px] bg-[#B69BFF]/35 dark:bg-[#7B61FF]/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="hidden md:block fixed bottom-[-100px] right-[-100px] w-[650px] h-[650px] bg-[#FFD7B5]/35 dark:bg-[#F4B6D2]/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="hidden md:block fixed top-[35%] left-[25%] w-[550px] h-[550px] bg-[#F4B6D2]/25 dark:bg-[#C6B4FF]/15 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="relative z-10">
        <Header />

        {/* ── Notification Permission Banner ── */}
        {showBanner && !isBlogPage && (
          <div className="fixed bottom-[10%] md:bottom-auto md:top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-[99999] bg-gradient-to-br from-[#6d28d9] to-[#4f46e5] text-white p-3 md:p-4 rounded-xl shadow-2xl flex flex-col gap-2 md:gap-3 w-[85%] max-w-[300px] md:w-80 border border-white/10 animate-fade-in">
            <button 
              onClick={handleDismissNotification} 
              className="absolute top-1.5 right-2 md:top-2 md:right-2.5 text-white/70 hover:text-white transition-colors text-base md:text-lg"
              title="Close"
            >
              ✕
            </button>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-1 md:gap-2.5 mt-1 md:mt-0">
              <span className="text-xl md:text-xl">🔔</span>
              <p className="text-[12px] md:text-sm text-white font-medium leading-snug px-1 md:px-0 md:pr-4">
                Enable notifications to get instant alerts for new chat messages!
              </p>
            </div>
            <div className="flex justify-center md:justify-end gap-2 mt-1">
              <button onClick={handleDismissNotification} className="px-3 py-1.5 md:px-3 md:py-1.5 text-[11px] md:text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                Not now
              </button>
              <button onClick={handleEnableClick} className="px-4 py-1.5 md:px-4 md:py-1.5 text-[11px] md:text-xs font-bold text-[#4f46e5] bg-white hover:bg-gray-50 rounded-lg transition-colors shadow-sm">
                Enable
              </button>
            </div>
          </div>
        )}

        {/* ── Cookie Consent Banner ── */}
        {showCookieBanner && (
          <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-[99999] bg-white dark:bg-[#1A1035] text-gray-800 dark:text-gray-200 p-3 md:p-4 rounded-xl shadow-2xl flex flex-col gap-2 md:gap-3 w-[85%] max-w-[300px] md:w-80 border border-gray-200 dark:border-purple-900/40 animate-fade-in">
            <button 
              onClick={handleCookieAction} 
              className="absolute top-1.5 right-2 md:top-2 md:right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-base md:text-lg"
              title="Close"
            >
              ✕
            </button>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-1 md:gap-2.5 mt-1 md:mt-0">
              <span className="text-xl md:text-xl">🍪</span>
              <p className="text-[12px] md:text-sm text-gray-800 dark:text-gray-200 font-medium leading-snug px-1 md:px-0 md:pr-4">
                We use cookies to improve your experience. By continuing to visit this site you agree to our use of cookies.
              </p>
            </div>
            <div className="flex justify-center md:justify-end gap-2 mt-1">
              <button onClick={handleCookieAction} className="px-3 py-1.5 md:px-3 md:py-1.5 text-[11px] md:text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                Decline
              </button>
              <button onClick={handleCookieAction} className="px-4 py-1.5 md:px-4 md:py-1.5 text-[11px] md:text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#4f46e5] hover:opacity-90 rounded-lg transition-colors shadow-sm">
                Accept
              </button>
            </div>
          </div>
        )}

        <Routes />
        <MobileFooter unreadCount={unreadCount} />
        {!isBlogPage && (
          <div className="fixed bottom-[5.5rem] md:bottom-8 right-4 md:right-8 z-[9999] flex flex-col gap-3 items-center">
            <div
              onClick={() => navigate('/user/chat')}
              className="relative cursor-pointer w-10 h-10 bg-[#7C3AED] rounded-full flex justify-center items-center text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform"
              title="Open Chat"
            >
              <MessageOutlined style={{ fontSize: '20px' }} />
              {unreadCount > 0 && !(location.pathname.includes('/chat') || location.pathname.includes('/chats')) && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white dark:border-[#0d0b1a] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <div
              onClick={handleMakeOffer}
              className="relative cursor-pointer w-11 h-11 bg-gradient-to-tr from-[#25D366] to-[#128C7E] rounded-full flex justify-center items-center text-white shadow-[0_4px_15px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-300"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp size={26} />
              {/* Subtle ping animation behind the button */}
              <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" style={{ animationDuration: '3s' }}></span>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
