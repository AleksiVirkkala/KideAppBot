<script>
	import { Log } from '$lib/components/Log';
	import { isRunning, startBot, logs } from '$lib/utils/trpc';
	import { tokenIsSet } from '$lib/stores/token';
	import LogItem from '$lib/components/Log/LogItem.svelte';
	import Icon from '@iconify/svelte';
	import { browser } from '$app/environment';

	let url = '';
	$: disabled = !$tokenIsSet || $isRunning;

	const start = () => {
		logs.set([]);
		startBot(url);
	};
</script>

<div class="flex grow flex-col space-y-4 pb-2 pt-4 sm:space-y-8 sm:pb-6 sm:pt-8">
	<h2 class="h2">Info</h2>
	<p>The bot will add maximum amount of tickets to your kide.app cart based on given event url.</p>

	<!-- Show error if token is not set and we are in browser environment (don't prerender error) -->

	{#if browser && !$tokenIsSet}
		<aside class="alert variant-glass-error">
			<Icon icon="heroicons:exclamation-triangle-solid" width="unset" class="w-12" />
			<div class="alert-message">
				<h3 class="h3">Warning</h3>
				<p>To use the bot you have to set your bearer token in the application settings.</p>
			</div>
			<!-- Navigation button to settings -->
			<a class="alert-actions btn variant-ghost" href="/settings">
				<Icon icon="heroicons:cog-6-tooth" width="auto" />
				<span>Settings</span>
			</a>
		</aside>
	{/if}

	<!-- Input + button -->

	<div class="flex space-x-4 sm:space-x-8">
		<input {disabled} type="text" class="input" placeholder="Event URL" bind:value={url} />
		<button
			{disabled}
			class="btn variant-filled-primary disabled:variant-filled-surface"
			on:click={start}>Start</button
		>
	</div>

	<!-- Logs -->

	<Log>
		{#each $logs as log}
			<LogItem {...log} />
		{/each}
	</Log>
</div>
