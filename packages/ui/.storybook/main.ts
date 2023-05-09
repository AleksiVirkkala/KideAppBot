import type { StorybookConfig } from '@storybook/nextjs'
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-storysource',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  docs: {
    autodocs: true
  },
  webpackFinal: async config => {
    // This is used to make turbo logs much shorter.
    return {
      ...config,
      stats: 'errors-warnings',
      plugins: [
        ...config.plugins?.filter(plugin => {
          return plugin.constructor.name !== 'ProgressPlugin'
        })
      ]
    }
  }
}
export default config
