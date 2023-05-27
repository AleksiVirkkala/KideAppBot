import type { Meta, StoryObj } from '@storybook/react';
import { SampleContent } from './SampleContent';

const meta: Meta<typeof SampleContent> = {
  component: SampleContent
};

export default meta;
type Story = StoryObj<typeof SampleContent>;

export const Default: Story = {};

export const WithoutStripes: Story = {
  args: {
    disableStripes: true
  }
};

export const WithCustomStyling: Story = {
  args: {
    className: 'h-72 border-red-500 border-4 rounded-none bg-slate-300'
  }
};

export const WithCustomContent: Story = {
  args: {
    children: (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900">Custom Content</h1>
        <p className="text-gray-700">This is a custom content area</p>
      </div>
    )
  }
};
