import '../src/lib/utils/initSkeleton';
import type { Preview } from '@storybook/svelte';
import { viewports } from './viewports';
import { themeGlobals, withTheme } from './withTheme';

export const globalTypes = {
	theme: themeGlobals
};

const preview: Preview = {
	parameters: {
		layout: 'centered',
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
	},
	/**
	 * This does work and is made as documentation shows
	 * @see https://storybook.js.org/docs/svelte/writing-stories/decorators#wrap-stories-with-extra-markup
	 */
	// @ts-ignore
	decorators: [withTheme]
};

export default preview;
