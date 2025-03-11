/**
 * Main JavaScript for the homepage
 * 🏠 Handles components and interactions for the index page
 */

// Import web components
import { CarouselItem } from '/components/carousel-item.js';
import { ImageCarousel } from '/components/image-carousel.js';
import { SiteFooter } from '/components/site-footer.js';
import { SiteHeader } from '/components/site-header.js';
import { ThemeToggle } from '/components/theme-toggle.js';

// Register custom elements if not already registered
if (!customElements.get('site-header')) {
	customElements.define('site-header', SiteHeader);
}

if (!customElements.get('site-footer')) {
	customElements.define('site-footer', SiteFooter);
}

if (!customElements.get('theme-toggle')) {
	customElements.define('theme-toggle', ThemeToggle);
}

if (!customElements.get('image-carousel')) {
	customElements.define('image-carousel', ImageCarousel);
}

if (!customElements.get('carousel-item')) {
	customElements.define('carousel-item', CarouselItem);
}

/**
 * Update dynamic content on the page
 */
function updateDynamicContent() {
	// Update current year in footer
	const yearElement = document.getElementById('current-year');
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear();
	}
}

/**
 * Setup event listeners for page interactions
 */
function setupEventListeners() {
	// Listen for carousel events
	const carousel = document.querySelector('image-carousel');
	if (carousel) {
		carousel.addEventListener('slide-change', (e) => {
			console.info('🎠 Slide changed', {
				current: e.detail.index + 1,
				total: e.detail.total
			});
		});
	}

	// Handle CTA button interactions
	const ctaButton = document.querySelector('.cta-button');
	if (ctaButton) {
		ctaButton.addEventListener('click', () => {
			console.debug('🔘 CTA button clicked');
		});
	}
}

// Initialize page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	updateDynamicContent();
	setupEventListeners();
	console.log('🏠 Homepage initialized successfully');
});

// Support for browsers that don't emit DOMContentLoaded when scripts are loaded with defer
if (document.readyState === 'interactive' || document.readyState === 'complete') {
	updateDynamicContent();
	setupEventListeners();
	console.log('🏠 Homepage initialized (document already loaded)');
}

// Export key functions for potential reuse or testing
export { updateDynamicContent, setupEventListeners };
