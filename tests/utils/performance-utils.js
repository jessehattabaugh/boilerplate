/**
 * Utilities for performance testing
 */
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const PERFORMANCE_DIR = path.join(process.cwd(), 'performance');

/**
 * Ensure the performance directory exists
 */
async function ensurePerformanceDir() {
	try {
		await fs.access(PERFORMANCE_DIR);
	} catch {
		await fs.mkdir(PERFORMANCE_DIR, { recursive: true });
	}
}

/**
 * Save performance metrics to a file
 *
 * @param {string} name - Name of the component/page being tested
 * @param {Object} metrics - Performance metrics to save
 * @returns {Promise<void>}
 */
export async function savePerformanceMetrics(name, metrics) {
	await ensurePerformanceDir();

	const filePath = path.join(PERFORMANCE_DIR, `${name}-performance.json`);
	const dateTime = new Date().toISOString();

	const dataToSave = {
		timestamp: dateTime,
		metrics,
	};

	// Format with nice indentation for readability
	await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2));
	console.log(`Performance metrics for ${name} saved to ${filePath}`);
}

/**
 * Load performance baseline metrics
 *
 * @param {string} name - Name of the component/page to load metrics for
 * @returns {Promise<Object|null>} The metrics or null if no baseline exists
 */
export async function loadPerformanceBaseline(name) {
	const filePath = path.join(PERFORMANCE_DIR, `${name}-performance.json`);

	try {
		const data = await fs.readFile(filePath, 'utf-8');
		return JSON.parse(data).metrics;
	} catch (err) {
		if (err.code === 'ENOENT') {
			console.log(
				`No baseline found for ${name}, will create one if UPDATE_PERFORMANCE_BASELINE is set`,
			);
			return null;
		}
		throw err;
	}
}

/**
 * Check if current performance meets baseline expectations
 *
 * @param {string} name - Name of the component/page being tested
 * @param {Object} currentMetrics - Current performance metrics
 * @param {Object} options - Options for comparison
 * @param {number} options.threshold - Percentage tolerance (default: 10%)
 * @returns {Promise<void>} - Throws if performance doesn't meet baseline
 */
export async function assertPerformanceBaseline(name, currentMetrics, options = {}) {
	const threshold = options.threshold || 10; // Default 10% tolerance
	const isUpdating = process.env.UPDATE_PERFORMANCE_BASELINE === 'true';

	// Save current metrics if we're updating baselines
	if (isUpdating) {
		await savePerformanceMetrics(name, currentMetrics);
		return;
	}

	const baseline = await loadPerformanceBaseline(name);

	// If no baseline, create one but don't fail the test
	if (!baseline) {
		console.warn(`No baseline found for ${name}. Creating one now.`);
		await savePerformanceMetrics(name, currentMetrics);
		return;
	}

	// Compare values with tolerance
	const failures = [];

	Object.keys(currentMetrics).forEach((metric) => {
		// Skip metrics that don't exist in the baseline
		if (!baseline[metric]) {
			return;
		}

		const baselineValue = baseline[metric];
		const currentValue = currentMetrics[metric];

		// Skip string or non-numeric metrics
		if (typeof baselineValue !== 'number' || typeof currentValue !== 'number') {
			return;
		}

		// For metrics where lower is better (most performance metrics)
		const percentChange = ((currentValue - baselineValue) / baselineValue) * 100;

		// If current value is more than threshold% worse than baseline
		if (percentChange > threshold) {
			failures.push({
				metric,
				baseline: baselineValue,
				current: currentValue,
				percentChange,
			});
		}
	});

	// Report failures
	if (failures.length > 0) {
		console.error('\nPerformance regression detected:');
		failures.forEach((failure) => {
			console.error(
				`  ${failure.metric}: ${failure.baseline.toFixed(2)} → ${failure.current.toFixed(
					2,
				)} ` + `(${failure.percentChange.toFixed(2)}% worse)`,
			);
		});

		throw new Error(`Performance degraded beyond ${threshold}% threshold for ${name}`);
	}

	console.log(`Performance is within ${threshold}% of baseline for ${name}`);
}

/**
 * Run Lighthouse and get scores
 *
 * @param {string} url - URL to test
 * @returns {Promise<Object>} - Lighthouse scores
 */
export async function getLighthouseScores(url) {
	try {
		// Create a temporary file for the output
		const outputPath = path.join(PERFORMANCE_DIR, 'temp-lighthouse.json');

		// Run Lighthouse
		execSync(
			`npx lighthouse ${url} --output json --output-path ${outputPath} --chrome-flags="--headless --no-sandbox --disable-gpu"`,
			{ stdio: 'inherit' },
		);

		// Read the results
		const data = await fs.readFile(outputPath, 'utf-8');
		const result = JSON.parse(data);

		// Extract the scores
		const scores = {
			performance: result.categories.performance.score * 100,
			accessibility: result.categories.accessibility.score * 100,
			'best-practices': result.categories['best-practices'].score * 100,
			seo: result.categories.seo.score * 100,
			pwa: result.categories.pwa.score * 100,

			// Core Web Vitals
			FCP: result.audits['first-contentful-paint'].numericValue,
			LCP: result.audits['largest-contentful-paint'].numericValue,
			CLS: result.audits['cumulative-layout-shift'].numericValue,
			TBT: result.audits['total-blocking-time'].numericValue,
			TTI: result.audits['interactive'].numericValue,
		};

		// Clean up temp file
		await fs.unlink(outputPath);

		return scores;
	} catch (error) {
		console.error('Failed to run Lighthouse:', error);
		return null;
	}
}

/**
 * Get browser performance metrics
 *
 * @param {Page} page - Playwright page object
 * @returns {Promise<Object>} Performance metrics
 */
export async function getBrowserPerformanceMetrics(page) {
	// Wait for page to be fully loaded
	await page.waitForLoadState('networkidle');

	// Get performance metrics
	const metrics = await page.evaluate(() => {
		return new Promise((resolve) => {
			let lcpValue = 0;
			let clsValue = 0;

			// Use Performance API for basic metrics
			const basicMetrics = {
				// Navigation Timing API metrics
				TTFB: performance.timing.responseStart - performance.timing.navigationStart,
				domLoad:
					performance.timing.domContentLoadedEventEnd -
					performance.timing.navigationStart,
				fullLoad: performance.timing.loadEventEnd - performance.timing.navigationStart,

				// First Paint & First Contentful Paint
				FP: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
				FCP: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
			};

			// Get more advanced metrics using PerformanceObserver
			new PerformanceObserver((list) => {
				const entries = list.getEntries();
				if (entries.length > 0) {
					lcpValue = entries[entries.length - 1].startTime;
				}
			}).observe({ type: 'largest-contentful-paint', buffered: true });

			new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					if (!entry.hadRecentInput) {
						clsValue += entry.value;
					}
				}
			}).observe({ type: 'layout-shift', buffered: true });

			// Wait to ensure metrics are collected
			setTimeout(() => {
				resolve({
					...basicMetrics,
					LCP: lcpValue,
					CLS: clsValue,

					// Memory usage
					jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit,
					totalJSHeapSize: performance.memory?.totalJSHeapSize,
					usedJSHeapSize: performance.memory?.usedJSHeapSize,
				});
			}, 3000); // Give time for metrics to be collected
		});
	});

	return metrics;
}
