<script lang="ts">
	/**
	 * Is this the principal call to action on the page?
	 */
	export let primary = false;

	/**
	 * What background color to use
	 */
	export let backgroundColor: string | undefined = undefined;
	/**
	 * How large should the button be?
	 */
	export let size: 'small' | 'medium' | 'large' = 'medium';

	$: mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';

	$: style = backgroundColor ? `background-color: ${backgroundColor}` : '';
</script>

<button type="button" class="btn variant-filled rounded-lg" {style} on:click>
	<slot />
	<div class="">moi</div>
</button>
