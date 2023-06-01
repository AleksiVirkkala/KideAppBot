<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import LogItem from './LogItem.svelte';
</script>

<Meta title="components/Log/Item" component={LogItem} />

<Template let:args>
	<div class="h-[800px] w-[600px]">
		<LogItem class="h-full" {...args} />
	</div>
</Template>

<Story name="Default" />
