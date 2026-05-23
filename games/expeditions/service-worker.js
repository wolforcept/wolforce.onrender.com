/* =====================================================================
   service-worker.js
   Offline-capable PWA cache. Cache-first for app shell + assets, with
   network fallthrough. The cache name is versioned — bumping CACHE_VERSION
   on a deploy invalidates the old cache so users pick up new files.
   ===================================================================== */

var CACHE_VERSION = 'expeditions-v3';

var SHELL = [
    './',
    'index.html',
    'manifest.json',
    'css/theme.css',
    'js/storage.js',
    'js/theme.js',
    'js/icon-map.js',
    'js/text-render.js',
    'js/modal.js',
    'js/mission-parser.js',
    'js/mission-sync.js',
    'js/missions-view.js',
    'js/settings-view.js',
    'js/stats-view.js',
    'js/game-view.js',
    'js/end-view.js',
    'js/app.js',
    // Initial mission set — precached so first-time offline works.
    // Updates flow through the network-first handler below.
    'missions/index.json',
    'missions/01-first-steps.txt',
    'missions/02-the-rival-camp.txt',
    'missions/03-summit.txt',
    'assets/logo.png',
    'assets/pwa-192.png',
    'assets/pwa-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// Anything matching this pattern is fetched network-first (always
// preferring fresh content when online, falling back to cache when
// offline). Required so updates to the mission catalog are picked up.
function isDynamic(url) {
    return /\/missions\//.test(url);
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function (cache) {
            // addAll is atomic: if any single fetch fails the install fails.
            // Use individual puts so missing optional files don't block install.
            return Promise.all(SHELL.map(function (url) {
                return fetch(url, { mode: 'no-cors' })
                    .then(function (res) { return cache.put(url, res); })
                    .catch(function () { /* skip if unavailable */ });
            }));
        }).then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (k) {
                if (k !== CACHE_VERSION) return caches.delete(k);
            }));
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function (event) {
    // Only handle GETs
    if (event.request.method !== 'GET') return;

    var url = event.request.url;

    // Dynamic paths (the mission catalog) — network-first so updates
    // published to the server actually reach the client. Fall back to
    // the most recent successful cached response when offline.
    if (isDynamic(url)) {
        event.respondWith(
            fetch(event.request).then(function (res) {
                if (res && res.status === 200) {
                    var clone = res.clone();
                    caches.open(CACHE_VERSION).then(function (c) { c.put(event.request, clone); });
                }
                return res;
            }).catch(function () {
                return caches.match(event.request);
            })
        );
        return;
    }

    // App shell — cache-first.
    event.respondWith(
        caches.match(event.request).then(function (cached) {
            if (cached) return cached;
            return fetch(event.request).then(function (res) {
                if (res && res.status === 200 && res.type === 'basic') {
                    var clone = res.clone();
                    caches.open(CACHE_VERSION).then(function (c) { c.put(event.request, clone); });
                }
                return res;
            }).catch(function () {
                if (event.request.mode === 'navigate') {
                    return caches.match('/games/expeditions/index.html');
                }
            });
        })
    );
});
