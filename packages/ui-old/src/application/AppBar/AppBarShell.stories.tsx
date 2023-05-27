import type { Meta, StoryObj } from '@storybook/react';
import { AppBarContext, AppBarShell } from './AppBarShell';
import { SampleContent } from '../../helpers/Content';
import { useContext } from 'react';

const PrimaryContent = () => {
  const { isExpanded, setIsExpanded } = useContext(AppBarContext);
  return (
    <div className="bg-indigo-200/20 p-4">
      <button className="w-full rounded-lg border-2 p-4" onClick={() => setIsExpanded(!isExpanded)}>
        expand
      </button>
    </div>
  );
};

const CollapsibleContent = () => {
  return (
    <div className="bg-green-200/20 p-4">
      <AppBarShell.CloseTrigger>
        <button className="h-20 w-full rounded-lg border-2 p-4">collapse</button>
      </AppBarShell.CloseTrigger>
    </div>
  );
};

const meta: Meta<typeof AppBarShell> = {
  component: AppBarShell,
  args: {
    className: 'backdrop-blur-sm',
    children: <PrimaryContent />,
    collapsibleContent: <CollapsibleContent />
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
