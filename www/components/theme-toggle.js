/**
 * Theme Toggle Web Component
 * A toggle switch for dark/light mode with system preference detection
 */
class ThemeToggle extends HTMLElement {
	// Key for storing preference in localStorage
	#storageKey = 'theme-preference';

	// Available themes
	#themes = {
		light: 'light',
		dark: 'dark',
		system: 'system',
	};

	// Current theme
	#currentTheme = this.#themes.system;

	// Media query for system preference
	#systemPreference = window.matchMedia('(prefers-color-scheme: dark)');

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		// Load saved theme preference
		this.#loadThemePreference();

		// Bind methods
		this.#handleToggleClick = this.#handleToggleClick.bind(this);
		this.#handleSystemPreferenceChange = this.#handleSystemPreferenceChange.bind(this);
	}

	connectedCallback() {
		this.render();

		// Apply the theme immediately
		this.#applyTheme();

		// Add event listener for system preference changes
		this.#systemPreference.addEventListener('change', this.#handleSystemPreferenceChange);

		// Add event listener for toggle
		this.shadowRoot.querySelector('button').addEventListener('click', this.#handleToggleClick);
	}

	disconnectedCallback() {
		this.shadowRoot
			.querySelector('button')
			?.removeEventListener('click', this.#handleToggleClick);
		this.#systemPreference.removeEventListener('change', this.#handleSystemPreferenceChange);
	}

	/**
	 * Load theme preference from localStorage
	 * @private
	 */
	#loadThemePreference() {
		try {
			const savedTheme = localStorage.getItem(this.#storageKey);
			if (savedTheme && Object.values(this.#themes).includes(savedTheme)) {
				this.#currentTheme = savedTheme;
			}
		} catch (e) {
			console.warn('Failed to load theme preference', e);
		}
	}

	/**
	 * Save theme preference to localStorage
	 * @private
	 * @param {string} theme - The theme to save
	 */
	#saveThemePreference(theme) {
		try {
			localStorage.setItem(this.#storageKey, theme);
		} catch (e) {
			console.warn('Failed to save theme preference', e);
		}
	}

	/**
	 * Handle toggle button click
	 * @private
	 */
	#handleToggleClick() {
		switch (this.#currentTheme) {
			case this.#themes.light:
				this.#setTheme(this.#themes.dark);
				break;
			case this.#themes.dark:
				this.#setTheme(this.#themes.system);
				break;
			case this.#themes.system:
			default:
				this.#setTheme(this.#themes.light);
				break;
		}
	}

	/**
	 * Handle system preference change
	 * @private
	 */
	#handleSystemPreferenceChange() {
		if (this.#currentTheme === this.#themes.system) {
			this.#applyTheme();
			this.#updateToggleState();
		}
	}

	/**
	 * Set the theme
	 * @private
	 * @param {string} theme - The theme to set
	 */
	#setTheme(theme) {
		this.#currentTheme = theme;
		this.#saveThemePreference(theme);
		this.#applyTheme();
		this.#updateToggleState();

		// Dispatch event
		this.dispatchEvent(
			new CustomEvent('themeChange', {
				detail: {
					theme: this.#currentTheme,
					isDark: this.#isDarkThemeActive(),
				},
				bubbles: true,
			}),
		);
	}

	/**
	 * Apply the current theme to the document
	 * @private
	 */
	#applyTheme() {
		const isDark = this.#isDarkThemeActive();

		document.documentElement.classList.toggle('dark-mode', isDark);
		document.documentElement.classList.toggle('light-mode', !isDark);

		// Also update meta theme-color for mobile browsers
		const themeColorMeta = document.querySelector('meta[name="theme-color"]');
		if (themeColorMeta) {
			const darkThemeColor =
				getComputedStyle(document.documentElement)
					.getPropertyValue('--color-background')
					.trim() || '#121212';
			const lightThemeColor = '#ffffff';
			themeColorMeta.setAttribute('content', isDark ? darkThemeColor : lightThemeColor);
		}
	}

	/**
	 * Check if dark theme is currently active
	 * @private
	 * @returns {boolean} Whether dark theme is active
	 */
	#isDarkThemeActive() {
		if (this.#currentTheme === this.#themes.dark) {
			return true;
		}
		if (this.#currentTheme === this.#themes.light) {
			return false;
		}
		// System preference
		return this.#systemPreference.matches;
	}

	/**
	 * Update the toggle button state based on current theme
	 * @private
	 */
	#updateToggleState() {
		const toggle = this.shadowRoot.querySelector('button');
		if (!toggle) {
			return;
		}

		const icon = toggle.querySelector('.icon');
		const label = toggle.querySelector('.label');

		// Update ARIA attributes for accessibility
		toggle.setAttribute('aria-pressed', this.#isDarkThemeActive() ? 'true' : 'false');

		// Important: Make sure the button has proper ARIA role for screenreaders
		toggle.setAttribute('role', 'switch');
		toggle.setAttribute('aria-label', 'Toggle theme');

		// Update icon and label based on current state
		let iconSvg = '';
		let labelText = '';

		switch (this.#currentTheme) {
			case this.#themes.light:
				iconSvg = this.#icons.light;
				labelText = 'Light';
				break;
			case this.#themes.dark:
				iconSvg = this.#icons.dark;
				labelText = 'Dark';
				break;
			case this.#themes.system:
				iconSvg = this.#systemPreference.matches ? this.#icons.dark : this.#icons.light;
				labelText = 'Auto';
				break;
		}

		icon.innerHTML = iconSvg;
		label.textContent = labelText;
	}

	/**
	 * SVG icons for the toggle button
	 * @private
	 */
	#icons = {
		light: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`,
		dark: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`,
		system: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>`,
	};

	/**
	 * Render the component
	 */
	render() {
		this.shadowRoot.innerHTML = `
      <style>
        :host {
          --toggle-bg: var(--theme-toggle-bg, rgba(0, 0, 0, 0.1));
          --toggle-color: var(--theme-toggle-color, inherit);
          --toggle-hover: var(--theme-toggle-hover, rgba(0, 0, 0, 0.15));
          --toggle-active: var(--theme-toggle-active, var(--cc-primary, #4f46e5));
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --toggle-bg: var(--theme-toggle-dark-bg, rgba(255, 255, 255, 0.1));
            --toggle-hover: var(--theme-toggle-dark-hover, rgba(255, 255, 255, 0.15));
          }
        }

        button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background-color: var(--toggle-bg);
          color: var(--toggle-color);
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-size: 0.875rem;
        }

        button:hover {
          background-color: var(--toggle-hover);
        }

        button:focus-visible {
          outline: 3px solid var(--toggle-active);
          outline-offset: 2px;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .label {
          font-size: 0.875rem;
        }

        /* Hide the label on small screens */
        @media screen and (max-width: 30em) {
          .label {
            display: none;
          }
        }
      </style>

      <button
        aria-label="Toggle theme"
        title="Toggle between light, dark, and system theme"
        role="switch"
        aria-pressed="false"
      >
        <span class="icon" aria-hidden="true"></span>
        <span class="label"></span>
      </button>
    `;

		// Update toggle state after rendering
		this.#updateToggleState();
	}

	/**
	 * Get the current theme
	 * @returns {string} The current theme
	 */
	getTheme() {
		return this.#currentTheme;
	}

	/**
	 * Check if dark mode is active
	 * @returns {boolean} Whether dark mode is active
	 */
	isDarkMode() {
		return this.#isDarkThemeActive();
	}

	/**
	 * Set the theme programmatically
	 * @param {string} theme - 'light', 'dark', or 'system'
	 */
	setTheme(theme) {
		if (Object.values(this.#themes).includes(theme)) {
			this.#setTheme(theme);
		} else {
			console.warn(
				`Invalid theme: ${theme}. Must be one of: ${Object.values(this.#themes).join(
					', ',
				)}`,
			);
		}
	}
}

// Define the custom element
customElements.define('theme-toggle', ThemeToggle);
