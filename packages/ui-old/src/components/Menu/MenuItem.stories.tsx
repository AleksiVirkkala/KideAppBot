import type { Meta, StoryObj } from '@storybook/react';
import { MenuItem } from './MenuItem';
import { Menu as HeadlessMenu } from '@headlessui/react';
import { PencilIcon } from '@heroicons/react/20/solid';

const meta: Meta<typeof MenuItem> = {
	component: MenuItem,
	args: {
		label: 'Options',
		Icon: PencilIcon
	},
	decorators: [
		Story => (
			<HeadlessMenu>
				<Story />
			</HeadlessMenu>
		)
	]
};

export default meta;
type Story = StoryObj<typeof MenuItem>;

export const Default: Story = {};

export const WithoutIcon: Story = {
	args: {
		Icon: undefined
	}
};
