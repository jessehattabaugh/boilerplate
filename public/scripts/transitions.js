// View Transitions API implementation
document.addEventListener('DOMContentLoaded', () => {
	// Initialize cookie consent
	initCookieConsent();

	// Setup View Transitions for navigation
	setupViewTransitions();
});

/**
 * Initialize the cookie consent dialog
 */
function initCookieConsent() {
	const cookieConsent = document.getElementById('cookie-consent');
	const acceptButton = document.getElementById('cookie-accept');
	const declineButton = document.getElementById('cookie-decline');

	// Check if user has already made a choice
	const cookieChoice = localStorage.getItem('cookie-choice');

	if (!cookieChoice) {
		// Show the cookie consent dialog
		cookieConsent.removeAttribute('hidden');

		// Handle user choices
		acceptButton.addEventListener('click', () => {
			localStorage.setItem('cookie-choice', 'accepted');
			cookieConsent.setAttribute('hidden', '');
			// Here you would initialize analytics or other cookie-dependent features
		});

		declineButton.addEventListener('click', () => {
			localStorage.setItem('cookie-choice', 'declined');
			cookieConsent.setAttribute('hidden', '');
		});
	}
}

/**
 * Setup view transitions for internal navigation
 */
function setupViewTransitions() {
	// Check if the View Transitions API is supported
	if (!document.startViewTransition) {
		console.debug('View Transitions API not supported');
		return;
	}

	// Add event listeners to all internal links
	document.addEventListener('click', (e) => {
		// Find closest anchor element
		const link = e.target.closest('a');

		if (!link) return;

		// Check if it's an internal link
		const url = new URL(link.href);
		const isInternal = url.origin === window.location.origin;

		if (!isInternal) return;

		// Prevent default navigation
		e.preventDefault();

		// Use the View Transitions API
		navigate(link.href);
	});
}

/**
 * Navigate to a new page using View Transitions API
 * @param {string} url - The URL to navigate to
 */
async function navigate(url) {
	// Start a view transition
	const transition = document.startViewTransition(async () => {
		try {
			// Fetch the new page
			const response = await fetch(url);
			const text = await response.text();

			// Extract the content from the new page
			const parser = new DOMParser();
			const newDocument = parser.parseFromString(text, 'text/html');
			const newMain = newDocument.querySelector('main');

			// Update the page title and URL
			document.title = newDocument.title;
			window.history.pushState({}, '', url);

			// Replace the current main content with the new content
			document.querySelector('main').innerHTML = newMain.innerHTML;
		} catch (error) {
			console.error('Navigation failed:', error);
		}
	});

	// Optional: You can add event listeners for the transition
	transition.ready.then(() => {
		console.debug('View transition ready');
	});

	transition.finished.then(() => {
		console.debug('View transition finished');
		// Re-initialize any scripts that should run on the new page
	});
}
