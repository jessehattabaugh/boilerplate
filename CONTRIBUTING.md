# 🚀 Contributing Guide

<!--
INSTRUCTIONS: This is a template for your project's contributing guidelines.
Replace the project name "Project Name" throughout this document with your actual project name.
Delete these instructions and add specific details about your project where indicated.

IMPORTANT: Include this file as context when using GitHub Copilot for implementing tests,
as it contains crucial test guidelines and technical developer information.
-->

## 📝 Project Overview

**Project Name** is a web application that

<!--
INSTRUCTIONS: Replace this section with a brief description of your project.
Include information about:
1. The project's purpose and core functionality
2. Key technologies used
3. The overall vision
-->

### 🧠 Core Principles

<!--
INSTRUCTIONS: Replace these principles with your project's core values.
Examples:
-->

-   **User Experience**: Creating intuitive and accessible interfaces
-   **Performance**: Ensuring fast load times and smooth interactions
-   **Modularity**: Building components that are reusable and maintainable
-   **Testing**: Thoroughly testing all features before deployment
-   **Documentation**: Providing clear and comprehensive documentation

## 📐 Project Structure

<!--
INSTRUCTIONS: Replace this section with your project's structure.
Include information about key directories, components, etc.
-->

### Full Directory Structure

```
/
├── www/              # Web assets
│   ├── components/   # Web components
│   │   ├── site-footer.css
│   │   ├── site-footer.js
│   │   ├── site-header.css
│   │   ├── site-header.js
│   ├── scripts/      # JavaScript files
│   │   ├── async.js
│   │   └── index.js
│   ├── styles/       # CSS files
│   │   ├── all.css
│   │   ├── light.css
│   │   ├── print.css
│   │   └── wide.css
│   └── icon/         # PWA icons
│       ├── 192.png
│       └── 512.png
├── test/             # Test files
│   └── index.spec.js
├── bin/              # Build scripts and utilities
├── netlify/          # Netlify configuration
│   └── functions/    # Serverless functions
```

### Frontend Architecture

-   **Component Structure**: [Describe your component architecture]
-   **State Management**: [Describe your state management approach]
-   **Routing**: [Describe your routing system]

## 🛠️ Tech Stack

-   **Frontend**: HTML/CSS/JavaScript with [framework/library]
-   **State Management**: [Your state management solution]
-   **Storage**: [Your storage solution]
-   **Testing**: Playwright for end-to-end testing

## 🏗️ Technical Architecture

### Key Principles

-   **Module System**: ES modules for direct imports
-   **Web Components**: Custom elements for modular UI components
-   **Progressive Enhancement**: Features that work without JavaScript when possible
-   **Offline-First**: Core functionality available offline
-   **Test-Driven Development**: Red/green testing approach for all new features

## 📝 Code Style Guidelines

### General Guidelines

-   **Indentation:** Use tabs for indentation, not spaces
-   **File Organization:** Group related functionality together
-   **Component Structure:** Each component should serve a singular purpose

### Naming Conventions

-   **Files:** Use kebab-case for filenames (`component-name.js`, not `componentName.js`)
-   **Components:** Use PascalCase for component names (`ComponentName`, not `componentName`)
-   **Functions:** Use camelCase for function names (`handleEvent`, not `handle_event`)
-   **CSS Classes:** Use kebab-case for CSS classes (`.component-wrapper`, not `.componentWrapper`)
-   **Constants:** Use UPPER_SNAKE_CASE for constants (`MAXIMUM_ITEMS`, not `maximumItems`)
-   **Test Files:** Use the same naming as the page they test with `.spec.js` suffix (`page-name.spec.js`)

### JavaScript Guidelines

-   **ES Modules:** Use ES modules exclusively for imports/exports
-   **Modern JavaScript:** Embrace template literals, destructuring, and other modern features
-   **Function Creation:** Only create new functions for code reuse (at least two call sites)
-   **JSDoc Comments:** Include JSDoc type annotations to ensure code clarity

### CSS Guidelines

-   **Selectors:** Use simple, shallow selectors to target elements efficiently
-   **Variables:** Define CSS custom properties at the :root level for consistent theming
-   **Nesting:** Avoid deeply nested CSS rules for better performance

### Console Logging

-   Use two emojis per console message—one representing the file's domain, one for the specific message
-   Suggested emoji domains:
    -   ⚙️ UI interactions
    -   🔧 Form handling
    -   🔍 Search functionality
    -   📊 Data management
    -   🧪 Testing infrastructure
-   Console methods:
    -   `console.debug()`: Minor information, loop iterations, internal workings
    -   `console.info()`: Useful but non-critical messages
    -   `console.log()`: General information useful for development
    -   `console.warn()`: Important notices or potential issues
    -   `console.error()`: Only for unrecoverable errors; always include relevant debugging information

## 🎨 Visual Style Guide

### Color Palette

```css
:root {
	--color-primary: #3498db;
	--color-secondary: #2ecc71;
	--color-accent: #e74c3c;
	--color-text: #333333;
	--color-text-light: #777777;
	--color-background: #ffffff;
	--color-background-alt: #f8f8f8;
	--color-border: #dddddd;
	--color-success: #2ecc71;
	--color-warning: #f39c12;
	--color-error: #e74c3c;
	--shadow-default: 0 2px 5px rgba(0, 0, 0, 0.1);
	--shadow-hover: 0 5px 15px rgba(0, 0, 0, 0.1);
}
```

### Typography

-   **Headings:** [Your heading font] (fallback: sans-serif)
-   **Body Text:** [Your body font] (system-ui, sans-serif)
-   **Monospace:** [Your monospace font] (monospace fallback)
-   **Font Sizes:** Use relative units (rem) with a base size of 16px
-   **Line Heights:** 1.5 for body text, 1.2 for headings

## 🧪 Testing Guidelines

> **IMPORTANT:** When creating tests with GitHub Copilot, include this file as context to ensure adherence to these guidelines.

-   **End-to-End Focus:** Tests must interact with actual HTML pages through the user interface
-   **User-Centric:** Focus on what real users would see and interact with
-   **No Mocks:** Avoid mock objects, unit tests, or test fixtures
-   **Browser Compatibility:** Ensure tests run on all modern browsers

### Test Structure

-   **Test Files:** Correspond to actual pages in the `/www` directory
-   **Test Naming:** Use descriptive names that reflect the user journey or interaction being tested
-   **URL Format:** Use relative URLs without the `/www/` prefix in test navigation (e.g., `/index.html` not `/www/index.html`)

### Test-Driven Development Process

-   **Red Tests First:** Always begin with a failing test that defines expected functionality
-   **Green Implementation:** Then implement just enough code to make the test pass
-   **User-Focused Testing:** Tests should reflect actual user interactions and experiences
-   **Accessibility Testing:** Ensure all tests interact with the page in ways that support screen readers
-   **Test Organization:** Group related tests in logical describe blocks
-   **Test Naming:** Tests should clearly describe the expected behavior being verified

## 🚀 Example Test

This example demonstrates how to test a page load with Playwright:

```javascript
/**
 * @file Page load test example
 * @module tests/page-load
 */
import { test, expect } from '@playwright/test';

test.describe('Page Load Test ⚙️', () => {
	// Shared emoji for this file domain
	const fileEmoji = '⚙️';

	test('should display the correct title and elements', async ({ page }) => {
		// Navigate to the page
		await page.goto('/index.html');

		// Check the page title
		await expect(page).toHaveTitle('Project Name');

		// Check for the presence of a key element
		const mainHeading = page.locator('h1');
		await expect(mainHeading).toBeVisible();

		// Check accessibility elements
		const mainContent = page.locator('[role="main"]');
		await expect(mainContent).toBeVisible();

		// Log the successful test
		console.info(`${fileEmoji} ✅ Page loaded successfully.`);
	});
});
```

## 📚 Development Setup

### Installation

```bash
# Clone the repository
git clone https://github.com/username/project-name.git

# Navigate to the project directory
cd project-name

# Install dependencies
npm install
```

### Development Workflow

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📄 Documentation Index

-   [README.md](README.md) - Project overview and roadmap
-   [CHANGELOG.md](CHANGELOG.md) - Update history

<!--
INSTRUCTIONS: Add any additional documentation links that are relevant to your project.
For example:
- API Documentation
- Style Guide
- Deployment Guide
-->

## 🔄 Contribution Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Pull Request Process

1. Ensure all tests pass
2. Update documentation as needed
3. Get approval from at least one reviewer
4. Merge once approved

<!--
INSTRUCTIONS: Add any specific requirements for your project's contribution process.
-->
