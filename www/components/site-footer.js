/**
 * Site Footer Web Component
 * Encapsulates the site footer with sections and copyright
 */
export class SiteFooter extends HTMLElement {
	#currentYear = new Date().getFullYear();

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: 3rem;
        }

        footer {
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 2rem;
        }

        .footer-section {
          flex: 1;
          min-width: 200px;
        }

        h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        li {
          margin-bottom: 0.5rem;
        }

        a {
          color: var(--color-text, inherit);
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
          color: var(--color-secondary, inherit);
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-links a {
          display: inline-flex;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
        }

        .social-links a:hover {
          background-color: var(--color-primary, #bb86fc);
          text-decoration: none;
        }

        .copyright {
          margin-top: 2rem;
          text-align: center;
        }

        p {
          margin-top: 0;
        }

        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .social-links a {
            transition: none;
          }
        }

        /* Custom slots */
        ::slotted(.custom-footer-content) {
          margin-top: 1rem;
        }
      </style>

      <footer>
        <div class="footer-content">
          <div class="footer-section">
            <h3>About Us</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie.</p>
          </div>

          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about.html">About</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Connect with Us</h3>
            <div class="social-links">
              <a href="#" aria-label="Facebook">F</a>
              <a href="#" aria-label="Twitter">T</a>
              <a href="#" aria-label="Instagram">I</a>
              <a href="#" aria-label="LinkedIn">L</a>
            </div>
          </div>
        </div>

        <slot></slot>

        <div class="copyright">
          <small>&copy; <span id="year">${
				this.#currentYear
			}</span> Modern Web Boilerplate. All rights reserved.</small>
        </div>
      </footer>
    `;
	}
}

customElements.define('site-footer', SiteFooter);
