<script>
	export let message = 'Hello, world!';
</script>

<div>{message}</div>

<style lang="postcss">
	div {
		background-color: white;
		@apply flex h-full w-full items-center justify-center text-7xl opacity-100;
	}
</style>
