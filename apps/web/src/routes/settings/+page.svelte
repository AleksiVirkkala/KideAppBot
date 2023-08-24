<script>
	import { token } from '$lib/stores/token';
	import Icon from '@iconify/svelte';
</script>

<div class="flex grow flex-col space-y-4 pb-2 pt-4 sm:space-y-8 sm:pb-6 sm:pt-8">
	<h2 class="h2">Settings</h2>
	<p>Token will be saved to browser local storage and used for ticket reservation.</p>
	<div class="flex space-x-4 sm:space-x-8">
		<input type="password" class="input" required placeholder="Bearer token" bind:value={$token} />
	</div>

	<div class="card space-y-4 p-8">
		<h3 class="flex space-x-4 font-bold">
			<Icon icon="mdi:key" height="unset" class="h-6" />
			<p>What is a bearer token?</p>
		</h3>
		<p class="mx-2">
			Bearer token is a long text of seemingly random numbers and letters. It functions as a key
			that gives access to your kide.app account. This bot uses it to make ticket reservations for
			the event of your choice.
		</p>
		<h3 class="flex space-x-4 font-bold">
			<Icon icon="mdi:magnify" height="unset" class="h-6" />
			<p>Where to get a bearer token?</p>
		</h3>
		<a
			href="https://github.com/AleksiVirkkala/KideAppBot#finding-your-bearer-token"
			class="anchor mx-2 inline-flex items-center"
		>
			<Icon icon="mdi:external-link" height="unset" class="mr-1 h-5" />
			<p>Finding your bearer token</p>
		</a>
	</div>
</div>
