/**
 * Script to regenerate snapshot baselines
 * This script:
 * 1. Runs the tests with --update-snapshots flag
 * 2. Renames all snapshots to include "baseline" in the filename
 */

import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const SNAPSHOTS_DIR = path.join(process.cwd(), 'snapshots');

async function runTests() {
	console.log('Running tests with --update-snapshots flag...');

	return new Promise((resolve, reject) => {
		exec('npx playwright test --update-snapshots', (error, stdout, stderr) => {
			if (error) {
				console.error('Error running tests:', error);
				console.error(stderr);
				reject(error);
				return;
			}

			console.log(stdout);
			resolve();
		});
	});
}

async function renameSnapshotsToBaselines() {
	console.log('Renaming snapshots to include "baseline" in the filename...');

	try {
		// Ensure directory exists
		try {
			await fs.access(SNAPSHOTS_DIR);
		} catch {
			console.log(`Creating snapshots directory at ${SNAPSHOTS_DIR}`);
			await fs.mkdir(SNAPSHOTS_DIR, { recursive: true });
		}

		const files = await fs.readdir(SNAPSHOTS_DIR);

		const renamePromises = files.map(async (file) => {
			// Skip files that already have "baseline" in the name or non-image files
			if (file.includes('baseline') || !file.endsWith('.png')) {
				return;
			}

			// Get file extension
			const ext = path.extname(file);
			const baseName = path.basename(file, ext);

			// Create new filename with "baseline" suffix
			const newFileName = `${baseName}-baseline${ext}`;

			// Rename the file
			await fs.rename(path.join(SNAPSHOTS_DIR, file), path.join(SNAPSHOTS_DIR, newFileName));

			console.log(`Renamed: ${file} -> ${newFileName}`);
		});

		await Promise.all(renamePromises);

		console.log('All snapshots renamed successfully!');
	} catch (error) {
		console.error('Error renaming snapshots:', error);
		throw error;
	}
}

async function main() {
	try {
		 // Ensure snapshots directory exists
		try {
			await fs.access(SNAPSHOTS_DIR);
		} catch {
			console.log(`Creating snapshots directory at ${SNAPSHOTS_DIR}`);
			await fs.mkdir(SNAPSHOTS_DIR, { recursive: true });
		}

		// Step 1: Run tests to generate new snapshots
		await runTests();

		// Step 2: Rename snapshots to include "baseline"
		await renameSnapshotsToBaselines();

		console.log('Baseline snapshots regenerated successfully!');
	} catch (error) {
		console.error('Failed to regenerate baseline snapshots:', error);
		process.exit(1);
	}
}

main();
