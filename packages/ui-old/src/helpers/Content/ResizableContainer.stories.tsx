import type { Meta, StoryObj } from '@storybook/react';
import { ResizableContainer } from './ResizableContainer';
import { SampleContent } from './SampleContent';

const meta: Meta<typeof ResizableContainer> = {
	component: ResizableContainer,
	args: {
		containerClassName: 'bg-red-200',
		children: <SampleContent label="Hello!" />
	}
};

export default meta;
type Story = StoryObj<typeof ResizableContainer>;

export const Default: Story = {};
export const WithInitialWidth: Story = {
	args: {
		initialWidth: 300,
		children: <SampleContent label="Initially 300px wide" />
	}
};

export const WithMinWidth: Story = {
	args: {
		minWidth: 400,
		children: <SampleContent label="Min width 400px" />
	}
};

export const FullSize: Story = {
	args: {
		fullSize: true,
		children: <SampleContent label="Full size" />
	}
};
