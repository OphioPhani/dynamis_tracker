/* Dynamis Tracker service worker — app-shell cache for offline gym use.
 * Strategy: stale-while-revalidate for same-origin GETs. Serves instantly
 * from cache when available, then refreshes from network in the background
 * so the app NEVER gets stuck on frozen code (a cache-first policy once
 * pinned browsers to outdated bundles).
 * Third-party API traffic (other origins) is never cached. */
const CACHE = 'dynamis-v2';
const SHELL = ['/', '/index.html', '/manifest.json', '/favicon.svg', '/logo-mark.svg', '/logo.svg', '/icon-192.png', '/icon-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin !== location.origin) return; // don't cache third-party APIs
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const network = fetch(e.request).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit || caches.match('/index.html'));
      // Stale-while-revalidate: instant cached response, background refresh.
      // Navigations always prefer network first so new deploys take effect.
      if (e.request.mode === 'navigate') return network;
      return hit || network;
    })
  );
});
