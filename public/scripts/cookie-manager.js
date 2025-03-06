/**
 * Cookie Manager
 * Handles cookie consent interactions and initializes features based on user preferences
 */
document.addEventListener('DOMContentLoaded', () => {
	setupCookieConsentListeners();
});

/**
 * Set up listeners for cookie consent events
 */
function setupCookieConsentListeners() {
	const cookieConsentElement = document.querySelector('cookie-consent');

	if (cookieConsentElement) {
		cookieConsentElement.addEventListener('preferencesLoaded', (e) => {
			console.debug('Cookie preferences loaded:', e.detail);
			handleCookiePreferences(e.detail);
		});

		cookieConsentElement.addEventListener('preferencesChanged', (e) => {
			console.debug('Cookie preferences changed:', e.detail);
			handleCookiePreferences(e.detail);
		});
	}
}

/**
 * Handle cookie preferences and initialize appropriate features
 * @param {Object} preferences - Cookie preferences object
 */
function handleCookiePreferences(preferences) {
	// Initialize analytics if allowed
	if (preferences.analytics) {
		initializeAnalytics();
	}

	// Initialize other cookie-dependent features
	if (preferences.preferences) {
		initializePreferences();
	}

	if (preferences.marketing) {
		initializeMarketing();
	}
}

/**
 * Initialize analytics (placeholder function)
 */
function initializeAnalytics() {
	console.debug('Analytics initialized');
	// Here you would include your actual analytics initialization code
}

/**
 * Initialize preferences (placeholder function)
 */
function initializePreferences() {
	console.debug('Preferences cookies initialized');
	// Initialize preferences-related features
}

/**
 * Initialize marketing (placeholder function)
 */
function initializeMarketing() {
	console.debug('Marketing features initialized');
	// Initialize marketing-related features
}

// Export functions for use in other modules
export { handleCookiePreferences };
