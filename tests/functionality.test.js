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

		// Check if the title element is present and visible
		const titleElement = page.locator('[data-site-title]').first();
		await expect(titleElement).toBeVisible();

		// Check if the description element is present and visible
		const descriptionElement = page.locator('[data-site-description]');
		await expect(descriptionElement).toBeVisible();
	});

	// Test cookie consent functionality
	test('should show cookie consent and handle acceptance', async ({ page }) => {
		// Clear localStorage to ensure cookie consent appears
		await page.evaluate(() => localStorage.clear());

		// Navigate to the homepage
		await page.goto('/');

		// Check if cookie consent is visible
		const cookieConsent = page.locator('#cookie-consent');
		await expect(cookieConsent).toBeVisible();

		// Click the accept button
		await page.click('#cookie-accept');

		// Cookie consent should now be hidden
		await expect(cookieConsent).toBeHidden();

		// Verify that localStorage has been updated
		const storedChoice = await page.evaluate(() => localStorage.getItem('cookie-choice'));
		expect(storedChoice).toBe('accepted');
	});

	// Test navigation with View Transitions API
	test('should navigate between pages', async ({ page }) => {
		await page.goto('/');

		// Assuming there's a navigation link to the About page
		await page.click('text=About');

		// Wait for URL to change
		await expect(page).toHaveURL(/.*about/);
	});
});
