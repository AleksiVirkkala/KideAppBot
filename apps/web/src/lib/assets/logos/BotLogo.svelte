<script lang="ts">
	export let width: number;
	export let color = '#6366f1';
	let className = '';
	export { className as class };
</script>

<!-- I don't like this method but svg file import fails in satori -->
<svg
	class={className}
	xmlns="http://www.w3.org/2000/svg"
	{width}
	viewBox="0 0 183 248.3"
	fill={color}
>
	<polygon points="35.3 22.2 19.2 0 0 22.2 0 123.8 36.2 85 35.3 22.2" />
	<path
		d="m87.1,58.5L0,145.7v80.5l16.5,22,19.7-21.7v-34.8l53.1,54,93.6-92.3L87.1,58.5Zm-36.6,92.3l37.8-37.8,40.7,40.3-38.2,37.8-40.3-40.4Z"
	/>
</svg>
