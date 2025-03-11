/**
 * Form Validation Utilities
 * 📝 Common validation functions for forms
 *
 * @file Collection of reusable form validation functions
 */

/**
 * Validate an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if the email is valid
 */
export function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(String(email).toLowerCase());
}

/**
 * Validate required fields in a form
 * @param {Object} fields - Object with field names and values
 * @returns {Object} Object with isValid flag and errors object
 */
export function validateRequired(fields) {
	const errors = {};
	let isValid = true;

	for (const [fieldName, value] of Object.entries(fields)) {
		if (!value || (typeof value === 'string' && !value.trim())) {
			errors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
			isValid = false;
		}
	}

	return { isValid, errors };
}

/**
 * Serialize form data to an object
 * @param {HTMLFormElement} form - Form element to serialize
 * @returns {Object} Form data as an object
 */
export function serializeForm(form) {
	const formData = new FormData(form);
	return Object.fromEntries(formData);
}

/**
 * Display form field errors
 * @param {Object} errors - Object with field names and error messages
 * @param {string} errorSuffix - Suffix for error element IDs (default: "-error")
 */
export function displayFormErrors(errors, errorSuffix = "-error") {
	for (const [fieldName, errorMessage] of Object.entries(errors)) {
		const field = document.getElementById(fieldName);
		const errorEl = document.getElementById(`${fieldName}${errorSuffix}`);

		if (field && errorEl) {
			field.setAttribute('aria-invalid', 'true');
			errorEl.textContent = errorMessage;
		}
	}
}

/**
 * Clear all form errors
 * @param {HTMLFormElement} form - Form to clear errors for
 * @param {string} errorSuffix - Suffix for error element IDs (default: "-error")
 */
export function clearFormErrors(form, errorSuffix = "-error") {
	// Get all input elements
	const inputs = form.querySelectorAll('input, textarea, select');

	inputs.forEach(input => {
		const errorEl = document.getElementById(`${input.id}${errorSuffix}`);
		if (errorEl) {
			errorEl.textContent = '';
			input.removeAttribute('aria-invalid');
		}
	});
}

console.debug('📝 Form utilities loaded');