import { get, readable, writable } from 'svelte/store';
import { trpc } from '.';
import type { LogMessage } from '@common/types';
import { token } from '$lib/stores/token';

export const isRunning = readable(false, set => {
	console.log('subscribing');
	trpc.bot.isRunningChanged.subscribe(
		{
			token: get(token)
		},
		{
			onData(running) {
				set(running);
			}
		}
	);
});

export const logs = writable<LogMessage[]>([], set => {
	trpc.bot.newLog.subscribe(
		{
			token: get(token)
		},
		{
			onData(log) {
				set([...get(logs), log]);
			}
		}
	);
});
