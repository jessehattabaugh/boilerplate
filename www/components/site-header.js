/**
 * Site Header Web Component
 * Encapsulates the site header with navigation and theme toggle
 */
export class SiteHeader extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
	}

	render() {
		const currentPath = window.location.pathname;

		this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 2rem;
        }

        header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        h1 {
          margin: 0;
          font-size: 1.8rem;
        }

        nav {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 1.5rem;
        }

        a {
          color: var(--color-text, inherit);
          text-decoration: none;
          padding: 0.5rem 0;
          position: relative;
        }

        a.active {
          font-weight: bold;
        }

        a.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--color-primary, currentColor);
        }

        a:hover::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--color-secondary, currentColor);
        }

        theme-toggle-slot {
          display: flex;
          align-items: center;
        }

        .theme-toggle-container {
          display: flex;
          align-items: center;
        }

        @media (max-width: 768px) {
          header {
            flex-direction: column;
            align-items: center;
          }

          nav {
            width: 100%;
            margin: 1rem 0;
          }

          ul {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }
        }

        /* Pass through CSS properties from host */
        :host {
          --header-color: var(--color-text);
          --header-background: var(--color-background);
        }

        /* Load external styles from light/dark theme */
        @media (prefers-color-scheme: dark) {
          :host {
            --nav-hover: var(--color-secondary, #03dac6);
          }
        }

        @media (prefers-color-scheme: light) {
          :host {
            --nav-hover: var(--color-primary, #6200ee);
          }
        }

        /* Style slots */
        ::slotted(theme-toggle) {
          margin-left: 1rem;
        }
      </style>

      <header>
        <h1><a href="/" class="${
			currentPath === '/' ? 'active' : ''
		}">Modern Web Boilerplate</a></h1>
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/" class="${currentPath === '/' ? 'active' : ''}">Home</a></li>
            <li><a href="/about.html" class="${
				currentPath === '/about.html' ? 'active' : ''
			}">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div class="theme-toggle-container">
          <slot name="theme-toggle"></slot>
        </div>
      </header>
    `;
	}
}

customElements.define('site-header', SiteHeader);
