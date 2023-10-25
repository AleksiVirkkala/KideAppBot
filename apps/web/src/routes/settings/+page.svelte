<script lang="ts">
	import { token, decodedToken } from '$lib/stores/token';
	import { calculateDateCountFromNow } from '$lib/utils/dateUtils';
	import { loginUser } from '$lib/utils/kideUtils';
	import Icon from '@iconify/svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let email = '';
	let password = '';

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		const result = await loginUser({ email, password });
		if (!result.success) {
			result;
			toastStore.trigger({
				background: 'variant-filled-error',
				hideDismiss: true,
				message: result.error
			});
			return;
		}
		token.set(result.token);
	};
</script>

<div class="flex grow flex-col space-y-4 pb-2 pt-4 md:space-y-8 md:pb-6 md:pt-8">
	{#if !$decodedToken}
		<h2 class="h2">Add your Kide.app bearer token</h2>
		<p>Token will be saved to browser local storage and used for ticket reservation.</p>
		<div class="flex space-x-4 sm:space-x-8">
			<input
				type="password"
				class="input"
				required
				placeholder="Bearer token"
				bind:value={$token}
			/>
		</div>
		{#if $token.length > 0}
			<aside class="alert variant-glass-error">
				<Icon icon="heroicons:exclamation-triangle-solid" width="unset" class="w-12" />
				<div class="alert-message">
					<h3 class="h3">Warning</h3>
					<p>
						The token you've entered doesn't seem to be valid. Please refer to the instructions and
						try again.
					</p>
				</div>
			</aside>
		{/if}
	{:else}
		<h2 class="h2">You are signed in</h2>
		<p>If you want to sign in with a different account, please sign out first.</p>
		<div class="flex flex-col gap-5 md:flex-row md:items-end" on:submit={handleSubmit}>
			<label class="label grow">
				<span>Email</span>
				<input class="input" type="email" readonly value={$decodedToken.userEmail} />
			</label>
			<label class="label grow">
				<span>Expires in</span>
				<input
					class="input"
					type="text"
					readonly
					value={calculateDateCountFromNow($decodedToken.expDate) + ' days'}
				/>
			</label>
			<div class="mt-4">
				<button type="submit" class="btn variant-filled-error w-full" on:click={() => ($token = '')}
					>Sign out</button
				>
			</div>
		</div>
	{/if}

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
