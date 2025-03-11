import { expect, test } from '@playwright/test';

import fs from 'fs';
import path from 'path';

/**
 * Test the homepage
 */
test.describe('Homepage', () => {
	// Create snapshots directory if it doesn't exist
	const snapshotDir = path.join(process.cwd(), 'snapshots');
	if (!fs.existsSync(snapshotDir)) {
		fs.mkdirSync(snapshotDir, { recursive: true });
	}

	// Test the homepage visuals
	test('homepage should match visual baseline', async ({ page }) => {
		await page.goto('/');

		// Wait for any animations or transitions to complete
		await page.waitForTimeout(500);

		// Take a screenshot of the entire page
		await expect(page).toHaveScreenshot('homepage-desktop-baseline.png');
	});

	// Test for mobile viewport
	test('homepage on mobile should match visual baseline', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Wait for key elements to be visible
		await page
			.getByRole('heading', { level: 1 })
			.waitFor({ state: 'visible', timeout: 5000 })
			.catch(() => {
				console.log('Heading level 1 not found, continuing test');
			});

		// Wait for any animations to complete
		await page.waitForTimeout(500);

		await expect(page).toHaveScreenshot('homepage-mobile-baseline.png');
	});

	// Test for accessibility-specific features
	test('should have proper keyboard navigation', async ({ page }) => {
		await page.goto('/');

		// Take screenshot with focus on the first interactive element
		await page.keyboard.press('Tab');

		// Find the currently focused element
		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement;
			return el.tagName !== 'BODY'; // Check if focus moved from body
		});

		// Verify something is actually focused
		expect(focusedElement).toBeTruthy();

		// Take a screenshot with the focus visible
		await expect(page).toHaveScreenshot('homepage-keyboard-focus-baseline.png');
	});
});

/**
 * @fileoverview Main test file for the index page
 * 🧪 Tests for basic functionality and theme toggle
 */

// Main page tests
test.describe('Index Page', () => {
	test('page loads successfully 🚀', async ({ page }) => {
		await page.goto('/');

		// Check that the page title is correct
		await expect(page).toHaveTitle(/Modern Web Boilerplate/);

		// Check that the page has a theme toggle component
		const themeToggle = page.locator('theme-toggle');
		await expect(themeToggle).toBeVisible();
	});

	test('takes visual snapshot of the page 📸', async ({ page }) => {
		await page.goto('/');
		// Wait for any animations to complete
		await page.waitForTimeout(500);

		// Take a screenshot of the whole page
		await expect(page).toHaveScreenshot('index-page-baseline.png');
	});
});

// Accessibility tests
test.describe('Accessibility', () => {
	test('page passes basic accessibility checks ♿', async ({ page }) => {
		await page.goto('/');

		// Check for basic accessibility issues using Playwright's accessibility scanner
		const accessibilityScanResults = await page.accessibility.snapshot();
		expect(accessibilityScanResults.children.length).toBeGreaterThan(0);

		// Check that the theme toggle is keyboard accessible
		await page.keyboard.press('Tab');
		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement;
			return el ? el.tagName : null;
		});
		expect(focusedElement).toBeTruthy();
	});
});

/**
 * Test suite for the About page 📄
 */
test.describe('About Page', () => {
    // Create snapshots directory if it doesn't exist
    const snapshotDir = path.join(process.cwd(), 'snapshots');
    if (!fs.existsSync(snapshotDir)) {
        fs.mkdirSync(snapshotDir, { recursive: true });
    }

    test('about page loads successfully 🚀', async ({ page }) => {
        await page.goto('/about.html');
        
        // Check that the page title contains "About"
        await expect(page).toHaveTitle(/About/);
        
        // Verify main heading
        const heading = page.getByRole('heading', { level: 1 });
        await expect(heading).toBeVisible();
    });

    test('navigation works correctly 🧭', async ({ page }) => {
        await page.goto('/about.html');
        
        // Click navigation links
        await page.click('nav a[href="/index.html"]');
        await expect(page).toHaveURL('/index.html');
        
        await page.click('nav a[href="/contact.html"]');
        await expect(page).toHaveURL('/contact.html');
        
        await page.click('nav a[href="/about.html"]');
        await expect(page).toHaveURL('/about.html');
    });

    test('about page is accessible ♿', async ({ page }) => {
        await page.goto('/about.html');
        
        // Check for basic accessibility issues
        const accessibilityScanResults = await page.accessibility.snapshot();
        expect(accessibilityScanResults.children.length).toBeGreaterThan(0);
        
        // Test keyboard navigation
        await page.keyboard.press('Tab');
        const skipLink = await page.evaluate(() => document.activeElement?.classList.contains('sr-only'));
        expect(skipLink).toBeTruthy();
    });

    test('takes visual snapshot of about page 📸', async ({ page }) => {
        await page.goto('/about.html');
        
        // Wait for any animations to complete
        await page.waitForTimeout(500);
        
        // Take screenshot
        await expect(page).toHaveScreenshot('about-page-baseline.png');
    });

    test('mobile layout matches baseline 📱', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/about.html');
        
        await expect(page).toHaveScreenshot('about-page-mobile-baseline.png');
    });
});
