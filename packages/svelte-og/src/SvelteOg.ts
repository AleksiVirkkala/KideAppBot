import type { ComponentType } from 'svelte';
import type { SvelteComponentTyped } from 'svelte';

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html as toReactNode } from 'satori-html';

type ReactNode = Parameters<typeof satori>[0];
export type SatoriOptions = Parameters<typeof satori>[1];

/**
 * Extracts the props of a Svelte component
 */
export type ComponentProps<T> = T extends ComponentType<SvelteComponentTyped<infer P>> ? P : never;

/**
 * Svelte SSR components have a render method that returns an object with html and css.
 */
interface ComponentWithRender<T extends ComponentType> extends ComponentType {
	render(props?: ComponentProps<T>): { html: string; css: { code: string } };
}

interface ComponentAndProps<T extends ComponentType> {
	component: T;
	props: ComponentProps<T>;
}

/**
 * Renders a Svelte component as an image
 *
 * @param component Svelte component to render
 * @param props Props to pass to the component
 * @param options All available options of satori
 * @returns A png response with the rendered image
 */
export async function svelteOg<T extends ComponentType>(
	component: T | ComponentAndProps<T>,
	options: SatoriOptions
): Promise<Response> {
	const props = 'props' in component ? component.props : undefined;
	component = 'props' in component ? component.component : component;

	/**
	 * Credits to Geoff Rich for the logic
	 * @see https://geoffrich.net/posts/svelte-social-image/
	 */

	const result = (component as unknown as ComponentWithRender<T>).render(props);
	const element = toReactNode(`${result.html}<style>${result.css.code}</style>`) as ReactNode;

	const svg = await satori(element, options);
	const resvg = new Resvg(svg);
	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			'Content-Type': 'image/png'
		}
	});
}

export function initSvelteOg(defaultOptions: SatoriOptions) {
	return async function <T extends ComponentType>(
		component: T | ComponentAndProps<T>,
		options: Partial<SatoriOptions>
	): Promise<Response> {
		return svelteOg(component, { ...defaultOptions, ...options });
	};
}
