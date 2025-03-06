importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.0/workbox-sw.js');

// Use workbox for better caching strategies
const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { precacheAndRoute } = workbox.precaching;

// Precache essential resources
precacheAndRoute([
	{ url: '/', revision: '1' },
	{ url: '/index.html', revision: '1' },
	{ url: '/styles/all.css', revision: '1' },
	{ url: '/styles/light.css', revision: '1' },
	{ url: '/styles/wide.css', revision: '1' },
	{ url: '/styles/transitions.css', revision: '1' },
	{ url: '/scripts/async.js', revision: '1' },
	{ url: '/scripts/defer.js', revision: '1' },
	{ url: '/scripts/transitions.js', revision: '1' },
	{ url: '/manifest.json', revision: '1' },
]);

// Cache page navigations with Network-first strategy
registerRoute(
	({ request }) => request.mode === 'navigate',
	new NetworkFirst({
		cacheName: 'pages',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 50,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
			}),
		],
	}),
);

// Cache CSS and JS with Stale-While-Revalidate strategy
registerRoute(
	({ request }) => request.destination === 'style' || request.destination === 'script',
	new StaleWhileRevalidate({
		cacheName: 'assets',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 60,
				maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
			}),
		],
	}),
);

// Cache images with Cache-first strategy
registerRoute(
	({ request }) => request.destination === 'image',
	new CacheFirst({
		cacheName: 'images',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
			}),
		],
	}),
);

// Handle offline fallback
const offlineFallbackPage = '/offline.html';

// Install and configure offline page
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('offline').then((cache) => {
			return cache.add(offlineFallbackPage);
		}),
	);
});

// Provide offline fallback
self.addEventListener('fetch', (event) => {
	if (event.request.mode === 'navigate') {
		event.respondWith(
			fetch(event.request).catch(() => {
				return caches.match(offlineFallbackPage);
			}),
		);
	}
});

console.debug('👋👷‍♂️ Enhanced service worker installed');
