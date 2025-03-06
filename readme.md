# Web Boilerplate

A modern web boilerplate with cutting-edge features

## Features

This boilerplate includes modern web features:

-   🎨 Modern CSS with variables, reset, and utility classes
-   🚀 View Transitions API for smooth page transitions
-   🔄 Service Worker with workbox for offline support
-   🌓 Dark/light theme support with auto detection
-   🍪 GDPR-compliant cookie consent dialog
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

## Testing

### End-to-End Testing

The boilerplate uses Playwright for end-to-end testing which provides:

-   **Visual regression testing:** Compares screenshots to detect visual changes
-   **Cross-browser testing:** Tests across Chromium, Firefox, and WebKit
-   **Mobile simulation:** Tests mobile viewports and behaviors
-   **Accessibility testing:** Ensures the site meets accessibility standards

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
```

## Best Practices

This boilerplate follows these best practices:

-   Progressive enhancement
-   Mobile-first design
-   Semantic HTML
-   Performance optimization
-   Accessibility (WCAG compliance)

## Customization

Edit the variables in `public/styles/all.css` to customize the design system.
Configure site details in `public/scripts/config.js`.

## Browser Support

Supports all modern browsers. IE is not supported.
