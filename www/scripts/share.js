/**
 * Web Share API utilities
 */
class ShareManager {
	/**
	 * Check if Web Share API is available
	 * @returns {boolean} Whether the API is available
	 */
	static isShareSupported() {
		return navigator.share !== undefined;
	}

	/**
	 * Share content using the Web Share API
	 * @param {Object} options - Share options
	 * @param {string} options.title - Title to share
	 * @param {string} options.text - Text to share
	 * @param {string} options.url - URL to share
	 * @param {File[]} options.files - Files to share (if supported)
	 * @returns {Promise<void>}
	 */
	static async share({ title, text, url = window.location.href, files = [] }) {
		if (!this.isShareSupported()) {
			console.warn('Web Share API not supported');
			return this.fallbackShare({ title, text, url });
		}

		const shareData = {
			title,
			text,
			url,
		};

		// Check if file sharing is supported
		if (files.length > 0 && navigator.canShare && navigator.canShare({ files })) {
			shareData.files = files;
		}

		try {
			await navigator.share(shareData);
			console.debug('Content shared successfully');
		} catch (error) {
			if (error.name !== 'AbortError') {
				console.error('Error sharing content:', error);
				this.fallbackShare({ title, text, url });
			}
		}
	}

	/**
	 * Fallback sharing method when Web Share API is not available
	 * @param {Object} options - Share options
	 */
	static fallbackShare({ title, text, url }) {
		// Try to copy to clipboard
		if (navigator.clipboard && navigator.clipboard.writeText) {
			const shareText = `${title}\n${text}\n${url}`;
			navigator.clipboard
				.writeText(shareText)
				.then(() => {
					alert('Content copied to clipboard for sharing');
				})
				.catch(() => {
					// If clipboard fails, open in new window
					this.openShareWindow(url);
				});
		} else {
			this.openShareWindow(url);
		}
	}

	/**
	 * Open a social sharing window
	 * @param {string} url - URL to share
	 */
	static openShareWindow(url) {
		const shareSites = [
			`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
		];

		// Display options to user
		const option = prompt(
			'Choose a platform to share on:\n1. Twitter\n2. Facebook\n3. LinkedIn',
			'1',
		);

		const index = parseInt(option, 10) - 1;
		if (index >= 0 && index < shareSites.length) {
			window.open(shareSites[index], 'share-window', 'width=550,height=400');
		}
	}
}

// Initialize share buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	const shareButtons = document.querySelectorAll('[data-share]');

	shareButtons.forEach((button) => {
		button.addEventListener('click', (e) => {
			e.preventDefault();

			const title = button.getAttribute('data-share-title') || document.title;
			const text = button.getAttribute('data-share-text') || '';
			const url = button.getAttribute('data-share-url') || window.location.href;

			ShareManager.share({ title, text, url });
		});
	});
});

// Export for module usage
export default ShareManager;
