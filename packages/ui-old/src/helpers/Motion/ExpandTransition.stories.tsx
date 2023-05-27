import type { Meta, StoryObj } from '@storybook/react';
import { ExpandTransition } from './ExpandTransition';
import { SampleContent } from '../Content';

const meta: Meta<typeof ExpandTransition> = {
  component: ExpandTransition,
  args: {
    expanded: true,
    children: <SampleContent className="mb-4 bg-indigo-500/20" label="Dynamic" />
  },
  decorators: [
    Story => (
      <div className="flex flex-col">
        <SampleContent className="mb-4" label="Static" />
        <Story />
        <SampleContent label="Static" />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof ExpandTransition>;

export const Default: Story = {};
