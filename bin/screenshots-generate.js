/**
 * Script to handle running the server and taking screenshots
 *
 * This script:
 * 1. Starts the server in the background
 * 2. Waits for the server to be ready
 * 3. Takes screenshots at various viewport sizes
 * 4. Kills the server when done
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';
import fetch from 'node-fetch';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '@playwright/test';
import fs from 'fs';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Configuration
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const MAX_RETRIES = 30;
const RETRY_DELAY = 1000; // 1 second

/**
 * Check if the server is ready by making a request
 */
async function isServerReady() {
	try {
		const response = await fetch(BASE_URL);
		return response.status === 200;
	} catch {
		return false;
	}
}

/**
 * Wait for the server to be ready
 */
async function waitForServer() {
	console.log(`Waiting for server to be ready at ${BASE_URL}...`);

	async function retryServerReady(retries) {
		if (retries === 0) {
			console.error('❌ Server failed to start within the timeout period');
			return false;
		}

		const [serverReady] = await Promise.all([isServerReady(), setTimeout(RETRY_DELAY)]);

		if (serverReady) {
			console.log('✅ Server is ready');
			return true;
		}

		process.stdout.write('.');
		return retryServerReady(retries - 1);
	}

	return retryServerReady(MAX_RETRIES);
}

/**
 * Take screenshots at various viewport sizes
 */
async function takeScreenshots() {
	console.log('Starting screenshot generation...');
	console.log('Using base URL:', BASE_URL);

	const SCREENSHOTS_DIR = path.join(rootDir, 'www', 'screenshots');

	// Ensure screenshots directory exists
	if (!fs.existsSync(SCREENSHOTS_DIR)) {
		fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
	}

	const browser = await chromium.launch();

	try {
		const context = await browser.newContext();
		const page = await context.newPage();

		// Desktop screenshot (1280x800)
		console.log('Taking desktop screenshot...');
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto(BASE_URL);
		await page.waitForTimeout(1000); // Wait for any animations to complete
		await page.screenshot({
			path: path.join(SCREENSHOTS_DIR, 'desktop.png'),
			fullPage: false,
		});

		// Mobile screenshot (390x844 - iPhone 12 dimensions)
		console.log('Taking mobile screenshot...');
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(BASE_URL);
		await page.waitForTimeout(1000); // Wait for any animations to complete
		await page.screenshot({
			path: path.join(SCREENSHOTS_DIR, 'mobile.png'),
			fullPage: false,
		});

		// Tablet screenshot (768x1024 - iPad dimensions)
		console.log('Taking tablet screenshot...');
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.goto(BASE_URL);
		await page.waitForTimeout(1000); // Wait for any animations to complete
		await page.screenshot({
			path: path.join(SCREENSHOTS_DIR, 'tablet.png'),
			fullPage: false,
		});

		console.log('All screenshots generated successfully!');
		console.log('Screenshots saved to:', SCREENSHOTS_DIR);

		return true;
	} catch (error) {
		console.error('Error generating screenshots:', error);
		return false;
	} finally {
		await browser.close();
	}
}

/**
 * Main function
 */
async function main() {
	console.log('🚀 Starting server...');

	// Start server process
	const serverProcess = spawn('npx', ['serve', './www', '-p', PORT], {
		stdio: ['ignore', 'pipe', 'pipe'],
		detached: true,
	});

	// Handle server output
	serverProcess.stdout.on('data', (data) => {
		return console.log(`[Server]: ${data.toString().trim()}`);
	});
	serverProcess.stderr.on('data', (data) => {
		return console.error(`[Server Error]: ${data.toString().trim()}`);
	});

	// Handle server errors
	serverProcess.on('error', (err) => {
		console.error('Failed to start server:', err);
		process.exit(1);
	});

	let success = false;

	try {
		// Wait for server to be ready
		const isReady = await waitForServer();
		if (!isReady) {
			throw new Error('Server failed to start');
		}

		// Take screenshots
		success = await takeScreenshots();
	} catch (error) {
		console.error('Error:', error);
		success = false;
	} finally {
		// Kill server process and its children
		console.log('🛑 Shutting down server...');

		if (process.platform === 'win32') {
			// Windows needs a different approach to kill processes
			spawn('taskkill', ['/pid', serverProcess.pid, '/T', '/F']);
		} else {
			// Unix-like systems
			process.kill(-serverProcess.pid, 'SIGTERM');
		}

		// Exit with appropriate code
		process.exit(success ? 0 : 1);
	}
}

// Run the main function
main().catch((error) => {
	console.error('Unhandled error:', error);
	process.exit(1);
});
