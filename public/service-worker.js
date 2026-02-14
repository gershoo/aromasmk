// ═══════════════════════════════════════════════════════════════════════════
// SERVICE WORKER - MK AROMAS PWA
// ═══════════════════════════════════════════════════════════════════════════

const CACHE_NAME = 'mk-aromas-v2.0';
const STATIC_CACHE = 'mk-static-v2.0';
const DYNAMIC_CACHE = 'mk-dynamic-v2.0';
const IMAGE_CACHE = 'mk-images-v2.0';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html',
    'https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;600;700&display=swap',
];

const PRECACHE_IMAGES = [
    'https://i.ibb.co/5XhktwJQ/Chat-GPT-Image-22-ene-2026-18-57-58.png',
    'https://i.ibb.co/Xrc370rK/Chat-GPT-Image-14-ene-2026-11-50-55-a-m.png',
];

self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            caches.open(IMAGE_CACHE).then((cache) => {
                console.log('[SW] Pre-caching images');
                return cache.addAll(PRECACHE_IMAGES);
            })
        ]).then(() => {
            console.log('[SW] Installation complete');
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => {
                        return name.startsWith('mk-') &&
                            name !== STATIC_CACHE &&
                            name !== DYNAMIC_CACHE &&
                            name !== IMAGE_CACHE;
                    })
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => {
            console.log('[SW] Activation complete');
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') return;
    if (!url.protocol.startsWith('http')) return;

    if (request.destination === 'image') {
        event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    } else if (url.pathname.startsWith('/api/') || url.hostname.includes('firebase')) {
        event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    } else if (STATIC_ASSETS.includes(url.pathname) || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
        event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    } else {
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    }
});

async function cacheFirstStrategy(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, no cache available:', request.url);
        if (request.destination === 'image') {
            return caches.match('/icons/placeholder.png');
        }
        throw error;
    }
}

async function networkFirstStrategy(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        throw error;
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    const networkPromise = fetch(request).then((response) => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => null);

    return cachedResponse || networkPromise || caches.match('/offline.html');
}

self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    if (event.tag === 'sync-cart') {
        event.waitUntil(syncCart());
    }
});

async function syncCart() {
    return null;
}

self.addEventListener('push', (event) => {
    const data = event.data?.json() || {
        title: 'MK Aromas',
        body: 'Tenés novedades esperándote',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png'
    };

    const options = {
        body: data.body,
        icon: data.icon || '/icons/icon-192x192.png',
        badge: data.badge || '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: { url: data.url || '/', dateOfArrival: Date.now() },
        actions: [
            { action: 'open', title: 'Ver ahora' },
            { action: 'close', title: 'Cerrar' }
        ]
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'open' || !event.action) {
        const url = event.notification.data?.url || '/';
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then((clientList) => {
                for (const client of clientList) {
                    if (client.url === url && 'focus' in client) return client.focus();
                }
                if (clients.openWindow) return clients.openWindow(url);
            })
        );
    }
});
