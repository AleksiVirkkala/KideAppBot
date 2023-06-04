import { get } from 'svelte/store';
import { trpc } from './index';
import { token } from '$lib/stores/token';

export const startBot = (eventUrl: string) => {
	trpc.bot.reserve.mutate({
		eventUrl,
		token: get(token)
	});
};

export const stopBot = () => {
	trpc.bot.stop.mutate({
		token: get(token)
	});
};
