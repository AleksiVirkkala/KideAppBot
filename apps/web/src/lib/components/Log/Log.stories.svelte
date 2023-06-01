<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Log from './Log.svelte';
	import LogItem, { type LogEntry } from './LogItem.svelte';

	const logs: LogEntry[] = [
		{
			type: 'regular',
			icon: '🛰️',
			title: 'Fetching page info...'
		},
		{
			type: 'title',
			title: 'Reserving ticket'
		},
		{
			type: 'regular',
			title: 'Variant',
			content: 'Peruslippu'
		},
		{
			type: 'bullet',
			title: 'InventoryId',
			content: '1421412-asdfasdf-124124'
		},
		{
			type: 'bullet',
			title: 'Amount',
			content: '100'
		},
		{ type: 'empty' }
	];

	const extendedLogs = [...logs, ...logs, ...logs, ...logs, ...logs, ...logs, ...logs];
</script>

<Meta title="components/Log" component={Log} />

<Template let:args>
	<div class="h-[800px] w-[600px]">
		<Log class="h-full" {...args}>
			{#each extendedLogs as log}
				<LogItem {...log} />
			{/each}
		</Log>
	</div>
</Template>

<Story name="Default" />
