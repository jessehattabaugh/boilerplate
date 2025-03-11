import { expect, test } from '@playwright/test';

/**
 * Test suite for contact form functionality
 * 📨 Ensures contact form validation and submission works correctly
 */

test.describe('Contact Form 📨', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the contact page before each test
		await page.goto('/contact.html');

		// Ensure the form is loaded
		await page.waitForSelector('#contactForm');
		console.debug('📨 Contact form loaded for testing');
	});

	test('shows error for empty fields 🚫', async ({ page }) => {
		// Submit the form without filling any fields
		await page.click('button[type="submit"]');

		// Check for error messages
		const nameError = await page.textContent('#name-error');
		const emailError = await page.textContent('#email-error');
		const messageError = await page.textContent('#message-error');

		// Verify error messages
		expect(nameError).toContain('required');
		expect(emailError).toContain('required');
		expect(messageError).toContain('required');

		// Take a screenshot of the form with errors
		await expect(page.locator('#contactForm')).toHaveScreenshot('contact-form-empty-errors.png');
		console.log('🚫 Empty field validation works correctly');
	});

	test('validates email format ✉️', async ({ page }) => {
		// Fill in invalid email
		await page.fill('#name', 'Test User');
		await page.fill('#email', 'invalid-email');
		await page.fill('#message', 'This is a test message');

		// Submit form
		await page.click('button[type="submit"]');

		// Check for email error message
		const emailError = await page.textContent('#email-error');
		expect(emailError).toContain('valid email');

		// Now fix the email and submit again
		await page.fill('#email', 'valid@example.com');
		await page.click('button[type="submit"]');

		// Email error should be cleared
		const emailErrorAfterFix = await page.textContent('#email-error');
		expect(emailErrorAfterFix).toBeFalsy();
		console.log('✉️ Email validation works correctly');
	});

	test('shows success message after valid submission ✅', async ({ page }) => {
		// Mock the API response
		await page.route('/.netlify/functions/contact-form', async route => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ message: 'Form submitted successfully' })
			});
		});

		// Fill in valid form data
		await page.fill('#name', 'Jane Doe');
		await page.fill('#email', 'jane@example.com');
		await page.fill('#message', 'Hello, this is a test message.');

		// Submit the form
		await page.click('button[type="submit"]');

		// Check for success message
		await page.waitForSelector('#formStatus.success');
		const successMessage = await page.textContent('#formStatus');
		expect(successMessage).toContain('success');

		// Take screenshot of success state
		await expect(page).toHaveScreenshot('contact-form-success.png');
		console.log('✅ Form submission success message works correctly');
	});

	test('shows error message on submission failure ❌', async ({ page }) => {
		// Mock the API failure
		await page.route('/.netlify/functions/contact-form', async route => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({ message: 'Server error' })
			});
		});

		// Fill in valid form data
		await page.fill('#name', 'John Doe');
		await page.fill('#email', 'john@example.com');
		await page.fill('#message', 'This is a test message');

		// Submit the form
		await page.click('button[type="submit"]');

		// Check for error message
		await page.waitForSelector('#formStatus.error');
		const errorMessage = await page.textContent('#formStatus');
		expect(errorMessage).toContain('Failed to send message');

		// Take screenshot of error state
		await expect(page).toHaveScreenshot('contact-form-server-error.png');
		console.log('❌ Form submission error handling works correctly');
	});

	test('keyboard navigation works correctly ⌨️', async ({ page }) => {
		// Start from the top of the page
		await page.keyboard.press('Tab');

		// First tab should focus on skip link
		const skipLinkFocused = await page.evaluate(() => {
			return document.activeElement.textContent.includes('Skip to');
		});
		expect(skipLinkFocused).toBeTruthy();

		// Tab to the name field
		await page.keyboard.press('Tab'); // Nav link 1
		await page.keyboard.press('Tab'); // Nav link 2
		await page.keyboard.press('Tab'); // Nav link 3
		await page.keyboard.press('Tab'); // Theme toggle
		await page.keyboard.press('Tab'); // Name field

		// Check if name field is focused
		const nameFieldFocused = await page.evaluate(() => {
			return document.activeElement.id === 'name';
		});
		expect(nameFieldFocused).toBeTruthy();

		// Continue tabbing through the form
		await page.keyboard.press('Tab'); // Email field
		await page.keyboard.press('Tab'); // Message field
		await page.keyboard.press('Tab'); // Submit button

		// Check if submit button is focused
		const submitButtonFocused = await page.evaluate(() => {
			return document.activeElement.textContent.includes('Send Message');
		});
		expect(submitButtonFocused).toBeTruthy();

		// Press Enter to submit the form
		await page.keyboard.press('Enter');

		// Check if validation errors appear
		await page.waitForSelector('.error-message');
		const hasErrors = await page.$$eval('.error-message', elements =>
			elements.some(el => el.textContent.trim().length > 0)
		);
		expect(hasErrors).toBeTruthy();

		console.log('⌨️ Keyboard navigation and form submission works correctly');
	});
});