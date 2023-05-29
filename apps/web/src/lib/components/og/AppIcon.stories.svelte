<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

	import AppIcon from './AppIcon.svelte';
</script>

<Meta title="components/og/AppIcon" component={AppIcon} />

<Template let:args>
	<div style={`width: ${args.size}px; height: ${args.size}px;`}>
		<AppIcon {...args} />
	</div>
</Template>

<Story
	name="Default"
	args={{ size: 512 }}
	argTypes={{
		size: { control: { type: 'range', min: 1, max: 512 } }
	}}
/>
