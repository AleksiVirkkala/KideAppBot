<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import AppBar, { type NavigationOption } from './AppBar.svelte';
	import SampleContent from '$lib/components/helpers/content/SampleContent.svelte';

	const navOptions = [
		{ label: 'Bot', href: '/bot', isActive: true },
		{ label: 'Settings', href: '/settings', isActive: false }
	] satisfies NavigationOption[];
</script>

<Meta
	title="application/AppBar"
	component={AppBar}
	parameters={{
		layout: 'fullscreen'
	}}
/>

<Template let:args>
	<div class="h-[500px] overflow-auto">
		<AppBar {navOptions} {...args} />
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
