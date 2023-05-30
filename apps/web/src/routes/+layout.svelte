<script lang="ts">
	import AppBar from '$lib/components/application/AppBar.svelte';
	import '$lib/utils/initSkeleton';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar />
	</svelte:fragment>
	<slot />
</AppShell>
