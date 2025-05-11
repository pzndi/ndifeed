const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/index.html',
  '/manifest.json',
  '/service-worker.js'
  // در صورت وجود فایل‌های CSS یا جاوا اسکریپت اضافی آنها را اضافه کنید
];

self.addEventListener('install', function(event) {
  console.log('Service Worker: Installing and caching resources.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // تلاش برای برگرداندن منبع از کش، در صورت عدم وجود، از شبکه درخواست می‌شود
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activating and cleaning old caches.');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
