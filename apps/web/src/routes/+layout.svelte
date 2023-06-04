<script lang="ts">
	import '$lib/styles/init';
	import { AppBar, type NavigationOption } from '$lib/components/application/AppBar';
	import { appDescription, appName } from '$lib/utils/appInfo';
	import { appleSplashScreenMeta, appleTouchIconMeta } from '$lib/utils/metadata';
	import { page } from '$app/stores';
	import autoAnimate from '@formkit/auto-animate';
	import ThemeSetter from '$lib/utils/ThemeSetter.svelte';

	const navOptions = [
		{ label: 'Bot', href: '/' },
		{ label: 'Settings', href: '/settings' }
	] satisfies NavigationOption[];
</script>

<svelte:head>
	<title>{appName}</title>
	<meta name="description" content={appDescription} />
	<meta name="application-name" content={appName} />
	<!-- Enable Apple PWA -->
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-title" content={appName} />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<!-- Apple Touch icons -->
	{#each appleTouchIconMeta as { rel, sizes, href }}
		<link {rel} {sizes} {href} />
	{/each}
	<!-- Apple Splash Screens -->
	{#each appleSplashScreenMeta as { rel, media, href }}
		<link {rel} {media} {href} />
	{/each}
</svelte:head>

<AppBar
	{navOptions}
	isActive={o => o.href === $page.url.pathname}
	class="shrink-0 pt-[env(safe-area-inset-top)]"
/>

<main use:autoAnimate class="app-container flex flex-auto flex-col">
	<slot />
</main>

<ThemeSetter />
