/**
 * Site Header Web Component
 * A header component with navigation and theme toggle
 * 🏗️ Enhanced with logo and responsive menu
 */
export class SiteHeader extends HTMLElement {
	/**
	 * Constructor for the site header component
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.menuOpen = false;
	}

	/**
	 * Connect component and add event listeners
	 */
	connectedCallback() {
		this.render();
		this.setupEventListeners();
	}

	/**
	 * Set up event listeners for the mobile menu toggle
	 */
	setupEventListeners() {
		const menuToggle = this.shadowRoot.querySelector('.menu-toggle');
		if (menuToggle) {
			menuToggle.addEventListener('click', () => {
				this.menuOpen = !this.menuOpen;
				this.updateMenuState();
			});
		}

		// Close menu when clicking outside
		document.addEventListener('click', (event) => {
			if (this.menuOpen && !this.contains(event.target)) {
				this.menuOpen = false;
				this.updateMenuState();
			}
		});

		// Handle window resize
		window.addEventListener('resize', () => {
			if (window.innerWidth > 768 && this.menuOpen) {
				this.menuOpen = false;
				this.updateMenuState();
			}
		});
	}

	/**
	 * Update the mobile menu state based on this.menuOpen
	 */
	updateMenuState() {
		const menu = this.shadowRoot.querySelector('.nav-links');
		const menuToggle = this.shadowRoot.querySelector('.menu-toggle');

		if (this.menuOpen) {
			menu.classList.add('active');
			menuToggle.setAttribute('aria-expanded', 'true');
			console.info('🧭 🍔 Mobile menu opened');
		} else {
			menu.classList.remove('active');
			menuToggle.setAttribute('aria-expanded', 'false');
			console.info('🧭 🍔 Mobile menu closed');
		}
	}

	/**
	 * Render the component HTML
	 */
	render() {
		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="/components/site-header.css">
			<header>
				<div class="container">
					<div class="logo">
						<a href="/">
							<span class="logo-text">GeneriCorp</span>
						</a>
					</div>

					<button class="menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-links">
						<span class="bar"></span>
						<span class="bar"></span>
						<span class="bar"></span>
					</button>

					<nav>
						<div class="nav-links" id="nav-links">
							<slot></slot>
						</div>
					</nav>

					<div class="header-actions">
						<slot name="actions"></slot>
					</div>
				</div>
			</header>
		`;
	}
}

// Register the component if not already registered
if (!customElements.get('site-header')) {
	customElements.define('site-header', SiteHeader);
}