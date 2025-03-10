import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import globals from 'globals';
import js from '@eslint/js';
import path from 'node:path';

// ESLint Flat Config setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default [
	js.configs.recommended,
	...compat.extends('eslint:recommended'),
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {
			'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
			'no-debugger': 'warn',
			'prefer-const': 'warn',
			'no-var': 'error',
			eqeqeq: ['error', 'always'],
			'no-trailing-spaces': 'warn',
			'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }],
			quotes: ['warn', 'single', { avoidEscape: true }],
			semi: ['warn', 'always'],
			indent: ['warn', 'tab'],
		},
		ignores: ['**/node_modules/**', '**/dist/**'],
	},
];
