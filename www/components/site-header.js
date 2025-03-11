/**
 * Site Header Web Component
 * A header component with navigation and theme toggle
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
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/components/site-header.css">
            <header>
                <nav>
                    <slot></slot>
                </nav>
            </header>
        `;
    }
}