// Service worker — basic cache strategy for servisnyzaznam.sk
// Strategy:
//   HTML (navigate):           network-first, fallback to cache
//   CSS/JS/images (same-origin): stale-while-revalidate
//   Opaque third-party (fonts/GTM/Mailgun/etc.): pass-through (no caching)
// Bump CACHE_VERSION when you change precache list to force refresh.

const CACHE_VERSION = 'sz-v1';
const PRECACHE = [
  '/',
  '/css/styles.css',
  '/js/main.js',
  '/js/cookie-consent.js',
  '/design/servisny-zaznam-logo.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // pass-through third-party

  // Navigate / HTML requests: network-first
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('/')))
    );
    return;
  }

  // Static assets: stale-while-revalidate
  if (['style', 'script', 'image', 'font'].includes(req.destination)) {
    event.respondWith(
      caches.open(CACHE_VERSION).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req)
            .then((res) => { cache.put(req, res.clone()).catch(() => {}); return res; })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
  }
});
