import 'tailwind-config/load.css';
import type { Preview } from '@storybook/react';
import { viewports } from './viewports';
import { motionGlobals, withMotion } from './withMotion';

export const globalTypes = {
  motion: motionGlobals
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    nextjs: {
      appDirectory: true
    },
    viewport: {
      viewports
    }
  },
  decorators: [withMotion]
};

export default preview;
