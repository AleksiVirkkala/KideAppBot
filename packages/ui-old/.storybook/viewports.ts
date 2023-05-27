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

export const viewports = {
  ...INITIAL_VIEWPORTS,
  ...customViewports
};
