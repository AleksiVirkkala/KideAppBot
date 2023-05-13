import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';
import {
  PencilIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  TrashIcon
} from '@heroicons/react/20/solid';
import { MenuItem } from './MenuItem';
import { userEvent, within } from '@storybook/testing-library';

const meta: Meta<typeof Menu> = {
  component: Menu,
  args: {
    label: 'Options',
    align: 'right',
    children: (
      <>
        <MenuItem label="Edit" Icon={PencilIcon} />
        <MenuItem label="Duplicate" Icon={DocumentDuplicateIcon} />
        <MenuItem label="Move" Icon={ArrowTopRightOnSquareIcon} />
        <MenuItem label="Delete" Icon={TrashIcon} />
      </>
    )
  },
  decorators: [
    Story => (
      <div className="h-60 w-72 text-right">
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
  }
};
