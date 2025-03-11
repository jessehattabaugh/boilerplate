/**
 * Theme Toggle Web Component
 * 🌓 Controls light/dark theme preferences
 */
export class ThemeToggle extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.currentTheme = 'system';
		this.themes = ['light', 'dark', 'system'];
	}

	connectedCallback() {
		this.render();
		this.setupEventListeners();
		this.applyInitialTheme();

		// Setup system theme detection
		this.setupSystemThemeDetection();
	}

	/**
	 * Render the component
	 */
	render() {
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: inline-block;
				}

				.toggle-button {
					background-color: transparent;
					border: none;
					cursor: pointer;
					padding: 8px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: background-color 0.3s ease;
					color: var(--color-text);
				}

				.toggle-button:hover {
					background-color: var(--color-surface-hover);
				}

				.toggle-button:focus-visible {
					outline: 2px solid var(--color-primary);
					outline-offset: 2px;
				}

				.icon {
					font-size: 1.2rem;
					width: 24px;
					height: 24px;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				@media (prefers-reduced-motion: reduce) {
					.toggle-button {
						transition: none;
					}
				}
			</style>

			<button class="toggle-button" aria-label="Toggle theme mode" title="Toggle theme mode">
				<span class="icon" aria-hidden="true"></span>
			</button>
		`;
	}

	/**
	 * Add event listeners to the toggle button
	 */
	setupEventListeners() {
		const button = this.shadowRoot.querySelector('.toggle-button');

		button.addEventListener('click', () => {
			this.cycleTheme();
		});

		button.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				this.cycleTheme();
			}
		});
	}

	/**
	 * Apply initial theme based on stored preference or system setting
	 */
	applyInitialTheme() {
		// Check for stored preference
		const storedTheme = localStorage.getItem('theme-preference');

		if (storedTheme && this.themes.includes(storedTheme)) {
			this.currentTheme = storedTheme;
		} else {
			// Default to system theme if no preference
			this.currentTheme = 'system';
		}

		this.applyTheme(this.currentTheme);
		this.updateButtonAppearance();

		console.debug('🌓 Initial theme applied:', this.currentTheme);
	}

	/**
	 * Setup system theme detection and change listener
	 */
	setupSystemThemeDetection() {
		// Match media query for dark mode preference
		this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		// Initial check if using system theme
		if (this.currentTheme === 'system') {
			this.applySystemTheme();
		}

		// Listen for system theme changes
		this.darkModeMediaQuery.addEventListener('change', () => {
			if (this.currentTheme === 'system') {
				this.applySystemTheme();
			}
		});
	}

	/**
	 * Apply the system theme based on user's OS preference
	 */
	applySystemTheme() {
		const isDarkMode = this.darkModeMediaQuery.matches;
		const systemTheme = isDarkMode ? 'dark' : 'light';

		document.documentElement.setAttribute('data-theme', systemTheme);
		document.body.classList.remove('light-mode', 'dark-mode');
		document.body.classList.add(`${systemTheme}-mode`);

		console.debug('🌓 System theme applied:', systemTheme);
	}

	/**
	 * Apply a specific theme
	 * @param {string} theme - The theme to apply ('light', 'dark', or 'system')
	 */
	applyTheme(theme) {
		// Save preference
		localStorage.setItem('theme-preference', theme);
		this.currentTheme = theme;

		// Reset classes
		document.body.classList.remove('light-mode', 'dark-mode');

		// Apply theme
		if (theme === 'system') {
			this.applySystemTheme();
		} else {
			document.documentElement.setAttribute('data-theme', theme);
			document.body.classList.add(`${theme}-mode`);
		}

		// Update the button icon
		this.updateButtonAppearance();

		// Dispatch event so other components can react
		this.dispatchEvent(new CustomEvent('theme-changed', {
			bubbles: true,
			composed: true,
			detail: { theme }
		}));

		console.log('🌓 Theme changed to:', theme);
	}

	/**
	 * Cycle to the next theme option
	 */
	cycleTheme() {
		const currentIndex = this.themes.indexOf(this.currentTheme);
		const nextIndex = (currentIndex + 1) % this.themes.length;
		const nextTheme = this.themes[nextIndex];

		this.applyTheme(nextTheme);
	}

	/**
	 * Update button appearance based on current theme
	 */
	updateButtonAppearance() {
		const iconElement = this.shadowRoot.querySelector('.icon');
		const button = this.shadowRoot.querySelector('.toggle-button');

		if (!iconElement || !button) return;

		// Update icon
		switch (this.currentTheme) {
			case 'light':
				iconElement.textContent = '☀️';
				button.setAttribute('title', 'Switch to dark mode');
				button.setAttribute('aria-label', 'Switch to dark mode');
				break;
			case 'dark':
				iconElement.textContent = '🌙';
				button.setAttribute('title', 'Switch to system theme');
				button.setAttribute('aria-label', 'Switch to system theme');
				break;
			case 'system':
			default:
				iconElement.textContent = '🌓';
				button.setAttribute('title', 'Switch to light mode');
				button.setAttribute('aria-label', 'Switch to light mode');
				break;
		}
	}
}

// Not registering the component here - this is done in the main JS file