<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import AppBarShell from './AppBarShell.svelte';
	import SampleContent from '$lib/components/helpers/content/SampleContent.svelte';

	let expanded = false;
</script>

<Meta
	title="application/AppBar/Shell"
	component={AppBarShell}
	parameters={{
		layout: 'fullscreen'
	}}
/>

<Template let:args>
	<div class="h-[500px] overflow-auto">
		<AppBarShell {expanded} {...args} background="backdrop-blur-sm">
			<div class="bg-primary-200-700-token p-4">
				<button class="btn variant-glass-surface w-full" on:click={() => (expanded = !expanded)}>
					expand
				</button>
			</div>
			<svelte:fragment slot="expandContent"
				><div class="bg-success-200-700-token p-4">
					<button
						class="btn variant-glass-surface h-20 w-full"
						on:click={() => (expanded = !expanded)}>collapse</button
					>
				</div></svelte:fragment
			>
		</AppBarShell>
		{#each Array(5) as _, index (index)}
			<SampleContent class="my-4" />
		{/each}
	</div>
</Template>

<Story
	name="Desktop"
	parameters={{
		viewport: {
			defaultViewport: 'fullHD'
		}
	}}
/>

<Story
	name="Mobile"
	parameters={{
		viewport: {
			defaultViewport: 'iphone12'
		}
	}}
/>
