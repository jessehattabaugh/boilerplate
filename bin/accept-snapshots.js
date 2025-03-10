/**
 * Accept temporary screenshots as new baselines by removing .tmp. from filenames
 * 🖼️ Screenshot acceptance utilities
 */
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

const TEST_RESULTS_DIR = path.resolve(process.cwd(), 'test-results');

async function acceptSnapshots() {
	console.info('🖼️ 📸 Looking for temporary snapshots to accept...');

	try {
		// Find all temporary snapshots
		const tmpSnapshots = await glob('**/*.tmp.*', {
			cwd: TEST_RESULTS_DIR,
			absolute: true,
		});

		if (tmpSnapshots.length === 0) {
			console.warn('🖼️ ⚠️ No temporary snapshots found. Run tests first.');
			return;
		}

		console.info(`🖼️ 🔍 Found ${tmpSnapshots.length} temporary snapshots`);

		// Accept each snapshot by removing .tmp.
		for (const tmpPath of tmpSnapshots) {
			const baselinePath = tmpPath.replace('.tmp.', '.');
			const dir = path.dirname(baselinePath);

			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}

			fs.renameSync(tmpPath, baselinePath);
			console.info(
				`🖼️ ✅ Accepted: ${path.basename(tmpPath)} -> ${path.basename(baselinePath)}`,
			);
		}

		console.info('🖼️ 🎉 Successfully accepted all snapshots');
	} catch (error) {
		console.error('🖼️ ❌ Error accepting snapshots:', error);
		process.exit(1);
	}
}

// Run the script
acceptSnapshots().catch(console.error);
