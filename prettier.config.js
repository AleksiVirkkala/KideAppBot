module.exports = {
  singleQuote: true,
  semi: true,
  arrowParens: 'avoid',
  trailingComma: 'none',
  printWidth: 100,
  plugins: [require('prettier-plugin-tailwindcss')],
  pluginSearchDirs: ['.']
};
