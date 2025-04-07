import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: [
			'node_modules/', // Ignora la carpeta node_modules
			'dist/', // Ignora archivos compilados en dist
			'build/', // Ignora archivos de build
			'*.min.js', // Ignora archivos minimizados
			'coverage/', // Ignora reportes de cobertura
		],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
			},
		},
		rules: {
			semi: ['error', 'always'],
			quotes: ['error', 'single'],
			indent: ['error', 2],
			eqeqeq: 'error',
			'no-trailing-spaces': 'error',
			'comma-dangle': ['error', 'never'],
			'no-unused-vars': ['warn'],
			'no-console': 'off',
			'no-restricted-syntax': [
				'error',
				{
					selector:
						"CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
					message: 'Unexpected property on console object was called',
				},
			],
		},
	},
	pluginJs.configs.recommended,
	prettierConfig,
];
