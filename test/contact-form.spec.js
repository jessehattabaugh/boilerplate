import { expect, test } from '@playwright/test';

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
        const formStatus = await page.textContent('#formStatus');
        expect(formStatus).toContain('Invalid email');
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
});