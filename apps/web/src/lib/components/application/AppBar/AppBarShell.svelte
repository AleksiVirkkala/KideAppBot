<script>
	import { twMerge } from '$lib/utils/twMerge';
	import { slide } from 'svelte/transition';

	let className = '';
	export { className as class };
	export let expanded = false;
	export let appBarContent = '';
	export let expandContent = '';
	export let background = 'transparent';
</script>

<header use:twMerge={className} class="sticky inset-x-0 top-0 z-50">
	<!-- Static content -->

	<div use:twMerge={[appBarContent, background]}>
		<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
			<slot />
		</div>
	</div>

	<!-- Border will be visible even when menu is closed -->
	<div
		use:twMerge={[expandContent, background]}
		class="border-surface-500/10 dark:border-surface-50/10 absolute inset-x-0 border-b-[1px]"
	>
		<!-- Expand content -->
		{#if expanded}
			<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8" transition:slide>
				<slot name="expandContent" />
			</div>
		{/if}
	</div>
</header>
