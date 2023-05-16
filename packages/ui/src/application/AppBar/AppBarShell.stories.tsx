import type { Meta, StoryObj } from '@storybook/react';
import { AppBarContent, AppBarShell } from './AppBarShell';
import { Collapsible } from '@radix-ui/react-collapsible';

const primaryContent: AppBarContent = ({ isExpanded, setIsExpanded }) => (
  <div className="bg-indigo-200">
    <button onClick={() => setIsExpanded(!isExpanded)}>expand</button>
  </div>
);

const collapsibleContent: AppBarContent = ({ isExpanded, setIsExpanded }) => (
  <div className="bg-green-200">
    <button onClick={() => setIsExpanded(!isExpanded)}>collapse</button>
  </div>
);

const meta: Meta<typeof AppBarShell> = {
  component: AppBarShell,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    className: 'border-2',
    children: primaryContent,
    collapsibleContent
  },
  decorators: [
    Story => (
      <Collapsible>
        <Story />
      </Collapsible>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof AppBarShell>;

export const Default: Story = {};
