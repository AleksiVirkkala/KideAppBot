<script lang="ts">
	import AppBar from '$lib/components/application/AppBar.svelte';
	import { appDescription, appName } from '$lib/utils/appInfo';
	import '$lib/utils/initSkeleton';
	import { appleSplashScreenMeta, appleTouchIconMeta } from '$lib/utils/metadata';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<svelte:head>
	<title>{appName}</title>
	<meta name="description" content={appDescription} />
	<meta name="application-name" content={appName} />
	<meta name="theme-color" content="#f3f4f6" />
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

<AppShell>
	<svelte:fragment slot="header">
		<AppBar />
	</svelte:fragment>
	<slot />
</AppShell>
