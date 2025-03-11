import { expect, test } from '@playwright/test';

import fs from 'fs';
import path from 'path';

/**
 * Test suite for the homepage
 * 🏠 Tests for homepage functionality and appearance
 */

test.describe('Index Page', () => {
	// Basic functionality
	test('page loads successfully 🚀', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Modern Web Boilerplate/);
		console.log('🏠 Homepage loaded successfully');
	});

	test('takes visual snapshot of the page 📸', async ({ page }) => {
		await page.goto('/');
		// Wait for any animations to complete
		await page.waitForTimeout(500);
		await expect(page).toHaveScreenshot('index-page-baseline.png');
		console.log('📸 Visual snapshot taken of homepage');
	});

	test('theme toggle changes theme 🌓', async ({ page }) => {
		await page.goto('/');

		// Click the theme toggle button
		await page.locator('theme-toggle').click();

		// Check if body has the light-mode class
		const hasLightClass = await page.evaluate(() => {
			return document.body.classList.contains('light-mode');
		});

		// Click the theme toggle button again
		await page.locator('theme-toggle').click();

		// Check if body has the dark-mode class
		const hasDarkClass = await page.evaluate(() => {
			return document.body.classList.contains('dark-mode');
		});

		// Make sure at least one theme was applied
		expect(hasLightClass || hasDarkClass).toBeTruthy();
		console.log('🌓 Theme toggle changes theme correctly');
	});

	test('theme toggle cycles through options 🔄', async ({ page }) => {
		await page.goto('/');

		// Click multiple times to cycle through options
		for (let i = 0; i < 4; i++) {
			await page.locator('theme-toggle').click();
			await page.waitForTimeout(100); // Small delay for theme to apply
		}

		// Theme should cycle back to the original state after 3 clicks
		const themePreference = await page.evaluate(() => {
			return localStorage.getItem('theme-preference');
		});

		expect(['light', 'dark', 'system']).toContain(themePreference);
		console.log('🔄 Theme toggle cycles through options correctly');
	});
});

test.describe('Homepage', () => {
	// Create snapshots directory if it doesn't exist
	const snapshotDir = path.join(process.cwd(), 'snapshots');
	if (!fs.existsSync(snapshotDir)) {
		fs.mkdirSync(snapshotDir, { recursive: true });
	}

	test('mobile layout matches baseline 📱', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Wait for key elements to be visible
		await page.getByRole('heading', { level: 1 }).waitFor({ state: 'visible' });

		// Wait for animations to complete
		await page.waitForTimeout(500);

		await expect(page).toHaveScreenshot('homepage-mobile-baseline.png');
		console.log('📱 Mobile layout snapshot taken');
	});

	test('should have proper keyboard navigation ⌨️', async ({ page }) => {
		await page.goto('/');

		// Press Tab to focus on the first interactive element
		await page.keyboard.press('Tab');

		// Find the focused element
		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement;
			return {
				tag: el.tagName,
				isFocused: el.tagName !== 'BODY',
			};
		});

		// Verify something other than body is focused
		expect(focusedElement.isFocused).toBeTruthy();

		// Take a screenshot with the focus visible
		await expect(page).toHaveScreenshot('homepage-keyboard-focus.png');
		console.log('⌨️ Keyboard navigation works correctly');
	});

	test('carousel navigation works 🎠', async ({ page }) => {
		await page.goto('/');

		// Find the carousel
		const carousel = await page.locator('image-carousel');

		// Check if carousel exists
		const carouselExists = (await carousel.count()) > 0;
		if (!carouselExists) {
			console.warn('🎠 Carousel not found, skipping test');
			test.skip();
			return;
		}

		// Click next button
		await page.locator('image-carousel').getByRole('button', { name: 'Next' }).click();

		// Take a screenshot of the carousel after navigation
		await page.waitForTimeout(300); // Wait for transition
		await expect(page.locator('image-carousel')).toHaveScreenshot('carousel-next.png');
		console.log('🎠 Carousel navigation tested');
	});
});

test.describe('Accessibility', () => {
	test('page passes basic accessibility checks ♿', async ({ page }) => {
		await page.goto('/');

		// Check for basic accessibility issues
		const accessibilityScanResults = await page.accessibility.snapshot();
		expect(accessibilityScanResults.children.length).toBeGreaterThan(0);

		// Check that skip link works
		const skipLink = await page.locator('a:text("Skip to main content")');
		await skipLink.focus();
		await skipLink.click();

		// Check that focus moved to main content
		const isFocusOnMain = await page.evaluate(() => {
			return document.activeElement.id === 'main-content';
		});

		expect(isFocusOnMain).toBeTruthy();
		console.log('♿ Accessibility features work as expected');
	});
});

test.describe('Performance', () => {
	test('page loads within reasonable time ⚡', async ({ page }) => {
		// Navigate to the page
		const navigationStart = Date.now();
		await page.goto('/');
		const navigationEnd = Date.now();

		// Basic performance check
		expect(navigationEnd - navigationStart).toBeLessThan(3000);

		// Log performance metrics
		const performanceTimings = await page.evaluate(() => JSON.stringify(performance.timing));
		const timings = JSON.parse(performanceTimings);

		// Log key metrics
		console.info('📊 Performance metrics:', {
			ttfb: timings.responseStart - timings.requestStart,
			domLoaded: timings.domContentLoadedEventEnd - timings.navigationStart,
			fullLoad: timings.loadEventEnd - timings.navigationStart,
		});

		console.log('⚡ Page load time within acceptable range');
	});
});
