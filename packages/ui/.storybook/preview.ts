import 'tailwind-config/load.css';
import type { Preview } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const customViewports = {
  fullHD: {
    name: 'Full HD',
    styles: {
      width: '1920px',
      height: '1080px'
    }
  },
  highResolution: {
    name: 'High resolution',
    styles: {
      width: '2560px',
      height: '1440px'
    }
  }
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
      viewports: {
        ...INITIAL_VIEWPORTS,
        ...customViewports
      }
    }
  }
};

export default preview;
