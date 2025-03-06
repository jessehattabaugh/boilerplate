import { test, expect } from '@playwright/test';

/**
 * Accessibility tests to ensure the site is accessible to all users
 * Using Playwright's built-in accessibility testing capabilities
 */
test.describe('Accessibility tests', () => {
	test('should have proper document structure', async ({ page }) => {
		await page.goto('/');

		// Check for essential page structure elements
		await expect(page.getByRole('banner')).toBeVisible(); // header
		await expect(page.getByRole('main')).toBeVisible(); // main content
		await expect(page.getByRole('contentinfo')).toBeVisible(); // footer

		// Check for page title
		const pageTitle = await page.title();
		expect(pageTitle.length).toBeGreaterThan(0);

		// Check for main heading
		const mainHeading = page.getByRole('heading', { level: 1 });
		await expect(mainHeading).toBeVisible();
	});

	test('should be navigable with keyboard', async ({ page }) => {
		await page.goto('/');

		// Test keyboard navigation of major interactive elements

		// Focus should move to first interactive element with tab
		await page.keyboard.press('Tab');
		let focusedElement = await getFocusedElement(page);
		expect(focusedElement.tagName).not.toBe('BODY');

		// Should be able to navigate to theme toggle
		let found = false;
		for (let i = 0; i < 10 && !found; i++) {
			await page.keyboard.press('Tab');
			focusedElement = await getFocusedElement(page);

			if (
				focusedElement.role === 'switch' &&
				focusedElement.ariaLabel?.includes('Toggle theme')
			) {
				found = true;
			}
		}
		expect(found).toBeTruthy();

		// Should be able to activate the theme toggle with space or enter
		await page.keyboard.press('Enter');

		// Check that theme has toggled by examining classList
		const isDarkMode = await page.evaluate(() =>
			document.documentElement.classList.contains('dark-mode'),
		);

		// Verify the element's state has changed after activation
		focusedElement = await getFocusedElement(page);
		expect(focusedElement.ariaPressed).toBe(String(isDarkMode));
	});

	test('all images should have alt text', async ({ page }) => {
		await page.goto('/');

		// Find all images
		const images = await page.locator('img').all();

		for (const img of images) {
			const alt = await img.getAttribute('alt');
			const role = await img.getAttribute('role');
			const ariaHidden = await img.getAttribute('aria-hidden');

			// Images should either have alt text, role="presentation", or be aria-hidden="true"
			expect(alt !== null || role === 'presentation' || ariaHidden === 'true').toBeTruthy();
		}
	});

	test('interactive elements should have accessible names', async ({ page }) => {
		await page.goto('/');

		// Check all buttons
		const buttons = await page.getByRole('button').all();
		for (const button of buttons) {
			const accessibleName = await button.evaluate((el) => {
				return el.getAttribute('aria-label') || el.textContent.trim() || el.title;
			});
			expect(accessibleName).toBeTruthy();
		}

		// Check all links
		const links = await page.getByRole('link').all();
		for (const link of links) {
			const accessibleName = await link.evaluate((el) => {
				return el.getAttribute('aria-label') || el.textContent.trim() || el.title;
			});
			expect(accessibleName).toBeTruthy();
		}
	});

	test('cookie consent should be accessible', async ({ page }) => {
		// Clear localStorage to ensure cookie consent appears
		await page.evaluate(() => localStorage.clear());

		await page.goto('/');

		// Cookie consent should have proper role
		const consent = await page.getByRole('dialog', { name: /cookie settings/i });
		await expect(consent).toBeVisible();

		// Should be able to activate buttons
		const acceptButton = page.getByRole('button', { name: /accept all/i });
		await expect(acceptButton).toBeVisible();
		await acceptButton.focus();

		// Verify the button is properly focused
		const focusedElement = await getFocusedElement(page);
		expect(focusedElement.text?.toLowerCase()).toContain('accept all');

		// Test that customization view is accessible
		await page.getByRole('button', { name: /customize/i }).click();

		// Check for form controls in customize view
		await expect(page.getByRole('checkbox', { name: /analytics cookies/i })).toBeVisible();
		await expect(page.getByRole('checkbox', { name: /preferences cookies/i })).toBeVisible();
		await expect(page.getByRole('checkbox', { name: /marketing cookies/i })).toBeVisible();

		// Check for save button
		await expect(page.getByRole('button', { name: /save preferences/i })).toBeVisible();
	});

	test('theme toggle should be accessible', async ({ page }) => {
		await page.goto('/');

		// Find theme toggle using its role and accessible name
		const themeToggle = page.getByRole('switch', { name: /toggle theme/i });
		await expect(themeToggle).toBeVisible();

		// Toggle should indicate its current state with aria-pressed
		const ariaPressed = await themeToggle.getAttribute('aria-pressed');
		expect(['true', 'false']).toContain(ariaPressed);

		// Test keyboard interaction
		await themeToggle.focus();
		const focusedBefore = await themeToggle.getAttribute('aria-pressed');

		// Activate with keyboard
		await page.keyboard.press('Enter');

		// State should toggle
		const focusedAfter = await themeToggle.getAttribute('aria-pressed');
		expect(focusedAfter).not.toBe(focusedBefore);
	});
});

// Helper function to get details about the currently focused element
async function getFocusedElement(page) {
	return await page.evaluate(() => {
		const el = document.activeElement;
		return {
			tagName: el.tagName,
			text: el.textContent?.trim(),
			role: el.getAttribute('role'),
			ariaLabel: el.getAttribute('aria-label'),
			ariaPressed: el.getAttribute('aria-pressed'),
		};
	});
}
