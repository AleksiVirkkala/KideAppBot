import { initSvelteOg } from 'svelte-og';
import NotoSans from '$lib/assets/fonts/NotoSans-Regular.ttf';

export const svelteOg = initSvelteOg({
	width: 600,
	height: 600,
	fonts: [
		{
			name: 'Noto Sans',
			data: Buffer.from(NotoSans),
			style: 'normal'
		}
	]
});
