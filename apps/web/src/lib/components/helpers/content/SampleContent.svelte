<script lang="ts">
	import { twMerge } from '$lib/actions';
	export let disableStripes = false;
	export let label: string | undefined = undefined;
	let className = '';
	export { className as class };
</script>

<div
	use:twMerge={className}
	class="relative h-40 overflow-auto rounded-xl border border-dashed border-gray-400 opacity-75"
>
	{#if label}
		<div class="absolute left-4 top-3 text-sm">{label}</div>
	{/if}

	{#if !disableStripes}
		<svg class="absolute inset-0 h-full w-full stroke-gray-900/10" fill="none">
			<defs>
				<pattern
					id="pattern-diagonal-lines"
					x="0"
					y="0"
					width="10"
					height="10"
					patternUnits="userSpaceOnUse"
				>
					<path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" />
				</pattern>
			</defs>
			<rect fill="url(#pattern-diagonal-lines)" class="h-full w-full stroke-none" />
		</svg>
	{/if}

	<slot />
</div>
