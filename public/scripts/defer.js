// DOM-dependent JavaScript
console.debug('deferred script loaded');

document.addEventListener('DOMContentLoaded', () => {
	// Initialize behaviors
	setupIntersectionObservers();
	setupBotProtection();
	setupThemeToggle();
});

/**
 * Set up theme toggle interaction
 */
function setupThemeToggle() {
	const themeToggle = document.querySelector('theme-toggle');
	if (themeToggle) {
		themeToggle.addEventListener('themeChange', (e) => {
			console.debug('Theme changed:', e.detail);
		});
	}
}

/**
 * Set up intersection observers for lazy loading and animations
 */
function setupIntersectionObservers() {
	// Lazy loading images
	const imgObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = entry.target;
					const src = img.getAttribute('data-src');
					if (src) {
						img.src = src;
						img.removeAttribute('data-src');
						imgObserver.unobserve(img);
					}
				}
			});
		},
		{ rootMargin: '200px' },
	);

	// Apply to images with data-src
	document.querySelectorAll('img[data-src]').forEach((img) => {
		imgObserver.observe(img);
	});

	// Animate elements when they enter the viewport
	const animateObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('animate-in');
				animateObserver.unobserve(entry.target);
			}
		});
	});

	// Apply to elements with data-animate
	document.querySelectorAll('[data-animate]').forEach((el) => {
		animateObserver.observe(el);
	});
}

/**
 * Simple bot protection measures
 */
function setupBotProtection() {
	// Add honey pot fields to forms
	document.querySelectorAll('form').forEach((form) => {
		// Create a hidden honeypot field
		const honeyPot = document.createElement('div');
		honeyPot.style.opacity = '0';
		honeyPot.style.position = 'absolute';
		honeyPot.style.height = '0';
		honeyPot.style.overflow = 'hidden';

		const honeyInput = document.createElement('input');
		honeyInput.type = 'text';
		honeyInput.name = 'bot_check';
		honeyInput.id = 'bot_check';
		honeyInput.setAttribute('tabindex', '-1');
		honeyInput.setAttribute('autocomplete', 'off');

		honeyPot.appendChild(honeyInput);
		form.appendChild(honeyPot);

		// Add form validation
		form.addEventListener('submit', (e) => {
			if (honeyInput.value !== '') {
				e.preventDefault();
				console.debug('Bot submission prevented');
			}
		});
	});
}
