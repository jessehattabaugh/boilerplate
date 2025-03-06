import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import {
	assertPerformanceBaseline,
} from './utils/performance-utils.js';

/**
 * Tests for the theme toggle component
 */

// Ensure snapshots directory exists
const snapshotDir = path.join(process.cwd(), 'snapshots');
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

	test('toggle functionality changes theme', async ({ page }) => {
		await clearPreferences(page);
		await page.goto('/');

		// Find the theme toggle
		const themeToggle = page.getByRole('switch', { name: /toggle theme/i });
		await expect(themeToggle).toBeVisible();

		// Get initial theme state
		const initialIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});

		// Take screenshot before clicking
		await expect(themeToggle).toHaveScreenshot('theme-toggle-before-click-baseline.png');

		// Click toggle and check if theme changed
		await themeToggle.click();
		await page.waitForTimeout(300);

		// Take screenshot after clicking
		await expect(themeToggle).toHaveScreenshot('theme-toggle-after-click-baseline.png');

		const newIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(newIsDark).not.toBe(initialIsDark);
	});

	test('toggle remembers preference after reload', async ({ page }) => {
		await clearPreferences(page);
		await page.goto('/');

		// Find the theme toggle
		const themeToggle = page.getByRole('switch', { name: /toggle theme/i });

		// Get initial theme state
		const initialIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});

		// Click toggle and check if theme changed
		await themeToggle.click();
		await page.waitForTimeout(300);

		// Reload the page
		await page.reload();
		await page.waitForTimeout(300);

		// Check if theme preference was remembered
		const rememberedIsDark = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(rememberedIsDark).not.toBe(initialIsDark);

		// Take screenshot of remembered state
		await expect(themeToggle).toHaveScreenshot('theme-toggle-remembered-baseline.png');
	});

	test('toggle is keyboard accessible', async ({ page }) => {
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

		// Take screenshot with focus
		await expect(page).toHaveScreenshot('theme-toggle-focused-baseline.png');

		// Activate with Enter key
		await page.keyboard.press('Enter');
		await page.waitForTimeout(200);

		// Take screenshot after keyboard activation
		await expect(page).toHaveScreenshot('theme-toggle-keyboard-activated-baseline.png');
	});

	test('system preference mode works correctly', async ({ page }) => {
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

		// Take screenshot with system dark preference
		await expect(page).toHaveScreenshot('theme-toggle-system-dark-baseline.png');

		// Test with light system preference
		await page.emulateMedia({ colorScheme: 'light' });
		await page.reload();
		const isDarkWithSystemLight = await page.evaluate(() => {
			return document.documentElement.classList.contains('dark-mode');
		});
		expect(isDarkWithSystemLight).toBeFalsy();

		// Take screenshot with system light preference
		await expect(page).toHaveScreenshot('theme-toggle-system-light-baseline.png');
	});

	test('theme toggle component meets performance baseline', async ({ page }) => {
		await clearPreferences(page);
		await page.goto('/');

		// Find the theme toggle
		const themeToggle = page.getByRole('switch', { name: /toggle theme/i });
		await expect(themeToggle).toBeVisible();

		// Click toggle and measure performance
		// Use performance.now() inside the page to measure operation time
		const toggleOperationTime = await page.evaluate(async () => {
			const themeToggle = document.querySelector('theme-toggle');

			// Measure time to toggle theme
			const start = performance.now();

			// Simulate a click on the toggle button
			const toggleButton = themeToggle.shadowRoot.querySelector('button');
			toggleButton.click();

			// Wait for any animations
			await new Promise((r) => {
				setTimeout(r, 300);
			});

			const end = performance.now();
			return {
				operationTime: end - start,
				domChanges: performance.getEntriesByType('resource').length,
				memoryUsage: performance.memory
					? {
							jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
							totalJSHeapSize: performance.memory.totalJSHeapSize,
							usedJSHeapSize: performance.memory.usedJSHeapSize,
					  }
					: null,
			};
		});

		console.log('Theme toggle performance:', toggleOperationTime);

		// Compare against baseline or save new baseline
		await assertPerformanceBaseline('theme-toggle', toggleOperationTime);

		// Ensure theme toggle operation is fast
		expect(toggleOperationTime.operationTime).toBeLessThan(500); // Toggle should be under 500ms
	});
});
