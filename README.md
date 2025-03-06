# Web Boilerplate

A modern web boilerplate with cutting-edge features

## Features

This boilerplate includes modern web features:

-   🎨 Modern CSS with variables, reset, and utility classes
-   🚀 View Transitions API for smooth page transitions
-   🔄 Service Worker with workbox for offline support
-   🌓 Dark/light theme support with auto detection
-   🍪 GDPR-compliant cookie consent dialog as a web component using Popup API
-   🤖 Simple bot protection for forms
-   📱 Fully responsive with container queries
-   🔒 Enhanced security headers
-   ♿ Accessibility features
-   🔍 SEO optimized
-   🧪 End-to-end testing with Playwright

## Getting Started

1. Install dependencies by running `npm install`
2. Configure your site: `npm run configure` (or manually edit the `public/config.js` file)
3. Start the development server with `npm start`

### Development Scripts

-   `npm start` - Start the development server
-   `npm run start:https` - Start with HTTPS for testing secure features
-   `npm run build` - Build for production (optimizes CSS)
-   `npm run lint` - Run ESLint for code quality checks
-   `npm run test` - Run Lighthouse tests
-   `npm run test:e2e` - Run Playwright end-to-end tests
-   `npm run test:e2e:ui` - Run Playwright tests with UI for debugging
-   `npm run test:e2e:update-snapshots` - Update visual test baselines
-   `npm run analyze` - Analyze the site with Lighthouse

## Web Components

### Cookie Consent Dialog

The boilerplate includes a GDPR-compliant cookie consent dialog implemented as a web component that leverages the modern Popup API:

```html
<cookie-consent
	popup
	privacy-policy-url="/privacy.html"
	necessary-cookies="session,csrf"
	optional-cookies="analytics,preferences"
>
</cookie-consent>
```

#### Features:

-   **Popup API integration:** Uses the native HTML `popup` attribute for better accessibility and mobile UX
-   **Customizable appearance:** Styling can be modified through CSS variables
-   **GDPR compliant:** Allows users to accept necessary cookies only or all cookies
-   **Preference persistence:** Remembers user choices across sessions
-   **Event-driven API:** Emits events when preferences change

#### JavaScript API:

```javascript
// Check if a specific cookie category is allowed
if (document.querySelector('cookie-consent').isAllowed('analytics')) {
	// Initialize analytics
}

// Listen for preference changes
document.querySelector('cookie-consent').addEventListener('preferencesChanged', (e) => {
	console.log('New cookie preferences:', e.detail);
});
```

### Theme Toggle

A theme toggle component that allows users to switch between light, dark, and system themes:

```html
<theme-toggle></theme-toggle>
```

#### Features:

-   **Multiple theme modes:** Supports light, dark, and system preference modes
-   **Preference persistence:** Remembers user's theme choice across sessions
-   **System preference detection:** Automatically follows system theme when in auto mode
-   **CSS variable integration:** Uses CSS variables for seamless theme switching
-   **Responsive design:** Adapts to different screen sizes

#### JavaScript API:

```javascript
// Get the current theme
const currentTheme = document.querySelector('theme-toggle').getTheme();

// Check if dark mode is active
const isDark = document.querySelector('theme-toggle').isDarkMode();

// Set theme programmatically
document.querySelector('theme-toggle').setTheme('dark'); // Options: 'light', 'dark', 'system'

// Listen for theme changes
document.querySelector('theme-toggle').addEventListener('themeChange', (e) => {
	console.log('Theme changed:', e.detail.theme);
	console.log('Is dark mode:', e.detail.isDark);
});
```

## Testing

### End-to-End Testing

The boilerplate uses Playwright for end-to-end testing which provides:

-   **Visual regression testing:** Compares screenshots to detect visual changes
-   **Cross-browser testing:** Tests across Chromium, Firefox, and WebKit
-   **Mobile simulation:** Tests mobile viewports and behaviors
-   **Accessibility testing:** Ensures the site meets accessibility standards

### Accessibility Testing

Accessibility is a first-class citizen in our testing approach:

-   **Built-in accessibility testing:** Uses Playwright's accessibility-focused selectors like getByRole and getByLabel
-   **Keyboard navigation testing:** Ensures all interactive elements can be accessed and activated via keyboard
-   **Screen reader friendly:** Tests use the same selectors that screen readers would use
-   **Alt text verification:** Ensures all images have appropriate alt text
-   **Semantic HTML testing:** Verifies proper use of ARIA attributes and semantic HTML elements

Our tests are intentionally designed to select elements the same way a user would interact with them, especially users of assistive technologies. Instead of using implementation details like CSS selectors or test IDs, we use:

-   `getByRole` - to find elements by their ARIA role
-   `getByLabel` - to find form elements by their associated label
-   `getByText` - to find elements by their visible text content
-   `getByAltText` - to find images by their alt text

This approach not only creates more resilient tests, but also ensures our application remains accessible as it evolves.

### Running Tests

```bash
# Run tests against local environment
npm run test:e2e

# Run tests against staging environment
npm run test:e2e:staging

# Update visual snapshots after intentional changes
npm run test:e2e:update-snapshots

# Debug tests with UI
npm run test:e2e:ui

# Run accessibility-specific tests
npm run test:a11y
```

## Best Practices

This boilerplate follows these best practices:

-   Progressive enhancement
-   Mobile-first design
-   Semantic HTML
-   Performance optimization
-   Accessibility (WCAG compliance)
-   Keyboard navigability
-   Screen reader compatibility

## Customization

Edit the variables in `public/styles/all.css` to customize the design system.
Configure site details in `public/scripts/config.js`.

## Browser Support

Supports all modern browsers. IE is not supported.
