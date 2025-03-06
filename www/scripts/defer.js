// DOM-dependent JavaScript

import { ThemeToggle } from '/components/theme-toggle.js';
import { SiteHeader } from '/components/site-header.js';
import { SiteFooter } from '/components/site-footer.js';

// Register all custom elements
customElements.define('theme-toggle', ThemeToggle);
customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);

console.debug('deferred script loaded');
