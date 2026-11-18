import React, { useCallback, useEffect, useState } from 'react';
import { subscribeToPush } from '../../App';

const DISMISS_KEY = 'chatNotifyPromptDismissed';

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isInstalledApp = () =>
  window.navigator.standalone === true ||
  window.matchMedia?.('(display-mode: standalone)').matches;

/**
 * What this browser can do about reply alerts:
 * 'ios-install' (iPhone needs the Home Screen app first), 'unsupported',
 * 'ask', 'blocked', 'on'.
 */
const detectState = async () => {
  const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  if (!supported) return isIOS() && !isInstalledApp() ? 'ios-install' : 'unsupported';
  if (Notification.permission === 'denied') return 'blocked';
  if (Notification.permission === 'default') return 'ask';
  // Allowed earlier: make sure this browser is really registered with our server
  const sub = await subscribeToPush();
  return sub ? 'on' : 'ask';
};

// Shown inside the buyer's chat until reply alerts are on, because the
// app-wide banner is easy to dismiss once and never see again.
const ChatNotifyPrompt = () => {
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const [hidden, setHidden] = useState(() => {
    try { return sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });

  const refresh = useCallback(() => { detectState().then(setState).catch(() => setState('unsupported')); }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const enable = async () => {
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        const sub = await subscribeToPush();
        setState(sub ? 'on' : 'ask');
      } else {
        setState(perm === 'denied' ? 'blocked' : 'ask');
      }
    } finally {
      setBusy(false);
    }
  };

  const dismiss = () => {
    setHidden(true);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch {}
  };

  if (!state || state === 'on' || state === 'unsupported' || hidden) return null;

  const text = {
    ask: "Turn on notifications so you don't miss our reply.",
    blocked: 'Notifications are blocked for SocialSwap. Tap the 🔒 icon next to the website address → Notifications → Allow, then reload.',
    'ios-install': 'On iPhone: tap Share → "Add to Home Screen", then open SocialSwap from your Home Screen to get reply alerts.',
  }[state];

  return (
    <div className="mx-3 mb-2 flex items-start gap-3 rounded-xl border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-[#231542] px-3 py-2.5">
      <span className="text-lg leading-none mt-0.5" aria-hidden="true">🔔</span>
      <p className="flex-1 text-xs md:text-[13px] leading-relaxed text-gray-700 dark:text-gray-200">{text}</p>
      {state === 'ask' && (
        <button
          onClick={enable}
          disabled={busy}
          className="shrink-0 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-xs font-bold disabled:opacity-60"
        >
          {busy ? 'Enabling…' : 'Allow'}
        </button>
      )}
      {state === 'blocked' && (
        <button onClick={refresh} className="shrink-0 px-3 py-1.5 rounded-full border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-xs font-bold">
          Check again
        </button>
      )}
      <button onClick={dismiss} aria-label="Hide for now" className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-base leading-none mt-0.5">×</button>
    </div>
  );
};

export default ChatNotifyPrompt;
