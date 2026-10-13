const CACHE_NAME = 'drogaria-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/layout.css',
  '/js/main.js'
  // adicione os arquivos principais que você precisa armazenar em cache
];

// Cache quando o navegador instala o Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Intercepta requisições, retorna cache primeiro
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});