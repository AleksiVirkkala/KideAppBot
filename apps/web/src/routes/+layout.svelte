<script lang="ts">
	import '$lib/styles/init';
	import { AppBar, type NavigationOption } from '$lib/components/application/AppBar';
	import { appDescription, appName } from '$lib/utils/appInfo';
	import { appleSplashScreenMeta, appleTouchIconMeta } from '$lib/utils/metadata';
	import { page } from '$app/stores';
	import autoAnimate from '@formkit/auto-animate';
	import ThemeSetter from '$lib/utils/ThemeSetter.svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { tokenIsSet } from '$lib/stores/token';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	const navOptions = [
		{ label: 'Bot', href: '/' },
		{ label: 'Settings', href: '/settings' }
	] satisfies NavigationOption[];

	if (browser && !$tokenIsSet) {
		goto('/settings');
	}
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
	<aside class="variant-soft-error text-surface-900-50-token mt-4 rounded-2xl">
		<Accordion>
			<AccordionItem>
				<svelte:fragment slot="summary">
					<div class="flex items-center gap-2 p-1">
						<Icon icon="heroicons:exclamation-triangle-solid" width="unset" class="w-10 shrink-0" />
						<h3 class="h3">Warning</h3>
					</div>
				</svelte:fragment>
				<svelte:fragment slot="content">
					<div class="mt-[-6px] px-3 pb-2">
						Kide.app has began to make changes to prevent botting. Send a message on GitHub if
						you're experiencing problems.
					</div>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</aside>

	<slot />
</main>

<ThemeSetter />
