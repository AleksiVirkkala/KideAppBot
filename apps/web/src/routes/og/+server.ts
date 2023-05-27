import AppIcon from '$lib/components/og/AppIcon.svelte';
import { SvelteOgResponse } from 'svelte-og';
import type { RequestHandler } from './$types';

const height = 630;
const width = 600;

export const GET: RequestHandler = async ({ url }) => {
	const message = url.searchParams.get('message') ?? undefined;
	return await SvelteOgResponse(
		{
			component: AppIcon,
			props: {
				message
			}
		},
		{
			width,
			height
		}
	);
};
