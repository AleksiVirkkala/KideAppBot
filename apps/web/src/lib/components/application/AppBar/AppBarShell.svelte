<script>
	import { clickOutside, twMerge } from '$lib/actions';
	import { slide } from 'svelte/transition';

	let className = '';
	export { className as class };
	export let expanded = false;
	export let appBarContent = '';
	export let expandContent = '';
	export let background = 'transparent';
</script>

<header
	use:twMerge={className}
	use:clickOutside
	on:outclick={() => (expanded = false)}
	class="sticky inset-x-0 top-0 z-50"
>
	<!-- Static content -->

	<div use:twMerge={[appBarContent, background]}>
		<div class="app-container">
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
			<div class="app-container" transition:slide>
				<slot name="expandContent" />
			</div>
		{/if}
	</div>
</header>
