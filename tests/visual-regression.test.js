import { test, expect } from '@playwright/test';

/**
 * Visual regression tests to ensure the site renders correctly
 */
test.describe('Visual regression tests', () => {
	// Test the homepage
	test('homepage should match snapshot', async ({ page }) => {
		await page.goto('/');

		// Wait for any animations or transitions to complete
		await page.waitForTimeout(500);

		// Take a screenshot of the entire page
		const screenshot = await page.screenshot({ fullPage: true });

		// Compare with baseline
		await expect(screenshot).toMatchSnapshot('homepage.png');
	});

	// Test the page in dark mode
	test('homepage in dark mode should match snapshot', async ({ page }) => {
		// Emulate dark mode
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.goto('/');

		await page.waitForTimeout(500);

		const screenshot = await page.screenshot({ fullPage: true });
		await expect(screenshot).toMatchSnapshot('homepage-dark.png');
	});

	// Test for mobile viewport
	test('homepage on mobile should match snapshot', async ({ page }) => {
		// This test will use the mobile configurations defined in the playwright.config.js
		await page.goto('/');

		await page.waitForTimeout(500);

		const screenshot = await page.screenshot({ fullPage: true });
		await expect(screenshot).toMatchSnapshot('homepage-mobile.png');
	});
});
