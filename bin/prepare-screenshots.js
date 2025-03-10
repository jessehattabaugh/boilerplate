/**
 * Prepares screenshots for web manifest by copying baseline screenshots to www/screenshots
 * 🖼️ Screenshot preparation utilities
 */
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

const WWW_SCREENSHOTS_DIR = path.resolve(process.cwd(), 'www', 'screenshots');
const TEST_RESULTS_DIR = path.resolve(process.cwd(), 'test-results');

async function prepareScreenshots() {
	console.info('🖼️ 🏗️ Preparing screenshots for web manifest...');

	// Create screenshots directory if it doesn't exist
	if (!fs.existsSync(WWW_SCREENSHOTS_DIR)) {
		fs.mkdirSync(WWW_SCREENSHOTS_DIR, { recursive: true });
	}

	try {
		// Find all baseline screenshots (not containing .tmp.)
		const screenshots = await glob('**/*baseline*.png', {
			cwd: TEST_RESULTS_DIR,
			absolute: true,
		});

		if (screenshots.length === 0) {
			console.warn('🖼️ ⚠️ No baseline screenshots found. Run tests first.');
			return;
		}

		// Map specific test screenshots to manifest names
		const screenshotMap = {
			'homepage-desktop-baseline.png': 'desktop.png',
			'homepage-mobile-baseline.png': 'mobile.png',
		};

		// Copy screenshots to www/screenshots with correct names
		for (const screenshot of screenshots) {
			const sourceFile = path.basename(screenshot);
			const targetFile = screenshotMap[sourceFile];

			// Only copy screenshots that are mapped for the manifest
			if (targetFile) {
				const destination = path.join(WWW_SCREENSHOTS_DIR, targetFile);
				fs.copyFileSync(screenshot, destination);
				console.info(`🖼️ ✅ Copied ${sourceFile} to ${targetFile}`);
			}
		}

		console.info('🖼️ 🎉 Successfully prepared screenshots for manifest');
	} catch (error) {
		console.error('🖼️ ❌ Error preparing screenshots:', error);
		process.exit(1);
	}
}

// Run the script
prepareScreenshots().catch(console.error);
