<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

	import Splash from './Splash.svelte';
</script>

<Meta title="components/og/Splash" component={Splash} />

<Template let:args>
	<div
		style={`width: ${args.width}px; height: ${args.height}px;`}
		class="origin-top-left scale-[0.3] border-4 bg-white"
	>
		<Splash {...args} />
	</div>
</Template>

<Story
	name="Default"
	args={{ width: 1000, height: 2000 }}
	argTypes={{
		width: { control: { type: 'range', min: 1, max: 6000, step: 100 } },
		height: { control: { type: 'range', min: 1, max: 6000, step: 100 } },
		label: { control: 'text' }
	}}
/>
