/**
 * Site Footer Web Component
 * A footer component with copyright and other site info
 */
export class SiteFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const currentYear = new Date().getFullYear();
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/components/site-footer.css">
            <footer>
                <div class="container">
                    <p>&copy; ${currentYear} Modern Web Boilerplate. All rights reserved.</p>
                    <slot></slot>
                </div>
            </footer>
        `;
    }
}