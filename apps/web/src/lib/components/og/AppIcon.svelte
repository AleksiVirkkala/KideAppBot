<script lang="ts">
	import BotLogo from '$lib/assets/logos/BotLogo.svelte';
	export let size = 512;
</script>

<div class="flex h-full w-full flex-col items-center justify-center border-4 bg-gray-50">
	<div
		class="flex"
		style={`padding-left: ${34 * (size / 512)}px; padding-bottom: ${28 * (size / 512)}px;`}
	>
		<BotLogo width={size * 0.45} />
	</div>
</div>
