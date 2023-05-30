<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import SampleContent from './SampleContent.svelte';
</script>

<Meta title="helpers/SampleContent" component={SampleContent} />

<Template let:args>
	<div class="w-[500px]">
		<SampleContent {...args} class="h-12" />
	</div>
</Template>

<Story name="Default" />

<Story
	name="WithoutStripes"
	args={{
		disableStripes: true
	}}
/>

<Story name="WithCustomStyling">
	<div class="w-[500px]">
		<SampleContent class="h-72 rounded-none border-4 border-red-500 bg-slate-300" />
	</div>
</Story>

<Story name="WithCustomContent">
	<div class="w-[500px]">
		<SampleContent>
			<div class="flex h-full flex-col items-center justify-center">
				<h1 class="text-3xl font-bold text-gray-900">Custom Content</h1>
				<p class="text-gray-700">This is a custom content area</p>
			</div>
		</SampleContent>
	</div>
</Story>
