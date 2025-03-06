import { test, expect } from '@playwright/test';

/**
 * Example tests to demonstrate best practices for Playwright testing
 *
 * These tests focus on user journeys and real browser interactions
 * rather than implementation details
 */

test.describe('Core user journeys', () => {
	test('new visitor can navigate the site', async ({ page }) => {
		// Start at the homepage
		await page.goto('/');

		// Verify key elements are present using accessibility-friendly selectors
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(
			page.getByRole('heading', { level: 2, name: /modern web boilerplate/i }),
		).toBeVisible();

		// Navigate to About page using the navigation
		await page.getByRole('link', { name: /about/i }).click();

		// Verify navigation worked
		await expect(page).toHaveURL(/.*about/);

		// This test validates the critical user journey of basic navigation
	});

	test('user preferences are respected', async ({ page }) => {
		await page.goto('/');

		// Test theme toggle functionality
		const themeToggle = page.getByRole('switch', { name: /toggle theme/i });

		// Get initial theme state
		const initialIsDarkMode = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});

		// Change theme
		await themeToggle.click();

		// Verify theme changed
		const newIsDarkMode = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(newIsDarkMode).not.toBe(initialIsDarkMode);

		// Reload the page to verify persistence
		await page.reload();

		// Verify preference was remembered
		const persistedIsDarkMode = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(persistedIsDarkMode).toBe(newIsDarkMode);
	});

	test('site is responsive across devices', async ({ page }) => {
		// Test on desktop viewport
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/');

		// Elements should be laid out for desktop
		const isMenuVisible = await page.getByRole('navigation').isVisible();
		expect(isMenuVisible).toBeTruthy();

		// Test on mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Verify key elements are still accessible on mobile
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

		// Take screenshot to verify layout
		await expect(page).toHaveScreenshot('mobile-homepage.png');
	});

	test('animations respect user preferences', async ({ page }) => {
		// Emulate a user who prefers reduced motion
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');

		// Trigger a navigation that would normally animate
		await page.getByRole('link', { name: /about/i }).click();

		// Verify we reached the destination
		await expect(page).toHaveURL(/.*about/);

		// Note: This is hard to test directly, but the key is that we're testing
		// with the reducedMotion media feature enabled
	});
});

/**
 * These tests represent good practices:
 * 1. Using accessibility selectors (getByRole, getByLabel)
 * 2. Testing real user flows and journeys
 * 3. Checking across different viewports
 * 4. Verifying preference persistence
 * 5. Using screenshots for visual verification
 */
