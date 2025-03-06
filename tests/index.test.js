import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Ensure snapshots directory exists
const snapshotDir = path.join(process.cwd(), 'tests', 'snapshots', 'index');
if (!fs.existsSync(snapshotDir)) {
	fs.mkdirSync(snapshotDir, { recursive: true });
}

/**
 * Test the homepage
 */
test.describe('The Homepage', () => {
	// Test the homepage
	test('homepage should match snapshot', async ({ page }) => {
		await page.goto('/');

		// Wait for any animations or transitions to complete
		await page.waitForTimeout(500);

		// Take a screenshot of the entire page
		await expect(page).toHaveScreenshot({
			path: 'index/homepage.png',
			fullPage: true,
		});
	});

	// Test for mobile viewport
	test('homepage on mobile should match snapshot', async ({ page }) => {
		// This test will use the mobile configurations defined in the playwright.config.js
		await page.goto('/');

		// Wait for key elements to be visible, using accessible selectors
		await page.getByRole('heading', { level: 1 }).waitFor();
		await page.getByRole('heading', { level: 2 }).waitFor();

		// Wait for any animations to complete
		await page.waitForTimeout(500);

		await expect(page).toHaveScreenshot({
			path: 'index/homepage-mobile.png',
			fullPage: true,
		});
	});

	// Test for accessibility-specific features
	test('should have proper keyboard navigation order', async ({ page }) => {
		await page.goto('/');

		// Take screenshot with focus on the first interactive element (typically first link)
		await page.keyboard.press('Tab');

		// Find the currently focused element
		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement;
			return {
				tagName: el.tagName,
				text: el.textContent,
				role: el.getAttribute('role'),
				ariaLabel: el.getAttribute('aria-label'),
			};
		});

		// Verify something is actually focused
		expect(focusedElement.tagName).not.toBe('BODY');

		// Take a screenshot with the focus visible
		await expect(page).toHaveScreenshot({
			path: 'index/homepage-keyboard-focus.png',
			fullPage: true,
		});
	});
});
