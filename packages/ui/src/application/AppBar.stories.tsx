import type { Meta, StoryObj } from '@storybook/react';
import { AppBar, NavigationOption } from './AppBar';

const navigation = [
  { label: 'Bot', href: '/bot', isActive: true },
  { label: 'Settings', href: '/settings', isActive: false }
] satisfies NavigationOption[];

const meta: Meta<typeof AppBar> = {
  component: AppBar,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    navigationOptions: navigation,
    versionNumber: '1.0.0'
  }
};

export default meta;
type Story = StoryObj<typeof AppBar>;

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'fullHD'
    }
  }
};
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone12'
    }
  }
};
