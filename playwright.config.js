import { defineConfig } from '@playwright/test';

/**
 * Get base URL from environment variable or use default
 * This allows testing different environments (local, staging, production)
 */
const getBaseUrl = () => {
	if (process.env.TEST_ENV === 'staging') {
		return process.env.STAGING_URL || 'https://staging.example.com';
	}
	return process.env.BASE_URL || 'http://localhost:3000';
};

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [['html', { open: 'never' }], ['list']],
	use: {
		baseURL: getBaseUrl(),
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},

	// Configure projects for different browsers
	projects: [
		{
			name: 'chromium',
			use: {
				browserName: 'chromium',
				viewport: { width: 1280, height: 720 },
			},
		},
		{
			name: 'firefox',
			use: {
				browserName: 'firefox',
				viewport: { width: 1280, height: 720 },
			},
		},
		{
			name: 'webkit',
			use: {
				browserName: 'webkit',
				viewport: { width: 1280, height: 720 },
			},
		},
		{
			name: 'mobile-chrome',
			use: {
				browserName: 'chromium',
				...devices['Pixel 5'],
			},
		},
		{
			name: 'mobile-safari',
			use: {
				browserName: 'webkit',
				...devices['iPhone 12'],
			},
		},
	],
});

// Import device presets
import { devices } from '@playwright/test';
