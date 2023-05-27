import type { Preview } from '@storybook/svelte';
import { viewports } from './viewports';

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/
			}
		},
		viewport: {
			viewports
		}
	}
};

export default preview;
