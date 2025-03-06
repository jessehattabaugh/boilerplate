import { test, expect } from '@playwright/test';

/**
 * Visual regression and functional tests for the theme toggle feature
 *
 * These tests verify that:
 * 1. The theme toggle is visible and interactive
 * 2. Toggling changes the theme appropriately
 * 3. Theme preferences are persisted between visits
 * 4. Visual appearance matches expected snapshots for both themes
 */

test.describe('Theme Toggle Tests', () => {
	test('theme toggle is visible and works correctly', async ({ page }) => {
		// Start with a clean slate (no stored preferences)
		await page.context().clearCookies();
		await page.evaluate(() => {
			return localStorage.clear();
		});

		// Navigate to the homepage
		await page.goto('/');

		// Find the theme toggle using its accessible role
		const themeToggle = page.getByRole('switch', { name: /toggle theme/i });

		// Verify it's visible
		await expect(themeToggle).toBeVisible();

		// Take screenshot of the initial state
		await expect(page).toHaveScreenshot('theme-initial-state.png', {
			fullPage: true,
			animations: 'disabled',
		});

		// Get the initial theme state
		const initialIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});

		// Click the theme toggle
		await themeToggle.click();

		// Allow a small delay for any transitions to complete
		await page.waitForTimeout(300);

		// Verify the theme has changed
		const newIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(newIsDark).not.toBe(initialIsDark);

		// Verify the toggle UI has updated
		const toggleState = await themeToggle.getAttribute('aria-pressed');
		expect(toggleState).toBe(String(newIsDark));

		// Take screenshot after theme change
		await expect(page).toHaveScreenshot('theme-after-toggle.png', {
			fullPage: true,
			animations: 'disabled',
		});

		// Reload the page to verify persistence
		await page.reload();

		// Verify theme persisted after reload
		const persistedIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(persistedIsDark).toBe(newIsDark);

		// Take screenshot after reload to verify persistence
		await expect(page).toHaveScreenshot('theme-persisted.png', {
			fullPage: true,
			animations: 'disabled',
		});

		// Toggle theme again to return to initial state
		const reloadedToggle = page.getByRole('switch', { name: /toggle theme/i });
		await reloadedToggle.click();

		// Allow a small delay for any transitions to complete
		await page.waitForTimeout(300);

		// Final theme state should match initial state
		const finalIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(finalIsDark).toBe(initialIsDark);

		// Take final screenshot
		await expect(page).toHaveScreenshot('theme-final-state.png', {
			fullPage: true,
			animations: 'disabled',
		});
	});

	test('theme toggle shows correct appearance in both light and dark modes', async ({ page }) => {
		// Force light mode
		await page.evaluate(() => {
			localStorage.setItem('theme-preference', 'light');
			document.documentElement.classList.remove('dark-mode');
			document.documentElement.classList.add('light-mode');
		});

		await page.goto('/');
		await page.waitForTimeout(100); // Brief delay to ensure theme applied

		// Verify light mode screenshot
		await expect(page.getByRole('switch', { name: /toggle theme/i })).toBeVisible();
		await expect(page).toHaveScreenshot('theme-toggle-light-mode.png', {
			fullPage: true,
		});

		// Now force dark mode
		await page.evaluate(() => {
			localStorage.setItem('theme-preference', 'dark');
			document.documentElement.classList.add('dark-mode');
			document.documentElement.classList.remove('light-mode');
		});

		await page.reload();
		await page.waitForTimeout(100); // Brief delay to ensure theme applied

		// Verify dark mode screenshot
		await expect(page).toHaveScreenshot('theme-toggle-dark-mode.png', {
			fullPage: true,
		});
	});

	test('theme toggle works with keyboard navigation', async ({ page }) => {
		await page.goto('/');

		// Navigate to the theme toggle with keyboard
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// Verify the theme toggle is focused
		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement;
			return {
				role: el.getAttribute('role'),
				ariaLabel: el.getAttribute('aria-label'),
			};
		});

		expect(focusedElement.role).toBe('switch');
		expect(focusedElement.ariaLabel).toMatch(/toggle theme/i);

		// Take screenshot of focused state
		await expect(page).toHaveScreenshot('theme-toggle-focused.png', {
			fullPage: true,
		});

		// Get initial theme state
		const initialIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});

		// Activate with keyboard
		await page.keyboard.press('Enter');
		await page.waitForTimeout(300);

		// Verify theme changed
		const newIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(newIsDark).not.toBe(initialIsDark);

		// Take screenshot after keyboard activation
		await expect(page).toHaveScreenshot('theme-toggle-keyboard-activated.png', {
			fullPage: true,
		});
	});

	test('system preference mode works correctly', async ({ page }) => {
		// Set to system mode
		await page.evaluate(() => {
			localStorage.setItem('theme-preference', 'system');
		});

		// Emulate system dark preference
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.goto('/');

		// Verify the page is in dark mode
		const isDarkWithSystemDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(isDarkWithSystemDark).toBeTruthy();

		// Take screenshot in dark system preference
		await expect(page).toHaveScreenshot('theme-system-dark-preference.png', {
			fullPage: true,
		});

		// Emulate system light preference
		await page.emulateMedia({ colorScheme: 'light' });
		await page.reload();

		// Verify the page is in light mode
		const isDarkWithSystemLight = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(isDarkWithSystemLight).toBeFalsy();

		// Take screenshot in light system preference
		await expect(page).toHaveScreenshot('theme-system-light-preference.png', {
			fullPage: true,
		});
	});

	test('theme toggle cycles through all modes correctly', async ({ page }) => {
		// Start with a clean slate
		await page.context().clearCookies();
		await page.evaluate(() => {
			return localStorage.clear();
		});

		await page.goto('/');

		const themeToggle = page.getByRole('switch', { name: /toggle theme/i });

		// Get label text for each click to verify cycling through modes
		const getToggleLabel = async () => {
			return page.evaluate(() => {
				const toggle = document
					.querySelector('theme-toggle')
					.shadowRoot.querySelector('.label');
				return toggle ? toggle.textContent.trim() : null;
			});
		};

		// Initial state (should be system or auto)
		const initialLabel = await getToggleLabel();
		expect(['Auto', 'System', 'Dark', 'Light']).toContain(initialLabel);

		// First click
		await themeToggle.click();
		await page.waitForTimeout(100);
		const label1 = await getToggleLabel();
		expect(label1).not.toBe(initialLabel);
		await expect(page).toHaveScreenshot('theme-cycle-1.png', { fullPage: true });

		// Second click
		await themeToggle.click();
		await page.waitForTimeout(100);
		const label2 = await getToggleLabel();
		expect(label2).not.toBe(label1);
		expect(label2).not.toBe(initialLabel);
		await expect(page).toHaveScreenshot('theme-cycle-2.png', { fullPage: true });

		// Third click should complete the cycle
		await themeToggle.click();
		await page.waitForTimeout(100);
		const label3 = await getToggleLabel();
		expect(label3).toBe(initialLabel);
		await expect(page).toHaveScreenshot('theme-cycle-3.png', { fullPage: true });
	});
});
