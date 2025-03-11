/**
 * Image Carousel Web Component
 * 🎠 A carousel for cycling through content or images
 */
export class ImageCarousel extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.currentIndex = 0;
		this.autoPlayInterval = null;
		this.items = [];
		this.paused = false;
	}
	
	// Component lifecycle methods
	connectedCallback() {
		this.render();
		this.setupItems();
		this.setupControls();
		
		if (this.hasAttribute('auto-play')) {
			const interval = this.getAttribute('interval') || 5000;
			this.startAutoPlay(Number(interval));
		}
		
		// Support keyboard navigation and accessibility
		this.setAttribute('tabindex', '0');
		this.addEventListener('keydown', this.handleKeyDown.bind(this));
		this.addEventListener('focus', () => this.pauseAutoPlay());
		this.addEventListener('blur', () => this.resumeAutoPlay());
		
		// Support reduced motion preferences
		this.checkReducedMotion();
		
		console.debug('🎠 Carousel initialized');
	}
	
	disconnectedCallback() {
		this.stopAutoPlay();
		this.removeEventListeners();
	}
	
	/**
	 * Render the component's HTML structure
	 */
	render() {
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					position: relative;
					overflow: hidden;
					width: 100%;
					min-height: 200px;
				}
				
				.carousel-container {
					position: relative;
					height: 100%;
				}
				
				.carousel-controls {
					display: flex;
					justify-content: space-between;
					position: absolute;
					top: 50%;
					width: 100%;
					transform: translateY(-50%);
					z-index: 10;
				}
				
				.carousel-button {
					background-color: var(--color-surface);
					border: none;
					border-radius: 50%;
					color: var(--color-text);
					cursor: pointer;
					width: 40px;
					height: 40px;
					display: flex;
					align-items: center;
					justify-content: center;
					opacity: 0.7;
					transition: opacity 0.3s ease;
					margin: 0 10px;
				}
				
				.carousel-button:hover {
					opacity: 1;
				}
				
				.carousel-button:focus-visible {
					outline: 2px solid var(--color-primary);
					outline-offset: 2px;
				}
				
				.carousel-indicators {
					display: flex;
					justify-content: center;
					margin: 10px 0;
				}
				
				.indicator {
					width: 10px;
					height: 10px;
					border-radius: 50%;
					background-color: var(--color-border);
					margin: 0 5px;
					cursor: pointer;
					transition: background-color 0.3s ease;
				}
				
				.indicator.active {
					background-color: var(--color-primary);
				}
				
				@media (prefers-reduced-motion: reduce) {
					::slotted(*) {
						transition: none !important;
					}
				}
			</style>
			
			<div class="carousel-container" aria-roledescription="carousel">
				<div class="carousel-content">
					<slot></slot>
				</div>
				
				<div class="carousel-controls">
					<button 
						class="carousel-button prev" 
						aria-label="Previous slide"
						title="Previous slide">
						&lt;
					</button>
					<button 
						class="carousel-button next" 
						aria-label="Next slide"
						title="Next slide">
						&gt;
					</button>
				</div>
				
				<div class="carousel-indicators" role="tablist"></div>
			</div>
		`;
	}
	
	/**
	 * Initialize carousel items
	 */
	setupItems() {
		// Get all carousel items
		this.items = Array.from(this.querySelectorAll('carousel-item'));
		
		if (this.items.length === 0) {
			console.warn('🎠 No carousel items found');
			return;
		}
		
		// Set initial states
		this.items.forEach((item, index) => {
			item.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
			item.style.display = index === 0 ? 'block' : 'none';
			item.setAttribute('role', 'tabpanel');
			item.setAttribute('id', `carousel-item-${index}`);
			item.setAttribute('aria-labelledby', `carousel-indicator-${index}`);
		});
		
		// Create indicator dots
		const indicators = this.shadowRoot.querySelector('.carousel-indicators');
		this.items.forEach((_, index) => {
			const indicator = document.createElement('div');
			indicator.classList.add('indicator');
			indicator.setAttribute('role', 'tab');
			indicator.setAttribute('id', `carousel-indicator-${index}`);
			indicator.setAttribute('aria-controls', `carousel-item-${index}`);
			indicator.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
			indicator.setAttribute('tabindex', '0');
			
			indicator.addEventListener('click', () => this.goToSlide(index));
			indicator.addEventListener('keydown', (event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					this.goToSlide(index);
				}
			});
			
			indicators.appendChild(indicator);
		});
		
		// Highlight first indicator
		this.updateIndicators();
		
		console.debug('🎠 Carousel items setup complete', {
			items: this.items.length
		});
	}
	
	/**
	 * Add event listeners to carousel controls
	 */
	setupControls() {
		const prevButton = this.shadowRoot.querySelector('.carousel-button.prev');
		const nextButton = this.shadowRoot.querySelector('.carousel-button.next');
		
		prevButton.addEventListener('click', () => this.prevSlide());
		nextButton.addEventListener('click', () => this.nextSlide());
		
		// Hide controls if only one item
		if (this.items.length <= 1) {
			prevButton.style.display = 'none';
			nextButton.style.display = 'none';
			this.shadowRoot.querySelector('.carousel-indicators').style.display = 'none';
		}
	}
	
	/**
	 * Remove event listeners
	 */
	removeEventListeners() {
		const prevButton = this.shadowRoot.querySelector('.carousel-button.prev');
		const nextButton = this.shadowRoot.querySelector('.carousel-button.next');
		
		if (prevButton) prevButton.removeEventListener('click', this.prevSlide);
		if (nextButton) nextButton.removeEventListener('click', this.nextSlide);
	}
	
	/**
	 * Navigate to previous slide
	 */
	prevSlide() {
		if (this.items.length <= 1) return;
		
		const newIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
		this.goToSlide(newIndex);
	}
	
	/**
	 * Navigate to next slide
	 */
	nextSlide() {
		if (this.items.length <= 1) return;
		
		const newIndex = (this.currentIndex + 1) % this.items.length;
		this.goToSlide(newIndex);
	}
	
	/**
	 * Go to a specific slide by index
	 * @param {number} index - The slide index to show
	 */
	goToSlide(index) {
		if (index === this.currentIndex || index < 0 || index >= this.items.length) return;
		
		// Hide current slide
		this.items[this.currentIndex].hide();
		
		// Show new slide
		this.items[index].show();
		
		// Update current index
		this.currentIndex = index;
		
		// Update indicators
		this.updateIndicators();
		
		// Dispatch event
		this.dispatchEvent(new CustomEvent('slide-change', {
			detail: {
				index: this.currentIndex,
				total: this.items.length
			}
		}));
	}
	
	/**
	 * Update the indicator dots to highlight current slide
	 */
	updateIndicators() {
		const indicators = Array.from(
			this.shadowRoot.querySelectorAll('.carousel-indicators .indicator')
		);
		
		indicators.forEach((indicator, index) => {
			if (index === this.currentIndex) {
				indicator.classList.add('active');
				indicator.setAttribute('aria-selected', 'true');
			} else {
				indicator.classList.remove('active');
				indicator.setAttribute('aria-selected', 'false');
			}
		});
	}
	
	/**
	 * Start automatic slide cycling
	 * @param {number} interval - Milliseconds between slides
	 */
	startAutoPlay(interval = 5000) {
		// Don't start if reduced motion is preferred
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}
		
		if (this.items.length <= 1) return;
		
		this.stopAutoPlay(); // Clear any existing interval
		
		this.autoPlayInterval = setInterval(() => {
			if (!this.paused) {
				this.nextSlide();
			}
		}, interval);
		
		console.debug('🎠 Auto-play started', { interval });
	}
	
	/**
	 * Stop automatic slide cycling
	 */
	stopAutoPlay() {
		if (this.autoPlayInterval) {
			clearInterval(this.autoPlayInterval);
			this.autoPlayInterval = null;
		}
	}
	
	/**
	 * Pause auto-play (e.g., when user is interacting)
	 */
	pauseAutoPlay() {
		this.paused = true;
	}
	
	/**
	 * Resume auto-play after pausing
	 */
	resumeAutoPlay() {
		this.paused = false;
	}
	
	/**
	 * Handle keyboard navigation
	 * @param {KeyboardEvent} event - Keyboard event
	 */
	handleKeyDown(event) {
		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				this.prevSlide();
				break;
			case 'ArrowRight':
				event.preventDefault();
				this.nextSlide();
				break;
			case 'Home':
				event.preventDefault();
				this.goToSlide(0);
				break;
			case 'End':
				event.preventDefault();
				this.goToSlide(this.items.length - 1);
				break;
			case ' ':
			case 'Enter':
				// Toggle autoplay
				event.preventDefault();
				this.paused = !this.paused;
				break;
		}
	}
	
	/**
	 * Check for reduced motion preference
	 */
	checkReducedMotion() {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		
		if (prefersReducedMotion && this.hasAttribute('auto-play')) {
			this.stopAutoPlay();
			console.info('🎠 Auto-play disabled due to reduced motion preference');
		}
		
		// Listen for changes to the preference
		window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
			if (event.matches) {
				this.stopAutoPlay();
			} else if (this.hasAttribute('auto-play')) {
				const interval = this.getAttribute('interval') || 5000;
				this.startAutoPlay(Number(interval));
			}
		});
	}
}

// Not registering the component here - this is done in the main JS file