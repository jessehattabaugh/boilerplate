/**
 * Site configuration
 * Edit these values to customize your site
 */
const siteConfig = {
	title: 'Web Boilerplate',
	description: 'A modern web boilerplate',
	shortName: 'Boilerplate',
	url: 'https://example.com',
	author: 'Your Name',
	themeColor: '#bb86fc',
	social: {
		twitter: 'yourusername',
		github: 'yourusername',
	},
};

/**
 * Apply configuration to the document
 */
document.addEventListener('DOMContentLoaded', () => {
	// Set document title
	document.title = siteConfig.title;

	// Update meta description
	const descriptionMeta = document.querySelector('meta[name="description"]');
	if (descriptionMeta) {
		descriptionMeta.setAttribute('content', siteConfig.description);
	}

	// Update theme color
	const themeColorMeta = document.querySelector('meta[name="theme-color"]');
	if (themeColorMeta) {
		themeColorMeta.setAttribute('content', siteConfig.themeColor);
	}

	// Update title elements
	document.querySelectorAll('[data-site-title]').forEach((el) => {
		el.textContent = siteConfig.title;
	});

	// Update description elements
	document.querySelectorAll('[data-site-description]').forEach((el) => {
		el.textContent = siteConfig.description;
	});

	// Set current year in footer
	document.getElementById('current-year').textContent = new Date().getFullYear();

	// Update manifest dynamically (this won't work for PWA installation,
	// but helps ensure consistency for manifest requests after installation)
	try {
		fetch('/manifest.json')
			.then((response) => response.json())
			.then((manifest) => {
				const link = document.createElement('link');
				link.rel = 'manifest';
				link.href = URL.createObjectURL(
					new Blob(
						[
							JSON.stringify({
								...manifest,
								name: siteConfig.title,
								short_name: siteConfig.shortName,
								description: siteConfig.description,
								theme_color: siteConfig.themeColor,
							}),
						],
						{ type: 'application/json' },
					),
				);
				const existingManifest = document.querySelector('link[rel="manifest"]');
				if (existingManifest) {
					existingManifest.remove();
				}
				document.head.appendChild(link);
			})
			.catch((err) => console.warn('Failed to update manifest dynamically', err));
	} catch (e) {
		console.warn('Dynamic manifest update not supported', e);
	}
});

// Export for use in other modules
export default siteConfig;
