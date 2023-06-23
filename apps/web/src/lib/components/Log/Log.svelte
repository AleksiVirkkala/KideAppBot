<script lang="ts">
	import { afterUpdate } from 'svelte';

	let logElement: HTMLUListElement;

	afterUpdate(() => {
		scrollToBottom(logElement);
	});

	const scrollToBottom = async (el: Element) => {
		el.scroll({ top: el.scrollHeight, behavior: 'smooth' });
	};
</script>

<ul
	bind:this={logElement}
	class="card hide-scrollbar ring-surface-400-500-token bg-surface-200-700-token h-1 min-h-[300px] grow overflow-y-scroll p-4 text-center"
>
	<slot />
</ul>
