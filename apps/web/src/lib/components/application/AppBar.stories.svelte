<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import AppBar from './AppBar.svelte';
</script>

<Meta
	title="application/AppBar"
	component={AppBar}
	parameters={{
		layout: 'fullscreen'
	}}
/>

<Template let:args>
	<AppBar {...args} />
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
