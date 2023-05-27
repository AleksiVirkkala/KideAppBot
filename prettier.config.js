module.exports = {
	useTabs: true,
	singleQuote: true,
	semi: true,
	arrowParens: 'avoid',
	trailingComma: 'none',
	printWidth: 100,
	plugins: [require('prettier-plugin-svelte'), require('prettier-plugin-tailwindcss')],
	pluginSearchDirs: ['.'],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
	tailwindFunctions: ['twMerge', 'tw'],
	tailwindAttributes: ['tw'] // Next.js og uses tw attribute instead of className
};
