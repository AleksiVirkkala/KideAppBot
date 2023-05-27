import type { Meta, StoryObj } from '@storybook/react';
import { PageTransition } from './PageTransition';
import { SampleContent } from '../Content';

const meta: Meta<typeof PageTransition> = {
	component: PageTransition,
	argTypes: {
		children: {
			options: [1, 2],
			control: { type: 'radio' }
		}
	},
	args: {
		children: 1
	},
	decorators: [
		Story => (
			<div className="flex h-[500px] flex-col">
				<SampleContent className="mb-4" label="Static" />
				<Story />
				<SampleContent label="Static" />
			</div>
		)
	],
	render: ({ children }) => (
		<PageTransition>
			{children === 1 ? (
				<SampleContent key="1" className="mb-4 h-12 bg-indigo-500/20" label="1" />
			) : (
				<SampleContent key="2" className="mb-4 h-40 bg-red-500/20" label="2" />
			)}
		</PageTransition>
	)
};

export default meta;
type Story = StoryObj<typeof PageTransition>;

export const Default: Story = {};
