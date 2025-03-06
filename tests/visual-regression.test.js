import { test, expect } from '@playwright/test';

/**
 * Visual regression tests to ensure the site renders correctly
 * Using accessibility-friendly selectors
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

		// Wait for any animations or transitions to complete
		await page.waitForTimeout(500);

		// Verify dark mode is active by checking for accessible theme toggle state
		const themeToggle = page.getByRole('switch', { name: /toggle theme/i });
		await expect(themeToggle).toBeVisible();

		// Verify dark mode class is applied
		const isDarkMode = await page.evaluate(() =>
			document.documentElement.classList.contains('dark-mode')
		);
		expect(isDarkMode).toBeTruthy();

		const screenshot = await page.screenshot({ fullPage: true });
		await expect(screenshot).toMatchSnapshot('homepage-dark.png');
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

		const screenshot = await page.screenshot({ fullPage: true });
		await expect(screenshot).toMatchSnapshot('homepage-mobile.png');
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
				ariaLabel: el.getAttribute('aria-label')
			};
		});

		// Verify something is actually focused
		expect(focusedElement.tagName).not.toBe('BODY');

		// Take a screenshot with the focus visible
		const screenshot = await page.screenshot({ fullPage: true });
		await expect(screenshot).toMatchSnapshot('homepage-keyboard-focus.png');
	});
});
