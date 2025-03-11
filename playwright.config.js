// @ts-check
import { defineConfig, devices } from '@playwright/test';

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
	testDir: './test',
	timeout: 30 * 1000,
	expect: {
		timeout: 5000,
		// Configure screenshot comparison
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.05,
			// Use a naming convention that includes "tmp" for new snapshots
			// These will be ignored by git until accepted as baselines
			snapshotPathTemplate: '{snapshotDir}/{arg}.tmp{ext}',
		},
	},
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: getBaseUrl(),
		actionTimeout: 0,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},
		{
			name: 'mobile-chrome',
			use: { ...devices['Pixel 5'] },
		},
		{
			name: 'mobile-safari',
			use: { ...devices['iPhone 12'] },
		},
	],

	webServer: {
		command: 'npm run start',
		port: 3000,
		reuseExistingServer: !process.env.CI,
	},
});
