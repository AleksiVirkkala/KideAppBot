<script>
	import { Log } from '$lib/components/Log';
</script>

<div class="flex grow flex-col space-y-4 pb-2 pt-4 sm:space-y-8 sm:pb-6 sm:pt-8">
	<h2 class="h2">Info</h2>
	<p>The bot will add maximum amount of tickets to your kide.app cart based on given event url.</p>
	<div class="flex space-x-4 sm:space-x-8">
		<input type="text" class="input" placeholder="Event URL" />
		<button class="btn variant-filled-primary">Start</button>
	</div>
	<Log class="grow" />
</div>
<svelte:body class="bg-red-300" />
