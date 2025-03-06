# Performance Baselines

This directory contains performance baseline metrics for the application.

## How Performance Testing Works

1. **Baseline Collection**: During development, performance metrics are collected and stored as baselines
2. **Automated Comparison**: Tests compare current performance against these baselines
3. **Regression Prevention**: If performance degrades beyond thresholds, tests will fail
4. **Documentation**: Changes in performance are logged for analysis

## Performance Files Organization

-   Each component or page has its own JSON file with metrics
-   Files are named according to what they test (e.g., `homepage-performance.json`, `theme-toggle-performance.json`)
-   Each file contains a timestamp and metrics object

## Core Web Vital Metrics Tracked

-   **FCP (First Contentful Paint)**: Time until the first content appears (target: < 2s)
-   **LCP (Largest Contentful Paint)**: Time until the main content appears (target: < 2.5s)
-   **CLS (Cumulative Layout Shift)**: Visual stability measure (target: < 0.1)
-   **TTI (Time to Interactive)**: Time until the page becomes interactive (target: < 3.5s)
-   **TBT (Total Blocking Time)**: Time the main thread is blocked (target: < 200ms)

## Component-Specific Metrics

Each component tracks metrics relevant to its functionality:

-   **Operation Time**: How long interactions take to complete (e.g., toggle actions)
-   **Memory Usage**: JS heap size and allocation metrics where applicable
-   **DOM Changes**: Number of DOM operations caused by component

## Lighthouse Integration

For main pages, full Lighthouse audits are performed and tracked:

-   Performance score (target: ≥ 90)
-   Accessibility score (target: ≥ 90)
-   Best Practices score (target: ≥ 90)
-   SEO score (target: ≥ 90)
-   PWA score (for reference)

## Managing Performance Baselines

To update baselines after intentional performance changes:

```bash
npm run test:update-performance
```

This will run tests with the UPDATE_PERFORMANCE_BASELINE flag and save current metrics as the new baselines.

## Adding Performance Tests for New Components

1. Import the performance utility functions:

```javascript
import {
	getBrowserPerformanceMetrics,
	assertPerformanceBaseline,
} from './utils/performance-utils.js';
```

2. Create a test that measures relevant metrics:

```javascript
test('component meets performance baseline', async ({ page }) => {
	await page.goto('/your-component-page');

	// Get performance metrics
	const metrics = await getBrowserPerformanceMetrics(page);

	// Compare against baseline
	await assertPerformanceBaseline('your-component-name', metrics);

	// Optional: Assert specific thresholds
	expect(metrics.operationTime).toBeLessThan(500);
});
```

3. Run the test and a baseline will be automatically created
