/**
 * Cookie Consent Web Component
 * A GDPR-compliant cookie consent dialog that uses the Popup API
 */
class CookieConsent extends HTMLElement {
	#preferences = {
		necessary: true, // Always true
		analytics: false,
		preferences: false,
		marketing: false,
	};

	#storageKey = 'cookie-preferences';
	#resolvePromise = null;
	#consentPromise = null;

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.#consentPromise = new Promise((resolve) => {
			this.#resolvePromise = resolve;
		});

		// Load saved preferences if available
		this.#loadPreferences();
	}

	connectedCallback() {
		// Use the popup attribute for native popup behavior
		if (!this.hasAttribute('popup') && 'popover' in document.createElement('div')) {
			this.setAttribute('popup', '');
		}

		// Initialize component if preferences aren't set
		if (!this.#hasPreferencesStored()) {
			this.render();

			// Show popup after a short delay
			setTimeout(() => {
				if ('showPopover' in this) {
					this.showPopover();
				} else {
					this.style.display = 'block';
				}
			}, 1000);
		} else {
			// Emit loaded event with stored preferences
			this.dispatchEvent(
				new CustomEvent('preferencesLoaded', {
					detail: { ...this.#preferences },
					bubbles: true,
				}),
			);
		}
	}

	disconnectedCallback() {
		this.shadowRoot
			.querySelector('#accept-all')
			?.removeEventListener('click', this.#handleAcceptAll);
		this.shadowRoot
			.querySelector('#accept-necessary')
			?.removeEventListener('click', this.#handleAcceptNecessary);
		this.shadowRoot
			.querySelector('#customize')
			?.removeEventListener('click', this.#handleCustomize);
		this.shadowRoot
			.querySelector('#save-preferences')
			?.removeEventListener('click', this.#handleSavePreferences);
	}

	static get observedAttributes() {
		return ['privacy-policy-url', 'necessary-cookies', 'optional-cookies'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue && this.isConnected) {
			this.render();
		}
	}

	/**
	 * Check if a cookie category is allowed
	 * @param {string} category - The cookie category to check
	 * @returns {boolean} - Whether the cookie is allowed
	 */
	isAllowed(category) {
		return this.#preferences[category] || false;
	}

	/**
	 * Get the consent promise that resolves when preferences are set
	 * @returns {Promise} - Promise that resolves with preferences
	 */
	get consentPromise() {
		return this.#consentPromise;
	}

	/**
	 * Save preferences and hide the popup
	 * @private
	 */
	#savePreferences(preferences) {
		this.#preferences = {
			...this.#preferences,
			...preferences,
		};

		// Store in localStorage
		localStorage.setItem(this.#storageKey, JSON.stringify(this.#preferences));

		// Hide the popup
		if ('hidePopover' in this) {
			this.hidePopover();
		} else {
			this.style.display = 'none';
		}

		// Dispatch event
		this.dispatchEvent(
			new CustomEvent('preferencesChanged', {
				detail: { ...this.#preferences },
				bubbles: true,
			}),
		);

		// Resolve the promise
		if (this.#resolvePromise) {
			this.#resolvePromise(this.#preferences);
			this.#resolvePromise = null;
		}
	}

	/**
	 * Load preferences from localStorage
	 * @private
	 */
	#loadPreferences() {
		try {
			const stored = localStorage.getItem(this.#storageKey);
			if (stored) {
				const parsed = JSON.parse(stored);
				this.#preferences = {
					...this.#preferences,
					...parsed,
				};

				// Resolve the promise immediately if we have stored preferences
				if (this.#resolvePromise) {
					this.#resolvePromise(this.#preferences);
					this.#resolvePromise = null;
				}
			}
		} catch (e) {
			console.error('Error loading cookie preferences', e);
		}
	}

	/**
	 * Check if preferences are already stored
	 * @private
	 * @returns {boolean} - Whether preferences are stored
	 */
	#hasPreferencesStored() {
		return localStorage.getItem(this.#storageKey) !== null;
	}

	/**
	 * Handle clicking the "Accept All" button
	 * @private
	 */
	#handleAcceptAll = () => {
		this.#savePreferences({
			necessary: true,
			analytics: true,
			preferences: true,
			marketing: true,
		});
	};

	/**
	 * Handle clicking the "Accept Necessary" button
	 * @private
	 */
	#handleAcceptNecessary = () => {
		this.#savePreferences({
			necessary: true,
			analytics: false,
			preferences: false,
			marketing: false,
		});
	};

	/**
	 * Handle clicking the "Customize" button
	 * @private
	 */
	#handleCustomize = () => {
		const mainView = this.shadowRoot.getElementById('main-view');
		const customizeView = this.shadowRoot.getElementById('customize-view');

		mainView.style.display = 'none';
		customizeView.style.display = 'block';
	};

	/**
	 * Handle clicking the "Save Preferences" button
	 * @private
	 */
	#handleSavePreferences = () => {
		const analyticsCheckbox = this.shadowRoot.getElementById('analytics-checkbox');
		const preferencesCheckbox = this.shadowRoot.getElementById('preferences-checkbox');
		const marketingCheckbox = this.shadowRoot.getElementById('marketing-checkbox');

		this.#savePreferences({
			necessary: true,
			analytics: analyticsCheckbox.checked,
			preferences: preferencesCheckbox.checked,
			marketing: marketingCheckbox.checked,
		});
	};

	/**
	 * Render the component
	 */
	render() {
		const privacyPolicyUrl = this.getAttribute('privacy-policy-url') || '/privacy-policy';
		const necessaryCookies = this.getAttribute('necessary-cookies') || 'session,csrf';
		const optionalCookies =
			this.getAttribute('optional-cookies') || 'analytics,preferences,marketing';

		this.shadowRoot.innerHTML = `
      <style>
        :host {
          --cc-background: var(--cookie-background, #ffffff);
          --cc-text: var(--cookie-text, #000000);
          --cc-border: var(--cookie-border, #d1d5db);
          --cc-primary: var(--cookie-primary, #4f46e5);
          --cc-primary-text: var(--cookie-primary-text, #ffffff);
          --cc-secondary: var(--cookie-secondary, #e5e7eb);
          --cc-secondary-text: var(--cookie-secondary-text, #374151);

          background: var(--cc-background);
          color: var(--cc-text);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--cc-border);
          width: 100%;
          max-width: 400px;
          z-index: 1000;
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --cc-background: var(--cookie-dark-background, #1f2937);
            --cc-text: var(--cookie-dark-text, #f9fafb);
            --cc-border: var(--cookie-dark-border, #374151);
            --cc-secondary: var(--cookie-dark-secondary, #374151);
            --cc-secondary-text: var(--cookie-dark-secondary-text, #f3f4f6);
          }
        }

        .container {
          padding: 1.5rem;
        }

        h2 {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
        }

        p {
          margin: 0 0 1.5rem 0;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: none;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .primary-btn {
          background-color: var(--cc-primary);
          color: var(--cc-primary-text);
        }

        .secondary-btn {
          background-color: var(--cc-secondary);
          color: var(--cc-secondary-text);
        }

        .link {
          color: var(--cc-primary);
          text-decoration: underline;
          cursor: pointer;
        }

        .cookie-option {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .cookie-option input {
          margin-right: 0.5rem;
          margin-top: 0.25rem;
        }

        .cookie-option label {
          font-size: 0.875rem;
        }

        .cookie-description {
          font-size: 0.75rem;
          margin-top: 0.25rem;
          margin-left: 1.5rem;
          color: var(--cc-text-secondary, #6b7280);
        }

        #customize-view {
          display: none;
        }

        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Enhance focus visibility for keyboard navigation */
        button:focus-visible {
          outline: 3px solid var(--cc-primary);
          outline-offset: 2px;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
        }

        /* Make sure checkboxes are visible when focused */
        input[type="checkbox"]:focus-visible {
          outline: 2px solid var(--cc-primary);
          outline-offset: 2px;
        }
      </style>

      <div class="container" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-description">
        <div id="main-view">
          <h2 id="cookie-title">Cookie Settings</h2>
          <p id="cookie-description">
            We use cookies to enhance your experience on our website.
            <a href="${privacyPolicyUrl}" class="link">Read our privacy policy</a> to learn more.
          </p>
          <div class="buttons">
            <button id="accept-all" class="primary-btn" aria-label="Accept all cookies">Accept All</button>
            <button id="accept-necessary" class="secondary-btn" aria-label="Accept only necessary cookies">Accept Necessary</button>
            <button id="customize" class="secondary-btn" aria-label="Customize cookie preferences">Customize</button>
          </div>
        </div>

        <div id="customize-view">
          <h2 id="customize-title">Customize Cookie Preferences</h2>

          <div class="cookie-option">
            <input type="checkbox" id="necessary-checkbox" checked disabled aria-describedby="necessary-description">
            <div>
              <label for="necessary-checkbox">Necessary Cookies</label>
              <p class="cookie-description" id="necessary-description">
                Required for the website to function properly (${necessaryCookies}).
              </p>
            </div>
          </div>

          <div class="cookie-option">
            <input type="checkbox" id="analytics-checkbox" aria-describedby="analytics-description">
            <div>
              <label for="analytics-checkbox">Analytics Cookies</label>
              <p class="cookie-description" id="analytics-description">
                Help us improve our website by collecting anonymous usage data.
              </p>
            </div>
          </div>

          <div class="cookie-option">
            <input type="checkbox" id="preferences-checkbox" aria-describedby="preferences-description">
            <div>
              <label for="preferences-checkbox">Preferences Cookies</label>
              <p class="cookie-description" id="preferences-description">
                Remember your settings and preferences for future visits.
              </p>
            </div>
          </div>

          <div class="cookie-option">
            <input type="checkbox" id="marketing-checkbox" aria-describedby="marketing-description">
            <div>
              <label for="marketing-checkbox">Marketing Cookies</label>
              <p class="cookie-description" id="marketing-description">
                Used to deliver personalized advertisements based on your interests.
              </p>
            </div>
          </div>

          <div class="buttons">
            <button id="save-preferences" class="primary-btn" aria-label="Save cookie preferences">Save Preferences</button>
          </div>
        </div>
      </div>
    `;

		// Add event listeners
		this.shadowRoot
			.querySelector('#accept-all')
			.addEventListener('click', this.#handleAcceptAll);
		this.shadowRoot
			.querySelector('#accept-necessary')
			.addEventListener('click', this.#handleAcceptNecessary);
		this.shadowRoot
			.querySelector('#customize')
			.addEventListener('click', this.#handleCustomize);
		this.shadowRoot
			.querySelector('#save-preferences')
			.addEventListener('click', this.#handleSavePreferences);
	}
}

// Define the custom element
customElements.define('cookie-consent', CookieConsent);
