<script lang="ts">
	/**
	 * What background color to use
	 */
	export let backgroundColor: string | undefined = undefined;

	$: style = backgroundColor ? `background-color: ${backgroundColor}` : '';
</script>

<button type="button" class="btn variant-filled rounded-lg" {style} on:click>
	<slot />
</button>
