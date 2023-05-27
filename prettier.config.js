module.exports = {
  singleQuote: true,
  semi: true,
  arrowParens: 'avoid',
  trailingComma: 'none',
  printWidth: 100,
  plugins: [require('prettier-plugin-tailwindcss')],
  pluginSearchDirs: false,
  tailwindFunctions: ['twMerge', 'tw'],
  tailwindAttributes: ['tw'] // Next.js og uses tw attribute instead of className
};
