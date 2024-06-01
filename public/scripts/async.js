// put JavaScript that doesn't require the DOM be fully parsed here

// register a service worker to enable PWA
if ('serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
		try {
			await navigator.serviceWorker.register('/scripts/sw.js', {
				scope: '/',
			});
			console.debug('👨‍🏭® service worker registered');
		} catch (exception) {
			console.error('👨‍🏭⚠ service worker failed', exception);
		}
	});
}
