import { test, expect } from '@playwright/test';

/**
 * Functionality tests to ensure the site works as expected
 */
test.describe('Functional tests', () => {
	// Test that the page loads correctly
	test('should load the homepage', async ({ page }) => {
		// Navigate to the homepage
		const response = await page.goto('/');

		// Check if the page loaded successfully
		expect(response.status()).toBe(200);

		// Check if the title element is present and visible - using heading elements
		const titleElement = page.getByRole('heading', { level: 1 }).first();
		await expect(titleElement).toBeVisible();

		// Check if the description element is present and visible - using heading level and content
		const descriptionElement = page.getByRole('heading', { level: 2 });
		await expect(descriptionElement).toBeVisible();
	});

	// Test cookie consent functionality
	test('should show cookie consent and handle acceptance', async ({ page }) => {
		// Clear localStorage to ensure cookie consent appears
		await page.evaluate(() => localStorage.clear());

		// Navigate to the homepage
		await page.goto('/');

		// Check if cookie consent is visible - using role and accessible name
		const cookieConsent = page.getByRole('dialog', { name: /cookie settings/i });
		await expect(cookieConsent).toBeVisible();

		// Click the accept button - using button role and accessible text
		await page.getByRole('button', { name: /accept all/i }).click();

		// Cookie consent should now be hidden
		await expect(cookieConsent).toBeHidden();

		// Verify that localStorage has been updated
		const storedChoice = await page.evaluate(() => localStorage.getItem('cookie-preferences'));
		expect(JSON.parse(storedChoice)).toHaveProperty('analytics', true);
	});

	// Test theme toggle functionality
	test('should toggle theme when clicked', async ({ page }) => {
		// Clear localStorage to ensure default theme
		await page.evaluate(() => localStorage.removeItem('theme-preference'));

		await page.goto('/');

		// Find theme toggle using its accessible role and name
		const themeToggle = page.getByRole('switch', { name: /toggle theme/i });
		await expect(themeToggle).toBeVisible();

		// Click the theme toggle
		await themeToggle.click();

		// Verify the theme changed (checking for class on html)
		const isDarkMode = await page.evaluate(() =>
			document.documentElement.classList.contains('dark-mode'),
		);
		const isLightMode = await page.evaluate(() =>
			document.documentElement.classList.contains('light-mode'),
		);

		// Depending on system settings, one should be true and one should be false
		expect(isDarkMode !== isLightMode).toBeTruthy();

		// Verify the aria-pressed state changed
		await expect(themeToggle).toHaveAttribute('aria-pressed', String(isDarkMode));
	});

	// Test navigation with View Transitions API
	test('should navigate between pages', async ({ page }) => {
		await page.goto('/');

		// Use link text which is naturally accessible
		await page.getByRole('link', { name: 'About' }).click();

		// Wait for URL to change
		await expect(page).toHaveURL(/.*about/);
	});
});
