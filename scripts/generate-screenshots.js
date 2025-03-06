/**
 * Script to generate screenshots for PWA manifest
 * Uses Playwright to capture desktop and mobile views
 */
import { chromium } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');

// Screenshot configurations
const SCREENSHOTS = [
	{
		name: 'desktop.png',
		width: 1280,
		height: 800,
		deviceScaleFactor: 1,
	},
	{
		name: 'mobile.png',
		width: 750,
		height: 1334,
		deviceScaleFactor: 2, // Higher resolution for app stores
		isMobile: true,
	},
];

/**
 * Ensure the screenshots directory exists
 */
async function ensureDir() {
	try {
		await fs.mkdir(screenshotsDir, { recursive: true });
		console.log(`Directory created/verified: ${screenshotsDir}`);
	} catch (err) {
		console.error('Failed to create screenshots directory:', err);
		process.exit(1);
	}
}

/**
 * Take screenshots using Playwright
 */
async function takeScreenshots() {
	console.log('Launching browser to capture screenshots...');

	// Launch browser
	const browser = await chromium.launch();

	try {
		// Create a new context for better isolation
		const context = await browser.newContext();

		// Get base URL from environment or use default
		const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

		await Promise.all(
			SCREENSHOTS.map(async config => {
				console.log(`Generating ${config.name}...`);

				// Create a page with the specified viewport
				const page = await context.newPage();
				await page.setViewportSize({
					width: config.width,
					height: config.height,
				});

				// Set mobile emulation if needed
				if (config.isMobile) {
					await context.addInitScript(() => {
						window.innerWidth = 390;
						window.innerHeight = 844;
						Object.defineProperty(navigator, 'userAgent', {
							get() {
								return 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';
							},
						});
					});
				}

				// Navigate to the site
				await page.goto(baseUrl);

				// Wait for key elements to ensure page is fully loaded
				await Promise.all([
					page.waitForSelector('header', { state: 'visible' }),
					page.waitForSelector('main', { state: 'visible' }),
					page.waitForTimeout(500), // Extra delay for animations
				]);

				// Take full page screenshot
				await page.screenshot({
					path: path.join(screenshotsDir, config.name),
					fullPage: true,
					quality: 90,
					scale: config.deviceScaleFactor || 1,
				});

				console.log(`✅ Saved ${config.name}`);
				await page.close();
			}),
		);

		// Close all contexts when done
		await context.close();
	} catch (error) {
		console.error('Error capturing screenshots:', error);
	} finally {
		await browser.close();
	}
}

/**
 * Update the manifest.json file with the correct screenshot paths
 */
async function updateManifest() {
	const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');

	try {
		// Read the existing manifest
		const manifestContent = await fs.readFile(manifestPath, 'utf8');
		const manifest = JSON.parse(manifestContent);

		// Update the screenshots array
		manifest.screenshots = [
			{
				src: '/screenshots/desktop.png',
				sizes: '1280x800',
				type: 'image/png',
				// eslint-disable-next-line camelcase
				form_factor: 'wide',
			},
			{
				src: '/screenshots/mobile.png',
				sizes: '750x1334',
				type: 'image/png',
				// eslint-disable-next-line camelcase
				form_factor: 'narrow',
			},
		];

		// Write the updated manifest
		await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
		console.log('✅ Updated manifest.json with screenshot entries');
	} catch (error) {
		console.error('Error updating manifest:', error);
	}
}

/**
 * Main function to run the screenshot generation process
 */
async function main() {
	console.log('🖼️  Generating PWA screenshots for manifest...');

	try {
		await ensureDir();
		await takeScreenshots();
		await updateManifest();

		console.log('✨ All screenshots generated successfully!');
		console.log(`📂 Screenshots saved to ${screenshotsDir}`);
	} catch (error) {
		console.error('Screenshot generation failed:', error);
		process.exit(1);
	}
}

// Run the main function
main();
