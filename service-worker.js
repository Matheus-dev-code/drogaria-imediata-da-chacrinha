// ========================================
// SERVICE WORKER — Drogaria Imediata
// Otimizado para Netlify (paths relativos)
// ========================================

const CACHE_NAME = 'drogaria-v2';

const ASSETS = [
    './',
    './index.html',
    './legal.html',
    './manifest.json',
    './css/base.css',
    './css/layout.css',
    './css/components.css',
    './css/sections.css',
    './css/carrossel.css',
    './css/carrinho.css',
    './css/admin.css',
    './css/animations.css',
    './css/responsive.css',
    './js/main.js',
    './js/modules/utils.js',
    './js/modules/ui.js',
    './js/modules/produtos.js',
    './js/modules/carrinho.js',
    './js/modules/filtros.js',
    './js/modules/favoritos.js',
    './js/modules/busca-inteligente.js',
    './js/modules/analytics.js',
    './js/modules/header-search.js',
    './js/modules/visualizacoes.js',
    './js/modules/destaques.js',
    './js/modules/banners.js',
    './js/modules/promocoes.js',
    './js/modules/admin.js'
];

// ========================================
// INSTALL — pré-cache
// ========================================

self.addEventListener('install', (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Usa allSettled pra não quebrar se um arquivo falhar
            return Promise.allSettled(
                ASSETS.map(url =>
                    cache.add(url).catch(err => {
                        console.warn('⚠️ Falha ao cachear:', url, err);
                    })
                )
            );
        })
    );
});

// ========================================
// ACTIVATE — limpa caches antigos
// ========================================

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// ========================================
// FETCH — cache-first para o próprio domínio
// ========================================

self.addEventListener('fetch', (event) => {
    const req = event.request;

    // Só intercepta GET
    if (req.method !== 'GET') return;

    // Só intercepta mesmo domínio (ignora Firebase, Google, CDN)
    let url;
    try {
        url = new URL(req.url);
    } catch (e) {
        return;
    }

    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;

            return fetch(req).then((response) => {
                // Não cacheia respostas inválidas
                if (!response || response.status !== 200 || response.type === 'opaque') {
                    return response;
                }

                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(req, clone).catch(() => {});
                });

                return response;
            }).catch(() => {
                // Fallback offline: se for navegação, manda o index
                if (req.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});