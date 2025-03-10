# Testing Documentation

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test index.test.js

# Run tests with UI mode
npx playwright test --ui
```

## Screenshot Testing Workflow

### How Screenshots Work

-   Tests capture screenshots using Playwright's `toHaveScreenshot()` API
-   New screenshots are saved with `.tmp.` in their filename
-   Screenshots with `.tmp.` are ignored by git (via `.gitignore`)
-   When satisfied with test results, accept them as baselines
-   For PWA manifest, desktop and mobile screenshots get copied to /www/screenshots

### Taking Screenshots

Add screenshot assertions in your tests:

```js
// Take a screenshot of the page
await expect(page).toHaveScreenshot('page-name-baseline.png');

// For responsive testing include viewport size
await page.setViewportSize({ width: 375, height: 667 });
await expect(page).toHaveScreenshot('page-name-mobile-baseline.png');
```

### Managing Screenshots

```bash
# Accept new screenshots as baselines:
npm run test:accept-snapshots

# Build will automatically copy approved screenshots for PWA manifest
npm run build
```

Only baseline screenshots (without `.tmp.`) are checked into source control.

## Test Directory Structure

-   `/test` - Test files and utilities
    -   `*.test.js` - Test files

## Development Server

The project uses Netlify Dev for local development:

```bash
# Start local development server
npm start

# Stop any running server
npm run kill
```

For more information:

-   [Playwright Documentation](https://playwright.dev/docs/intro)
-   [Netlify Dev Documentation](https://docs.netlify.com/cli/local-development/)
