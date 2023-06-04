<script lang="ts">
	import { autoModeWatcher } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';

	// Initial theme config from current state
	const osDarkTheme = writable(false);
	onMount(() => {
		// Set up our MediaQueryList
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		osDarkTheme.set(mq.matches);

		// Update the store if OS preference changes
		const onChange = () => osDarkTheme.set(mq.matches);
		mq.addEventListener('change', onChange);
	});

	const themeColor = derived(osDarkTheme, $osDarkTheme =>
		$osDarkTheme ? 'rgb(66, 65, 71)' : 'rgb(237, 237, 238)'
	);
</script>

<svelte:head>
	<meta name="theme-color" content={$themeColor} />
	{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>
