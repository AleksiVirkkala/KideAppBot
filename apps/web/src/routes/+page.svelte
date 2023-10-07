<script lang="ts">
	import type { LogMessage } from '@common/types';
	import KideAppBot from 'kideappbot';
	import { Log } from '$lib/components/Log';
	import { token, tokenIsSet } from '$lib/stores/token';
	import LogItem from '$lib/components/Log/LogItem.svelte';
	import Icon from '@iconify/svelte';
	import { browser } from '$app/environment';

	let isRunning = false;
	let logs: LogMessage[] = [];

	let url = '';
	$: disabled = !$tokenIsSet || isRunning;

	const start = () => {
		logs = [];
		const bot = new KideAppBot($token);
		bot.setOnIsActiveChanged(isActive => (isRunning = isActive));
		bot.setOnLog(log => (logs = [...logs, log]));
		bot.runBot(url);
	};
</script>

<div class="flex grow flex-col space-y-4 pb-2 pt-4 sm:space-y-8 sm:pb-6 sm:pt-8">
	<h2 class="h2">Info</h2>
	<p>The bot will add maximum amount of tickets to your kide.app cart based on given event url.</p>

	<aside class="alert variant-glass-error">
		<Icon icon="mdi:robot-dead" width="unset" class="w-12" />
		<div class="alert-message">
			<h3 class="h3">There's a problem</h3>
			<p>
				Kide.app has made changes to their api to prevent botting. This has caused all bots to stop
				working... For now.
			</p>
		</div>
		<!-- Link to more information about kide.app bot prevention update -->
		<a
			class="alert-actions btn variant-ghost"
			href="https://github.com/aleksivirkkala/kideappbot#%EF%B8%8F-new-bot-prevention-measurements-%EF%B8%8F"
		>
			<Icon icon="mdi:external-link" width="auto" />
			<span>Read more</span>
		</a>
	</aside>

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
		{#each logs as log}
			<LogItem {...log} />
		{/each}
	</Log>
</div>
