import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Tests for the theme toggle component
 *
 * These tests check if the theme toggle works correctly:
 * - Basic functionality (clicking changes theme)
 * - Visual appearance in different modes
 * - Keyboard accessibility
 * - System preference handling
 */

// Ensure snapshots directory exists
const snapshotDir = path.join(process.cwd(), 'tests', 'snapshots', 'theme-toggle');
if (!fs.existsSync(snapshotDir)) {
	fs.mkdirSync(snapshotDir, { recursive: true });
}

test.describe('Theme Toggle', () => {
	// Setup helper to clear preferences before tests
	async function clearPreferences(page) {
		try {
			await page.context().clearCookies();

			// Make sure we're on a page before trying to access localStorage
			const currentUrl = page.url();
			if (!currentUrl.startsWith('http')) {
				await page.goto('/');
			}

			// Clear localStorage with proper error handling
			await page.evaluate(() => {
				try {
					localStorage.clear();
					return true;
				} catch (e) {
					console.error('Failed to clear localStorage:', e);
					return false;
				}
			});
		} catch (error) {
			console.warn('Error in clearPreferences:', error.message);
		}
	}

	test('basic toggle functionality', async ({ page }) => {
		await clearPreferences(page);
		await page.goto('/');

		// Find the theme toggle
		const themeToggle = page.getByRole('switch', { name: /toggle theme/i });
		await expect(themeToggle).toBeVisible();

		// Get initial theme state
		const initialIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});

		// Click toggle and check if theme changed
		await themeToggle.click();
		await page.waitForTimeout(300);

		const newIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(newIsDark).not.toBe(initialIsDark);

		// Check if theme is saved after reload
		await page.reload();
		const savedIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(savedIsDark).toBe(newIsDark);
	});

	test('visual appearance in light and dark modes', async ({ page }) => {
		// Test light mode appearance
		await page.goto('/');
		await page.evaluate(() => {
			try {
				localStorage.setItem('theme-preference', 'light');
				document.documentElement.classList.remove('dark-mode');
				document.documentElement.classList.add('light-mode');
				return true;
			} catch (e) {
				console.error('Error setting light mode:', e);
				return false;
			}
		});

		await page.reload();
		await expect(page).toHaveScreenshot({
			path: 'theme-toggle/theme-toggle-light-mode.png',
		});

		// Test dark mode appearance
		await page.evaluate(() => {
			try {
				localStorage.setItem('theme-preference', 'dark');
				document.documentElement.classList.add('dark-mode');
				document.documentElement.classList.remove('light-mode');
				return true;
			} catch (e) {
				console.error('Error setting dark mode:', e);
				return false;
			}
		});

		await page.reload();
		await expect(page).toHaveScreenshot({
			path: 'theme-toggle/theme-toggle-dark-mode.png',
		});
	});

	test('keyboard accessibility', async ({ page }) => {
		await page.goto('/');

		// Tab to the toggle
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// Check if toggle is focused
		const focused = await page.evaluate(() => {
			const el = document.activeElement;
			return (
				el.getAttribute('role') === 'switch' &&
				el.getAttribute('aria-label')?.toLowerCase().includes('toggle theme')
			);
		});
		expect(focused).toBeTruthy();

		// Activate with Enter key
		await page.keyboard.press('Enter');

		// Verify theme changed
		await page.waitForTimeout(200);
		await expect(page).toHaveScreenshot({
			path: 'theme-toggle/theme-toggle-keyboard-activated.png',
		});
	});

	test('system preference mode', async ({ page }) => {
		// Set to system mode
		await page.goto('/');
		await page.evaluate(() => {
			try {
				localStorage.setItem('theme-preference', 'system');
				return true;
			} catch (e) {
				console.error('Error setting system preference:', e);
				return false;
			}
		});

		// Test with dark system preference
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.reload();
		const isDarkWithSystemDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(isDarkWithSystemDark).toBeTruthy();

		// Test with light system preference
		await page.emulateMedia({ colorScheme: 'light' });
		await page.reload();
		const isDarkWithSystemLight = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(isDarkWithSystemLight).toBeFalsy();
	});

	// Visual regression tests for theme toggle
	test('theme toggle appearance changes when clicked', async ({ page }) => {
		await clearPreferences(page);
		await page.goto('/');

		const themeToggle = page.getByRole('switch', { name: /toggle theme/i });

		// Screenshot before clicking
		await expect(page.getByRole('navigation')).toHaveScreenshot({
			path: 'theme-toggle/theme-toggle-before.png',
		});

		// Click and take another screenshot
		await themeToggle.click();
		await page.waitForTimeout(200);
		await expect(page.getByRole('navigation')).toHaveScreenshot({
			path: 'theme-toggle/theme-toggle-after.png',
		});
	});

	test('full page in dark mode', async ({ page }) => {
		// Set dark mode and check full page appearance
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.goto('/');

		await page.waitForTimeout(300);

		const isDarkMode = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(isDarkMode).toBeTruthy();

		await expect(page).toHaveScreenshot({
			path: 'theme-toggle/full-page-dark-mode.png',
			fullPage: true,
		});
	});
});
