<script context="module" lang="ts">
	export interface NavigationOption {
		label: string;
		href: string;
		isActive: boolean;
	}
</script>

<script lang="ts">
	import AppBarShell from './AppBarShell.svelte';
	import Icon from '@iconify/svelte';
	import { appVersion } from '$lib/utils/appInfo';
	import BotLogo from '$lib/assets/logos/BotLogo.svelte';

	export let expanded = false;
	export let navOptions: NavigationOption[] = [];
</script>

<AppBarShell {expanded} background="backdrop-blur-sm">
	<div class="relative flex items-center justify-between py-3">
		<!-- Header left -->

		<button
			class="btn btn-sm absolute left-0 flex items-center p-2 sm:hidden"
			on:click={() => (expanded = !expanded)}
		>
			<Icon
				icon={expanded ? 'heroicons:x-mark' : 'heroicons:bars-3'}
				class="text-surface-900-50-token"
				height="auto"
			/>
		</button>

		<!-- Header Main -->

		<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
			<!-- Bot Logo -->

			<a href="/" class="btn btn-sm flex items-center space-x-3 px-2 py-1">
				<div class="mb-1 ml-1 h-7">
					<BotLogo width={22} />
				</div>
				<strong class="text-surface-900-50-token hidden select-none text-xl font-light sm:block"
					>KideAppBot</strong
				>
			</a>

			<!-- Desktop Navigation -->

			<nav class="ml-6 flex items-center space-x-4 max-sm:hidden">
				{#each navOptions as { href, isActive, label }}
					<a
						{href}
						class="btn btn-sm h-8 {isActive ? 'variant-glass-surface' : 'bg-surface-hover-token'}"
						>{label}</a
					>
				{/each}
			</nav>
		</div>

		<!-- Header Right -->

		<div
			class="absolute inset-y-0 right-0 flex items-center space-x-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
		>
			<!-- Version number -->

			<span class="text-surface-800-100-token font-mono text-sm opacity-50">{appVersion}</span>

			<!-- GitHub link -->

			<a
				href="https://github.com/AleksiVirkkala/KideAppBot"
				aria-label="KideAppBot GitHub repository"
				class="btn btn-icon btn-icon-sm"
			>
				<Icon icon="mdi:github" height="unset" class="text-surface-900-50-token h-7" />
			</a>
		</div>
	</div>

	<svelte:fragment slot="expandContent">
		<nav class="space-y-1 px-2 pb-3 pt-2 sm:hidden">
			{#each navOptions as { href, isActive, label }}
				<a
					{href}
					class="btn btn-sm block h-8 text-left {isActive
						? 'variant-glass-surface'
						: 'bg-surface-hover-token'}">{label}</a
				>
			{/each}
		</nav>
	</svelte:fragment>
</AppBarShell>
