import ThemeInit from './ThemeInit.svelte';
import { writable } from 'svelte/store';
import type { Preview } from '@storybook/svelte';

/**
 * Menubar item to switch between light and dark themes.
 */
export const themeGlobals = {
	name: 'Theme',
	description: 'Set Skeleton UI Theme',
	defaultValue: 'light',
	toolbar: {
		icon: 'contrast',
		dynamicTitle: true,
		items: [
			{ value: 'light', icon: 'sun', title: 'Light' },
			{ value: 'dark', icon: 'moon', title: 'Dark' }
		]
	}
} as const;

type Decorator = Exclude<Preview['decorators'], undefined>[number];
type Params = Parameters<Decorator>;
type Story = Params[0];
type Context = Params[1];

type theme = 'light' | 'dark';

/**
 * Store to keep track of the current theme.
 */
export const theme = writable<theme>('light');

/**
 * Decorator that sets the theme.
 */
export const withTheme = (Story: Story, context: Context) => {
	theme.set(context.globals.theme);
	return ThemeInit;
};
