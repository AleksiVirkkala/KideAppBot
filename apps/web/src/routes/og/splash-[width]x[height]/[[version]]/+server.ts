import type { RequestHandler } from './$types';
import Splash from '$lib/components/og/Splash.svelte';
import { svelteOg } from '$lib/utils/svelteOg';
import { type } from 'arktype';
import { ogCatchHandler } from '../../ogCatchHandler';

const boundedSize = type('1 <= integer <= 6000');
const imageParams = type({
	width: ['parsedInteger', '|>', boundedSize],
	height: ['parsedInteger', '|>', boundedSize]
});

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { width, height } = imageParams.assert(params);
		return await svelteOg(Splash, {
			width,
			height
		});
	} catch (e) {
		return ogCatchHandler(e);
	}
};
