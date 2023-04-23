// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'next/core-web-vitals',
        'base',
        'plugin:storybook/recommended'
      ],
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json')
      }
    }
  ],
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json')
  },
  extends: ['next/core-web-vitals', 'base', 'plugin:storybook/recommended']
}
module.exports = config
