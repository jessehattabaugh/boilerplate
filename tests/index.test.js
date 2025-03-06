import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {
	getBrowserPerformanceMetrics,
	assertPerformanceBaseline,
	getLighthouseScores,
} from './utils/performance-utils.js';

/**
 * Test the homepage
 */
test.describe('Homepage', () => {
	// Create snapshots directory if it doesn't exist
	const snapshotDir = path.join(process.cwd(), 'snapshots');
	if (!fs.existsSync(snapshotDir)) {
		fs.mkdirSync(snapshotDir, { recursive: true });
	}

	// Test the homepage visuals
	test('homepage should match visual baseline', async ({ page }) => {
		await page.goto('/');

		// Wait for any animations or transitions to complete
		await page.waitForTimeout(500);

		// Take a screenshot of the entire page
		await expect(page).toHaveScreenshot('homepage-desktop-baseline.png');
	});

	// Test for mobile viewport
	test('homepage on mobile should match visual baseline', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Wait for key elements to be visible
		await page
			.getByRole('heading', { level: 1 })
			.waitFor({ state: 'visible', timeout: 5000 })
			.catch(() => {
				console.log('Heading level 1 not found, continuing test');
			});

		// Wait for any animations to complete
		await page.waitForTimeout(500);

		await expect(page).toHaveScreenshot('homepage-mobile-baseline.png');
	});

	// Test for accessibility-specific features
	test('should have proper keyboard navigation', async ({ page }) => {
		await page.goto('/');

		// Take screenshot with focus on the first interactive element
		await page.keyboard.press('Tab');

		// Find the currently focused element
		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement;
			return el.tagName !== 'BODY'; // Check if focus moved from body
		});

		// Verify something is actually focused
		expect(focusedElement).toBeTruthy();

		// Take a screenshot with the focus visible
		await expect(page).toHaveScreenshot('homepage-keyboard-focus-baseline.png');
	});

	// Performance testing for homepage
	test('homepage meets performance baseline requirements', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		// Collect browser performance metrics
		const metrics = await getBrowserPerformanceMetrics(page);
		console.log('Homepage performance metrics:', metrics);

		// Compare against baseline
		await assertPerformanceBaseline('homepage', metrics);

		// Assert specific thresholds for critical metrics
		expect(metrics.FCP).toBeLessThan(2000); // First Contentful Paint under 2s
		expect(metrics.LCP).toBeLessThan(2500); // Largest Contentful Paint under 2.5s
		expect(metrics.CLS).toBeLessThan(0.1); // Cumulative Layout Shift under 0.1
	});

	test('homepage passes Lighthouse performance thresholds', async ({ page, baseURL }) => {
		test.skip(process.env.CI === 'true', 'Lighthouse tests are skipped in CI environment');

		// Only run on chromium
		test.skip(
			page.context().browser().browserType().name() !== 'chromium',
			'Lighthouse tests only run on Chromium',
		);

		// Visit the page first to ensure it's loaded and server is running
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Now run Lighthouse (using the base URL)
		const url = baseURL || 'http://localhost:3000';
		const scores = await getLighthouseScores(url);

		// Save or compare with baseline
		await assertPerformanceBaseline('homepage-lighthouse', scores);

		// Check against absolute thresholds
		expect(scores.performance).toBeGreaterThanOrEqual(90);
		expect(scores.accessibility).toBeGreaterThanOrEqual(90);
		expect(scores['best-practices']).toBeGreaterThanOrEqual(90);
		expect(scores.seo).toBeGreaterThanOrEqual(90);
	});
});
