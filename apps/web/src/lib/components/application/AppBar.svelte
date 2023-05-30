<script>
	import { AppBar } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { appVersion } from '$lib/utils/appInfo';
	import BotLogo from '$lib/assets/logos/BotLogo.svelte';

	let expanded = false;
</script>

<AppBar
	class="border-surface-500/10 dark:border-surface-50/10 sticky"
	background="transparent backdrop-blur-sm"
	padding="p-0"
	border="border-b-[1px]"
	regionRowMain="py-3 max-w-7xl px-2 sm:px-6 lg:px-8 mx-auto w-full"
	gridColumns="grid-cols-1"
	slotDefault="flex w-full relative"
>
	<!-- Nav left -->

	<button
		class="btn btn-sm absolute inset-y-0 left-0 flex items-center p-2 sm:hidden"
		on:click={() => (expanded = !expanded)}
	>
		<Icon
			icon={expanded ? 'heroicons:x-mark' : 'heroicons:bars-3'}
			class="text-surface-900-50-token"
			height="auto"
		/>
	</button>

	<!-- Nav Main -->

	<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
		<a href="/" class="btn btn-sm flex items-center space-x-3 px-2 py-1">
			<div class="mb-1 ml-1 h-7">
				<BotLogo width={22} />
			</div>
			<strong class="text-surface-900-50-token hidden select-none text-xl font-light sm:block"
				>KideAppBot</strong
			>
		</a>
	</div>

	<!-- Nav Right -->

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
</AppBar>
