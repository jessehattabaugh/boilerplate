/**
 * Carousel Item Web Component
 * 🎠 Individual item in a carousel
 */
export class CarouselItem extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
	}

	/**
	 * Render the component
	 */
	render() {
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					width: 100%;
					height: 100%;
				}

				.carousel-item-content {
					height: 100%;
					padding: var(--space-4);
					box-sizing: border-box;
				}

				::slotted(*) {
					margin: 0;
				}
			</style>
			<div class="carousel-item-content">
				<slot></slot>
			</div>
		`;
	}

	/**
	 * Show this carousel item
	 */
	show() {
		this.style.display = 'block';
		this.setAttribute('aria-hidden', 'false');
		this.dispatchEvent(new CustomEvent('item-shown', {
			bubbles: true,
		}));
		console.debug('🎠 Carousel item shown');
	}

	/**
	 * Hide this carousel item
	 */
	hide() {
		this.style.display = 'none';
		this.setAttribute('aria-hidden', 'true');
		this.dispatchEvent(new CustomEvent('item-hidden', {
			bubbles: true,
		}));
	}
}

// Not registering the component here - this is done in the main JS file