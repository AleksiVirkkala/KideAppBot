import type { Meta, StoryObj } from '@storybook/react';
import { MenuButton } from './MenuButton';
import { Collapsible } from '@radix-ui/react-collapsible';

const meta: Meta<typeof MenuButton> = {
	component: MenuButton,
	args: {
		isOpen: false
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
type Story = StoryObj<typeof MenuButton>;

export const Default: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'fullHD'
		}
	}
};
