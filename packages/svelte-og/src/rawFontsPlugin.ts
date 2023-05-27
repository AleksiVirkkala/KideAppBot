import fs from 'fs';

/**
 * Vite plugin for raw font file import.
 *
 * NotoSans-Regular.ttf is configured by default.
 * You don't need to use this if you are happy with it.
 * This plugin can be used to use any font.
 *
 * @author Geoff Rich
 * @see https://geoffrich.net/posts/svelte-social-image/
 *
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { rawFonts } from 'svelte-og';
 *
 * export default defineConfig({
 *   plugins: [rawFonts(['.ttf'])],
 * });
 * ```
 */
export function rawFonts(ext: string[]) {
	return {
		name: 'vite-plugin-raw-fonts',
		transform(_: unknown, id: string) {
			if (ext.some(e => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return { code: `export default ${JSON.stringify(buffer)}`, map: null };
			}
		}
	};
}
