import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { rawFonts } from 'svelte-og';

export default defineConfig({
	plugins: [sveltekit(), rawFonts(['.ttf'])],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		port: 8080
	},
	define: {
		// Package.json can't be imported so we define global constant for version
		__PKG_VERSION__: JSON.stringify(process.env.npm_package_version)
	}
});
