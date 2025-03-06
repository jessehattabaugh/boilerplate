/**
 * Interactive script to configure the site
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const configPath = path.join(projectRoot, 'public', 'scripts', 'config.js');
const manifestPath = path.join(projectRoot, 'public', 'manifest.json');
const packagePath = path.join(projectRoot, 'package.json');

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Promise-based question function
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
	console.log('\n🔧 Site Configuration Tool 🔧\n');
	console.log('This tool will help you configure your site.\n');

	try {
		// Read the current config
		const configContent = await fs.readFile(configPath, 'utf8');
		const manifestContent = await fs.readFile(manifestPath, 'utf8');
		const packageContent = await fs.readFile(packagePath, 'utf8');

		// Parse the manifest
		const manifest = JSON.parse(manifestContent);
		// Parse package.json
		const packageJson = JSON.parse(packageContent);

		// Extract current values (simple regex for demo purposes)
		const titleMatch = configContent.match(/title:\s*['"]([^'"]+)['"]/);
		const descriptionMatch = configContent.match(/description:\s*['"]([^'"]+)['"]/);
		const shortNameMatch = configContent.match(/shortName:\s*['"]([^'"]+)['"]/);
		const urlMatch = configContent.match(/url:\s*['"]([^'"]+)['"]/);
		const authorMatch = configContent.match(/author:\s*['"]([^'"]+)['"]/);
		const themeColorMatch = configContent.match(/themeColor:\s*['"]([^'"]+)['"]/);

		// Get current values
		const currentTitle = titleMatch ? titleMatch[1] : 'Web Boilerplate';
		const currentDescription = descriptionMatch
			? descriptionMatch[1]
			: 'A modern web boilerplate';
		const currentShortName = shortNameMatch ? shortNameMatch[1] : 'Boilerplate';
		const currentUrl = urlMatch ? urlMatch[1] : 'https://example.com';
		const currentAuthor = authorMatch ? authorMatch[1] : 'Your Name';
		const currentThemeColor = themeColorMatch ? themeColorMatch[1] : '#bb86fc';

		// Ask for new values
		console.log('Press Enter to keep current values\n');
		const title = await question(`Site title (${currentTitle}): `);
		const description = await question(`Site description (${currentDescription}): `);
		const shortName = await question(`Short name for PWA (${currentShortName}): `);
		const url = await question(`Site URL (${currentUrl}): `);
		const author = await question(`Author name (${currentAuthor}): `);
		const themeColor = await question(`Theme color (${currentThemeColor}): `);

		// Update the config file
		let newConfigContent = configContent;
		newConfigContent = newConfigContent.replace(
			/title:\s*['"]([^'"]+)['"]/,
			`title: '${title || currentTitle}'`,
		);
		newConfigContent = newConfigContent.replace(
			/description:\s*['"]([^'"]+)['"]/,
			`description: '${description || currentDescription}'`,
		);
		newConfigContent = newConfigContent.replace(
			/shortName:\s*['"]([^'"]+)['"]/,
			`shortName: '${shortName || currentShortName}'`,
		);
		newConfigContent = newConfigContent.replace(
			/url:\s*['"]([^'"]+)['"]/,
			`url: '${url || currentUrl}'`,
		);
		newConfigContent = newConfigContent.replace(
			/author:\s*['"]([^'"]+)['"]/,
			`author: '${author || currentAuthor}'`,
		);
		newConfigContent = newConfigContent.replace(
			/themeColor:\s*['"]([^'"]+)['"]/,
			`themeColor: '${themeColor || currentThemeColor}'`,
		);

		// Update the manifest
		manifest.name = title || currentTitle;
		manifest.short_name = shortName || currentShortName;
		manifest.description = description || currentDescription;
		manifest.theme_color = themeColor || currentThemeColor;

		// Update package.json
		packageJson.name = (title || currentTitle).toLowerCase().replace(/\s+/g, '-');
		packageJson.description = description || currentDescription;
		packageJson.homepage = url || currentUrl;

		// Write the updated files
		await fs.writeFile(configPath, newConfigContent);
		await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
		await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));

		console.log('\n✅ Configuration updated successfully!\n');
		console.log(`Site title: ${title || currentTitle}`);
		console.log(`Description: ${description || currentDescription}`);
		console.log(`Short name: ${shortName || currentShortName}`);
		console.log(`URL: ${url || currentUrl}`);
		console.log(`Author: ${author || currentAuthor}`);
		console.log(`Theme color: ${themeColor || currentThemeColor}`);
		console.log('\nYou can further edit these settings in public/scripts/config.js\n');
	} catch (error) {
		console.error('Error updating configuration:', error);
	} finally {
		rl.close();
	}
}

main();
