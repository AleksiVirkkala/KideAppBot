<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

	import BotLogo from './BotLogo.svelte';
</script>

<Meta title="assets/BotLogo" component={BotLogo} />

<Template let:args>
	<div style={`width: ${args.size}px; height: ${args.size}px;`}>
		<BotLogo {...args} />
	</div>
</Template>

<Story
	name="Default"
	args={{ size: 512, color: '#6366f1' }}
	argTypes={{
		size: { control: { type: 'range', min: 10, max: 300, step: 10 } },
		color: { control: 'color' }
	}}
/>
