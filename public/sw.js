// ── Keep the service worker alive (prevents browser from killing it) ────────
// Without a fetch handler browsers aggressively terminate the SW,
// which means push events never fire.
self.addEventListener('fetch', function(event) {
  // Pass every fetch through — we just need this handler to exist
  // so the browser marks the SW as "used" and keeps it running.
  event.respondWith(fetch(event.request));
});

// ── Push notification handler ─────────────────────────────────────────────
self.addEventListener('push', function(event) {
  let data = { title: 'SocialSwap', body: 'You have a new message.', url: '/' };

  if (event.data) {
    try {
      // Backend sends JSON — parse it
      data = { ...data, ...event.data.json() };
    } catch (_) {
      // Fallback: treat as plain text body
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    tag: 'socialswap-chat',          // replaces previous notification instead of stacking
    renotify: true,                   // still vibrates/sounds even if same tag
    data: {
      dateOfArrival: Date.now(),
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ── Notification click handler ────────────────────────────────────────────
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data.url || '/',
    self.location.origin
  ).href;

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(windowClients) {
        // Find any open tab whose URL *starts with* the origin (not exact match)
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.startsWith(self.location.origin) && 'focus' in client) {
            // Navigate existing tab to target URL and focus it
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        // No existing tab — open a new one
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
