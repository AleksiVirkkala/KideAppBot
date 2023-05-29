<script lang="ts">
	import BotLogo from '$lib/assets/logos/BotLogo.svelte';
	import { appName } from '$lib/utils/appInfo';
	export let label = appName;
</script>

<div class="flex h-full w-full flex-col items-center justify-center bg-gray-100 pb-12">
	<div class="flex pl-6">
		<BotLogo width={180} />
	</div>
	<div class="pt-10 text-6xl text-zinc-700/50">{label}</div>
</div>
