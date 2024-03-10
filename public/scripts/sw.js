importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js',
);
const { registerRoute } = workbox.routing;
const { CacheFirst } = workbox.strategies;
registerRoute(() => true, new CacheFirst());
console.debug('👋👷‍♂️ service worker caching enabled');
