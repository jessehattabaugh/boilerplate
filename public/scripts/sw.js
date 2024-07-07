importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');
// eslint-disable-next-line no-undef
const { registerRoute } = workbox.routing;
// eslint-disable-next-line no-undef
const { CacheFirst } = workbox.strategies;
registerRoute(() => {
	return true;
}, new CacheFirst());
console.debug('👋👷‍♂️ service worker cacheing enabled');
