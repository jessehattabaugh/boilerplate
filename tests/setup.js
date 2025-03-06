/**
 * Global setup for tests
 */
import fs from 'fs';
import path from 'path';

/**
 * Save test results and screenshots to a directory with timestamp
 */
export const setupTestResultsDir = () => {
	const now = new Date();
	const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
		now.getDate(),
	).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(
		now.getMinutes(),
	).padStart(2, '0')}`;
	const resultsDir = path.join(process.cwd(), 'test-results', timestamp);

	if (!fs.existsSync(resultsDir)) {
		fs.mkdirSync(resultsDir, { recursive: true });
	}

	return resultsDir;
};

/**
 * Get the name of the environment being tested
 */
export const getTestEnvironment = () => {
	return process.env.TEST_ENV || 'local';
};

/**
 * Log test run information
 */
export const logTestRunInfo = () => {
	console.log(
		`Running tests against ${getTestEnvironment()} environment: ${
			process.env.BASE_URL || 'http://localhost:3000'
		}`,
	);
};
