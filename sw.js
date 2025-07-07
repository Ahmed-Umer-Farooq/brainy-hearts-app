const CACHE_NAME = 'brainy-hearts-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/questions.json',
  'https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-fairy-bell-bless-864.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-game-magic-dream-swoosh-2425.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});