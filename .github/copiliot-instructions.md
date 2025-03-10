# Coding Guidelines

## Core Development Principles

-   **Keep It Simple:** Write clean, direct code without clever tricks. Favor readability over cleverness. Code like Hemingway would - simple and direct.
-   **Use Modern JavaScript:** No TypeScript - use JavaScript with JSDoc types. Use ES Modules and modern ES6+ features that improve clarity (destructuring, template literals, etc.)
-   **Self-Documenting Code:** Use meaningful variable and function names that explain their purpose. Make code intention-revealing with clear naming and structure.
-   **Bottom-Line-Up-Front Logic:** Place core logic early in functions. Return early rather than nesting deeply. Handle primary cases first, edge cases second.
-   **Don't Repeat Yourself...twice (DRYT):** Abstract logic repeated more than once into shared functions. Create a single source of truth for each piece of functionality.
-   **You Aren't Gonna Need It (YAGNI):** Avoid premature abstraction or coding for hypothetical future requirements.
-   **One Responsibility:** Write small, focused functions and modules that do one thing well.

## Project-Specific Standards

-   Indent with tabs
-   Always add JSDoc types
-   Use TDD: write failing tests first, then code that passes
-   Log changes in CHANGELOG.md when functionality is added or removed
-   For DOM interaction, always use web components
-   Use functional programming for data transformations, OOP for large control flow structures
-   Avoid Windows-specific tools (rimraf, cross-env, mkdirp)
-   Traditional control structures (if/else, switch, while) are acceptable
-   Support all modern browsers. IE is not supported
-   Everything must be covered by end-to-end Playwright browser tests
-   Prefer long flat directories
-   Do not create functions for the sake of organization; functions are for code reuse
-   If a function isn't passed as a callback, or have at least two callsites, then it doesn't need to exist

## HTML & CSS Guidance

-   **Semantic Structure:** Use proper HTML5 semantic elements over generic divs
-   **Lean Markup:** Include only the necessary HTML, avoid extra wrappers
-   **Separation of Concerns:** Keep structure (HTML) separate from presentation (CSS)
-   **Simple Selectors:** Avoid deeply nested CSS selectors
-   **Mobile-First Design:** Start with mobile layouts and enhance for larger screens
-   **Progressive Enhancement:** Ensure core functionality works without JavaScript

## Accessibility & Web Best Practices

-   **WCAG Compliance:** Follow accessibility guidelines (WCAG) for all components
-   **Keyboard Navigation:** Ensure all interactive elements are keyboard accessible
-   **Screen Reader Support:** Use appropriate ARIA attributes and semantic HTML
-   **Reduced Motion:** Respect user preferences with prefers-reduced-motion media query
-   **Performance Optimization:** Minimize asset sizes and optimize for Core Web Vitals

## Console Logging Guidelines

-   Use emojis in console messages and test names 🚀
-   Include two emojis per message: one shared across the file, one unique
-   Use console methods in important locations as a form of documentation:
    -   `console.debug()`: For very minor info or code in loops
    -   `console.info()`: For non-critical information
    -   `console.log()`: For information users may want to see
    -   `console.warn()`: For information users NEED to see
    -   `console.error()`: Only for unrecoverable errors
        include any local variables that might be useful for debugging purposes
