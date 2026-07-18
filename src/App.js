import React from 'react';
import Routes  from './Routing/Routes';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import { MessageOutlined } from '@ant-design/icons';
import Header from './Component/Header/Header';
import MobileFooter from './Component/Header/MobileFooter';
import { WhatsappIcon } from 'react-share';
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

    // Always clear old subscription first — prevents AbortError from VAPID key mismatch
    const existing = await reg.pushManager.getSubscription();
    if (existing) {
      console.log('[Push] Clearing old subscription...');
      await existing.unsubscribe();
    }

    const key = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    console.log('[Push] Subscribing with new VAPID key...');
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

  const [showBanner, setShowBanner] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !('Notification' in window)) return;

    const perm = Notification.permission;
    console.log('[Push] Permission on load:', perm);

    if (perm === 'granted') {
      // Already granted — silently re-sync subscription to backend
      subscribeToPush().catch(console.error);
    } else if (perm === 'default') {
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
    <>
      <Header />

      {/* ── Notification Permission Banner ── */}
      {showBanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999,
          background: 'linear-gradient(135deg,#6d28d9,#4f46e5)',
          color: '#fff', padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12, flexWrap: 'wrap',
          boxShadow: '0 3px 12px rgba(0,0,0,.35)'
        }}>
          <span style={{ fontSize: 14 }}>
            🔔 <strong>Enable notifications</strong> to get instant alerts for new chat messages!
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleEnableClick} style={{
              background: '#fff', color: '#4f46e5',
              border: 'none', borderRadius: 999, padding: '5px 16px',
              fontWeight: 700, cursor: 'pointer', fontSize: 13
            }}>Enable</button>
            <button onClick={() => setShowBanner(false)} style={{
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,.5)', borderRadius: 999,
              padding: '5px 12px', cursor: 'pointer', fontSize: 13
            }}>Not now</button>
          </div>
        </div>
      )}

      <Routes />
      <MobileFooter />
      {!isBlogPage && (
        <>
          <div
            onClick={() => navigate('/user/chat')}
            style={{
              position: 'fixed',
              bottom: '5.2rem',
              right: '2rem',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              backgroundColor: '#7C3AED',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 9999
            }}
            title="Open Chat"
          >
            <MessageOutlined style={{ fontSize: '20px' }} />
          </div>
          <WhatsappIcon
            onClick={handleMakeOffer} size={40} round
            style={{ position: 'fixed', bottom: '2rem', right: '2rem', cursor: 'pointer', zIndex: 9999 }}
          />
        </>
      )}
      {!isBlogPage && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
