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

// Simple performance check without using performance-utils
test.describe('Performance', () => {
	test('page loads within reasonable time ⚡', async ({ page }) => {
		// Navigate to the page
		const navigationStart = Date.now();
		await page.goto('/');
		const navigationEnd = Date.now();

		// Basic performance check - page should load in under 1 second in test environment
		expect(navigationEnd - navigationStart).toBeLessThan(1000);
	});
});

/**
 * Test suite for contact form functionality 📝
 */
test.describe('Contact Form 📨', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/contact.html');
    });

    test('shows error for empty fields 🚫', async ({ page }) => {
        // Try submitting empty form
        await page.click('button[type="submit"]');

        // Native HTML5 validation should prevent submission
        // and highlight the first required field
        const focusedElement = await page.evaluate(() => document.activeElement?.id);
        expect(focusedElement).toBe('name');
    });

    test('validates email format ✉️', async ({ page }) => {
        // Fill invalid email
        await page.fill('#name', 'Test User');
        await page.fill('#email', 'invalid-email');
        await page.fill('#message', 'Test message');

        // Submit form
        await page.click('button[type="submit"]');

        // Should show validation error
        const emailError = await page.textContent('#email-error');
        expect(emailError).toContain('valid email');
    });

    test('submits form successfully ✅', async ({ page }) => {
        // Fill out form
        await page.fill('#name', 'Test User');
        await page.fill('#email', 'test@example.com');
        await page.fill('#message', 'Test message');

        // Submit form
        await page.click('button[type="submit"]');

        // Check for success message
        const formStatus = await page.locator('#formStatus');
        await expect(formStatus).toHaveClass('success');
        await expect(formStatus).toContainText('successfully');

        // Form should be reset
        await expect(page.locator('#name')).toHaveValue('');
        await expect(page.locator('#email')).toHaveValue('');
        await expect(page.locator('#message')).toHaveValue('');
    });

    test('handles server errors gracefully ⚠️', async ({ page }) => {
        // Fill out form
        await page.fill('#name', 'Error Test');
        await page.fill('#email', 'error@test.com');
        await page.fill('#message', 'Trigger error');

        // Mock failed response
        await page.route('**/.netlify/functions/contact-form', async (route) => {
            await route.fulfill({
                status: 500,
                body: JSON.stringify({ message: 'Internal server error' })
            });
        });

        // Submit form
        await page.click('button[type="submit"]');

        // Check for error message
        const formStatus = await page.locator('#formStatus');
        await expect(formStatus).toHaveClass('error');
        await expect(formStatus).toContainText('error');
    });

    test('shows loading state while submitting 🔄', async ({ page }) => {
        // Fill out form
        await page.fill('#name', 'Test User');
        await page.fill('#email', 'test@example.com');
        await page.fill('#message', 'Test message');

        // Start intercepting form submission
        const responsePromise = page.waitForResponse('**/.netlify/functions/contact-form');

        // Submit form
        await page.click('button[type="submit"]');

        // Check loading state
        const formStatus = await page.textContent('#formStatus');
        expect(formStatus).toBe('Sending...');

        // Wait for response
        await responsePromise;
    });

    test('preserves user input on validation errors 💾', async ({ page }) => {
        const testName = 'Test User';
        const testEmail = 'invalid-email';
        const testMessage = 'Test message';

        // Fill form with invalid email
        await page.fill('#name', testName);
        await page.fill('#email', testEmail);
        await page.fill('#message', testMessage);

        // Submit form (should fail validation)
        await page.click('button[type="submit"]');

        // Check that form values are preserved
        await expect(page.locator('#name')).toHaveValue(testName);
        await expect(page.locator('#email')).toHaveValue(testEmail);
        await expect(page.locator('#message')).toHaveValue(testMessage);
    });

    test('keyboard navigation works correctly ⌨️', async ({ page }) => {
        // Press Tab to focus first input
        await page.keyboard.press('Tab');
        let focusedElement = await page.evaluate(() => document.activeElement?.id);
        expect(focusedElement).toBe('name');

        // Tab through form fields
        await page.keyboard.press('Tab');
        focusedElement = await page.evaluate(() => document.activeElement?.id);
        expect(focusedElement).toBe('email');

        await page.keyboard.press('Tab');
        focusedElement = await page.evaluate(() => document.activeElement?.id);
        expect(focusedElement).toBe('message');
    });
});
