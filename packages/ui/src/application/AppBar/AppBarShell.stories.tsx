import type { Meta, StoryObj } from '@storybook/react';
import { AppBarContent, AppBarShell } from './AppBarShell';
import { SampleContent } from '../../helpers/Content';

const primaryContent: AppBarContent = ({ isExpanded, setIsExpanded }) => (
  <div className="bg-indigo-200/20 p-4">
    <button className="w-full rounded-lg border-2 p-4" onClick={() => setIsExpanded(!isExpanded)}>
      expand
    </button>
  </div>
);

const collapsibleContent: AppBarContent = ({ isExpanded, setIsExpanded }) => (
  <div className="bg-green-200/20 p-4">
    <button
      className="h-20 w-full rounded-lg border-2 p-4"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      collapse
    </button>
  </div>
);

const meta: Meta<typeof AppBarShell> = {
  component: AppBarShell,
  args: {
    className: 'backdrop-blur-sm',
    children: primaryContent,
    collapsibleContent
  },
  decorators: [
    Story => (
      <div className="h-[400px] overflow-scroll border-4 border-black">
        <Story />
        <SampleContent className="m-4 h-[1000px]" />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof AppBarShell>;

export const Default: Story = {};
