import type { RequestHandler } from './$types';
import AppIcon from '$lib/components/og/AppIcon.svelte';
import { svelteOg } from '$lib/utils/svelteOg';
import { type } from 'arktype';
import { ogCatchHandler } from '../../ogCatchHandler';

const sizeType = type(['parsedNumber', '|>', type('1 <= integer <= 512')]);

export const GET: RequestHandler = async ({ params }) => {
	try {
		const size = sizeType.assert(params.size);
		return await svelteOg(
			{
				component: AppIcon,
				props: {
					size
				}
			},
			{
				width: size,
				height: size
			}
		);
	} catch (e) {
		return ogCatchHandler(e);
	}
};
