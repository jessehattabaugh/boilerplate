/**
 * Component registry
 * Import and register all web components here
 */
import { ThemeToggle } from './theme-toggle.js';

// Register the custom element
customElements.define('theme-toggle', ThemeToggle);

// Export components for programmatic usage
export { ThemeToggle };
