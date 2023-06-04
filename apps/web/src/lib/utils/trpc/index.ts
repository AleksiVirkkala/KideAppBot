import { PUBLIC_API_URL_HTTP, PUBLIC_API_URL_WS } from '$env/static/public';
import { browser, dev } from '$app/environment';
import type { AppRouter } from 'api';
import {
	createTRPCProxyClient,
	httpBatchLink,
	createWSClient,
	wsLink,
	splitLink
} from '@trpc/client';

// This file is run in both the browser and the server, thus we need to check if we are in the browser or not

// httpBatchLink can be called on both server and client, therefore this is ok
const httpLink = httpBatchLink({
	url: dev ? 'http://localhost:3000' : PUBLIC_API_URL_HTTP
});

// wsLink can only be called on the client, therefore we need to check if we are in the browser or not
const links = [
	browser
		? splitLink({
				condition(op) {
					return op.type === 'subscription';
				},
				true: wsLink({
					client: createWSClient({
						url: dev ? 'ws://localhost:3000' : PUBLIC_API_URL_WS
					})
				}),
				false: httpLink
		  })
		: httpLink
];

export const trpc = createTRPCProxyClient<AppRouter>({
	links
});

export * from './stores';
export * from './actions';
