<script lang="ts">
	import { token, decodedToken } from '$lib/stores/token';
	import { calculateDateCountFromNow } from '$lib/utils/dateUtils';
	import { loginUser } from '$lib/utils/kideUtils';
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
		<h2 class="h2">Sign in to your account</h2>
		<p>Use your Kide.app credentials</p>
		<form class="flex flex-col gap-5 md:flex-row md:items-end" on:submit={handleSubmit}>
			<label class="label grow">
				<span>Email</span>
				<input
					class="input"
					type="email"
					placeholder="your.email@something.com"
					bind:value={email}
				/>
			</label>
			<label class="label grow">
				<span>Password</span>
				<input class="input" type="password" placeholder="••••••••" bind:value={password} />
			</label>
			<div class="mt-4">
				<button type="submit" class="btn variant-filled-primary w-full">Sign in</button>
			</div>
		</form>
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
</div>
