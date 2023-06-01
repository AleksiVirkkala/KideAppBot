<script lang="ts">
	import { twMerge } from '$lib/actions';

	let className = '';
	export { className as class };
</script>

<ul use:twMerge={className} class="card hide-scrollbar overflow-y-scroll p-4">
	<slot />
</ul>
