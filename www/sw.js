/* eslint-env serviceworker */
/**
 * @typedef {import('workbox-routing')} WorkboxRouting
 * @typedef {import('workbox-strategies')} WorkboxStrategies
 * @typedef {import('workbox-expiration')} WorkboxExpiration
 * @typedef {import('workbox-precaching')} WorkboxPrecaching
 */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.0/workbox-sw.js');

// Use workbox for better caching strategies
const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { precacheAndRoute } = workbox.precaching;

// Precache essential resources organized by type
precacheAndRoute([
	// HTML pages
	{ url: '/', revision: '1' },
	{ url: '/index.html', revision: '1' },
	{ url: '/about.html', revision: '1' },
	{ url: '/offline.html', revision: '1' },

	// Core styles
	{ url: '/styles/all.css', revision: '1' },
	{ url: '/styles/light.css', revision: '1' },
	{ url: '/styles/wide.css', revision: '1' },
	{ url: '/styles/transitions.css', revision: '1' },
	{ url: '/styles/print.css', revision: '1' },

	// Components styles
	{ url: '/components/site-header.css', revision: '1' },
	{ url: '/components/site-footer.css', revision: '1' },
	{ url: '/components/image-carousel.css', revision: '1' },
	{ url: '/components/carousel-item.css', revision: '1' },

	// Core scripts
	{ url: '/scripts/async.js', revision: '1' },
	{ url: '/scripts/defer.js', revision: '1' },
	{ url: '/scripts/transitions.js', revision: '1' },
	{ url: '/scripts/config.js', revision: '1' },

	// Web components
	{ url: '/components/site-header.js', revision: '1' },
	{ url: '/components/site-footer.js', revision: '1' },
	{ url: '/components/image-carousel.js', revision: '1' },
	{ url: '/components/carousel-item.js', revision: '1' },

	// Configuration files
	{ url: '/manifest.json', revision: '1' },
	{ url: '/robots.txt', revision: '1' },
	{ url: '/humans.txt', revision: '1' },

	// Images
	{ url: '/icon/192.png', revision: '1' },
	{ url: '/icon/512.png', revision: '1' },
	{ url: '/favicon.ico', revision: '1' },
]);

// Cache page navigations with Network-first strategy
registerRoute(
	({ request }) => {
		return request.mode === 'navigate';
	},
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
	({ request }) => {
		return request.destination === 'style' || request.destination === 'script';
	},
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
	({ request }) => {
		return request.destination === 'image';
	},
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

// Cache other potential assets that might be used
registerRoute(
	({ request }) => {
		return (
			request.destination === 'font' ||
			request.destination === 'audio' ||
			request.destination === 'video' ||
			request.url.includes('/screenshots/')
		);
	},
	new CacheFirst({
		cacheName: 'other-assets',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 30,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
			}),
		],
	}),
);

console.debug('👋👷‍♂️ Enhanced service worker installed with comprehensive precaching');
