import { test, expect } from '@playwright/test';

/**
 * Performance tests that verify core web vitals meet thresholds
 */
test.describe('Performance metrics', () => {
	test('homepage meets core web vital thresholds', async ({ page }) => {
		// Enable performance metrics collection
		await page.goto('/', { waitUntil: 'networkidle' });

		// Get performance metrics
		const metrics = await page.evaluate(() => {
			return {
				// Core Web Vitals
				FCP: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
				LCP: 0, // We'll use PerformanceObserver in the page to get this
				CLS: 0, // We'll use PerformanceObserver in the page to get this
				TTI: performance.timing.domInteractive - performance.timing.navigationStart,
				TBT: 0, // Total Blocking Time is complex to measure in this context

				// Navigation Timing API metrics
				TTFB: performance.timing.responseStart - performance.timing.navigationStart,
				domLoad:
					performance.timing.domContentLoadedEventEnd -
					performance.timing.navigationStart,
				fullLoad: performance.timing.loadEventEnd - performance.timing.navigationStart,
			};
		});

		// Inject and run more advanced metrics gathering
		await page.evaluate(() => {
			return new Promise((resolve) => {
				// Measure LCP
				new PerformanceObserver((list) => {
					const entries = list.getEntries();
					if (entries.length > 0) {
						const lcpEntry = entries[entries.length - 1];
						window.lcpValue = lcpEntry.startTime;
					}
				}).observe({ type: 'largest-contentful-paint', buffered: true });

				// Measure CLS
				let clsValue = 0;
				new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						if (!entry.hadRecentInput) {
							clsValue += entry.value;
						}
					}
					window.clsValue = clsValue;
				}).observe({ type: 'layout-shift', buffered: true });

				// Wait to ensure metrics are collected
				setTimeout(() => {
					return resolve();
				}, 1000);
			});
		});

		// Get the additional metrics we collected
		const additionalMetrics = await page.evaluate(() => {
			return {
				LCP: window.lcpValue || 0,
				CLS: window.clsValue || 0,
			};
		});

		// Combine all metrics
		const allMetrics = {
			...metrics,
			LCP: additionalMetrics.LCP,
			CLS: additionalMetrics.CLS,
		};

		console.log('Performance metrics:', allMetrics);

		// Assert against thresholds from the config
		expect(allMetrics.FCP).toBeLessThan(2000); // 2 seconds
		expect(allMetrics.LCP).toBeLessThan(2500); // 2.5 seconds
		expect(allMetrics.TTI).toBeLessThan(3500); // 3.5 seconds
		expect(allMetrics.CLS).toBeLessThan(0.1); // Google's recommended maximum

		// Additional assertions on other metrics
		expect(allMetrics.TTFB).toBeLessThan(800); // 800ms
		expect(allMetrics.domLoad).toBeLessThan(1500); // 1.5 seconds
	});
});
