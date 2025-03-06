// JavaScript that doesn't require the DOM be fully parsed

// Feature detection and polyfill loading
const modernFeatures = {
	viewTransitions: 'startViewTransition' in document,
	intersectionObserver: 'IntersectionObserver' in window,
	resizeObserver: 'ResizeObserver' in window,
	containerQueries: CSS.supports('container-type: inline-size'),
	colorScheme: window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all',
};

console.debug('Feature detection:', modernFeatures);

// Register service worker for PWA capabilities
if ('serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
		try {
			const registration = await navigator.serviceWorker.register('/sw.js', {
				scope: '/',
			});
			console.debug('👨‍🏭® service worker registered', registration.scope);

			// Set up periodic background sync if supported
			if ('periodicSync' in registration) {
				// Request permission for background sync
				const status = await navigator.permissions.query({
					name: 'periodic-background-sync',
				});

				if (status.state === 'granted') {
					try {
						await registration.periodicSync.register('content-sync', {
							minInterval: 24 * 60 * 60 * 1000, // 1 day
						});
						console.debug('Periodic background sync registered');
					} catch (error) {
						console.warn('Periodic background sync registration failed:', error);
					}
				}
			}
		} catch (exception) {
			console.error('👨‍🏭⚠ service worker failed', exception);
		}
	});
}

// Preconnect to critical domains
function addPreconnect(url) {
	const link = document.createElement('link');
	link.rel = 'preconnect';
	link.href = url;
	document.head.appendChild(link);
}

// Add DNS-prefetch for faster resource loading
function addDnsPrefetch(url) {
	const link = document.createElement('link');
	link.rel = 'dns-prefetch';
	link.href = url;
	document.head.appendChild(link);
}

// Add critical performance optimizations
const criticalDomains = ['https://storage.googleapis.com'];
for (const domain of criticalDomains) {
	addPreconnect(domain);
	addDnsPrefetch(domain);
}

// Detect network status
function updateNetworkStatus() {
	const isOnline = navigator.onLine;
	document.documentElement.classList.toggle('offline', !isOnline);

	if (!isOnline) {
		console.debug('App is offline');
	}
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();
