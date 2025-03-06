// DOM-dependent JavaScript

import { ThemeToggle } from '/components/theme-toggle.js';
import { SiteHeader } from '/components/site-header.js';
import { SiteFooter } from '/components/site-footer.js';
import { ImageCarousel } from '/components/image-carousel.js';
import { CarouselItem } from '/components/carousel-item.js';

// Register all custom elements
customElements.define('theme-toggle', ThemeToggle);
customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
customElements.define('image-carousel', ImageCarousel);
customElements.define('carousel-item', CarouselItem);

console.debug('deferred script loaded');
