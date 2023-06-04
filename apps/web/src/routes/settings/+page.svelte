<script>
	import { token } from '$lib/stores/token';
</script>

<div class="flex grow flex-col space-y-4 pb-2 pt-4 sm:space-y-8 sm:pb-6 sm:pt-8">
	<h2 class="h2">Settings</h2>
	<p>Token will be saved to browser local storage and used for ticket reservation.</p>
	<div class="flex space-x-4 sm:space-x-8">
		<input type="password" class="input" required placeholder="Bearer token" bind:value={$token} />
	</div>
</div>
