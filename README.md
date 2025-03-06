# Web Boilerplate

A modern web boilerplate with cutting-edge features

## Features

This boilerplate includes modern web features:

-   🎨 Modern CSS with variables, reset, and utility classes
-   🚀 View Transitions API for smooth page transitions
-   🔄 Service Worker with workbox for offline support
-   🌓 Dark/light theme support with auto detection
-   🤖 Simple bot protection for forms
-   📱 Fully responsive with container queries
-   🔒 Enhanced security headers
-   ♿ Accessibility features including prefers-reduced-motion support
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
-   `npm run test` - Run Playwright end-to-end tests
-   `npm run test:ui` - Run Playwright tests with UI for debugging
-   `npm run test:update-snapshots` - Update visual test baselines
-   `npm run analyze` - Analyze the site with Lighthouse

## Web Components

The boilerplate includes modular web components that are encapsulated and easily replaceable:

### Theme Toggle

A toggle switch component for controlling light, dark, and system themes:

```html
<theme-toggle></theme-toggle>
```

#### Features:

-   **Multiple theme modes:** Supports light, dark, and system preference modes
-   **Preference persistence:** Remembers user's theme choice across sessions
-   **System preference detection:** Automatically follows system theme when in auto mode
-   **Self-contained styles:** All styles are encapsulated within the component
-   **Responsive design:** Adapts to different screen sizes

#### JavaScript API:

```javascript
// Import the component class if you want to use it programmatically
import { ThemeToggle } from './components/theme-toggle.js';

// Or use the already registered custom element
const toggle = document.querySelector('theme-toggle');

// Get the current theme
const currentTheme = toggle.getTheme();

// Check if dark mode is active
const isDark = toggle.isDarkMode();

// Set theme programmatically
toggle.setTheme('dark'); // Options: 'light', 'dark', 'system'

// Listen for theme changes
toggle.addEventListener('themeChange', (e) => {
	console.log('Theme changed:', e.detail.theme);
	console.log('Is dark mode:', e.detail.isDark);
});
```

#### Customizing or Replacing:

The theme toggle component is designed to be easily customizable or replaceable:

1. Modify the existing component at `/components/theme-toggle.js`
2. Or create your own component and update the registration in `/components/index.js`

## Accessibility Features

This boilerplate includes several accessibility enhancements:

### Reduced Motion Support

The site respects the user's motion preferences:

-   Uses the `prefers-reduced-motion` media query to disable animations and transitions
-   Provides alternative experiences for users who prefer reduced motion
-   Disables View Transitions for users with motion sensitivity
-   JavaScript animation logic is motion-preference aware

```css
/* Example of how animations respect user preferences */
@media (prefers-reduced-motion: no-preference) {
	.animate-element {
		transition: transform 0.3s ease;
	}
}
```

## Testing

## Testing Philosophy

This boilerplate embraces a practical testing philosophy:

1. **Production is the ultimate test** - Real users on real devices are the true validation
2. **Automated browser testing** against staging environments is the next best thing
3. **Local browser testing** during development provides immediate feedback

We deliberately avoid "mock-heavy" unit or integration tests that test abstractions rather than real user experiences.

### End-to-End Testing with Playwright

The boilerplate uses Playwright for comprehensive end-to-end testing which:

-   Tests your application in **real browsers** (Chromium, Firefox, WebKit)
-   Verifies behavior across **different devices and viewports**
-   Ensures **accessibility standards** are met
-   Provides **visual regression testing** to catch unexpected UI changes

#### Included Test Types

-   **Functional tests**: Verify features work as expected
-   **Visual regression tests**: Catch unintended visual changes
-   **Accessibility tests**: Ensure the site works for all users
-   **Mobile responsiveness**: Test behavior on different devices

#### Running Tests

```bash
# Quick test during development
npm run test

# Test against staging environment (closest to production)
npm run test:staging

# Update visual snapshots after intentional changes
npm run test:update-snapshots

# Debug tests interactively with UI
npm run test:ui

# Run just the theme toggle visual tests
npm run test:theme
```

#### Visual Regression Testing

The boilerplate includes visual regression tests that verify UI components maintain their expected appearance:

-   **Theme Toggle**: Tests verify the toggle functions correctly in all states
-   **Dark/Light Mode**: Screenshots are compared across theme changes to ensure proper styling
-   **Responsive Design**: Visual tests run across multiple viewport sizes

When making design changes, update the visual reference snapshots:

```bash
# Update visual snapshots after intentional UI changes
npm run test:update-snapshots
```

#### Writing Effective Tests

When adding new features, write Playwright tests that:

1. Focus on **user journeys** rather than implementation details
2. Use **accessibility-friendly selectors** like `getByRole` and `getByLabel`
3. Test across **multiple browsers and devices**
4. Include **visual regression** tests for UI components

Example of a good test case:

```javascript
test('user can toggle theme', async ({ page }) => {
	await page.goto('/');

	// Find element by its accessible role
	const themeToggle = page.getByRole('switch', { name: /toggle theme/i });

	// Verify initial state
	await expect(themeToggle).toBeVisible();
	const initialTheme = await page.evaluate(() =>
		document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light',
	);

	// Perform action
	await themeToggle.click();

	// Verify result
	const newTheme = await page.evaluate(() =>
		document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light',
	);
	expect(newTheme).not.toBe(initialTheme);
});
```

See the `tests` directory for more examples.

## Visual Testing

This project uses Playwright's visual comparison testing to ensure UI consistency:

### How snapshot testing works

1. The first time tests run, baseline screenshots are captured
2. On subsequent runs, new screenshots are compared against the baselines
3. Tests fail if there are visual differences beyond the threshold

### Managing snapshots

-   **Update snapshots:** After intentional UI changes, run `npm run test:update-visual`
-   **Clean temporary snapshots:** Remove diff and actual files with `npm run test:clean-snapshots`
-   **View differences:** Check the Playwright report for side-by-side comparison of visual changes

### Snapshot organization

-   Baseline snapshots are stored in `tests/snapshots/`
-   Each test file has its own subfolder to organize screenshots
-   Only baseline snapshots are committed to git

### Best practices

-   Keep snapshot regions focused on specific UI elements when possible
-   Use full page snapshots sparingly to reduce false positives
-   Consider device-specific variations in your tests

## PWA Screenshots

The boilerplate includes tools for generating PWA screenshots for the web app manifest:

```bash
# Generate screenshots from local development server
npm run screenshots

# Generate screenshots from production site
npm run screenshots:prod
```

These screenshots are used in the `manifest.json` file and help create better installation experiences when users add your PWA to their home screen.

The script automatically captures:

-   Desktop screenshot (1280x800)
-   Mobile screenshot (750x1334) with proper device scaling

Screenshots are saved to `/public/screenshots/` and the manifest.json is automatically updated.

## Best Practices

This boilerplate follows these best practices:

-   Progressive enhancement
-   Mobile-first design
-   Semantic HTML
-   Performance optimization
-   Accessibility (WCAG compliance)
-   Keyboard navigability
-   Screen reader compatibility
-   Reduced motion support

## Customization

Edit the variables in `public/styles/all.css` to customize the design system.
Configure site details in `public/scripts/config.js`.

## Browser Support

Supports all modern browsers. IE is not supported.
