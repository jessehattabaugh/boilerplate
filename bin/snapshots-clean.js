/**
 * Clean snapshot files except for baseline images
 * This replaces the rimraf command in package.json
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const SNAPSHOTS_DIR = path.join(process.cwd(), 'snapshots');

async function cleanSnapshots() {
	console.log('Cleaning snapshots directory...');

	try {
		// Check if snapshots directory exists
		try {
			await fs.access(SNAPSHOTS_DIR);
		} catch (err) {
			console.log(`Creating snapshots directory at ${SNAPSHOTS_DIR}`);
			await fs.mkdir(SNAPSHOTS_DIR, { recursive: true });
			return;
		}

		// Get all files in the snapshots directory
		const files = await fs.readdir(SNAPSHOTS_DIR);

		// Filter out baseline files
		const filesToRemove = files.filter((file) => {
			return !file.includes('baseline') && !file.endsWith('.md');
		});

		// Delete each file that's not a baseline
		for (const file of filesToRemove) {
			const filePath = path.join(SNAPSHOTS_DIR, file);
			await fs.unlink(filePath);
			console.log(`Deleted: ${file}`);
		}

		console.log('Snapshot cleanup complete!');

		// Try to restore baseline files from git if any were deleted
		try {
			execSync('git checkout -- ./snapshots/*baseline*', { stdio: 'inherit' });
			console.log('Restored any missing baseline files from git');
		} catch (gitError) {
			// It's okay if this fails, could be that there are no git-tracked baselines yet
			console.log('Note: No baseline files needed to be restored from git');
		}
	} catch (error) {
		console.error('Error cleaning snapshots:', error);
		process.exit(1);
	}
}

// Run the cleanup function
cleanSnapshots();
