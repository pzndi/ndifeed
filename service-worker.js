const CACHE_NAME = 'pwa-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
  // سایر منابع استاتیک
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching core assets');
        return cache.addAll(urlsToCache).catch((error) => {
          console.error('Failed to cache:', error);
        });
      })
  );
});

self.addEventListener('fetch', (event) => {
  // فقط درخواست‌های GET را مدیریت می‌کنیم
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // اگر در کش وجود داشت، برگردانده می‌شود
        if (cachedResponse) {
          return cachedResponse;
        }

        // در غیر این صورت از شبکه دریافت می‌شود
        return fetch(event.request)
          .then((response) => {
            // فقط پاسخ‌های معتبر را کش می‌کنیم
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // پاسخ را برای استفاده بعدی کش می‌کنیم
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback برای زمانی که هم کش و هم شبکه خطا می‌دهند
            return new Response('<h1>حالت آفلاین</h1>', {
              headers: { 'Content-Type': 'text/html' }
            });
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
