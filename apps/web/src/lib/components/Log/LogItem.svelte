<script context="module" lang="ts">
	export type LogType = 'regular' | 'title' | 'bullet' | 'empty';

	export interface LogEntry {
		type: LogType;
		icon?: string;
		title?: string;
		content?: string;
	}
</script>

<script lang="ts">
	export let type: LogType = 'regular';
	export let icon: string | undefined = undefined;
	export let title: string | undefined = undefined;
	export let content: string | undefined = undefined;

	const BULLET_ICON = '‣';
	const prefixIcon = type === 'bullet' ? BULLET_ICON : icon;

	const typeClasses = {
		regular: '',
		title: 'py-4 font-bold',
		bullet: '',
		empty: 'my-4'
	} as const;

	const className = typeClasses[type];
</script>

{#if type === 'empty'}
	<hr class={className} />
{:else}
	<li class="flex items-center space-x-2 {className}">
		<!-- Prefix -->

		{#if prefixIcon}
			<span class="w-6 text-center text-xl">
				{prefixIcon}
			</span>
		{/if}

		<!-- Title -->

		<span>{title}</span>

		<!-- Additional Details -->

		{#if content}
			: <span class="code">{content}</span>
		{/if}
	</li>
{/if}
