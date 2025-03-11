// Page-specific JavaScript

import { CarouselItem } from '/components/carousel-item.js';
import { ImageCarousel } from '/components/image-carousel.js';
import { SiteFooter } from '/components/site-footer.js';
// Import shared functionality
import { SiteHeader } from '/components/site-header.js';

// Register custom elements if not already registered
if (!customElements.get('site-header')) {
    customElements.define('site-header', SiteHeader);
}
if (!customElements.get('site-footer')) {
    customElements.define('site-footer', SiteFooter);
}
if (!customElements.get('image-carousel')) {
    customElements.define('image-carousel', ImageCarousel);
}
if (!customElements.get('carousel-item')) {
    customElements.define('carousel-item', CarouselItem);
}

// Update current year in footer
document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Listen for carousel events
    const carousel = document.querySelector('image-carousel');
    if (carousel) {
        carousel.addEventListener('slide-change', (e) => {
            console.log(`Slide changed to ${e.detail.index + 1} of ${e.detail.total}`);
        });
    }
});

console.debug('index.js loaded');
